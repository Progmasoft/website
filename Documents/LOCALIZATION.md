<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1 -->

# Localization

The language site is published in four languages.

| Locale | Language | Menu label | Text direction |
| --- | --- | --- | --- |
| `en-US` | English | EN | left to right |
| `de-DE` | German | DE | left to right |
| `ru-RU` | Russian | RU | left to right |
| `he-IL` | Hebrew | HE | right to left |

A page has one URL in every language. The language is a preference kept in the browser.

## How a page picks its language

The rules are pure functions in `frontend/src/locales.ts`:

1. **The visitor's choice.** A language stored under `vxs-locale-choice` in local storage always wins.
2. **The browser.** Without a stored choice, the first entry of `navigator.languages` whose primary language is
   published is used. `de-AT` selects German, and `iw`, the former code for Hebrew, selects Hebrew.
3. **The fallback.** A browser that prefers no published language gets `en-US`.

| Browser languages | Page language |
| --- | --- |
| `he-IL`, `en-US` | Hebrew |
| `de-AT`, `en` | German |
| `tr-TR`, `de` | German, the first preference that is published |
| `tr-TR`, `fr` | English, the fallback |
| none reported | English |

## What counts as a choice

A language becomes the stored choice only when a visitor changes it in the menu.

- Loading a page never stores anything. A visitor who never used the menu keeps following the browser, also after
  the browser's language changes.
- A change is stored only after the visitor has acted on the page (`navigator.userActivation`). A change that
  reaches the page before anyone clicked, tapped or typed switches the language but is not remembered. A browser
  without that API cannot tell, and there a change counts as a choice.

Earlier versions wrote the language under `vxs-locale` on every visit, which made a real choice indistinguishable
from the former English default. That key is no longer read.

## The forum page

The forum notice has no language menu. `forum/site.js` shows its one notice in the first browser language that has a
translation and in English otherwise, and stores nothing about language. It keeps its own theme key,
`vxs-forum-theme`.

## Hebrew and text direction

Hebrew does not mirror the page. The layout, the navigation and code keep their left-to-right arrangement; only text
follows the language.

- The root element carries `data-text-direction="rtl"`, not `dir="rtl"`.
- Headings and paragraphs run right to left and align to the right.
- Links, buttons and list items take the direction of their own first letter, so a product name on its own still
  reads left to right.
- Code blocks stay left to right.
- The onward arrow comes from `forwardArrow` and points left in Hebrew.
- A left-to-right mark (`‎`) follows `Visual X#` and `C#` in Hebrew strings. Without it the `#` jumps to the
  other side of the name inside right-to-left text.

The rules are at the end of `frontend/src/styles/site.css` and `forum/site.css`.

## Where the text lives

| Text | File |
| --- | --- |
| header, navigation, footer | `frontend/src/App.vue` |
| each page | the `<script setup>` block of its file under `frontend/src/pages/` |
| titles and descriptions | `frontend/src/seo.ts` |
| forum notice | `forum/site.js` |

Each of these holds one object per locale with the same keys. TypeScript checks the page objects against the list of
locales, so a page that lacks a language does not compile.

## Adding a language

1. In `locales.ts`, add the locale to `supportedLocales`, a label to `localeLabels` and its primary language to
   `localeByLanguage`. If it is written right to left, extend `textDirection`.
2. Add the locale to every text object listed above, and to the notice in `forum/site.js`.
3. Add the locale to `supportedLocales` in `backend/.../SiteController.kt` and to its test.
4. Extend the tests: the list in `locales.test.mjs`, a metadata case in `seo.test.mjs` and a notice case in
   `forum.test.mjs`.
5. When the forum files change, change the `?v=` value on its stylesheet and script in `forum/index.html`, so that
   a cached copy of the old files is not paired with the new page.
6. Run the checks in [Development](DEVELOPMENT.md) and read all three pages and the forum notice in the new language
   in a browser, in both themes and at a narrow width.

The [content contract](CONTENT.md) has the translation rules. Have a native speaker read the text before it is
published; the Hebrew text has not had that review yet.
