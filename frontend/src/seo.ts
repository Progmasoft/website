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
      title: "Tala — Make the whole program understandable",
      description:
        "Meet Tala: a native programming language built around readable source, explicit ownership, and an inspectable compiler pipeline.",
    },
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
    "/": {
      title: "Tala — Das ganze Programm verstehen",
      description:
        "Tala ist eine native Programmiersprache mit lesbarem Quellcode, explizitem Ownership und nachvollziehbarer Compiler-Pipeline.",
    },
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
    "/": {
      title: "Tala — Сделать понятной всю программу",
      description:
        "Tala — нативный язык программирования с читаемым исходным кодом, явным владением и прозрачным конвейером компилятора.",
    },
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
    "/": {
      title: "Tala — להפוך את התוכנית כולה למובנת",
      description:
        "הכירו את Tala: שפת תכנות שמהודרת לקוד מכונה והבנויה סביב קוד מקור קריא, בעלות מפורשת ותהליך הידור שאפשר לבחון.",
    },
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
