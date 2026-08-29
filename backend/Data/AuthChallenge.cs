// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.0

namespace XSharp.Web.Api.Data;

internal sealed class AuthChallenge
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public required Guid UserId { get; init; }
    public required string Purpose { get; init; }
    public required byte[] CodeDigest { get; init; }
    public DateTimeOffset ExpiresAt { get; init; }
    public int FailedAttempts { get; set; }
    public DateTimeOffset? ConsumedAt { get; set; }
}
