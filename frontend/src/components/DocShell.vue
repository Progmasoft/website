<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1 -->

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { sidebarFor } from "../content/routes";
import { locale } from "../preferences";
import { site } from "../site";

/**
 * The frame of every documentation page: the topics of the site on the left, the page in a readable column, the
 * headings of the page on the right, and the previous and next topics under it. The headings are read from the
 * rendered page, so a page only has to write its h2 elements.
 */
const props = defineProps<{ path: string; editPath: string }>();

const labels = {
  "en-US": {
    contents: "Contents",
    onPage: "On this page",
    previous: "Previous",
    next: "Next",
    edit: "Edit this page",
    docs: "Documentation",
  },
  "de-DE": {
    contents: "Inhalt",
    onPage: "Auf dieser Seite",
    previous: "Zurück",
    next: "Weiter",
    edit: "Diese Seite bearbeiten",
    docs: "Dokumentation",
  },
  "ru-RU": {
    contents: "Содержание",
    onPage: "На этой странице",
    previous: "Назад",
    next: "Далее",
    edit: "Изменить страницу",
    docs: "Документация",
  },
  "he-IL": {
    contents: "תוכן",
    onPage: "בעמוד הזה",
    previous: "הקודם",
    next: "הבא",
    edit: "עריכת העמוד",
    docs: "תיעוד",
  },
} as const;
const copy = computed(() => labels[locale.value]);
const brand = { language: "Tala", talac: "Talac", tazel: "Tazel" }[site];

const sidebar = computed(() => sidebarFor(site, locale.value));
const position = computed(() => sidebar.value.findIndex((entry) => entry.path === props.path));
const current = computed(() => sidebar.value[position.value]);
const previous = computed(() =>
  position.value > 0 ? sidebar.value[position.value - 1] : undefined,
);
const next = computed(() =>
  position.value >= 0 && position.value < sidebar.value.length - 1
    ? sidebar.value[position.value + 1]
    : undefined,
);
const editUrl = computed(
  () => `https://github.com/Progmasoft/website/blob/main/frontend/${props.editPath}`,
);

const article = ref<HTMLElement>();
const contents = ref<HTMLDetailsElement>();
const headings = ref<{ id: string; text: string }[]>([]);

/** A fragment for a heading: its words, in any script, joined by hyphens. */
function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

async function collectHeadings() {
  await nextTick();
  const found: { id: string; text: string }[] = [];
  for (const heading of article.value?.querySelectorAll("h2") ?? []) {
    const text = heading.textContent?.trim() ?? "";
    if (!text) continue;
    let id = slug(text) || `section-${found.length + 1}`;
    while (found.some((entry) => entry.id === id)) id = `${id}-${found.length + 1}`;
    heading.id = id;
    found.push({ id, text });
  }
  headings.value = found;
}

onMounted(() => {
  // On a narrow screen the topics fold away above the page; on a wide one they stay open beside it.
  if (contents.value && window.matchMedia("(max-width: 760px)").matches)
    contents.value.open = false;
  collectHeadings();
});
watch([locale, () => props.path], collectHeadings);
</script>

<template>
  <div class="docs">
    <aside class="docs-nav">
      <details ref="contents" class="docs-nav-toggle" open>
        <summary>{{ copy.contents }}</summary>
        <nav :aria-label="copy.docs">
          <p class="docs-nav-site">{{ brand }}</p>
          <RouterLink
            v-for="entry in sidebar"
            :key="entry.path"
            :to="entry.path"
            :aria-current="entry.path === path ? 'page' : undefined"
            >{{ entry.label }}</RouterLink
          >
          <a v-if="site === 'language'" href="https://github.com/Progmasoft/tala/tree/main/Spec"
            >Specification ↗</a
          >
        </nav>
      </details>
    </aside>

    <div class="docs-main">
      <nav class="docs-crumbs" aria-label="Breadcrumb">
        <RouterLink to="/">{{ brand }}</RouterLink>
        <span aria-hidden="true">/</span>
        <span>{{ copy.docs }}</span>
        <template v-if="current">
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ current.label }}</span>
        </template>
      </nav>
      <article ref="article" class="doc-content">
        <slot />
      </article>
      <nav class="docs-pager" :aria-label="`${copy.previous} / ${copy.next}`">
        <RouterLink v-if="previous" class="docs-pager-previous" :to="previous.path">
          <span>{{ copy.previous }}</span>
          <strong>{{ previous.label }}</strong>
        </RouterLink>
        <RouterLink v-if="next" class="docs-pager-next" :to="next.path">
          <span>{{ copy.next }}</span>
          <strong>{{ next.label }}</strong>
        </RouterLink>
      </nav>
      <p class="docs-edit">
        <a :href="editUrl" target="_blank" rel="noopener noreferrer">{{ copy.edit }} ↗</a>
      </p>
    </div>

    <aside v-if="headings.length > 1" class="docs-toc">
      <p>{{ copy.onPage }}</p>
      <a v-for="heading in headings" :key="heading.id" :href="`#${heading.id}`">{{
        heading.text
      }}</a>
    </aside>
  </div>
</template>
