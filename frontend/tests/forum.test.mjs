// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const forumDirectory = join(dirname(fileURLToPath(import.meta.url)), "../../forum");
const forumScript = readFileSync(join(forumDirectory, "site.js"), "utf8");
const forumPage = readFileSync(join(forumDirectory, "index.html"), "utf8");

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

function loadForum(navigator = { languages: ["en-US"] }, initialStorage = {}) {
  const elements = new Map(
    ["eyebrow", "title", "message", "home", "source", "theme"].map((id) => [id, createElement()]),
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
  runInNewContext(forumScript, { document, localStorage, navigator });
  return { document, elements, values };
}

test("forum shows English and dark mode to an English browser without offering sign-up", () => {
  const { document, elements } = loadForum();
  assert.equal(document.documentElement.lang, "en");
  assert.equal(document.documentElement.dataset.textDirection, "ltr");
  assert.equal(document.documentElement.dataset.theme, "dark");
  assert.match(elements.get("title").textContent, /isn't open yet/);
  assert.match(elements.get("message").textContent, /no accounts, posts/);
  assert.doesNotMatch(elements.get("message").textContent, /sign up/i);
  assert.match(document.title, /Visual X#/);
});

test("forum shows its one notice in the language of the browser", () => {
  const german = loadForum({ languages: ["de-AT", "en"] });
  assert.equal(german.document.documentElement.lang, "de");
  assert.match(german.elements.get("title").textContent, /nicht geöffnet/);
  assert.equal(german.elements.get("theme").attributes.get("aria-label"), "Farbschema wechseln");

  const russian = loadForum({ languages: ["ru-RU"] });
  assert.equal(russian.document.documentElement.lang, "ru");
  assert.match(russian.elements.get("title").textContent, /Форум пока не открыт/);
  assert.match(russian.elements.get("message").textContent, /нет ни аккаунтов, ни сообщений/);

  for (const languages of [["he-IL"], ["iw"], ["HE", "en"]]) {
    const hebrew = loadForum({ languages });
    assert.equal(hebrew.document.documentElement.lang, "he");
    assert.equal(hebrew.document.documentElement.dataset.textDirection, "rtl");
    assert.match(hebrew.elements.get("title").textContent, /הפורום עדיין לא נפתח/);
    assert.match(hebrew.elements.get("home").textContent, /←$/);
  }
});

test("forum falls back to English when the browser language has no translation", () => {
  for (const navigator of [
    { languages: ["tr-TR"] },
    { languages: ["tr-TR", "fr"] },
    { languages: [] },
    { languages: ["constructor"] },
    { language: "ja" },
    {},
  ]) {
    const { document, elements } = loadForum(navigator);
    assert.equal(document.documentElement.lang, "en", JSON.stringify(navigator));
    assert.match(elements.get("title").textContent, /isn't open yet/);
  }
  // A later preference with a translation is used before English.
  assert.equal(loadForum({ languages: ["tr-TR", "de"] }).document.documentElement.lang, "de");
  // A browser that reports only one language is honored.
  assert.equal(loadForum({ language: "ru" }).document.documentElement.lang, "ru");
});

test("forum has no language menu and ignores a language stored by an older page", () => {
  assert.doesNotMatch(forumPage, /<select/);
  assert.doesNotMatch(forumPage, /id="language"/);
  const { document, values } = loadForum({ languages: ["de"] }, { "vxs-forum-language": "ru" });
  assert.equal(document.documentElement.lang, "de");
  assert.equal(values.get("vxs-forum-language"), "ru");
});

test("forum restores the saved light preference", () => {
  const { document } = loadForum({ languages: ["en"] }, { "vxs-forum-theme": "light" });
  assert.equal(document.documentElement.dataset.theme, "light");
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
