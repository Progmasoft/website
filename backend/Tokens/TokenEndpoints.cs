// SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using XSharp.Web.Api.Data;

namespace XSharp.Web.Api.Tokens;

internal static class TokenEndpoints
{
    private static readonly HashSet<string> AllowedScopes = new(StringComparer.Ordinal)
    {
        "read",
        "publish",
        "yank",
    };

    public static void MapTokenEndpoints(this WebApplication app)
    {
        RouteGroupBuilder tokens = app.MapGroup("/api/v1/tokens")
            .RequireAuthorization()
            .RequireRateLimiting("tokens");
        tokens.MapGet("/", ListAsync);
        tokens.MapPost("/", CreateAsync);
        tokens.MapDelete("/{id:guid}", RevokeAsync);
    }

    private static async Task<IResult> ListAsync(
        ClaimsPrincipal principal,
        RegistryDbContext database,
        CancellationToken cancellationToken)
    {
        Guid userId = GetUserId(principal);
        var tokens = await database.RegistryTokens
            .Where(token => token.UserId == userId && token.RevokedAt == null)
            .OrderByDescending(token => token.CreatedAt)
            .Select(token => new
            {
                token.Id,
                token.Name,
                token.Prefix,
                token.Scopes,
                token.CreatedAt,
                token.LastUsedAt,
            })
            .ToListAsync(cancellationToken);
        return Results.Ok(tokens);
    }

    private static async Task<IResult> CreateAsync(
        CreateTokenRequest request,
        ClaimsPrincipal principal,
        RegistryDbContext database,
        CancellationToken cancellationToken)
    {
        string name = request.Name?.Trim() ?? string.Empty;
        string[] scopes = request.Scopes?
            .Where(scope => scope is not null)
            .Distinct(StringComparer.Ordinal)
            .Order(StringComparer.Ordinal)
            .ToArray() ?? [];
        if (name.Length is < 1 or > 80 || scopes.Length == 0 || scopes.Any(scope => !AllowedScopes.Contains(scope)))
        {
            return Results.BadRequest(new
            {
                error = "invalid_token",
                message = "Token name or permissions are invalid.",
            });
        }

        string raw = $"xs_{Convert.ToHexString(RandomNumberGenerator.GetBytes(32)).ToLowerInvariant()}";
        RegistryToken token = new()
        {
            UserId = GetUserId(principal),
            Name = name,
            Digest = SHA256.HashData(System.Text.Encoding.ASCII.GetBytes(raw)),
            Prefix = raw[..11],
            Scopes = scopes,
        };
        database.RegistryTokens.Add(token);
        await database.SaveChangesAsync(cancellationToken);
        return Results.Ok(new
        {
            token.Id,
            Token = raw,
            token.Prefix,
            token.Scopes,
            token.CreatedAt,
        });
    }

    private static async Task<IResult> RevokeAsync(
        Guid id,
        ClaimsPrincipal principal,
        RegistryDbContext database,
        CancellationToken cancellationToken)
    {
        Guid userId = GetUserId(principal);
        RegistryToken? token = await database.RegistryTokens
            .FirstOrDefaultAsync(item => item.Id == id && item.UserId == userId && item.RevokedAt == null,
                cancellationToken);
        if (token is null) return Results.NotFound();
        token.RevokedAt = DateTimeOffset.UtcNow;
        await database.SaveChangesAsync(cancellationToken);
        return Results.NoContent();
    }

    private static Guid GetUserId(ClaimsPrincipal principal) =>
        Guid.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("Authenticated user identifier is missing."));
}

internal sealed record CreateTokenRequest(string? Name, string[]? Scopes);
