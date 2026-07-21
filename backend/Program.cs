// SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
builder.Services.AddProblemDetails();
builder.Services.AddHealthChecks();

WebApplication app = builder.Build();
app.UseExceptionHandler();

app.MapHealthChecks("/health");
app.MapGet(
    "/api/v1/status",
    () => Results.Ok(
        new ServiceStatus(
            Service: "xsharp-lang",
            Status: "online",
            RegistryAvailable: false)));

app.Run();

internal sealed record ServiceStatus(string Service, string Status, bool RegistryAvailable);

