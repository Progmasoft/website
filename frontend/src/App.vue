<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1 -->

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { localeLabels } from "./locales";
import { locale, supportedLocales, theme } from "./preferences";

const labels = {
  "en-US": {
    home: "Home",
    overview: "Overview",
    start: "Getting started",
    forum: "Forum",
    source: "Source",
    theme: "Switch color theme",
    language: "Language",
    status: "In active development",
    footer: "A Progmasoft project. Visual X# is an independent language identity.",
    domainNotice:
      "This site is moving to a new domain within a month. xsharp-lang.xyz will keep working and will redirect to the new address.",
  },
  "de-DE": {
    home: "Startseite",
    overview: "Überblick",
    start: "Erste Schritte",
    forum: "Forum",
    source: "Quellcode",
    theme: "Farbschema wechseln",
    language: "Sprache",
    status: "In aktiver Entwicklung",
    footer: "Ein Progmasoft-Projekt. Visual X# hat eine eigenständige Sprachidentität.",
    domainNotice:
      "Diese Website zieht innerhalb eines Monats auf eine neue Domain um. xsharp-lang.xyz bleibt erreichbar und leitet dann auf die neue Adresse weiter.",
  },
  "ru-RU": {
    home: "Главная",
    overview: "Обзор",
    start: "Начало работы",
    forum: "Форум",
    source: "Исходный код",
    theme: "Сменить цветовую тему",
    language: "Язык",
    status: "В активной разработке",
    footer: "Проект Progmasoft. Visual X# — самостоятельный язык со своей идентичностью.",
    domainNotice:
      "В течение месяца сайт переедет на новый домен. xsharp-lang.xyz продолжит работать и будет перенаправлять на новый адрес.",
  },
  "he-IL": {
    home: "בית",
    overview: "סקירה",
    start: "צעדים ראשונים",
    forum: "פורום",
    source: "קוד מקור",
    theme: "החלפת ערכת הצבעים",
    language: "שפה",
    status: "בפיתוח פעיל",
    footer: "פרויקט של Progmasoft. ל-Visual X#‎ זהות שפה עצמאית.",
    domainNotice:
      "האתר יעבור לדומיין חדש בתוך חודש. xsharp-lang.xyz ימשיך לפעול ויפנה לכתובת החדשה.",
  },
} as const;
const copy = computed(() => labels[locale.value]);

// The notice belongs to the domain that is being left: a visitor of the new
// domain, or of a preview, has nothing to be told.
const onDepartingDomain = /(^|\.)xsharp-lang\.xyz$/.test(window.location.hostname);

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
}
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="site-shell">
    <p v-if="onDepartingDomain" class="domain-notice" role="status">{{ copy.domainNotice }}</p>
    <header class="site-header">
      <RouterLink class="brand" to="/" :aria-label="`Visual X# ${copy.home}`">
        <img src="/visual-xsharp-mark.svg" width="31" height="31" alt="" />
        <span>Visual X#</span>
      </RouterLink>
      <nav class="primary-nav" aria-label="Primary navigation">
        <RouterLink to="/">{{ copy.home }}</RouterLink>
        <RouterLink to="/docs/overview">{{ copy.overview }}</RouterLink>
        <RouterLink to="/docs/getting-started">{{ copy.start }}</RouterLink>
        <a href="https://forum.xsharp-lang.xyz/">{{ copy.forum }}</a>
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
          href="https://github.com/Progmasoft/visual-xsharp"
          target="_blank"
          rel="noopener noreferrer"
          >{{ copy.source }} ↗</a
        >
      </div>
    </header>
    <main id="main"><RouterView /></main>
    <footer class="site-footer">
      <div>
        <span class="footer-wordmark">Visual X#</span>
        <p>{{ copy.footer }}</p>
      </div>
      <div class="footer-links">
        <RouterLink to="/docs/overview">{{ copy.overview }}</RouterLink
        ><a href="https://github.com/Progmasoft/visual-xsharp/tree/main/Spec">Specification</a
        ><a href="https://github.com/Progmasoft/website">Website source</a>
      </div>
      <small>© 2026 Progmasoft</small>
    </footer>
  </div>
</template>
