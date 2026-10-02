// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import { ref, watch } from "vue";

export const supportedLocales = ["en-US", "de-DE", "ru-RU"] as const;
export type Locale = (typeof supportedLocales)[number];
export type Theme = "dark" | "light";

function storedLocale(): Locale {
  const stored = localStorage.getItem("vxs-locale");
  return supportedLocales.find((supported) => supported === stored) ?? "en-US";
}

function storedTheme(): Theme {
  return localStorage.getItem("vxs-theme") === "light" ? "light" : "dark";
}

export const locale = ref<Locale>(storedLocale());
export const theme = ref<Theme>(storedTheme());

watch(
  locale,
  (value) => {
    document.documentElement.lang = value;
    localStorage.setItem("vxs-locale", value);
  },
  { immediate: true },
);

watch(
  theme,
  (value) => {
    document.documentElement.dataset.theme = value;
    localStorage.setItem("vxs-theme", value);
  },
  { immediate: true },
);
