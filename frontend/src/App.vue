<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1 -->

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { localeLabels } from "./locales";
import { locale, supportedLocales, theme } from "./preferences";
import { forumUrl, site, siteHome, siteUrl, type Site } from "./site";

const labels = {
  "en-US": {
    syntax: "Syntax",
    home: "Home",
    overview: "Overview",
    start: "Getting started",
    forum: "Forum",
    source: "Source",
    theme: "Switch color theme",
    language: "Language",
    status: "In active development",
    footer: "A Progmasoft project. Tala is an independent language identity.",
  },
  "de-DE": {
    syntax: "Syntax",
    home: "Startseite",
    overview: "Überblick",
    start: "Erste Schritte",
    forum: "Forum",
    source: "Quellcode",
    theme: "Farbschema wechseln",
    language: "Sprache",
    status: "In aktiver Entwicklung",
    footer: "Ein Progmasoft-Projekt. Tala hat eine eigenständige Sprachidentität.",
  },
  "ru-RU": {
    syntax: "Синтаксис",
    home: "Главная",
    overview: "Обзор",
    start: "Начало работы",
    forum: "Форум",
    source: "Исходный код",
    theme: "Сменить цветовую тему",
    language: "Язык",
    status: "В активной разработке",
    footer: "Проект Progmasoft. Tala — самостоятельный язык со своей идентичностью.",
  },
  "he-IL": {
    syntax: "תחביר",
    home: "בית",
    overview: "סקירה",
    start: "צעדים ראשונים",
    forum: "פורום",
    source: "קוד מקור",
    theme: "החלפת ערכת הצבעים",
    language: "שפה",
    status: "בפיתוח פעיל",
    footer: "פרויקט של Progmasoft. ל-Tala זהות שפה עצמאית.",
  },
} as const;
const copy = computed(() => labels[locale.value]);

const hostname = window.location.hostname;
const brand = { language: "Tala", talac: "talac", tazel: "Tazel" }[site];
// The other two sites are linked by their names, which read the same in every language.
const siblings = (["language", "talac", "tazel"] as const)
  .filter((other): other is Site => other !== site)
  .map((other) => ({
    label: { language: "Tala", talac: "talac", tazel: "Tazel" }[other],
    href: siteUrl(other, siteHome[other], hostname),
  }));

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
}
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="site-shell">
    <header class="site-header">
      <RouterLink class="brand" :to="siteHome[site]" :aria-label="`${brand} ${copy.home}`">
        <img src="/tala-mark.svg" width="31" height="31" alt="" />
        <span>{{ brand }}</span>
      </RouterLink>
      <nav class="primary-nav" aria-label="Primary navigation">
        <template v-if="site === 'language'">
          <RouterLink to="/">{{ copy.home }}</RouterLink>
          <RouterLink to="/docs/overview">{{ copy.overview }}</RouterLink>
          <RouterLink to="/docs/getting-started">{{ copy.start }}</RouterLink>
          <RouterLink to="/docs/syntax">{{ copy.syntax }}</RouterLink>
        </template>
        <a v-for="sibling in siblings" :key="sibling.href" :href="sibling.href">{{
          sibling.label
        }}</a>
        <a :href="forumUrl">{{ copy.forum }}</a>
      </nav>
      <div class="header-tools">
        <label class="language-control">
          <span class="sr-only">{{ copy.language }}</span>
          <select v-model="locale" :aria-label="copy.language">
            <option v-for="supported in supportedLocales" :key="supported" :value="supported">
              {{ localeLabels[supported] }}
            </option>
          </select>
        </label>
        <button class="icon-button" type="button" :aria-label="copy.theme" @click="toggleTheme">
          {{ theme === "dark" ? "☀" : "◐" }}
        </button>
        <a
          class="source-link"
          href="https://github.com/Progmasoft/tala"
          target="_blank"
          rel="noopener noreferrer"
          >{{ copy.source }} ↗</a
        >
      </div>
    </header>
    <main id="main"><RouterView /></main>
    <footer class="site-footer">
      <div>
        <span class="footer-wordmark">Tala</span>
        <p>{{ copy.footer }}</p>
      </div>
      <div class="footer-links">
        <a :href="siteUrl('language', '/docs/overview', hostname)">{{ copy.overview }}</a
        ><a href="https://github.com/Progmasoft/tala/tree/main/Spec">Specification</a
        ><a href="https://github.com/Progmasoft/website">Website source</a>
      </div>
      <small>© 2026 Progmasoft</small>
    </footer>
  </div>
</template>
