// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.0

namespace XSharp.Web.Api.Auth;

internal sealed class AuthCodeOptions
{
    public required string Pepper { get; init; }
    public int LifetimeMinutes { get; init; } = 15;
    public int MaximumAttempts { get; init; } = 6;
}
