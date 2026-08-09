<!--
SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Transactional mail boundary

The registry API submits verification and password-recovery messages to Postfix over the loopback interface. Postfix is
send-only, requires TLS for remote SMTP delivery, and signs `xsharp-lang.xyz` mail with OpenDKIM selector `registry`.
The `noreply@xsharp-lang.xyz` address is an automated sender, not a mailbox or support address.

Production DNS publishes:

- an unproxied `mail.xsharp-lang.xyz` address record;
- a strict SPF record authorizing the registry host;
- the `registry._domainkey` public key;
- a strict-alignment DMARC policy.

The private DKIM key and ASP.NET Core connection/OAuth secrets live only on the host. They are never committed. The
hosting provider should set reverse DNS for `193.111.77.89` to `mail.xsharp-lang.xyz`; this cannot be configured through
Cloudflare DNS.

Install both `opendkim` and `opendkim-tools`. Keep the selector private key owned by `opendkim:opendkim` with mode
`0600`, and make every parent key directory traversable by the `opendkim` group. On SELinux hosts, restore the packaged
OpenDKIM contexts before starting the service.
