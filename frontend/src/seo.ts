// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import { landing } from "./content/landing.ts";
import { contentRoutes } from "./content/routes.ts";
import type { Locale } from "./locales";
import { site, siteHosts, type Site } from "./site.ts";

/** The documentation pages of the language site that are built by hand rather than from content. */
export type PublicRoute = "/docs/overview" | "/docs/getting-started";

type PageMetadata = {
  title: string;
  description: string;
};

const metadata: Record<Locale, Record<PublicRoute, PageMetadata>> = {
  "en-US": {
    "/docs/overview": {
      title: "Overview · Tala",
      description:
        "Understand Tala design goals, type and ownership choices, compiler stages, and the boundary between specification and implementation.",
    },
    "/docs/getting-started": {
      title: "Getting started · Tala",
      description:
        "Clone Tala, check the toolchain, build and test the compiler, and inspect the first program with the current CLI.",
    },
  },
  "de-DE": {
    "/docs/overview": {
      title: "Überblick · Tala",
      description:
        "Entwurfsziele, Typ- und Ownership-Regeln, Compilerstufen sowie die Grenze zwischen Spezifikation und Implementierung verstehen.",
    },
    "/docs/getting-started": {
      title: "Erste Schritte · Tala",
      description:
        "Tala klonen, Toolchain prüfen, Compiler bauen und testen und das erste Programm mit der aktuellen CLI untersuchen.",
    },
  },
  "ru-RU": {
    "/docs/overview": {
      title: "Обзор · Tala",
      description:
        "Цели проектирования Tala, правила типов и владения, стадии компилятора и граница между спецификацией и реализацией.",
    },
    "/docs/getting-started": {
      title: "Начало работы · Tala",
      description:
        "Клонируйте Tala, проверьте набор инструментов, соберите и протестируйте компилятор и изучите первую программу с текущим CLI.",
    },
  },
  "he-IL": {
    "/docs/overview": {
      title: "סקירה · Tala",
      description:
        "יעדי התכנון של Tala, בחירות הטיפוסים והבעלות, שלבי המהדר והגבול בין המפרט למימוש.",
    },
    "/docs/getting-started": {
      title: "צעדים ראשונים · Tala",
      description:
        "שכפלו את Tala, בדקו את שרשרת הכלים, בנו ובדקו את המהדר ובחנו את התוכנית הראשונה עם ה-CLI הנוכחי.",
    },
  },
};

function setMeta(selector: string, content: string): void {
  const element = document.querySelector<HTMLMetaElement>(selector);
  if (element) element.content = content;
}

/** The title, description and canonical path of a page of [current]. */
export function pageMetadata(
  path: string,
  locale: Locale,
  current: Site = site,
): PageMetadata & { canonicalPath: string } {
  if (path === "/") {
    const page = landing[current][locale];
    return { title: page.title, description: page.description, canonicalPath: "/" };
  }
  const content = contentRoutes[current].find((route) => route.path === path);
  if (content) {
    const page = content.topic[locale];
    return { title: page.title, description: page.description, canonicalPath: path };
  }
  // Unknown routes are redirected by the router. Their brief transitional state must not generate a canonical
  // URL to an unlisted public page, so they are described as the landing page.
  if (current === "language" && (path === "/docs/overview" || path === "/docs/getting-started")) {
    return { ...metadata[locale][path], canonicalPath: path };
  }
  return pageMetadata("/", locale, current);
}

export function applyPageMetadata(path: string, locale: Locale): void {
  const page = pageMetadata(path, locale);
  const url = `https://${siteHosts[site]}${page.canonicalPath}`;

  document.title = page.title;
  setMeta('meta[name="description"]', page.description);
  setMeta('meta[property="og:title"]', page.title);
  setMeta('meta[property="og:description"]', page.description);
  setMeta('meta[property="og:url"]', url);

  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = url;
}
