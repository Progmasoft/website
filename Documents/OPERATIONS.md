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
| `xsharp-lang.xyz/` | Vue language site | Live |
| `xsharp-lang.xyz/docs/overview` | Vue language site | Live |
| `xsharp-lang.xyz/docs/getting-started` | Vue language site | Live |
| `xsharp-lang.xyz/api/v1/site` | Spring language API | Live; the only proxied API path |
| `forum.xsharp-lang.xyz/` | Static placeholder | Live; noindex |
| `www`, `docs`, `spec` subdomains | Redirect | Permanent redirect to `xsharp-lang.xyz` |
| `viget.xsharp-lang.xyz/*` | Legacy redirect | Permanent redirect to the new package host |

The main domain is served with `ops/nginx/xsharp.conf`. While it is switched to
`ops/nginx/xsharp-maintenance.conf`, the three language routes answer 503 and
`/api/v1/site` is not exposed.

Do not use a catch-all `/api/` proxy for this service. The production Nginx
configuration proxies exactly `/api/v1/site`; other `/api/` paths return 404.
The Spring process binds only to `127.0.0.1`. Local runs default to port 5080;
the checked-in systemd unit sets `PORT=5086`, matching the Nginx proxy.
Its `/health` endpoint is for local process checks, not an advertised public
route.

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
gradle test bootJar dokkaGenerate --no-daemon
```

`dokkaGenerate` is the documentation gate: a public declaration without KDoc
fails it.

The backend checks in Gradle dependency locks and SHA-256 verification metadata
to keep transitive versions and downloaded artifacts stable. When intentionally
updating dependencies, run these commands from `backend/`, review both generated
files, then rerun the ordinary backend gates:

```text
gradle dependencies --write-locks --no-daemon
gradle --refresh-dependencies --write-verification-metadata sha256 help test jacocoTestReport bootJar dokkaGenerate --no-daemon
```

Keep `--refresh-dependencies`. Written from a warm local cache, the metadata
misses files that Gradle did not download again, and the build then fails
verification on a clean machine while it passes locally.

Do not accept a checksum-only change without confirming the artifact version
and source repository; the checksum is an integrity pin, not a trust review.

The frontend tests assert canonical metadata, sitemap membership, asset shape,
forum non-indexing, and the absence of retired site links. The Spring tests
assert site-only API behavior, health, read-only operation, and missing account
and registry routes. These gates are necessary but not a substitute for a
browser review of both themes, all four languages, and narrow screens.

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
post model, database, or discussion endpoint. It shows its notice in the
language of the browser and has a theme button; both work entirely in the
browser. The page and its server response both carry
noindex signals. The Nginx policy only allows same-origin CSS, JavaScript, and
images; it does not need `unsafe-inline`.

Files under `forum/` are deployed as a unit. Deploying `index.html` without
its version-matched `site.css`, `site.js`, and two SVG files can leave a
half-styled page or controls that no longer work. `index.html` refers to the
stylesheet and the script with a `?v=` value; change that value whenever either
file changes, because a CDN in front of the host can keep serving the old file,
or a cached "not found", for hours. The forum Nginx config
permits only those named static paths. After copying, restore SELinux labels,
validate the Nginx configuration, then reload Nginx. Do not turn SELinux off
to work around a labeling mistake.

Check the public URL for HTTP 200 and for these response properties:

- `X-Robots-Tag: noindex, nofollow`;
- Content Security Policy with same-origin script and style sources;
- `site.css`, `site.js`, and the leopard SVG returning HTTP 200;
- no login, registration, posting, or package UI;
- no language menu, and the notice in the language of the browser, English for
  a browser whose language has no translation; and
- a working light-mode control.

The forum can be deployed while the main language domain is in
maintenance. Opening the real forum later is a separate product decision.

## Releasing the main site

On the server the site lives in one directory:

```text
/srv/xsharp/website/
  current/
    frontend/     contents of frontend/dist
    forum/        the five forum files
    backend/      the Spring jar, next to the files of the legacy process
  previous-<timestamp>/   the release before, kept for rollback
```

`current` is a real directory, not a symbolic link. A release replaces it by
renaming:

1. Build the frontend and the jar from the commit being released, and run the
   local gates.
2. On the server, copy `current` to a new directory next to it with
   `cp -a`, which keeps owners, modes and SELinux labels, and replace the
   changed parts inside the copy.
3. Start the new jar on a free loopback port as the service user, request
   `/health` and `/api/v1/site`, and stop it.
4. Rename `current` to `previous-<timestamp>` and the new directory to
   `current`.
5. Run `restorecon -R` on `current/frontend` and `current/forum`.
6. Restart the API service, then check the public routes from outside.

Step 5 has to come after step 4. The SELinux rules that let Nginx read the
files are bound to the paths below `current`. Run on a staging path,
`restorecon` gives the files the default label of that path, and Nginx then
answers 403 or 500 for every file. Do not switch SELinux to permissive to get
around a label.

A CDN in front of the host caches static files, `robots.txt` included, for
hours. After a release, a changed file at an unchanged URL can look stale from
outside while the server already has the new one; compare with a request made
on the server itself before concluding that a release failed.

## Maintenance mode

`ops/nginx/xsharp-maintenance.conf` answers the main domain with 503 and keeps
the legacy redirect working. `ops/nginx/xsharp.conf` serves the site. Keep the
two mutually exclusive in the live Nginx include directory. Building the Vue
bundle or deploying the forum does not by itself authorize switching between
them.

Before switching the main site from maintenance to public:

1. Review the copy in every published language against the public language
   Spec and current compiler behavior.
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

The redirect is part of the site config as well. It is routing
compatibility, not a ViGet API or a user-facing section of the language site.

## Rollback

Keep the previous release directory until the checks after a release pass. A
rollback of a release renames `current` away and `previous-<timestamp>` back to
`current`, runs `restorecon -R` on `current/frontend` and `current/forum`, and
restarts the API service.

Keep the prior Nginx configuration as well. Taking the main site offline
returns its vhost to maintenance, checks `nginx -t`, reloads Nginx, and
confirms the expected 503. The forum and legacy redirect should remain
unaffected.

Do not roll back by deleting certificates, disabling SELinux, or pointing
unrelated hostnames at the language frontend. If the Spring process fails,
inspect its systemd journal and local `/health` response, then restore the
previous service unit or leave the site in maintenance until the owner
boundary is clear.

## Monitoring and privacy

The main language routes answer 200, and `/api/v1/site` returns only the
website's non-sensitive state. Expected forum responses are 200 for the five
static files and 404 for other paths. Expected legacy redirect responses are
308. In maintenance mode the main domain answers 503 with `Retry-After`. A 200
from a retired login or registry route is a regression.

Neither the static site nor the forum placeholder should send personal data
to a third-party analytics service. The content security policy allows
same-origin scripts only, so a script added by an intermediary is blocked by
the browser rather than run. Theme and language preferences are kept
locally in the browser. Nginx and Spring logs still need normal retention
and access-control practices, but this repository does not define an account
database or a user profile store.

## Post-release review

After a release, perform the same checks from a clean browser profile with no
saved language or theme choice. Confirm that the theme is dark and that the
language is the browser's when it is one of the four, and English otherwise.
Choose another language in the menu, navigate through both documentation
routes, and confirm the choice persists. Choose Hebrew and confirm that text
runs right to left while the layout and the code blocks stay as they are.
Switch to light mode and repeat. The forum keeps its own theme key and follows
the browser language; it should not change the main site's settings.

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
