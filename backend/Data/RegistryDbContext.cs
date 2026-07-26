// SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace XSharp.Web.Api.Data;

internal sealed class RegistryDbContext(DbContextOptions<RegistryDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<AuthChallenge> AuthChallenges => Set<AuthChallenge>();
    public DbSet<RegistryToken> RegistryTokens => Set<RegistryToken>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.HasDefaultSchema("registry");

        builder.Entity<ApplicationUser>(entity =>
        {
            entity.Property(user => user.CreatedAt).IsRequired();
            entity.HasIndex(user => user.NormalizedEmail).IsUnique();
        });
        builder.Entity<AuthChallenge>(entity =>
        {
            entity.HasKey(challenge => challenge.Id);
            entity.Property(challenge => challenge.Purpose).HasMaxLength(32);
            entity.Property(challenge => challenge.CodeDigest).HasMaxLength(32);
            entity.HasIndex(challenge => new { challenge.UserId, challenge.Purpose, challenge.ConsumedAt });
        });
        builder.Entity<RegistryToken>(entity =>
        {
            entity.HasKey(token => token.Id);
            entity.Property(token => token.Name).HasMaxLength(80);
            entity.Property(token => token.Digest).HasMaxLength(32);
            entity.Property(token => token.Prefix).HasMaxLength(16);
            entity.Property(token => token.Scopes).HasColumnType("text[]");
            entity.HasIndex(token => token.Digest).IsUnique();
            entity.HasIndex(token => new { token.UserId, token.RevokedAt });
        });
    }
}
