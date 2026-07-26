// SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace XSharp.Web.Api.Auth;

internal sealed class AuthCodeOptions
{
    public required string Pepper { get; init; }
    public int LifetimeMinutes { get; init; } = 15;
    public int MaximumAttempts { get; init; } = 6;
}
