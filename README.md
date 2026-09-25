<!--
SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1
-->

# Visual X# website

This repository owns the public language website at [xsharp-lang.xyz](https://xsharp-lang.xyz). It does not own
Progmasoft's corporate or account sites. Visual X# uses its own supplied purple leopard SVG identity;
the Progmasoft mark is a different brand.

## Routes and rollout

- `/` answers why Visual X# exists and gives an honest implementation-status caveat.
- `/docs/overview` explains the design direction.
- `/docs/getting-started` links the real compiler checkout and toolchain.
- `forum.xsharp-lang.xyz` is a standalone informational page. It is *not* a forum service; accounts and posts do not exist
  there yet. It stays noindex until a real community forum is launched.

The language domain remains on its maintenance page during the redesign. Do not replace the maintenance Nginx config with
`ops/nginx/xsharp.conf` merely because the new frontend builds. Publishing the site requires content review, route checks,
and an explicit rollout decision. The forum placeholder can be deployed independently. See the
[operations runbook](Documents/OPERATIONS.md) for the exact route and rollout boundaries.

## Frontend

The frontend is Vue 3 + Vite + TypeScript. It defaults to dark mode and `en-US`, with a `de-DE` option and a light theme.
Preferences stay in local storage. Motion is limited to short interaction transitions and obeys reduced-motion preferences.
The site uses self-hosted Fira Sans and no third-party runtime font request.

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
gradle test bootJar
```

The jar is built under `backend/build/libs/`. The server unit in `ops/systemd/xsharp-web-api.service` expects it at
`/srv/xsharp/website/current/backend/visual-xsharp-website-api-1.0.0.jar` and binds it only to loopback port 5080.
Before switching the live website service, confirm that any legacy status route still served by its old .NET process has
been transferred to its rightful owner. Install Java 25 on the server, test the new jar's site and health routes locally,
and change the service only as an explicit deployment action. Committing these files does not switch the server.

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
