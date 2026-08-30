// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.0

using System.Security.Cryptography.X509Certificates;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using XSharp.Web.Api.Auth;
using XSharp.Web.Api.Data;
using XSharp.Web.Api.Email;
using XSharp.Web.Api.Tokens;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
string connectionString = builder.Configuration.GetConnectionString("Registry")
    ?? throw new InvalidOperationException("ConnectionStrings:Registry is required.");
string keyPath = builder.Configuration["DataProtection:Path"] ?? "./keys";

builder.Services.AddProblemDetails();
builder.Services.AddHealthChecks();
builder.Services.AddAuthorization();
IDataProtectionBuilder dataProtection = builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(keyPath))
    .SetApplicationName("xsharp-registry");
string? certificatePath = builder.Configuration["DataProtection:CertificatePath"];
string? certificatePassword = builder.Configuration["DataProtection:CertificatePassword"];
if (!string.IsNullOrWhiteSpace(certificatePath))
{
    X509Certificate2 certificate = X509CertificateLoader.LoadPkcs12FromFile(
        certificatePath,
        certificatePassword,
        X509KeyStorageFlags.EphemeralKeySet);
    dataProtection.ProtectKeysWithCertificate(certificate);
}
builder.Services.AddDbContext<RegistryDbContext>(options => options.UseNpgsql(connectionString));
builder.Services
    .AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
    {
        options.SignIn.RequireConfirmedEmail = true;
        options.User.RequireUniqueEmail = true;
        options.Password.RequiredLength = 10;
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireNonAlphanumeric = false;
        options.Lockout.MaxFailedAccessAttempts = 8;
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    })
    .AddEntityFrameworkStores<RegistryDbContext>()
    .AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "__Host-xs_registry";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.ExpireTimeSpan = TimeSpan.FromDays(14);
    options.SlidingExpiration = true;
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});

IConfigurationSection google = builder.Configuration.GetSection("Authentication:Google");
if (!string.IsNullOrWhiteSpace(google["ClientId"]) && !string.IsNullOrWhiteSpace(google["ClientSecret"]))
{
    builder.Services.AddAuthentication().AddGoogle(options =>
    {
        options.ClientId = google["ClientId"]!;
        options.ClientSecret = google["ClientSecret"]!;
        options.CallbackPath = "/api/v1/auth/google/callback";
        options.SignInScheme = IdentityConstants.ExternalScheme;
    });
}

builder.Services.Configure<EmailOptions>(builder.Configuration.GetSection("Email"));
builder.Services.Configure<AuthCodeOptions>(builder.Configuration.GetSection("AuthCodes"));
builder.Services.AddScoped<AuthCodeService>();
builder.Services.AddSingleton<RegistryEmailSender>();
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("auth", context => RateLimitPartition.GetFixedWindowLimiter(
        context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 12,
            Window = TimeSpan.FromMinutes(5),
            QueueLimit = 0,
        }));
    options.AddPolicy("tokens", context => RateLimitPartition.GetFixedWindowLimiter(
        context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "anonymous",
        _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 20,
            Window = TimeSpan.FromMinutes(1),
            QueueLimit = 0,
        }));
});

WebApplication app = builder.Build();
app.UseExceptionHandler();
app.UseForwardedHeaders();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("/health");
app.MapGet("/api/v1/status", () => Results.Ok(new ServiceStatus("viget", "online", true)));
app.MapAuthEndpoints();
app.MapTokenEndpoints();

await using (AsyncServiceScope scope = app.Services.CreateAsyncScope())
{
    RegistryDbContext database = scope.ServiceProvider.GetRequiredService<RegistryDbContext>();
    await database.Database.MigrateAsync();
}

app.Run();

internal sealed record ServiceStatus(string Service, string Status, bool RegistryAvailable);
