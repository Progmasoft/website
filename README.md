<!--
SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.0
-->

# Visual X# website

This repository contains the public web surface for the Visual X# programming language at
[`xsharp-lang.xyz`](https://xsharp-lang.xyz).

## Workspaces

- `frontend/` is the Astro website. It is emitted as static HTML and assets.
- `backend/` is the ASP.NET Core Identity and package-registry API. It owns password and Google authentication,
  verification/recovery mail, secure session cookies, PostgreSQL persistence, and digest-only CLI tokens.
Account dashboards use the canonical
`https://account.progmasoft.com/<Account>/dashboard` route. Package publication remains closed while the compiler
package contract is completed. Registry tokens follow the Cargo model: the plaintext is returned once,
only a SHA-256 digest is retained, and a user can revoke each token independently. Account deletion permanently
removes the Identity account, external logins, verification records, and registry tokens.

ViGet keeps DSL plugins and Visual X# packages in separate canonical catalogs:

- `https://viget.progmasoft.com/dslplugins/<Publisher>/<Name>/` contains Kotlin DSL plugin JARs.
- `https://viget.progmasoft.com/<Publisher>/<Name>/` contains Visual X# `.vipkg` packages.

`<Publisher>` is not a second registry identity. It is exactly the canonical Progmasoft `<Account>` name used by
`https://account.progmasoft.com/<Account>/dashboard`; ViGet does not register a separate publisher name.

These paths reserve catalog identity; they do not imply that publishing or downloading is available before the registry
HTTP contract is implemented.

Login, registration, recovery, and dashboards belong to `account.progmasoft.com`; ViGet owns package catalogs. The
Visual X# language host does not expose registry pages or account routes, and the retired `api.xsharp-lang.xyz` host is
not part of the production contract.

The PostgreSQL provider is selected solely by `ConnectionStrings__Registry`. Production uses the PostgreSQL instance on
the project-owned server over a local Unix socket; the database is not delegated to a hosted database service or exposed
to the browser. Google OAuth client credentials, the database connection, auth-code pepper, and data-protection
certificate stay in host-managed secrets.

OAuth and account registration belong to the Progmasoft account service. The ViGet deployment must not enable its retired
standalone Google client or ask for a second publisher username.

## Requirements

- Node.js 22.12 or newer
- npm 9.6.5 or newer
- .NET SDK 10 with the ASP.NET Core targeting pack
- PostgreSQL 16 or newer
- Postfix and OpenDKIM for production transactional mail

Production runs the API as the non-login `xsharp_web` operating-system account. PostgreSQL uses a matching local role
over its Unix socket with peer authentication, so the web process does not need a database password and PostgreSQL is
never exposed through the firewall.

## Development

```text
cd frontend
npm install
npm run dev
```

In another terminal:

```text
cd backend
dotnet run
```

Run the release checks with:

```text
npm --prefix frontend ci
npm --prefix frontend run check
npm --prefix frontend run build
dotnet restore backend/XSharp.Web.Api.csproj
dotnet build backend/XSharp.Web.Api.csproj --no-restore
```

Restore the pinned Entity Framework tool and create a migration with:

```text
dotnet tool restore
dotnet tool run dotnet-ef migrations add <Name> --project backend/XSharp.Web.Api.csproj --output-dir Data/Migrations
```

Email verification and recovery use an eight-character, short-lived, single-use code. Messages are sent by the
automated `noreply@progmasoft.com` identity; it is not a mailbox. See `ops/mail/README.md` for the transport boundary.

## Release policy

The website is a rolling deployment with fixed package and Git tag version `1.0.0`. The repository does not publish
GitHub Releases; deployment history is represented by ordinary commits while the `1.0.0` tag follows the deployed
baseline.

## License

The Visual X# website's project-owned source code is licensed under `AGPL-3.0-or-later` with the additional Progmasoft
Patent Grant, Version 1.0. A deployed modified version must offer its corresponding source to users who interact with it
over a network. The patent grant does not remove that obligation. The canonical source is
[`github.com/Progmasoft/website`](https://github.com/Progmasoft/website). See `LICENSE.txt`, `PATENTS`, and
`LICENSES/AdditionRef-Progmasoft-Patent-Grant-1.0.txt`.
