// SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

using Microsoft.AspNetCore.Identity;

namespace XSharp.Web.Api.Data;

internal sealed class ApplicationUser : IdentityUser<Guid>
{
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public string? PublisherName { get; set; }
    public string? NormalizedPublisherName { get; set; }
}
