// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.0

namespace XSharp.Web.Api.Email;

internal sealed class EmailOptions
{
    public string Host { get; init; } = "127.0.0.1";
    public int Port { get; init; } = 25;
    public string From { get; init; } = "noreply@progmasoft.com";
    public string SenderName { get; init; } = "ViGet Package Registry by Progmasoft";
}
