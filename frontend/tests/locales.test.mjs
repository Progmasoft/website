// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  browserLocale,
  fallbackLocale,
  forwardArrow,
  initialLocale,
  isLocale,
  localeLabels,
  supportedLocales,
  textDirection,
} from "../src/locales.ts";

test("four languages are published and English is the fallback", () => {
  assert.deepEqual(supportedLocales, ["en-US", "de-DE", "ru-RU", "he-IL"]);
  assert.equal(fallbackLocale, "en-US");
  for (const locale of supportedLocales) {
    assert.equal(isLocale(locale), true, locale);
    assert.match(localeLabels[locale], /^[A-Z]{2}$/);
  }
  for (const value of ["en", "he", "tr-TR", "", null, undefined, 7]) {
    assert.equal(isLocale(value), false, String(value));
  }
});

test("the browser language selects the page language", () => {
  const cases = [
    [["de-AT", "en"], "de-DE"],
    [["ru"], "ru-RU"],
    [["he-IL", "en-US"], "he-IL"],
    [["iw"], "he-IL"],
    [["HE"], "he-IL"],
    [["en-GB"], "en-US"],
    // An unpublished first choice falls through to the next preference.
    [["tr-TR", "de"], "de-DE"],
  ];
  for (const [languages, expected] of cases) {
    assert.equal(browserLocale(languages), expected, languages.join(","));
  }
});

test("a browser language that is not published falls back to English", () => {
  for (const languages of [[], ["tr-TR"], ["tr-TR", "fr", "ja"], [""], ["constructor"]]) {
    assert.equal(browserLocale(languages), "en-US", languages.join(","));
  }
});

test("a language the visitor chose wins over the browser language", () => {
  assert.equal(initialLocale("de-DE", ["he-IL"]), "de-DE");
  assert.equal(initialLocale("en-US", ["ru"]), "en-US");
  assert.equal(initialLocale(null, ["he-IL"]), "he-IL");
  // A stored value that is not a published locale is not a choice.
  assert.equal(initialLocale("tr-TR", ["ru"]), "ru-RU");
  assert.equal(initialLocale("", []), "en-US");
});

test("only Hebrew text runs right to left", () => {
  for (const locale of supportedLocales) {
    const expected = locale === "he-IL" ? "rtl" : "ltr";
    assert.equal(textDirection(locale), expected, locale);
    assert.equal(forwardArrow(locale), expected === "rtl" ? "←" : "→", locale);
  }
});
