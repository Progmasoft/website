<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1 -->

# Visual X# website operations

This runbook covers only the language website and its not-yet-open forum page.
The account site, corporate site, and package service have their own repositories
and deployments. A redirect from an old package hostname is retained for
compatibility, but it does not make package functions part of this website.

## Route ownership

| Host and path | Owner | Current treatment |
| --- | --- | --- |
| `xsharp-lang.xyz/` | Vue language site | Maintenance response until approval |
| `xsharp-lang.xyz/docs/overview` | Vue language site | Maintenance response until approval |
| `xsharp-lang.xyz/docs/getting-started` | Vue language site | Maintenance response until approval |
| `xsharp-lang.xyz/api/v1/site` | Spring language API | Not exposed during maintenance |
| `forum.xsharp-lang.xyz/` | Static placeholder | Live; noindex |
| `viget.xsharp-lang.xyz/*` | Legacy redirect | Permanent redirect to the new package host |

Do not use a catch-all `/api/` proxy for this service. The production Nginx
configuration proxies exactly `/api/v1/site`; other `/api/` paths return 404.
The Spring process listens only on `127.0.0.1:5080`. Its `/health` endpoint is
for local process checks, not an advertised public route.

## Local gates

Run the frontend checks from `frontend/`:

```text
npm ci
npm run check
npm run format:check
npm test
npm run build
```

Run the backend gates from `backend/` with Temurin JDK 25:

```text
gradle test bootJar --no-daemon
```

The frontend tests assert canonical metadata, sitemap membership, asset shape,
forum non-indexing, and the absence of retired site links. The Spring tests
assert site-only API behavior, health, read-only operation, and missing account
and registry routes. These gates are necessary but not a substitute for a
browser review of both themes, both languages, and narrow screens.

## Asset checks

The source brand file is the supplied Visual X# SVG. The wide, transparent
composition is used in the hero. The leopard-only crop is used for favicon
and the small header mark so the animal remains legible at small sizes. The
social preview is a 1280 × 640 PNG with an intentional background. It is
separate from the Progmasoft corporate mark.

Before publication, verify that:

1. The leopard is not cropped at either its nose or lower outline.
2. The full wordmark is readable in the hero at desktop and mobile widths.
3. The light theme has adequate contrast, including links and focus rings.
4. The social PNG matches the approved Visual X# identity.
5. No page unintentionally uses a Progmasoft corporate logo.

## Link checks

All source links should target the current `Progmasoft/visual-xsharp` default
branch. In particular, check the `Spec/`, `Documents/BUILDING.md`,
`Documents/CLI.md`, and `Examples/` targets after any repository move.
The only frontend navigation routes are `/`, `/docs/overview`, and
`/docs/getting-started`. A retired login, registration, or package route must
not reappear in the site shell.

The forum placeholder links back to the language domain and to the compiler
repository. While the main domain is in maintenance, that home link may
intentionally lead to the maintenance response. Do not silently replace the
link with a different brand domain.

## Forum placeholder deployment

The forum is deliberately a static document. It has no form, identity flow,
post model, database, or discussion endpoint. Its language and theme controls
operate entirely in the browser. The page and its server response both carry
noindex signals. The Nginx policy only allows same-origin CSS, JavaScript, and
images; it does not need `unsafe-inline`.

Files under `forum/` are deployed as a unit. Deploying `index.html` without
its version-matched `site.css`, `site.js`, and two SVG files can leave a
half-styled page or controls that no longer work. The forum Nginx config
permits only those named static paths. After copying, restore SELinux labels,
validate the Nginx configuration, then reload Nginx. Do not turn SELinux off
to work around a labeling mistake.

Check the public URL for HTTP 200 and for these response properties:

- `X-Robots-Tag: noindex, nofollow`;
- Content Security Policy with same-origin script and style sources;
- `site.css`, `site.js`, and the leopard SVG returning HTTP 200;
- no login, registration, posting, or package UI; and
- English by default, with working German and light-mode controls.

The forum can be deployed while the main language domain stays in
maintenance. Opening the real forum later is a separate product decision.

## Main-site rollout gate

The current main-domain server uses `ops/nginx/xsharp-maintenance.conf`.
The future site config is `ops/nginx/xsharp.conf`. Merely committing the
future config, building the Vue bundle, or deploying the forum does **not**
authorize replacing the maintenance config. Keep the two configurations
mutually exclusive in the live Nginx include directory.

Before opening the main site:

1. Review the English and German copy against the public language Spec and
   current compiler behavior.
2. Confirm the homepage actually answers why the language exists and does
   not describe planned compiler work as a finished feature.
3. Verify the three route bodies, both themes, keyboard focus, and responsive
   widths in a real browser.
4. Confirm all GitHub destinations and the forum link respond correctly.
5. Run both build/test sets shown above.
6. Install the Vue `dist/` contents at the static root named in the Nginx
   config, preserving file permissions and SELinux labels.
7. Install Java 25 on the host and test the Spring jar on loopback before
   replacing any running API service.
8. Confirm the old service's unrelated status function has moved to the
   correct owner before retiring the old process.
9. Make one explicit Nginx configuration switch, run `nginx -t`, and reload.
10. Check the public routes and headers again from outside the server.

The Java service is not required for the static homepage render. If it is
not ready, do not pretend it is ready by rewriting the API path. Delay the
rollout or explicitly publish static pages without the API after reviewing
the impact of that decision.

## Legacy redirect during maintenance

The redirect hostname is intentionally split from the maintenance vhost.
Requests to `viget.xsharp-lang.xyz` must produce 308 to
`https://viget.progmasoft.com` and preserve path and query string. This is
true while `xsharp-lang.xyz` itself returns 503. The redirect certificate
uses the existing SAN entry for the old hostname. Do not remove the redirect
in the course of cleaning up language-site copy.

The redirect remains in the future Nginx config as well. It is routing
compatibility, not a ViGet API or a user-facing section of the language site.

## Rollback

Keep the prior Nginx configuration and the last known good frontend artifact
available until post-rollout checks pass. A rollback returns the main language
vhost to maintenance, checks `nginx -t`, reloads Nginx, and confirms the
expected 503. The forum and legacy redirect should remain unaffected.

Do not roll back by deleting certificates, disabling SELinux, or pointing
unrelated hostnames at the language frontend. If the Spring process fails,
inspect its systemd journal and local `/health` response, then restore the
previous service unit or leave the site in maintenance until the owner
boundary is clear.

## Monitoring and privacy

Expected main-domain maintenance responses are 503 with `Retry-After`.
Expected forum responses are 200 for the five static files and 404 for other
paths. Expected legacy redirect responses are 308. After the public launch,
the main language routes should be 200 and `/api/v1/site` should return only
the website's non-sensitive state. A 200 from a retired login or registry
route is a regression.

Neither the static site nor the forum placeholder should send personal data
to a third-party analytics service. Theme and language preferences are kept
locally in the browser. Nginx and Spring logs still need normal retention
and access-control practices, but this repository does not define an account
database or a user profile store.

## Post-release review

After a public rollout, perform the same checks from a clean browser profile
with no saved language or theme choice. Confirm that the default is dark and
English. Switch to German, navigate through both documentation routes, and
confirm the choice persists. Switch to light mode and repeat. The forum has
its own local preference keys and should not unexpectedly change the main
site's settings.

Inspect the page source as well as the rendered page. The initial HTML has
English home metadata; JavaScript updates metadata after route and locale
changes. If search indexing of documentation routes requires fully rendered
route-specific HTML without JavaScript, add a deliberate prerendering step
and test its output before claiming that capability. Do not assume that a
client-side title update alone proves crawler behavior.

Check the published source link and licensing files after deployment. The
source link must identify the version actually published, not a different
application's repository. Keep the public logo and third-party font notices
with the artifact. A successful HTTP response without the right assets,
copy, and license information is not a complete rollout.
