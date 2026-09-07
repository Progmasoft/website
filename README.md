<!--
SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1
-->

# Visual X# website

This repository contains the public web surface for the Visual X# programming language at
[`xsharp-lang.xyz`](https://xsharp-lang.xyz).

## Workspaces

- `frontend/` is the Astro website for `xsharp-lang.xyz` and the static ViGet catalog surface. Visual X# does not use
  Next.js.
- `backend/` is the deliberately small ViGet service boundary. It exposes health and registry availability only while
  package publication is closed.

Progmasoft corporate pages, account registration, authentication, recovery, sessions, and account dashboards are owned
by the separate [`Progmasoft/progmaweb`](https://github.com/Progmasoft/progmaweb) repository and implemented there with
Next.js and ASP.NET Core. This repository does not duplicate those account screens or endpoints.

ViGet keeps DSL plugins and Visual X# packages in separate canonical catalogs:

- `https://viget.progmasoft.com/dslplugins/<Publisher>/<Name>/` contains Kotlin DSL plugin JARs.
- `https://viget.progmasoft.com/<Publisher>/<Name>/` contains Visual X# `.vipkg` packages.

`<Publisher>` is not a second registry identity. It is exactly the canonical Progmasoft `<Account>` name used by
`https://account.progmasoft.com/<Account>/dashboard`; ViGet does not register a separate publisher name.

These paths reserve catalog identity; they do not imply that publishing or downloading is available before the registry
HTTP contract is implemented.

Login, registration, recovery, and dashboards belong to `account.progmasoft.com`; ViGet owns package catalogs. The
Visual X# language host does not expose registry pages or account routes, and the retired `api.xsharp-lang.xyz` host is
not part of the production contract. Future ViGet publishing authentication must consume the Progmasoft Account contract;
it must not grow a second user database or publisher identity.

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

## Release policy

The website is a rolling deployment with fixed package and Git tag version `1.0.0`. The repository does not publish
GitHub Releases; deployment history is represented by ordinary commits while the `1.0.0` tag follows the deployed
baseline.

## License

The Visual X# website's project-owned source code is licensed under `AGPL-3.0-or-later` with the additional Progmasoft
Patent Grant, Version 1.1. A deployed modified version must offer its corresponding source to users who interact with it
over a network. The patent grant does not remove that obligation. The canonical source is
[`github.com/Progmasoft/website`](https://github.com/Progmasoft/website). See `LICENSE.txt`, `PATENTS`, and
`LICENSES/AdditionRef-Progmasoft-Patent-Grant-1.1.txt`.
