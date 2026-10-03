// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { applyPageMetadata } from "../src/seo.ts";

const originalDocument = globalThis.document;

afterEach(() => {
  globalThis.document = originalDocument;
});

function fakeDocument() {
  const elements = new Map([
    ['meta[name="description"]', { content: "" }],
    ['meta[property="og:title"]', { content: "" }],
    ['meta[property="og:description"]', { content: "" }],
    ['meta[property="og:url"]', { content: "" }],
    ['link[rel="canonical"]', { href: "" }],
  ]);
  const document = {
    title: "",
    querySelector(selector) {
      return elements.get(selector) ?? null;
    },
  };
  globalThis.document = document;
  return { document, elements };
}

test("the English home page has a canonical URL and matching social metadata", () => {
  const { document, elements } = fakeDocument();
  applyPageMetadata("/", "en-US");
  assert.match(document.title, /^Visual X#/);
  assert.equal(elements.get('meta[property="og:title"]').content, document.title);
  assert.match(elements.get('meta[name="description"]').content, /native programming language/);
  assert.equal(elements.get('meta[property="og:url"]').content, "https://xsharp-lang.xyz/");
  assert.equal(elements.get('link[rel="canonical"]').href, "https://xsharp-lang.xyz/");
});

test("the overview route uses its own German title and description", () => {
  const { document, elements } = fakeDocument();
  applyPageMetadata("/docs/overview", "de-DE");
  assert.equal(document.title, "Überblick · Visual X#");
  assert.match(elements.get('meta[name="description"]').content, /Ownership-Regeln/);
  assert.equal(elements.get('link[rel="canonical"]').href, "https://xsharp-lang.xyz/docs/overview");
});

test("the getting-started route does not inherit the overview metadata", () => {
  const { document, elements } = fakeDocument();
  applyPageMetadata("/docs/overview", "en-US");
  applyPageMetadata("/docs/getting-started", "en-US");
  assert.equal(document.title, "Getting started · Visual X#");
  assert.match(elements.get('meta[name="description"]').content, /toolchain/);
  assert.equal(
    elements.get('meta[property="og:url"]').content,
    "https://xsharp-lang.xyz/docs/getting-started",
  );
});

test("unknown routes never become public canonical URLs", () => {
  const { elements } = fakeDocument();
  applyPageMetadata("/old/login", "en-US");
  assert.equal(elements.get('link[rel="canonical"]').href, "https://xsharp-lang.xyz/");
});

test("a missing optional metadata tag does not stop the page title", () => {
  globalThis.document = {
    title: "",
    querySelector() {
      return null;
    },
  };
  applyPageMetadata("/docs/getting-started", "de-DE");
  assert.equal(globalThis.document.title, "Erste Schritte · Visual X#");
});

test("the Russian routes have their own titles and keep the canonical URLs", () => {
  const { document, elements } = fakeDocument();
  applyPageMetadata("/", "ru-RU");
  assert.match(document.title, /^Visual X# — Сделать понятной всю программу$/);
  assert.match(elements.get('meta[name="description"]').content, /нативный язык программирования/);
  assert.equal(elements.get('link[rel="canonical"]').href, "https://xsharp-lang.xyz/");
  applyPageMetadata("/docs/overview", "ru-RU");
  assert.equal(document.title, "Обзор · Visual X#");
  applyPageMetadata("/docs/getting-started", "ru-RU");
  assert.equal(document.title, "Начало работы · Visual X#");
  assert.equal(
    elements.get('link[rel="canonical"]').href,
    "https://xsharp-lang.xyz/docs/getting-started",
  );
});

test("the Hebrew routes have their own titles and keep the canonical URLs", () => {
  const { document, elements } = fakeDocument();
  applyPageMetadata("/", "he-IL");
  assert.match(document.title, /^Visual X#‎ — להפוך את התוכנית כולה למובנת$/);
  assert.match(elements.get('meta[name="description"]').content, /שמהודרת לקוד מכונה/);
  assert.equal(elements.get('link[rel="canonical"]').href, "https://xsharp-lang.xyz/");
  applyPageMetadata("/docs/overview", "he-IL");
  assert.equal(document.title, "סקירה · Visual X#‎");
  applyPageMetadata("/docs/getting-started", "he-IL");
  assert.equal(document.title, "צעדים ראשונים · Visual X#‎");
  assert.equal(
    elements.get('link[rel="canonical"]').href,
    "https://xsharp-lang.xyz/docs/getting-started",
  );
});
