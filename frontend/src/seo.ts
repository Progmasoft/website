// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import type { Locale } from "./locales";

export type PublicRoute = "/" | "/docs/overview" | "/docs/getting-started";

type PageMetadata = {
  title: string;
  description: string;
};

const metadata: Record<Locale, Record<PublicRoute, PageMetadata>> = {
  "en-US": {
    "/": {
      title: "Visual X# — Make the whole program understandable",
      description:
        "Meet Visual X#: a native programming language built around readable source, explicit ownership, and an inspectable compiler pipeline.",
    },
    "/docs/overview": {
      title: "Overview · Visual X#",
      description:
        "Understand Visual X# design goals, type and ownership choices, compiler stages, and the boundary between specification and implementation.",
    },
    "/docs/getting-started": {
      title: "Getting started · Visual X#",
      description:
        "Clone Visual X#, check the toolchain, build and test the compiler, and inspect the first program with the current CLI.",
    },
  },
  "de-DE": {
    "/": {
      title: "Visual X# — Das ganze Programm verstehen",
      description:
        "Visual X# ist eine native Programmiersprache mit lesbarem Quellcode, explizitem Ownership und nachvollziehbarer Compiler-Pipeline.",
    },
    "/docs/overview": {
      title: "Überblick · Visual X#",
      description:
        "Entwurfsziele, Typ- und Ownership-Regeln, Compilerstufen sowie die Grenze zwischen Spezifikation und Implementierung verstehen.",
    },
    "/docs/getting-started": {
      title: "Erste Schritte · Visual X#",
      description:
        "Visual X# klonen, Toolchain prüfen, Compiler bauen und testen und das erste Programm mit der aktuellen CLI untersuchen.",
    },
  },
  "ru-RU": {
    "/": {
      title: "Visual X# — Сделать понятной всю программу",
      description:
        "Visual X# — нативный язык программирования с читаемым исходным кодом, явным владением и прозрачным конвейером компилятора.",
    },
    "/docs/overview": {
      title: "Обзор · Visual X#",
      description:
        "Цели проектирования Visual X#, правила типов и владения, стадии компилятора и граница между спецификацией и реализацией.",
    },
    "/docs/getting-started": {
      title: "Начало работы · Visual X#",
      description:
        "Клонируйте Visual X#, проверьте набор инструментов, соберите и протестируйте компилятор и изучите первую программу с текущим CLI.",
    },
  },
  "he-IL": {
    "/": {
      title: "Visual X#‎ — להפוך את התוכנית כולה למובנת",
      description:
        "הכירו את Visual X#‎: שפת תכנות מקומית הבנויה סביב קוד מקור קריא, בעלות מפורשת וצינור מהדר שאפשר לבחון.",
    },
    "/docs/overview": {
      title: "סקירה · Visual X#‎",
      description:
        "יעדי התכנון של Visual X#‎, בחירות הטיפוסים והבעלות, שלבי המהדר והגבול בין המפרט למימוש.",
    },
    "/docs/getting-started": {
      title: "צעדים ראשונים · Visual X#‎",
      description:
        "שכפלו את Visual X#‎, בדקו את שרשרת הכלים, בנו ובדקו את המהדר ובחנו את התוכנית הראשונה עם ה-CLI הנוכחי.",
    },
  },
};

function setMeta(selector: string, content: string): void {
  const element = document.querySelector<HTMLMetaElement>(selector);
  if (element) element.content = content;
}

export function applyPageMetadata(path: string, locale: Locale): void {
  // Unknown routes are redirected by the router. Their brief transitional state
  // must not generate a canonical URL to an unlisted public page.
  const canonicalPath: PublicRoute =
    path === "/docs/overview" || path === "/docs/getting-started" ? path : "/";
  const page = metadata[locale][canonicalPath];

  document.title = page.title;
  setMeta('meta[name="description"]', page.description);
  setMeta('meta[property="og:title"]', page.title);
  setMeta('meta[property="og:description"]', page.description);
  setMeta('meta[property="og:url"]', `https://xsharp-lang.xyz${canonicalPath}`);

  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = `https://xsharp-lang.xyz${canonicalPath}`;
}
