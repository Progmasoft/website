// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.0

using Microsoft.AspNetCore.Identity;

namespace XSharp.Web.Api.Data;

internal sealed class ApplicationUser : IdentityUser<Guid>
{
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public string? PublisherName { get; set; }
    public string? NormalizedPublisherName { get; set; }
}
