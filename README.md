<!--
SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1
-->

# Visual X# website

This repository owns the public language website at [xsharp-lang.xyz](https://xsharp-lang.xyz). It does not own
Progmasoft's corporate or account sites. Visual X# uses its own supplied purple leopard SVG identity;
the Progmasoft mark is a different brand.

## Routes

- `/` answers why Visual X# exists and gives an honest implementation-status caveat.
- `/docs/overview` explains the design direction.
- `/docs/getting-started` links the real compiler checkout and toolchain.
- `forum.xsharp-lang.xyz` is a standalone informational page. It is *not* a forum service; accounts and posts do not exist
  there yet. It stays noindex until a real community forum is launched.

The site is public and served with `ops/nginx/xsharp.conf`. `ops/nginx/xsharp-maintenance.conf` remains in the
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
`/srv/xsharp/website/current/frontend/` in `ops/nginx/xsharp.conf`. Vue Router history URLs require the Nginx
`try_files ... /index.html` fallback. The sitemap lists only the three canonical language pages; forum remains noindex.

## Backend

The small language-site API is Kotlin/JVM 25 and Spring Boot 4.1.1. Its package root is
`com.progmasoft.visual.xsharp.website`. It exposes `/api/v1/site` for the website's own public state and `/health`
for the local service manager. It has no account, package, publication, or registry endpoints. Progmaweb owns those
separate services and uses Next.js with ASP.NET Core 10; neither that stack nor its status API belongs in this repository.

```text
cd backend
gradle test bootJar dokkaGenerate
```

`dokkaGenerate` builds the API documentation and fails on a public declaration without KDoc, so the backend's
documentation cannot fall behind its code.

The jar is built under `backend/build/libs/`. The server unit in `ops/systemd/xsharp-site-api.service` expects it at
`/srv/xsharp/website/current/backend/visual-xsharp-website-api-1.0.0.jar` and binds it only to loopback port 5086.
The old .NET process remains on loopback port 5080 solely because Progmaweb's temporary ViGet status route still
depends on it; the language site does not proxy to that process. Migrate the ViGet route within Progmaweb before
retiring the old process. The server needs a Java 25 runtime. Committing these files alone does not deploy them.

## Links and language accuracy

The code example in the site is the repository's `Examples/HelloWorld/HelloWorld.vxs`, not an invented syntax sample.
All links to the compiler, examples, and specification point to the `Progmasoft/visual-xsharp` repository. The design
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
