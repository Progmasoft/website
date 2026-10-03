// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import { computed, ref, watch } from "vue";
import { forwardArrow, initialLocale, textDirection, type Locale } from "./locales";

export { supportedLocales, type Locale } from "./locales";
export type Theme = "dark" | "light";

// Holds a language only after the visitor picked one in the menu. The earlier
// `vxs-locale` key was written on every visit, so it cannot tell a choice
// from the former English default and is no longer read.
const localeChoiceKey = "vxs-locale-choice";

function storedTheme(): Theme {
  return localStorage.getItem("vxs-theme") === "light" ? "light" : "dark";
}

export const locale = ref<Locale>(
  initialLocale(localStorage.getItem(localeChoiceKey), navigator.languages ?? []),
);
export const theme = ref<Theme>(storedTheme());

/** The arrow that points onward in the current language. */
export const arrow = computed(() => forwardArrow(locale.value));

function showLocale(value: Locale): void {
  document.documentElement.lang = value;
  document.documentElement.dataset.textDirection = textDirection(value);
}

showLocale(locale.value);
// The language changes only through the menu, so a change is a choice.
watch(locale, (value) => {
  showLocale(value);
  localStorage.setItem(localeChoiceKey, value);
});

watch(
  theme,
  (value) => {
    document.documentElement.dataset.theme = value;
    localStorage.setItem("vxs-theme", value);
  },
  { immediate: true },
);
