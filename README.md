<!--
SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Visual X# website

This repository contains the public web surface for the Visual X# programming language at
[`xsharp-lang.xyz`](https://xsharp-lang.xyz).

## Workspaces

- `frontend/` is the Astro website. It is emitted as static HTML and assets.
- `backend/` is the ASP.NET Core Identity and package-registry API. It owns password and Google authentication,
  verification/recovery mail, secure session cookies, PostgreSQL persistence, and digest-only CLI tokens.
- `java.xsharp-lang.xyz` is retained as a deprecated, read-only historical Java catalog so existing links continue to
  resolve. It does not define the current compiler pipeline and does not accept new artifact publication.
  Its dedicated nginx host serves the generated `/java/` page at the domain root while sharing immutable frontend assets.

The deprecated catalog records the former `org.progmasoft.visual_xsharp.xmm.writer`,
`org.progmasoft.visual_xsharp.xmm.reader`, and `org.progmasoft.java_utilities.ffi.c` package plans for historical reference;
they are not a current public-package commitment.

The registry account dashboard is available at
[`viget.xsharp-lang.xyz/dashboard`](https://viget.xsharp-lang.xyz/dashboard/). Package publication remains closed while
the compiler package contract is completed. Registry tokens follow the Cargo model: the plaintext is returned once,
only a SHA-256 digest is retained, and a user can revoke each token independently. Account deletion permanently
removes the Identity account, external logins, verification records, and registry tokens.

The PostgreSQL provider is selected solely by `ConnectionStrings__Registry`; production can use a Supabase PostgreSQL
connection without exposing database or service credentials to the browser. Google OAuth client credentials, the
database connection, auth-code pepper, and data-protection certificate stay in host-managed secrets.

The Google OAuth web client callback is
`https://viget.xsharp-lang.xyz/api/v1/auth/google/callback`. Configure it through
`Authentication__Google__ClientId` and `Authentication__Google__ClientSecret`. Until both values exist, the frontend
keeps the Google button visible but disabled and email/password authentication remains available.
Every completed Google authorization still requires the short-lived Visual X# email code before a registry session is issued.
New accounts choose a publisher username before email verification. The canonical spelling is case-sensitive and must contain
8–128 ASCII letters or digits, beginning with an uppercase letter. Ownership is case-insensitively unique, so case-only
variants cannot impersonate an existing publisher; `Progmasoft` and `Leitwolf` are reserved.

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
automated `noreply@xsharp-lang.xyz` identity; it is not a mailbox. See `ops/mail/README.md` for the transport boundary.

## Release policy

The website is a rolling deployment with fixed package and Git tag version `1.0.0`. The repository does not publish
GitHub Releases; deployment history is represented by ordinary commits while the `1.0.0` tag follows the deployed
baseline.

## License

The Visual X# website is licensed under the GNU Affero General Public License, version 3 or any later version. A deployed modified
version must offer its corresponding source to users who interact with it over a network. The canonical source link is
[`github.com/Progmasoft/website`](https://github.com/Progmasoft/website).
