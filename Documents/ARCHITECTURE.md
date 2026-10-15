<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1 -->

# Architecture

The repository has three independent parts. Each is built and deployed as its own artifact, and none of them stores
anything about a visitor on a server.

| Part | Technology | Artifact | Serves |
| --- | --- | --- | --- |
| `frontend/` | Vue 3, Vite, TypeScript | static files in `frontend/dist/` | `tala.run`, `talac.tala.run`, `tazel.tala.run` |
| `backend/` | ASP.NET Core 10 | one published application | `tala.run/api/v1/site` |
| `forum/` | one HTML page with plain CSS and JavaScript | the five files as they are | `forum.tala.run` |

```text
browser
   |  HTTPS
   v
Nginx
   |-- tala.run, talac.tala.run, tazel.tala.run   static files of the Vue build; unknown paths fall back to index.html
   |-- tala.run/api/v1/site      ->  http://127.0.0.1:5086  (ASP.NET Core)
   |-- forum.tala.run            five named static files; every other path is 404
   |-- www.tala.run              permanent redirect to tala.run
   `-- xsharp-lang.xyz and its subdomains   permanent redirects to tala.run, and viget to viget.progmasoft.com
```

## Frontend

A single-page application that serves three sites. `site.ts` decides the site from the host name, and
`frontend/src/main.ts` registers the routes of that site:

| Host | Route | Page | Source |
| --- | --- | --- | --- |
| `tala.run` | `/` | why the language exists, and its current state | `pages/HomePage.vue` |
| `tala.run` | `/docs/overview` | the design direction and the compiler stages | `pages/OverviewPage.vue` |
| `tala.run` | `/docs/getting-started` | building the compiler from its repository | `pages/GettingStartedPage.vue` |
| `tala.run` | `/docs/syntax` | a first look at the syntax | `content/syntax.ts` |
| `talac.tala.run` | `/docs/command-line`, `/docs/outputs` | the compiler | `content/talac.ts` |
| `tazel.tala.run` | `/docs/commands`, `/docs/project-file` | the build system | `content/tazel.ts` |

The pages from `content/` are rendered by `pages/DocPage.vue`; each topic carries its text in all four languages. The
root of the two documentation hosts opens their first topic. Any other path redirects to the root. The router uses history URLs, so the server must answer unknown paths with
`index.html`.

The rest of the frontend is small:

- `App.vue` is the shell: header, navigation, language menu, theme button and footer.
- `locales.ts` holds the list of languages and the pure rules for choosing one. It touches neither the page nor
  storage, which is why the tests can import it directly.
- `preferences.ts` holds the current language and theme as reactive values, applies them to the page, and stores a
  choice in the browser.
- `seo.ts` sets the title, description, social metadata and canonical URL of each route in each language.
- `styles/site.css` is the only stylesheet. Fira Sans is served from the site itself; there is no request to a
  third-party font service.

Each page keeps its text next to its template, one object per language. See [Localization](LOCALIZATION.md).

## Backend

The backend is deliberately tiny. It has two endpoints:

| Endpoint | Returns |
| --- | --- |
| `GET /api/v1/site` | the name, the development phase, the fallback locale, the published locales and whether the forum is open |
| `GET /health` | an empty 200 for the local service manager; not proxied to the public |

It binds to loopback only. It has no database, no account, no package and no registry endpoint, and its tests assert
that those routes are absent. The frontend renders without it; nothing on the three pages depends on the endpoint
today.

Nginx proxies exactly `/api/v1/site`. Every other `/api/` path is answered with 404 by Nginx, so adding an endpoint
to the backend does not publish it.

## Forum page

`forum.tala.run` is a notice that the forum is not open yet. It is not a forum: there are no accounts, no
posts and no service behind it. The page shows its one notice in the language of the browser and offers a theme
button; it has no language menu and stores no language. It is marked `noindex` in the page and in the response
header.

The page is independent of the Vue application. It shares no code with it, and its strict content security policy
allows only its own script, stylesheet and two images.

## What the site does not contain

- **Accounts and packages.** Progmasoft accounts and the ViGet package registry belong to the Progmaweb repository
  and live on `progmasoft.com` hosts. This site links to neither a sign-in nor a registry.
- **A legacy redirect only.** `viget.xsharp-lang.xyz` redirects permanently to `viget.progmasoft.com`, keeping path
  and query. That redirect is routing compatibility, not a feature of this site; tala.run has no ViGet host.
- **Visitor data.** The language and theme a visitor chose are kept in the browser's local storage. The site sets no
  cookie and sends nothing about the visitor to the backend.

## Search engines and crawlers

- Each host has its own `sitemap.xml` and `robots.txt`; Nginx serves `public/hosts/talac/` and
  `public/hosts/tazel/` for the two documentation hosts. A sitemap lists exactly the routes of its host.
- Every route has its own title, description and canonical URL. A language is a preference, not a second URL, so
  there are no `hreflang` alternatives.
- `robots.txt` names the crawlers the site has a rule for. Search and answer-retrieval crawlers are allowed. Among
  the crawlers that collect training data, Google-Extended and ClaudeBot are allowed and GPTBot is disallowed; the
  file is the authority for the full list.
- The initial HTML carries the English metadata of the homepage. The metadata of the other routes and languages is
  set by JavaScript after the page loads.

## Security headers

Nginx sends a content security policy that allows only same-origin resources, plus HSTS, `X-Content-Type-Options`,
`X-Frame-Options: DENY` and a referrer policy. The policy has no exception for third-party scripts; a script injected
by an intermediary, such as an analytics beacon added by a CDN, is blocked by the browser.
