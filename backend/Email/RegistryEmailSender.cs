// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.0

using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace XSharp.Web.Api.Email;

internal sealed class RegistryEmailSender(IOptions<EmailOptions> options)
{
    private readonly EmailOptions configuration = options.Value;

    public async Task SendCodeAsync(string recipient, string code, string purpose)
    {
        string action = purpose == "recovery" ? "reset your password" : "verify your email";
        using MailMessage message = new()
        {
            From = new MailAddress(configuration.From, configuration.SenderName),
            Subject = purpose == "recovery" ? "Your Visual X# password recovery code" : "Verify your Visual X# registry email",
            Body = $"Use this one-time code to {action}: {code}\n\n"
                + "The code expires in 15 minutes. If you did not request it, ignore this message.\n\n"
                + "This mailbox is not monitored.",
            IsBodyHtml = false,
        };
        message.To.Add(new MailAddress(recipient));

        using SmtpClient client = new(configuration.Host, configuration.Port)
        {
            DeliveryMethod = SmtpDeliveryMethod.Network,
            EnableSsl = false,
            UseDefaultCredentials = false,
            Credentials = CredentialCache.DefaultNetworkCredentials,
        };
        await client.SendMailAsync(message);
    }
}
