// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const forumScript = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../../forum/site.js"),
  "utf8",
);

function createElement() {
  const listeners = new Map();
  const attributes = new Map();
  return {
    textContent: "",
    listeners,
    attributes,
    addEventListener(name, callback) {
      listeners.set(name, callback);
    },
    setAttribute(name, value) {
      attributes.set(name, value);
    },
    click() {
      listeners.get("click")();
    },
  };
}

function loadForum(initialStorage = {}) {
  const elements = new Map(
    ["eyebrow", "title", "message", "home", "source", "language", "theme"].map((id) => [
      id,
      createElement(),
    ]),
  );
  const values = new Map(Object.entries(initialStorage));
  const localStorage = {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
  const document = {
    title: "",
    documentElement: { lang: "en", dataset: {} },
    getElementById(id) {
      const element = elements.get(id);
      if (!element) throw new Error(`unexpected element: ${id}`);
      return element;
    },
  };
  runInNewContext(forumScript, { document, localStorage });
  return { document, elements, values };
}

test("forum starts in English and dark mode without offering sign-up", () => {
  const { document, elements } = loadForum();
  assert.equal(document.documentElement.lang, "en");
  assert.equal(document.documentElement.dataset.theme, "dark");
  assert.equal(elements.get("language").textContent, "DE");
  assert.match(elements.get("title").textContent, /isn't open yet/);
  assert.match(elements.get("message").textContent, /no accounts, posts/);
  assert.doesNotMatch(elements.get("message").textContent, /sign up/i);
});

test("forum switches language and keeps the choice", () => {
  const { document, elements, values } = loadForum();
  elements.get("language").click();
  assert.equal(document.documentElement.lang, "de");
  assert.equal(values.get("vxs-forum-language"), "de");
  assert.equal(elements.get("language").textContent, "EN");
  assert.match(elements.get("title").textContent, /nicht geöffnet/);
  assert.match(document.title, /Visual X#/);
  assert.equal(elements.get("language").attributes.get("aria-label"), "Zu Englisch wechseln");
  elements.get("language").click();
  assert.equal(document.documentElement.lang, "en");
  assert.equal(values.get("vxs-forum-language"), "en");
});

test("forum restores the saved German and light preferences", () => {
  const { document, elements } = loadForum({
    "vxs-forum-language": "de",
    "vxs-forum-theme": "light",
  });
  assert.equal(document.documentElement.lang, "de");
  assert.equal(document.documentElement.dataset.theme, "light");
  assert.equal(elements.get("language").textContent, "EN");
});

test("forum theme button toggles and persists in both directions", () => {
  const { document, elements, values } = loadForum();
  elements.get("theme").click();
  assert.equal(document.documentElement.dataset.theme, "light");
  assert.equal(values.get("vxs-forum-theme"), "light");
  elements.get("theme").click();
  assert.equal(document.documentElement.dataset.theme, "dark");
  assert.equal(values.get("vxs-forum-theme"), "dark");
});
