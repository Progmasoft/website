// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddProblemDetails();
builder.Services.AddHealthChecks();

WebApplication app = builder.Build();

app.UseExceptionHandler();
app.MapHealthChecks("/health");
app.MapGet("/api/v1/status", () => Results.Ok(new ServiceStatus("viget", "online", true)));

app.Run();

internal sealed record ServiceStatus(string Service, string Status, bool RegistryAvailable);

// WebApplicationFactory uses this partial type to host the same production
// entry point in the ViGet boundary test. Account endpoints intentionally live
// in Progmaweb and must not be reintroduced here.
public partial class Program;
