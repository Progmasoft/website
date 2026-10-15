// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import type { Locale } from "../locales";

/** One piece of a documentation page, in reading order. */
export type DocBlock =
  | { kind: "heading"; text: string }
  | { kind: "subheading"; text: string }
  | { kind: "text"; text: string }
  | { kind: "code"; code: string }
  | { kind: "terms"; items: readonly { term: string; detail: string }[] }
  | { kind: "note"; title: string; text: string };

/** A documentation page in one language. */
export type DocPageText = {
  /** The name of the page in the sidebar. */
  nav: string;
  /** The document title and its description for search engines. */
  title: string;
  description: string;
  section: string;
  heading: string;
  lead: string;
  blocks: readonly DocBlock[];
};

/** A documentation page in every published language. */
export type DocTopic = Record<Locale, DocPageText>;

/** A topic and the path it is served at. */
export type DocRoute = { path: string; topic: DocTopic };
