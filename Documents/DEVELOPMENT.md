<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1 -->

# Development

## Requirements

| Tool | Version | Used for |
| --- | --- | --- |
| Node.js | 22.18 or newer; CI uses 24 | the frontend and all JavaScript tests |
| npm | the one that ships with Node.js | frontend dependencies |
| .NET SDK | 10, as `global.json` allows | the backend |

## Frontend

```text
cd frontend
npm ci
npm run dev            # development server
npm run check          # vue-tsc type check
npm test               # Node tests
npm run format:check   # Prettier, also over ../forum
npm run build          # type check and production build into dist/
```

`npm run format` rewrites the files Prettier checks. The development server proxies `/api` to
`http://127.0.0.1:5086`, the default port of a locally started backend. A development host has no subdomains, so
`?site=talac` or `?site=tazel` opens the documentation of the compiler or the build system; the choice lasts for the
tab, and `?site=language` returns to the language site.

`.npmrc` refuses install scripts of dependencies that were not reviewed. A new dependency with an install script
fails `npm ci` until its exact version is allowed in `package.json`.

## Backend

```text
dotnet restore Progmasoft.Tala.Website.slnx --locked-mode
dotnet build Progmasoft.Tala.Website.slnx --configuration Release --no-restore
dotnet test --project backend/Progmasoft.Tala.Website.Api.Tests/Progmasoft.Tala.Website.Api.Tests.csproj --configuration Release --no-build
dotnet run --project backend/Progmasoft.Tala.Website.Api      # serves on 127.0.0.1:5086
```

- The build treats warnings as errors and requires a documentation comment on every public declaration.
- DocFX builds the API reference from those comments. `dotnet tool restore`, then
  `dotnet docfx Documents/api/docfx.json --warningsAsErrors` and
  `dotnet run Documents/api/CheckDocumentation.cs -- Documents/api`; the second fails on any namespace, type or
  member of the reference without a description. See [the API reference](api/index.md).
- The tests run the endpoints in an in-memory host with xUnit v3 on Microsoft.Testing.Platform.
- `PORT` changes the port; the service binds to loopback only.

### Dependency locks

Every project restores from its `packages.lock.json`, and CI restores with `--locked-mode`, so a resolved version
cannot change unnoticed. After changing a package reference, run `dotnet restore Progmasoft.Tala.Website.slnx` and
review the changed lock files.

## Forum page

`forum/` has no build step. Open `forum/index.html` through any static file server, for example:

```text
python -m http.server 3022 --bind 127.0.0.1 --directory forum
```

Its script is tested by `frontend/tests/forum.test.mjs`, which runs it against a minimal fake document. To see the
notice in another language, change the preferred language of the browser.

## Tests

All JavaScript tests run with `npm test` in `frontend/`.

| File | Asserts |
| --- | --- |
| `locales.test.mjs` | the published locales, browser-language selection, the English fallback, that a stored choice wins, text direction, and when a change is remembered |
| `seo.test.mjs` | the title, description and canonical URL of every route in every language |
| `sites.test.mjs` | which host is which site, links between the sites, the sidebars, that every topic is written in every language with the same code samples, and that the documentation teaches only the current command lines |
| `forum.test.mjs` | the notice in each language, the fallback, the absence of a language menu, and the theme button |
| `site-integrity.test.mjs` | sitemap and router agreement, forum non-indexing, logo and social image shape, absence of retired links, pinned workflow actions, and that the Nginx and systemd files agree with each other |

Two tests in `site-integrity.test.mjs` compare the site with a checkout of the compiler repository next to this one
and skip themselves when it is absent.

The API tests assert the content of `/api/v1/site`, the empty health response, that the API is read-only, and
that account and registry routes do not exist.

A change to a page is not verified by these tests alone. Look at it in a browser: all four languages, both themes, a
narrow window, and keyboard focus.

## Continuous integration

| Job | Enforces |
| --- | --- |
| `frontend` | `npm ci`, `npm audit` at moderate severity, type check, tests with coverage, format check, build |
| `backend` | locked restore, build with warnings as errors, tests with coverage, the published application, and the DocFX documentation gate |
| `frontend-coverage`, `backend-coverage` | upload coverage to Codecov |
| `dependency-review` | reviews dependency changes of a pull request |
| CodeQL | static analysis of the workflows, TypeScript and C# |

Only the coverage jobs receive an OIDC token; the jobs that install and build do not, and pull requests from forks
skip the upload. Workflow actions are pinned to commit hashes, and a test fails when one is not.

`main` is protected: changes arrive through pull requests with green checks.

## Conventions

- Public documents, comments, commit messages and pull request text are written in American English.
- Every file carries the SPDX header of the repository; `REUSE.toml` covers the formats that cannot hold a comment.
- A user-visible string is added to every locale in the same change. See [Localization](LOCALIZATION.md).
- What the pages may claim about the language is governed by the [content contract](CONTENT.md).
