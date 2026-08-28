// SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace XSharp.Web.Api.Email;

internal sealed class EmailOptions
{
    public string Host { get; init; } = "127.0.0.1";
    public int Port { get; init; } = 25;
    public string From { get; init; } = "noreply@progmasoft.com";
    public string SenderName { get; init; } = "ViGet Package Registry by Progmasoft";
}
