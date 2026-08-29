// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.0

using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using XSharp.Web.Api.Data;

namespace XSharp.Web.Api.Auth;

internal sealed class AuthCodeService(RegistryDbContext database, IOptions<AuthCodeOptions> options)
{
    private const string Alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private readonly AuthCodeOptions configuration = options.Value;

    public async Task<string> CreateAsync(Guid userId, string purpose, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(configuration.Pepper))
        {
            throw new InvalidOperationException("AuthCodes:Pepper is required.");
        }

        await database.AuthChallenges
            .Where(item => item.UserId == userId && item.Purpose == purpose && item.ConsumedAt == null)
            .ExecuteUpdateAsync(setters => setters.SetProperty(item => item.ConsumedAt, DateTimeOffset.UtcNow),
                cancellationToken);

        string code = string.Create(8, 0, static (buffer, _) =>
        {
            for (int index = 0; index < buffer.Length; ++index)
            {
                buffer[index] = Alphabet[RandomNumberGenerator.GetInt32(Alphabet.Length)];
            }
        });
        database.AuthChallenges.Add(new AuthChallenge
        {
            UserId = userId,
            Purpose = purpose,
            CodeDigest = Digest(code, configuration.Pepper),
            ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(configuration.LifetimeMinutes),
        });
        await database.SaveChangesAsync(cancellationToken);
        return code;
    }

    public async Task<bool> ConsumeAsync(Guid userId, string purpose, string code, CancellationToken cancellationToken)
    {
        AuthChallenge? challenge = await database.AuthChallenges
            .Where(item => item.UserId == userId && item.Purpose == purpose && item.ConsumedAt == null)
            .OrderByDescending(item => item.ExpiresAt)
            .FirstOrDefaultAsync(cancellationToken);
        if (challenge is null || challenge.ExpiresAt <= DateTimeOffset.UtcNow
            || challenge.FailedAttempts >= configuration.MaximumAttempts)
        {
            return false;
        }

        byte[] supplied = Digest(code.Trim().ToUpperInvariant(), configuration.Pepper);
        if (!CryptographicOperations.FixedTimeEquals(challenge.CodeDigest, supplied))
        {
            ++challenge.FailedAttempts;
            await database.SaveChangesAsync(cancellationToken);
            return false;
        }

        challenge.ConsumedAt = DateTimeOffset.UtcNow;
        await database.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static byte[] Digest(string code, string pepper) =>
        SHA256.HashData(Encoding.UTF8.GetBytes($"{pepper}:{code}"));
}
