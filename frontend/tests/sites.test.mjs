// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import assert from "node:assert/strict";
import { test } from "node:test";
import { contentRoutes, sidebarFor } from "../src/content/routes.ts";
import { supportedLocales } from "../src/locales.ts";
import { pageMetadata } from "../src/seo.ts";
import { siteHome, siteHosts, siteOf, siteTopics, siteUrl } from "../src/site.ts";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("a host name selects its site and anything else is the language site", () => {
  assert.equal(siteOf("tala.run", ""), "language");
  assert.equal(siteOf("talac.tala.run", ""), "talac");
  assert.equal(siteOf("tazel.tala.run", ""), "tazel");
  assert.equal(siteOf("talafmt.tala.run", ""), "talafmt");
  assert.equal(siteOf("talalint.tala.run", ""), "talalint");
  assert.equal(siteOf("localhost", "?site=talalint"), "talalint");
  assert.equal(siteOf("www.tala.run", ""), "language");
  // A query string selects a site only on a development host.
  assert.equal(siteOf("tala.run", "?site=talac"), "language");
  assert.equal(siteOf("talac.example.com", ""), "language");
});

test("a development host keeps the site it was asked for in the tab", () => {
  const storage = memoryStorage();
  assert.equal(siteOf("localhost", "?site=tazel", storage), "tazel");
  assert.equal(siteOf("localhost", "", storage), "tazel");
  assert.equal(siteOf("127.0.0.1", "?site=language", storage), "language");
  assert.equal(siteOf("localhost", "?site=nonsense", memoryStorage()), "language");
  const broken = {
    getItem() {
      throw new Error("storage is blocked");
    },
    setItem() {
      throw new Error("storage is blocked");
    },
  };
  assert.equal(siteOf("localhost", "?site=talac", broken), "talac");
  assert.equal(siteOf("localhost", "", broken), "language");
});

test("links to another site are absolute in production and stay on a development host", () => {
  assert.equal(
    siteUrl("talac", "/docs/outputs", "tala.run"),
    "https://talac.tala.run/docs/outputs",
  );
  assert.equal(siteUrl("language", "/", "tazel.tala.run"), "https://tala.run/");
  assert.equal(siteUrl("tazel", "/docs/commands", "localhost"), "/docs/commands?site=tazel");
});

test("every topic a sidebar lists is a page of its site", () => {
  for (const site of ["language", "talac", "tazel", "talafmt", "talalint"]) {
    const routes = contentRoutes[site].map((route) => route.path);
    for (const path of routes)
      assert.ok(siteTopics[site].includes(path), `${site} does not list ${path}`);
    for (const locale of supportedLocales) {
      const sidebar = sidebarFor(site, locale);
      assert.deepEqual(
        sidebar.map((entry) => entry.path),
        [...siteTopics[site]],
      );
      assert.ok(sidebar.every((entry) => entry.label.length > 0 && !entry.label.startsWith("/")));
    }
  }
  // Every site opens on its own landing page rather than on a documentation topic.
  assert.deepEqual(siteHome, {
    language: "/",
    talac: "/",
    tazel: "/",
    talafmt: "/",
    talalint: "/",
  });
});

test("every topic is written in every language with the same code in each", () => {
  for (const site of ["language", "talac", "tazel", "talafmt", "talalint"]) {
    for (const route of contentRoutes[site]) {
      const reference = route.topic["en-US"];
      const codes = (page) =>
        page.blocks.filter((block) => block.kind === "code").map((block) => block.code);
      const terms = (page) =>
        page.blocks
          .filter((block) => block.kind === "terms")
          .flatMap((block) => block.items.map((item) => item.term));
      for (const locale of supportedLocales) {
        const page = route.topic[locale];
        for (const field of ["nav", "title", "description", "section", "heading", "lead"]) {
          assert.ok(page[field].trim().length > 0, `${route.path} ${locale} has no ${field}`);
        }
        assert.equal(
          page.blocks.length,
          reference.blocks.length,
          `${route.path} ${locale} lost a block`,
        );
        assert.deepEqual(
          codes(page),
          codes(reference),
          `${route.path} ${locale} changed a code sample`,
        );
        assert.deepEqual(
          terms(page),
          terms(reference),
          `${route.path} ${locale} changed an option name`,
        );
        if (locale !== "en-US") {
          assert.notEqual(page.lead, reference.lead, `${route.path} ${locale} is not translated`);
        }
      }
    }
  }
});

test("the documentation teaches the current command lines only", () => {
  const all = Object.values(contentRoutes)
    .flat()
    .flatMap((route) => Object.values(route.topic))
    .map((page) => JSON.stringify(page))
    .join("\n");
  for (const retired of [
    /-File\b/,
    /-Emit\b/,
    /-Help\b/,
    /\.vxse\b/,
    /\btadc\b/,
    /talac (?:check|build|run)\b/,
  ]) {
    assert.doesNotMatch(all, retired);
  }
  assert.match(all, /--emit=metadata/);
  assert.match(all, /tazel lint -- --fix/);
});

test("each site names its pages and points canonical URLs at its own host", () => {
  const talac = pageMetadata("/docs/outputs", "de-DE", "talac");
  assert.equal(talac.title, "Ausgaben · Talac");
  assert.equal(talac.canonicalPath, "/docs/outputs");
  const tazel = pageMetadata("/", "en-US", "tazel");
  assert.equal(tazel.canonicalPath, "/");
  assert.equal(tazel.title, "Tazel — The build system of Tala");
  assert.equal(pageMetadata("/docs/syntax", "ru-RU", "language").title, "Синтаксис · Tala");
  assert.equal(pageMetadata("/docs/outputs", "en-US", "language").canonicalPath, "/");
  assert.equal(pageMetadata("/docs/layout", "en-US", "talafmt").title, "What it changes · Talafmt");
  assert.equal(pageMetadata("/docs/checks", "de-DE", "talalint").title, "Was es prüft · Talalint");
  assert.equal(pageMetadata("/docs/layout", "en-US", "talalint").canonicalPath, "/");
  assert.deepEqual(siteHosts, {
    language: "tala.run",
    talac: "talac.tala.run",
    tazel: "tazel.tala.run",
    talafmt: "talafmt.tala.run",
    talalint: "talalint.tala.run",
  });
});
