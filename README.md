<!--
SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1
-->

# Tala website

This repository owns the public language website at [tala.run](https://tala.run) and the documentation of the
compiler and the build system at [talac.tala.run](https://talac.tala.run) and [tazel.tala.run](https://tazel.tala.run).
It does not own
Progmasoft's corporate or account sites. Tala uses its own supplied purple leopard SVG identity;
the Progmasoft mark is a different brand.

## Routes

One frontend build serves three sites and picks its pages from the host name:

- `tala.run/` answers why Tala exists and gives an honest implementation-status caveat; `tala.run/docs/overview`
  explains the design direction, `tala.run/docs/getting-started` links the real compiler checkout and toolchain, and
  `tala.run/docs/syntax` gives a first look at the syntax from the public specification.
- `talac.tala.run/docs/command-line` and `talac.tala.run/docs/outputs` document the compiler.
- `tazel.tala.run/docs/commands` and `tazel.tala.run/docs/project-file` document the build system.
- `forum.tala.run` is a standalone informational page. It is *not* a forum service; accounts and posts do not exist
  there yet. It stays noindex until a real community forum is launched.

Every path of the former domain, `xsharp-lang.xyz`, redirects permanently to the same path of `tala.run`. tala.run has
no ViGet host; the registry lives at `viget.progmasoft.com`.

The sites are public and served with `ops/nginx/tala.conf`. `ops/nginx/tala-maintenance.conf` remains in the
repository as the configuration to fall back to when the main domain has to be taken offline. The forum page is
deployed independently of the main site. See the [operations runbook](Documents/OPERATIONS.md) for the route and
release boundaries.

## Documentation

- [Architecture](Documents/ARCHITECTURE.md): the three parts of the repository and what each serves.
- [Localization](Documents/LOCALIZATION.md): language selection, text direction and adding a language.
- [Development](Documents/DEVELOPMENT.md): local setup, tests and what CI enforces.
- [Content contract](Documents/CONTENT.md): what the pages may claim and the rules for copy.
- [Operations](Documents/OPERATIONS.md): routes, release steps and rollback.

## Frontend

The frontend is Vue 3 + Vite + TypeScript. It is published in `en-US`, `de-DE`, `ru-RU` and `he-IL`. A visitor who has
not chosen a language gets the language of their browser, and `en-US` when the browser prefers none of the four; a
language chosen in the menu is remembered. Hebrew text runs right to left while the page layout stays as it is. The
theme defaults to dark, with a light option. Preferences stay in local storage. Motion is limited to short interaction
transitions and obeys reduced-motion preferences. The site uses self-hosted Fira Sans and no third-party runtime font
request.

```text
cd frontend
npm ci
npm run check
npm run format:check
npm test
npm run build
npm run dev
```

The production artifact is `frontend/dist/`. Deploy its *contents* to the static root named
`/srv/xsharp/website/current/frontend/` in `ops/nginx/tala.conf`. Vue Router history URLs require the Nginx
`try_files ... /index.html` fallback. Each site has its own sitemap and robots file; the forum remains noindex. On a
development host, `?site=talac` or `?site=tazel` selects the documentation site.

## Backend

The small language-site API is ASP.NET Core 10, `backend/Progmasoft.Tala.Website.Api`, under the namespace
`Progmasoft.Tala.Website`. It exposes `/api/v1/site` for the website's own public state and `/health` for the local
service manager. It has no account, package, publication, or registry endpoints; Progmaweb owns those separate
services.

```text
dotnet restore Progmasoft.Tala.Website.slnx --locked-mode
dotnet build Progmasoft.Tala.Website.slnx --configuration Release --no-restore
dotnet test --project backend/Progmasoft.Tala.Website.Api.Tests/Progmasoft.Tala.Website.Api.Tests.csproj --configuration Release --no-build
dotnet publish backend/Progmasoft.Tala.Website.Api/Progmasoft.Tala.Website.Api.csproj --configuration Release --output publish
```

The build treats warnings as errors and requires a documentation comment on every public declaration; DocFX builds
the API reference from those comments and fails on any undocumented item (see `Documents/api/`). The server unit
in `ops/systemd/tala-site-api.service` runs the published DLL from `/srv/xsharp/website/current/site-api/` on the
shared ASP.NET Core 10 runtime and binds it only to loopback port 5086. The old .NET process on loopback port 5080 in
`current/backend/` belongs to Progmaweb's ViGet status route; the language site does not proxy to it. Committing these
files alone does not deploy them.

## Links and language accuracy

The code example in the site is the repository's `Examples/HelloWorld/HelloWorld.tala`, not an invented syntax sample.
All links to the compiler, examples, and specification point to the `Progmasoft/tala` repository. The design
examples in `Spec/` can be ahead of compiler support; website text must not turn them into implementation claims. The
retired `docs/ARCHITECTURE.md` link has been removed; architecture documentation now lives under `Documents/` in the
compiler repository.
The [content contract](Documents/CONTENT.md) records the intended page roles, translation rules, and fact-checking
boundary for future copy changes.

## License

Project-owned website source is `AGPL-3.0-or-later` with the Progmasoft Patent Grant, Version 1.1. Users interacting
with a deployed modified version over a network must be offered its corresponding source. See `LICENSE.txt`, `PATENTS`,
and `LICENSES/AdditionRef-Progmasoft-Patent-Grant-1.1.txt`. Fira Sans has its own OFL notice in
`third_party/fonts/FiraSans-OFL.txt`.
