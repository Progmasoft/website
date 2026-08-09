// SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using XSharp.Web.Api.Data;
using XSharp.Web.Api.Email;

namespace XSharp.Web.Api.Auth;

internal static class AuthEndpoints
{
    private const string DashboardUrl = "https://viget.xsharp-lang.xyz/dashboard/";
    private const string LoginUrl = "https://viget.xsharp-lang.xyz/login/";
    private const string RegisterUrl = "https://viget.xsharp-lang.xyz/register/";

    public static void MapAuthEndpoints(this WebApplication app)
    {
        RouteGroupBuilder auth = app.MapGroup("/api/v1/auth").RequireRateLimiting("auth");
        auth.MapPost("/register", RegisterAsync);
        auth.MapPost("/verify-email", VerifyEmailAsync);
        auth.MapPost("/verify-email/resend", ResendVerificationAsync);
        auth.MapPost("/login", LoginAsync);
        auth.MapPost("/logout", LogoutAsync).RequireAuthorization();
        auth.MapDelete("/account", DeleteAccountAsync).RequireAuthorization();
        auth.MapGet("/me", MeAsync).RequireAuthorization();
        auth.MapGet("/providers", ProvidersAsync);
        auth.MapGet("/google", BeginGoogleAsync);
        auth.MapGet("/google/complete", CompleteGoogleAsync);
        auth.MapPost("/recovery/start", StartRecoveryAsync);
        auth.MapPost("/recovery/complete", CompleteRecoveryAsync);
    }

    private static async Task<IResult> RegisterAsync(
        Credentials request,
        UserManager<ApplicationUser> users,
        AuthCodeService codes,
        RegistryEmailSender emailSender,
        CancellationToken cancellationToken)
    {
        if (!TryGetCredentials(request, out string email, out string password))
        {
            return InvalidRequest();
        }
        ApplicationUser user = new() { UserName = email, Email = email };
        IdentityResult result = await users.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            return IdentityErrors(result);
        }

        string code = await codes.CreateAsync(user.Id, "signup", cancellationToken);
        await emailSender.SendCodeAsync(email, code, "signup");
        return Results.Accepted(value: new { verificationRequired = true });
    }

    private static async Task<IResult> VerifyEmailAsync(
        VerificationRequest request,
        UserManager<ApplicationUser> users,
        AuthCodeService codes,
        SignInManager<ApplicationUser> signIn,
        CancellationToken cancellationToken)
    {
        if (!TryNormalizeEmail(request.Email, out string email) || string.IsNullOrWhiteSpace(request.Code))
        {
            return InvalidRequest();
        }
        ApplicationUser? user = await users.FindByEmailAsync(email);
        if (user is null || !await codes.ConsumeAsync(user.Id, "signup", request.Code, cancellationToken))
        {
            return Results.BadRequest(new ApiError("invalid_code", "The verification code is invalid or expired."));
        }

        user.EmailConfirmed = true;
        IdentityResult result = await users.UpdateAsync(user);
        if (!result.Succeeded) return IdentityErrors(result);
        await signIn.SignInAsync(user, isPersistent: true);
        return Results.Ok(new { verified = true });
    }

    private static async Task<IResult> ResendVerificationAsync(
        EmailRequest request,
        UserManager<ApplicationUser> users,
        AuthCodeService codes,
        RegistryEmailSender emailSender,
        CancellationToken cancellationToken)
    {
        if (TryNormalizeEmail(request.Email, out string email))
        {
            ApplicationUser? user = await users.FindByEmailAsync(email);
            if (user is not null && !user.EmailConfirmed)
            {
                string code = await codes.CreateAsync(user.Id, "signup", cancellationToken);
                await emailSender.SendCodeAsync(email, code, "signup");
            }
        }
        return Results.Accepted(value: new { codeSent = true });
    }

    private static async Task<IResult> LoginAsync(
        Credentials request,
        UserManager<ApplicationUser> users,
        SignInManager<ApplicationUser> signIn)
    {
        if (!TryGetCredentials(request, out string email, out string password))
        {
            return InvalidCredentials();
        }
        ApplicationUser? user = await users.FindByEmailAsync(email);
        if (user is null)
        {
            return InvalidCredentials();
        }
        SignInResult result = await signIn.PasswordSignInAsync(user, password, true, true);
        if (result.IsNotAllowed)
        {
            return Results.Json(new ApiError("email_unverified", "Verify your email before signing in."),
                statusCode: StatusCodes.Status403Forbidden);
        }
        return result.Succeeded ? Results.Ok(new { authenticated = true }) : InvalidCredentials();
    }

    private static async Task<IResult> LogoutAsync(SignInManager<ApplicationUser> signIn)
    {
        await signIn.SignOutAsync();
        return Results.NoContent();
    }

    private static IResult MeAsync(ClaimsPrincipal principal) => Results.Ok(new
    {
        id = principal.FindFirstValue(ClaimTypes.NameIdentifier),
        email = principal.FindFirstValue(ClaimTypes.Email) ?? principal.Identity?.Name,
        displayName = principal.FindFirstValue(ClaimTypes.Name) ?? principal.Identity?.Name,
        emailVerified = true,
    });

    private static async Task<IResult> ProvidersAsync(IAuthenticationSchemeProvider schemes) =>
        Results.Ok(new { google = await schemes.GetSchemeAsync("Google") is not null });

    private static async Task<IResult> BeginGoogleAsync(
        IAuthenticationSchemeProvider schemes,
        SignInManager<ApplicationUser> signIn)
    {
        if (await schemes.GetSchemeAsync("Google") is null)
        {
            return Results.Problem("Google OAuth is not configured.", statusCode: StatusCodes.Status503ServiceUnavailable);
        }
        AuthenticationProperties properties = signIn.ConfigureExternalAuthenticationProperties(
            "Google", "/api/v1/auth/google/complete");
        return Results.Challenge(properties, ["Google"]);
    }

    private static async Task<IResult> CompleteGoogleAsync(
        SignInManager<ApplicationUser> signIn,
        UserManager<ApplicationUser> users,
        AuthCodeService codes,
        RegistryEmailSender emailSender,
        CancellationToken cancellationToken)
    {
        ExternalLoginInfo? info = await signIn.GetExternalLoginInfoAsync();
        if (info is null) return Results.Redirect($"{LoginUrl}?error=oauth");

        if (!TryNormalizeEmail(info.Principal.FindFirstValue(ClaimTypes.Email), out string email))
        {
            return Results.Redirect($"{LoginUrl}?error=missing_email");
        }
        ApplicationUser? user = await users.FindByEmailAsync(email);
        if (user is null)
        {
            user = new ApplicationUser { UserName = email, Email = email };
            IdentityResult created = await users.CreateAsync(user);
            if (!created.Succeeded) return Results.Redirect($"{LoginUrl}?error=account");
        }

        ApplicationUser? loginOwner = await users.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
        if (loginOwner is null)
        {
            IdentityResult loginAdded = await users.AddLoginAsync(user, info);
            if (!loginAdded.Succeeded) return Results.Redirect($"{LoginUrl}?error=oauth");
        }
        else if (loginOwner.Id != user.Id)
        {
            return Results.Redirect($"{LoginUrl}?error=oauth");
        }

        string code = await codes.CreateAsync(user.Id, "signup", cancellationToken);
        await emailSender.SendCodeAsync(email, code, "signup");
        string destination = $"{RegisterUrl}?verify=google"
            + $"&email={Uri.EscapeDataString(email)}";
        return Results.Redirect(destination);
    }

    private static async Task<IResult> DeleteAccountAsync(
        [Microsoft.AspNetCore.Mvc.FromBody] DeleteAccountRequest request,
        ClaimsPrincipal principal,
        UserManager<ApplicationUser> users,
        SignInManager<ApplicationUser> signIn)
    {
        ApplicationUser? user = await users.GetUserAsync(principal);
        if (user?.Email is null)
        {
            return Results.Unauthorized();
        }
        string confirmation = request.Confirmation?.Trim() ?? string.Empty;
        if (!string.Equals(confirmation, user.Email, StringComparison.OrdinalIgnoreCase))
        {
            return Results.BadRequest(new ApiError(
                "confirmation_mismatch",
                "Enter the account email address to confirm deletion."));
        }

        IdentityResult result = await users.DeleteAsync(user);
        if (!result.Succeeded) return IdentityErrors(result);
        await signIn.SignOutAsync();
        return Results.NoContent();
    }

    private static async Task<IResult> StartRecoveryAsync(
        EmailRequest request,
        UserManager<ApplicationUser> users,
        AuthCodeService codes,
        RegistryEmailSender emailSender,
        CancellationToken cancellationToken)
    {
        if (!TryNormalizeEmail(request.Email, out string email))
        {
            return Results.Accepted(value: new { codeSent = true });
        }
        ApplicationUser? user = await users.FindByEmailAsync(email);
        if (user is not null && user.EmailConfirmed)
        {
            string code = await codes.CreateAsync(user.Id, "recovery", cancellationToken);
            await emailSender.SendCodeAsync(email, code, "recovery");
        }
        return Results.Accepted(value: new { codeSent = true });
    }

    private static async Task<IResult> CompleteRecoveryAsync(
        RecoveryRequest request,
        UserManager<ApplicationUser> users,
        AuthCodeService codes,
        SignInManager<ApplicationUser> signIn,
        CancellationToken cancellationToken)
    {
        if (!TryNormalizeEmail(request.Email, out string email)
            || string.IsNullOrWhiteSpace(request.Code)
            || string.IsNullOrWhiteSpace(request.Password))
        {
            return InvalidRequest();
        }
        ApplicationUser? user = await users.FindByEmailAsync(email);
        if (user is null || !await codes.ConsumeAsync(user.Id, "recovery", request.Code, cancellationToken))
        {
            return Results.BadRequest(new ApiError("invalid_code", "The recovery code is invalid or expired."));
        }
        string resetToken = await users.GeneratePasswordResetTokenAsync(user);
        IdentityResult result = await users.ResetPasswordAsync(user, resetToken, request.Password);
        if (!result.Succeeded) return IdentityErrors(result);
        await signIn.SignInAsync(user, isPersistent: true);
        return Results.Ok(new { recovered = true });
    }

    private static bool TryGetCredentials(Credentials request, out string email, out string password)
    {
        password = request.Password ?? string.Empty;
        return TryNormalizeEmail(request.Email, out email) && password.Length > 0;
    }

    private static bool TryNormalizeEmail(string? value, out string email)
    {
        email = value?.Trim().ToLowerInvariant() ?? string.Empty;
        return System.Net.Mail.MailAddress.TryCreate(email, out System.Net.Mail.MailAddress? address)
            && string.Equals(address.Address, email, StringComparison.OrdinalIgnoreCase);
    }

    private static IResult InvalidRequest() =>
        Results.BadRequest(new ApiError("invalid_request", "The request fields are invalid."));
    private static IResult InvalidCredentials() =>
        Results.Json(new ApiError("invalid_credentials", "The email or password is incorrect."),
            statusCode: StatusCodes.Status401Unauthorized);
    private static IResult IdentityErrors(IdentityResult result) =>
        Results.BadRequest(new { error = "identity_validation", errors = result.Errors.Select(item => item.Description) });
}

internal sealed record Credentials(string? Email, string? Password);
internal sealed record EmailRequest(string? Email);
internal sealed record VerificationRequest(string? Email, string? Code);
internal sealed record RecoveryRequest(string? Email, string? Code, string? Password);
internal sealed record DeleteAccountRequest(string? Confirmation);
internal sealed record ApiError(string Error, string Message);
