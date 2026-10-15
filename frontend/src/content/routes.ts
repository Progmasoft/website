// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import type { Locale } from "../locales";
import { siteTopics, type Site } from "../site.ts";
import { syntaxRoutes } from "./syntax.ts";
import { talacRoutes } from "./talac.ts";
import { tazelRoutes } from "./tazel.ts";
import type { DocRoute } from "./types";

/** The documentation pages each site renders from content; the language site also has hand-built pages. */
export const contentRoutes: Record<Site, readonly DocRoute[]> = {
  language: syntaxRoutes,
  talac: talacRoutes,
  tazel: tazelRoutes,
};

// The two hand-built pages of the language site name themselves in their own components; the sidebar of a content
// page needs their names too.
const languagePageNames: Record<Locale, Record<string, string>> = {
  "en-US": { "/docs/overview": "Overview", "/docs/getting-started": "Getting started" },
  "de-DE": { "/docs/overview": "Überblick", "/docs/getting-started": "Erste Schritte" },
  "ru-RU": { "/docs/overview": "Обзор", "/docs/getting-started": "Начало работы" },
  "he-IL": { "/docs/overview": "סקירה", "/docs/getting-started": "צעדים ראשונים" },
};

/** The sidebar of a documentation page: every topic of the site, in order. */
export function sidebarFor(site: Site, locale: Locale): { path: string; label: string }[] {
  return siteTopics[site].map((path) => {
    const content = contentRoutes[site].find((route) => route.path === path);
    const label = content ? content.topic[locale].nav : (languagePageNames[locale][path] ?? path);
    return { path, label };
  });
}
