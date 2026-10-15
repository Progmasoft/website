// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { test } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const websiteRoot = join(root, "..");

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function locations(path) {
  return [...read(path).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

test("every site publishes exactly its own pages in its sitemap", () => {
  assert.deepEqual(locations("public/sitemap.xml"), [
    "https://tala.run/",
    "https://tala.run/docs/overview",
    "https://tala.run/docs/getting-started",
    "https://tala.run/docs/syntax",
  ]);
  assert.deepEqual(locations("public/hosts/talac/sitemap.xml"), [
    "https://talac.tala.run/docs/command-line",
    "https://talac.tala.run/docs/outputs",
  ]);
  assert.deepEqual(locations("public/hosts/tazel/sitemap.xml"), [
    "https://tazel.tala.run/docs/commands",
    "https://tazel.tala.run/docs/project-file",
  ]);
  assert.doesNotMatch(read("public/sitemap.xml"), /forum\.tala\.run/);
  for (const [path, host] of [
    ["public/robots.txt", "tala.run"],
    ["public/hosts/talac/robots.txt", "talac.tala.run"],
    ["public/hosts/tazel/robots.txt", "tazel.tala.run"],
  ]) {
    assert.match(
      read(path),
      new RegExp(`Sitemap: https://${host.replaceAll(".", "\\.")}/sitemap\\.xml`),
    );
  }
});

test("the forum placeholder is explicitly non-indexable and not an account service", () => {
  const forum = readFileSync(join(websiteRoot, "forum/index.html"), "utf8");
  const nginx = readFileSync(join(websiteRoot, "ops/nginx/forum.conf"), "utf8");
  assert.match(forum, /name="robots" content="noindex, nofollow"/);
  assert.match(forum, /There are no accounts,/);
  assert.match(forum, /posts, or discussion service/);
  assert.match(nginx, /X-Robots-Tag "noindex, nofollow"/);
  assert.match(nginx, /script-src 'self'; style-src 'self'/);
  assert.doesNotMatch(nginx, /unsafe-inline/);
  assert.match(forum, /src="\/site\.js[?"]/);
  assert.match(forum, /href="\/site\.css[?"]/);
  const normalizedForum = forum.toLowerCase();
  assert.equal(normalizedForum.split("<script").length - 1, 1);
  assert.equal(normalizedForum.split("</script>").length - 1, 1);
  // The query string is a cache key for the edge cache. Nginx serves the
  // exact file path, so changing the value forces a fresh copy after a deploy.
  assert.match(normalizedForum, /<script src="\/site\.js\?v=[0-9-]+" defer><\/script>/);
  assert.match(normalizedForum, /<link rel="stylesheet" href="\/site\.css\?v=[0-9-]+" \/>/);
  assert.doesNotMatch(forum, /<form\b/);
});

test("the browser identity uses the supplied logo without an opaque background", () => {
  const svg = read("public/tala.svg");
  const mark = read("public/tala-mark.svg");
  assert.match(svg, /<svg\b/);
  assert.doesNotMatch(svg, /<rect\s+id="background"/);
  assert.match(mark, /<title[^>]*>Tala leopard<\/title>/);
  assert.match(mark, /viewBox="370 285 365 345"/);
  assert.match(read("index.html"), /rel="icon"[^>]*tala-mark\.svg/);
  assert.match(read("src/App.vue"), /src="\/tala-mark\.svg"/);
  const fullLeopard = svg.match(/<path id="leopard" d="([^"]+)"/);
  const croppedLeopard = mark.match(/<path d="([^"]+)"/);
  assert.ok(fullLeopard && croppedLeopard, "both brand variants must contain the leopard path");
  assert.equal(croppedLeopard[1], fullLeopard[1], "favicon must not redraw or distort the mascot");
});

test("the social image is a 1280 by 640 PNG suitable for the page metadata", () => {
  const image = readFileSync(join(root, "public/tala-social.png"));
  assert.equal(image.toString("hex", 0, 8), "89504e470d0a1a0a");
  assert.equal(image.readUInt32BE(16), 1280);
  assert.equal(image.readUInt32BE(20), 640);
  assert.match(read("index.html"), /tala-social\.png/);
});

test("the site has no retired public login or registry links", () => {
  const sources = [
    "src/App.vue",
    "src/pages/HomePage.vue",
    "src/pages/OverviewPage.vue",
    "src/pages/GettingStartedPage.vue",
  ];
  for (const source of sources) {
    const content = read(source);
    assert.doesNotMatch(content, /(?:xsharp-lang\.xyz|tala\.run)\/(?:login|register|repo)/);
    assert.doesNotMatch(content, /xsharp-lang\.xyz/);
    assert.doesNotMatch(content, /AlfaPC11/);
    assert.doesNotMatch(content, /docs\/ARCHITECTURE\.md/);
  }
});

test("every linked repository path used by the guides exists when compiler source is available", (context) => {
  const compilerRoot = join(websiteRoot, "..");
  if (!existsSync(join(compilerRoot, "Spec"))) {
    context.skip("standalone website checkout has no sibling compiler repository");
    return;
  }
  for (const relativePath of [
    "Spec",
    "Documents/BUILDING.md",
    "Documents/CLI.md",
    "Examples/HelloWorld/HelloWorld.tala",
  ]) {
    assert.ok(existsSync(join(compilerRoot, relativePath)), `${relativePath} is missing`);
  }
});

test("the site example is copied from the compiler repository when available", (context) => {
  const compilerRoot = join(websiteRoot, "..");
  const examplePath = join(compilerRoot, "Examples/HelloWorld/HelloWorld.tala");
  if (!existsSync(examplePath)) {
    context.skip("standalone website checkout has no sibling compiler repository");
    return;
  }
  const source = readFileSync(examplePath, "utf8");
  const program = source
    .slice(source.indexOf("namespace Examples.HelloWorld;"))
    .replaceAll("\r\n", "\n")
    .trim();
  const pages = ["src/pages/HomePage.vue", "src/pages/GettingStartedPage.vue"];
  for (const page of pages) {
    const content = read(page);
    assert.ok(
      content.replaceAll("\r\n", "\n").includes(program),
      `${page} diverged from the compiler example`,
    );
  }
});

test("maintenance mode preserves the legacy redirect without opening the language site", () => {
  const maintenance = readFileSync(join(websiteRoot, "ops/nginx/tala-maintenance.conf"), "utf8");
  const live = readFileSync(join(websiteRoot, "ops/nginx/tala.conf"), "utf8");
  assert.match(
    maintenance,
    /server_name tala\.run www\.tala\.run talac\.tala\.run tazel\.tala\.run;/,
  );
  assert.match(maintenance, /location \/ \{ return 503; \}/);
  assert.match(maintenance, /server_name viget\.xsharp-lang\.xyz/);
  assert.match(maintenance, /return 308 https:\/\/viget\.progmasoft\.com\$request_uri/);
  assert.match(live, /server_name viget\.xsharp-lang\.xyz/);
  assert.match(live, /location = \/api\/v1\/site/);
  assert.match(live, /location \^~ \/api\/ \{\s*return 404;/);
});

test("the former domain lands on the same path of tala.run and tala.run has no ViGet host", () => {
  const live = readFileSync(join(websiteRoot, "ops/nginx/tala.conf"), "utf8");
  const forum = readFileSync(join(websiteRoot, "ops/nginx/forum.conf"), "utf8");
  assert.match(
    live,
    /server_name xsharp-lang\.xyz www\.xsharp-lang\.xyz docs\.xsharp-lang\.xyz spec\.xsharp-lang\.xyz;[^}]*return 308 https:\/\/tala\.run\$request_uri;/s,
  );
  assert.match(
    live,
    /server_name www\.tala\.run;[^}]*return 308 https:\/\/tala\.run\$request_uri;/s,
  );
  assert.match(
    forum,
    /server_name forum\.xsharp-lang\.xyz;[^}]*return 308 https:\/\/forum\.tala\.run\$request_uri;/s,
  );
  assert.doesNotMatch(live + forum, /viget\.tala\.run/);
  for (const host of ["talac", "tazel"]) {
    assert.match(live, new RegExp(`try_files /hosts/${host}/robots\\.txt =404;`));
    assert.match(live, new RegExp(`try_files /hosts/${host}/sitemap\\.xml =404;`));
  }
});

test("workflow actions are immutable and OIDC is isolated from build jobs", () => {
  const ci = readFileSync(join(websiteRoot, ".github/workflows/ci.yml"), "utf8");
  const codeql = readFileSync(join(websiteRoot, ".github/workflows/codeql.yml"), "utf8");

  for (const workflow of [ci, codeql]) {
    const actions = workflow
      .split("\n")
      .map((line) => {
        const marker = line.indexOf("uses:");
        return marker < 0
          ? ""
          : line
              .slice(marker + "uses:".length)
              .split("#", 1)[0]
              .trim();
      })
      .filter((action) => action.length > 0);

    assert.ok(actions.length > 0, "workflow must declare its action dependencies");
    for (const action of actions) {
      const separator = action.lastIndexOf("@");
      assert.ok(separator > 0, `${action} must have an immutable commit reference`);
      const commit = action.slice(separator + 1);
      assert.equal(commit.length, 40, `${action} must use a full commit SHA`);
      assert.ok(
        [...commit].every((character) => "0123456789abcdef".includes(character)),
        `${action} has a malformed commit SHA`,
      );
    }
  }

  const job = (name, nextName) => {
    const start = ci.indexOf(`  ${name}:`);
    const end = ci.indexOf(`  ${nextName}:`, start + 1);
    assert.ok(start >= 0 && end > start, `expected CI job boundary ${name} → ${nextName}`);
    return ci.slice(start, end);
  };

  assert.ok(!job("frontend", "backend").includes("id-token: write"));
  assert.ok(!job("backend", "frontend-coverage").includes("id-token: write"));
  assert.ok(job("frontend-coverage", "backend-coverage").includes("id-token: write"));
  assert.ok(job("backend-coverage", "dependency-review").includes("id-token: write"));
});

test("the production API binds to loopback and matches its Nginx proxy port", () => {
  const application = readFileSync(
    join(websiteRoot, "backend/Progmasoft.Tala.Website.Api/Program.cs"),
    "utf8",
  );
  const service = readFileSync(join(websiteRoot, "ops/systemd/tala-site-api.service"), "utf8");
  const nginx = readFileSync(join(websiteRoot, "ops/nginx/tala.conf"), "utf8");

  assert.ok(application.includes('UseUrls($"http://127.0.0.1:{port}")'));
  assert.ok(application.includes("public const int DefaultPort = 5086;"));
  assert.ok(service.includes("Environment=PORT=5086"));
  assert.ok(service.includes("ExecStart=/usr/bin/dotnet "));
  assert.doesNotMatch(service, /java/i);
  assert.ok(nginx.includes("proxy_pass http://127.0.0.1:5086/api/v1/site;"));
});

test("the forum assets are allowed by its restrictive Nginx policy", () => {
  const config = readFileSync(join(websiteRoot, "ops/nginx/forum.conf"), "utf8");
  const forum = readFileSync(join(websiteRoot, "forum/index.html"), "utf8");
  for (const filename of ["site.css", "site.js", "tala-mark.svg"]) {
    assert.ok(existsSync(join(websiteRoot, "forum", filename)), `${filename} missing`);
    assert.ok(config.includes(`location = /${filename}`), `${filename} blocked by Nginx`);
    assert.ok(forum.includes(`/${filename}`), `${filename} not referenced by forum`);
  }
});

test("navigation, router, and sitemap agree on the public language pages", () => {
  const router = read("src/main.ts");
  const navigation = read("src/App.vue");
  const sitemap = read("public/sitemap.xml");
  for (const route of ["/docs/overview", "/docs/getting-started"]) {
    assert.ok(router.includes(`path: "${route}"`), `${route} is absent from the router`);
    assert.ok(navigation.includes(`to="${route}"`), `${route} is absent from navigation`);
    assert.ok(sitemap.includes(`tala.run${route}`), `${route} is absent from sitemap`);
  }
  assert.ok(navigation.includes(`to="/docs/syntax"`));
  assert.match(router, /path: "\/"/);
  assert.match(navigation, /<RouterLink[^>]*to="\/"/);
});

test("every public link in the page shell uses the correct project identity", () => {
  const shell = read("src/App.vue");
  const home = read("src/pages/HomePage.vue");
  const overview = read("src/pages/OverviewPage.vue");
  const guide = read("src/pages/GettingStartedPage.vue");
  const combined = [shell, home, overview, guide].join("\n");
  const parsedUrls = (combined.match(/https:\/\/[^"'\s<>]+/g) ?? []).map((value) => new URL(value));
  assert.ok(read("src/site.ts").includes('forumUrl = "https://forum.tala.run/"'));
  assert.ok(parsedUrls.every((url) => !url.hostname.endsWith("xsharp-lang.xyz")));
  const githubUrls = parsedUrls.filter((url) => url.hostname === "github.com");
  const repositories = githubUrls.map((url) =>
    url.pathname
      .split("/")
      .filter(Boolean)
      .slice(0, 2)
      .map((segment) => segment.toLowerCase())
      .join("/"),
  );
  assert.ok(repositories.includes("progmasoft/tala"));
  assert.ok(
    githubUrls.every(
      (url) => !["alfapc11", "leitwolf11"].includes(url.pathname.split("/")[1]?.toLowerCase()),
    ),
  );
  assert.doesNotMatch(combined, /support@xsharp-lang\.xyz/);
  assert.doesNotMatch(combined, /repo\.xsharp-lanng\.xyz/);
});

test("language and theme controls remain labeled and keyboard focus is visible", () => {
  const shell = read("src/App.vue");
  const styles = read("src/styles/site.css");
  assert.match(shell, /<select v-model="locale" :aria-label="copy\.language"/);
  assert.match(shell, /<option v-for="supported in supportedLocales"/);
  assert.match(shell, /class="icon-button"[^>]*:aria-label="copy\.theme"/);
  assert.match(styles, /:focus-visible\s*\{/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /\.language-control select,\s*\.icon-button\s*\{[^}]*border-radius: 9px/s);
});

test("the former domain is left to the server: the page carries no notice about it", () => {
  const app = read("src/App.vue");
  assert.doesNotMatch(app, /domainNotice|domain-notice|onDepartingDomain/);
  assert.doesNotMatch(read("src/styles/site.css"), /\.domain-notice/);
});

test("every tala.run host behaves as if HSTS were preloaded for its top-level domain", () => {
  for (const file of ["tala.conf", "forum.conf", "tala-maintenance.conf"]) {
    const config = readFileSync(join(websiteRoot, "ops/nginx", file), "utf8");
    const blocks = config.split(/\nserver \{/).slice(1);
    for (const block of blocks) {
      const names = block.match(/server_name ([^;]+);/)?.[1] ?? "";
      if (!/\btala\.run\b/.test(names)) continue;
      if (/listen 443/.test(block)) {
        assert.match(
          block,
          /add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;/,
          `${file}: ${names} must send the preload header`,
        );
      } else {
        // Plain HTTP answers only the ACME challenge and otherwise sends the visitor to HTTPS.
        assert.match(block, /return 308 https:\/\//, `${file}: ${names} must redirect to HTTPS`);
      }
    }
  }
});
