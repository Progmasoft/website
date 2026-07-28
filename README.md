<!--
SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# X# website

This repository contains the public web surface for the X# programming language at
[`xsharp-lang.xyz`](https://xsharp-lang.xyz).

## Workspaces

- `frontend/` is the Astro website. It is emitted as static HTML and assets.
- `backend/` is the ASP.NET Core Identity and package-registry API. It owns password and Google authentication,
  verification/recovery mail, secure session cookies, PostgreSQL persistence, and digest-only CLI tokens.
- `java.xsharp-lang.xyz` is the read-only Java artifact catalog. Its package descriptions are rendered from trusted
  Markdown at build time and Maven-compatible files are served separately from the static catalog.

The registry account dashboard is available at
[`repo.xsharp-lang.xyz/dashboard`](https://repo.xsharp-lang.xyz/dashboard/). Package publication remains closed while
the compiler package contract is completed. Registry tokens follow the Cargo model: the plaintext is returned once,
only a SHA-256 digest is retained, and a user can revoke each token independently. Account deletion permanently
removes the Identity account, external logins, verification records, and registry tokens.

The PostgreSQL provider is selected solely by `ConnectionStrings__Registry`; production can use a Supabase PostgreSQL
connection without exposing database or service credentials to the browser. Google OAuth client credentials, the
database connection, auth-code pepper, and data-protection certificate stay in host-managed secrets.

The Google OAuth web client callback is
`https://repo.xsharp-lang.xyz/api/v1/auth/google/callback`. Configure it through
`Authentication__Google__ClientId` and `Authentication__Google__ClientSecret`. Until both values exist, the frontend
keeps the Google button visible but disabled and email/password authentication remains available.
Every completed Google authorization still requires the short-lived X# email code before a registry session is issued.

## Requirements

- Node.js 22.12 or newer
- npm 9.6.5 or newer
- .NET SDK 10 with the ASP.NET Core targeting pack
- PostgreSQL 16 or newer
- Postfix and OpenDKIM for production transactional mail

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

## License

X# website is licensed under the GNU Affero General Public License, version 3 or any later version. A deployed modified
version must offer its corresponding source to users who interact with it over a network. The canonical source link is
[`github.com/xss-lang/website`](https://github.com/xss-lang/website).
