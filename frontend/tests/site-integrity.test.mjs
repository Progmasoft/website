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

test("the published sitemap lists exactly the three supported language routes", () => {
  const sitemap = read("public/sitemap.xml");
  const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(routes, [
    "https://xsharp-lang.xyz/",
    "https://xsharp-lang.xyz/docs/overview",
    "https://xsharp-lang.xyz/docs/getting-started",
  ]);
  assert.doesNotMatch(sitemap, /forum\.xsharp-lang\.xyz/);
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
  assert.match(forum, /src="\/site\.js"/);
  assert.match(forum, /href="\/site\.css"/);
  assert.doesNotMatch(forum, /<script>(?:.|\n)*<\/script>/);
  assert.doesNotMatch(forum, /<form\b/);
});

test("the browser identity uses the supplied logo without an opaque background", () => {
  const svg = read("public/visual-xsharp.svg");
  const mark = read("public/visual-xsharp-mark.svg");
  assert.match(svg, /<svg\b/);
  assert.doesNotMatch(svg, /<rect\s+id="background"/);
  assert.match(mark, /<title[^>]*>Visual X# leopard<\/title>/);
  assert.match(mark, /viewBox="370 285 365 345"/);
  assert.match(read("index.html"), /rel="icon"[^>]*visual-xsharp-mark\.svg/);
  assert.match(read("src/App.vue"), /src="\/visual-xsharp-mark\.svg"/);
  const fullLeopard = svg.match(/<path id="leopard" d="([^"]+)"/);
  const croppedLeopard = mark.match(/<path d="([^"]+)"/);
  assert.ok(fullLeopard && croppedLeopard, "both brand variants must contain the leopard path");
  assert.equal(croppedLeopard[1], fullLeopard[1], "favicon must not redraw or distort the mascot");
});

test("the social image is a 1280 by 640 PNG suitable for the page metadata", () => {
  const image = readFileSync(join(root, "public/visual-xsharp-social.png"));
  assert.equal(image.toString("hex", 0, 8), "89504e470d0a1a0a");
  assert.equal(image.readUInt32BE(16), 1280);
  assert.equal(image.readUInt32BE(20), 640);
  assert.match(read("index.html"), /visual-xsharp-social\.png/);
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
    assert.doesNotMatch(content, /xsharp-lang\.xyz\/(?:login|register|repo)/);
    assert.doesNotMatch(content, /AlfaPC11/);
    assert.doesNotMatch(content, /docs\/ARCHITECTURE\.md/);
  }
});

test("every linked repository path used by the guides exists locally", () => {
  const compilerRoot = join(websiteRoot, "..");
  for (const relativePath of [
    "Spec",
    "Documents/BUILDING.md",
    "Documents/CLI.md",
    "Examples/HelloWorld/HelloWorld.vxs",
  ]) {
    assert.ok(existsSync(join(compilerRoot, relativePath)), `${relativePath} is missing`);
  }
});

test("the site example is copied from the compiler repository", () => {
  const compilerRoot = join(websiteRoot, "..");
  const source = readFileSync(join(compilerRoot, "Examples/HelloWorld/HelloWorld.vxs"), "utf8");
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
  const maintenance = readFileSync(join(websiteRoot, "ops/nginx/xsharp-maintenance.conf"), "utf8");
  const future = readFileSync(join(websiteRoot, "ops/nginx/xsharp.conf"), "utf8");
  assert.match(maintenance, /server_name xsharp-lang\.xyz/);
  assert.match(maintenance, /location \/ \{ return 503; \}/);
  assert.match(maintenance, /server_name viget\.xsharp-lang\.xyz/);
  assert.match(maintenance, /return 308 https:\/\/viget\.progmasoft\.com\$request_uri/);
  assert.match(future, /server_name viget\.xsharp-lang\.xyz/);
  assert.match(future, /location = \/api\/v1\/site/);
  assert.match(future, /location \^~ \/api\/ \{\s*return 404;/);
});

test("the forum assets are allowed by its restrictive Nginx policy", () => {
  const config = readFileSync(join(websiteRoot, "ops/nginx/forum.conf"), "utf8");
  const forum = readFileSync(join(websiteRoot, "forum/index.html"), "utf8");
  for (const filename of ["site.css", "site.js", "visual-xsharp-mark.svg"]) {
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
    assert.ok(sitemap.includes(`xsharp-lang.xyz${route}`), `${route} is absent from sitemap`);
  }
  assert.match(router, /path: "\/"/);
  assert.match(navigation, /<RouterLink[^>]*to="\/"/);
});

test("every public link in the page shell uses the correct project identity", () => {
  const shell = read("src/App.vue");
  const home = read("src/pages/HomePage.vue");
  const overview = read("src/pages/OverviewPage.vue");
  const guide = read("src/pages/GettingStartedPage.vue");
  const combined = [shell, home, overview, guide].join("\n");
  assert.match(shell, /https:\/\/forum\.xsharp-lang\.xyz\//);
  assert.match(combined, /https:\/\/github\.com\/Progmasoft\/visual-xsharp/);
  assert.doesNotMatch(combined, /github\.com\/(?:AlfaPC11|Leitwolf11)/i);
  assert.doesNotMatch(combined, /support@xsharp-lang\.xyz/);
  assert.doesNotMatch(combined, /repo\.xsharp-lanng\.xyz/);
});

test("language and theme controls remain labeled and keyboard focus is visible", () => {
  const shell = read("src/App.vue");
  const styles = read("src/styles/site.css");
  assert.match(shell, /<select v-model="locale" :aria-label="copy\.language"/);
  assert.match(shell, /class="icon-button"[^>]*:aria-label="copy\.theme"/);
  assert.match(styles, /:focus-visible\s*\{/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /\.language-control select,\s*\.icon-button\s*\{[^}]*border-radius: 9px/s);
});
