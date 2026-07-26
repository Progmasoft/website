<!--
SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# X# website

This repository contains the public web surface for the X# programming language at
[`xsharp-lang.xyz`](https://xsharp-lang.xyz).

## Workspaces

- `frontend/` is the Astro website. It is emitted as static HTML and assets.
- `backend/` is the ASP.NET Core API boundary for future account and package-registry services.
- `java.xsharp-lang.xyz` is the read-only Java artifact catalog. Its package descriptions are rendered from trusted
  Markdown at build time and Maven-compatible files are served separately from the static catalog.

The package registry is not implemented yet. The backend currently exposes only health and public service metadata;
this keeps deployment plumbing testable without claiming an unfinished API contract.

## Requirements

- Node.js 22.12 or newer
- npm 9.6.5 or newer
- .NET SDK 10 with the ASP.NET Core targeting pack

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

## License

X# website is licensed under the GNU Affero General Public License, version 3 or any later version. A deployed modified
version must offer its corresponding source to users who interact with it over a network. The canonical source link is
[`github.com/xss-lang/website`](https://github.com/xss-lang/website).
