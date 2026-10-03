<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1 -->

# Development

## Requirements

| Tool | Version | Used for |
| --- | --- | --- |
| Node.js | 22.18 or newer; CI uses 24 | the frontend and all JavaScript tests |
| npm | the one that ships with Node.js | frontend dependencies |
| Temurin JDK | 25 | the backend |
| Gradle | 9.6.0, the version CI installs | the backend build; the repository has no Gradle wrapper |

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
`http://127.0.0.1:5080`, the default port of a locally started backend.

`.npmrc` refuses install scripts of dependencies that were not reviewed. A new dependency with an install script
fails `npm ci` until its exact version is allowed in `package.json`.

## Backend

```text
cd backend
gradle test bootJar dokkaGenerate --no-daemon
gradle bootRun --no-daemon      # serves on 127.0.0.1:5080
```

- `test` runs the Spring tests.
- `bootJar` builds `build/libs/visual-xsharp-website-api-1.0.0.jar`.
- `dokkaGenerate` builds the API documentation and is a gate: a public declaration without KDoc, a broken link or an
  unresolved reference fails the build.

### Dependency locks and checksums

The backend pins every resolved version in `gradle.lockfile` and the SHA-256 of every downloaded file in
`gradle/verification-metadata.xml`. After changing a dependency or a plugin, regenerate both and review the diff:

```text
gradle dependencies --write-locks --no-daemon
gradle --refresh-dependencies --write-verification-metadata sha256 help test jacocoTestReport bootJar dokkaGenerate --no-daemon
```

`--refresh-dependencies` matters. With a warm local cache Gradle does not download every metadata file again and so
does not record it; the build then passes locally and fails verification on a clean CI machine.

A checksum is an integrity pin, not a trust review. Confirm the version and the repository of an artifact before
accepting its checksum.

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
| `forum.test.mjs` | the notice in each language, the fallback, the absence of a language menu, and the theme button |
| `site-integrity.test.mjs` | sitemap and router agreement, forum non-indexing, logo and social image shape, absence of retired links, pinned workflow actions, and that the Nginx and systemd files agree with each other |

Two tests in `site-integrity.test.mjs` compare the site with a checkout of the compiler repository next to this one
and skip themselves when it is absent.

The backend tests assert the content of `/api/v1/site`, the empty health response, that the API is read-only, and
that account and registry routes do not exist.

A change to a page is not verified by these tests alone. Look at it in a browser: all four languages, both themes, a
narrow window, and keyboard focus.

## Continuous integration

| Job | Enforces |
| --- | --- |
| `frontend` | `npm ci`, `npm audit` at moderate severity, type check, tests with coverage, format check, build |
| `backend` | tests with coverage, the jar, and the Dokka documentation gate |
| `frontend-coverage`, `backend-coverage` | upload coverage to Codecov |
| `dependency-review` | reviews dependency changes of a pull request |
| CodeQL | static analysis of the workflows, TypeScript and Kotlin |

Only the coverage jobs receive an OIDC token; the jobs that install and build do not, and pull requests from forks
skip the upload. Workflow actions are pinned to commit hashes, and a test fails when one is not.

`main` is protected: changes arrive through pull requests with green checks.

## Conventions

- Public documents, comments, commit messages and pull request text are written in American English.
- Every file carries the SPDX header of the repository; `REUSE.toml` covers the formats that cannot hold a comment.
- A user-visible string is added to every locale in the same change. See [Localization](LOCALIZATION.md).
- What the pages may claim about the language is governed by the [content contract](CONTENT.md).
