// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

export const supportedLocales = ["en-US", "de-DE", "ru-RU", "he-IL"] as const;
export type Locale = (typeof supportedLocales)[number];

/** The language of a visitor whose browser asks for none that is published. */
export const fallbackLocale: Locale = "en-US";

/** The short label of each language in the language menu. */
export const localeLabels: Record<Locale, string> = {
  "en-US": "EN",
  "de-DE": "DE",
  "ru-RU": "RU",
  "he-IL": "HE",
};

// Primary language subtags and the published locale each one selects. `iw` is
// the former code for Hebrew, which some browsers still report.
const localeByLanguage = new Map<string, Locale>([
  ["en", "en-US"],
  ["de", "de-DE"],
  ["ru", "ru-RU"],
  ["he", "he-IL"],
  ["iw", "he-IL"],
]);

export function isLocale(value: unknown): value is Locale {
  return supportedLocales.some((supported) => supported === value);
}

/**
 * The first published locale among the languages a browser prefers.
 *
 * The argument is the list a browser reports, most preferred first. Only the
 * primary language of each entry is compared, so `de-AT` selects German.
 */
export function browserLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const primary = String(language).split("-", 1)[0] ?? "";
    const locale = localeByLanguage.get(primary.toLowerCase());
    if (locale) return locale;
  }
  return fallbackLocale;
}

/**
 * The language a page starts in: the language the visitor chose, and without
 * a choice the language of the browser.
 */
export function initialLocale(chosen: string | null, languages: readonly string[]): Locale {
  return isLocale(chosen) ? chosen : browserLocale(languages);
}

/**
 * The direction in which the text of a language runs.
 *
 * Only text follows it. The page layout, the navigation and code samples keep
 * their left-to-right arrangement in every language.
 */
export function textDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "he-IL" ? "rtl" : "ltr";
}

/** The arrow that points onward in the reading direction of a language. */
export function forwardArrow(locale: Locale): string {
  return textDirection(locale) === "rtl" ? "←" : "→";
}
