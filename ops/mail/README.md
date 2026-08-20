<!--
SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Transactional mail boundary

The registry API submits verification and password-recovery messages to Postfix over the loopback interface. Postfix
requires TLS for remote SMTP delivery and signs `xsharp-lang.xyz` mail with OpenDKIM selector `registry`. The automated
`noreply@xsharp-lang.xyz` sender remains non-login. `support@xsharp-lang.xyz` is the only interactive mailbox and is
delivered as Maildir to the dedicated, non-shell `support` account.

Production DNS publishes:

- an unproxied `mail.xsharp-lang.xyz` address record;
- an MX record with priority 10 targeting `mail.xsharp-lang.xyz`;
- a strict SPF record authorizing the registry host;
- the `registry._domainkey` public key;
- a strict-alignment DMARC policy.

The private DKIM key and ASP.NET Core connection/OAuth secrets live only on the host. They are never committed. The
hosting provider should set reverse DNS for `193.111.77.89` to `mail.xsharp-lang.xyz`; this cannot be configured through
Cloudflare DNS.

Install `postfix`, `opendkim`, `opendkim-tools`, `dovecot`, and `certbot`. Keep the selector private key owned by
`opendkim:opendkim` with mode `0600`, and make every parent key directory traversable by the `opendkim` group. On SELinux
hosts, restore packaged contexts before starting the services.

The support password is supplied only through `XSHARP_SUPPORT_EMAIL_PASSWORD` while provisioning. It is converted to the
host's password hash and must never be copied into a repository, environment file, or Postfix/Dovecot configuration.
Remove the legacy `support: postmaster` alias before enabling local delivery, because aliases take precedence over the
local account.

The dedicated home and every Maildir directory are owned by `support:support` with mode `0700`. Because this deployment
keeps mail under `/var/lib/xsharp-mail` instead of `/home`, SELinux must persist `user_home_dir_t` on the account home and
`mail_home_rw_t` on `Maildir(/.*)?` through `semanage fcontext`, followed by `restorecon`. A generic `var_lib_t` context
allows login but blocks both Postfix delivery and Dovecot index writes.

Client settings:

- address and username: `support@xsharp-lang.xyz`;
- incoming mail: IMAPS at `mail.xsharp-lang.xyz:993`, TLS required;
- outgoing mail: submission at `mail.xsharp-lang.xyz:587`, STARTTLS required;
- SMTP sender: exactly `support@xsharp-lang.xyz`.

Port 25 accepts mail for the local domain but never authenticates users or acts as an open relay. Port 587 requires
Dovecot authentication and rejects an authenticated account that tries to use another sender address. Certificate
renewal installs `certbot-deploy-hook.sh` so Postfix and Dovecot reload the renewed key material.
