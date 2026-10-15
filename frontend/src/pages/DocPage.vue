<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1 -->

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { sidebarFor } from "../content/routes";
import type { DocTopic } from "../content/types";
import { locale } from "../preferences";
import { site } from "../site";

const props = defineProps<{ topic: DocTopic; path: string }>();
const page = computed(() => props.topic[locale.value]);
const sidebar = computed(() => sidebarFor(site, locale.value));
const kicker = { language: "TALA", talac: "TALAC", tazel: "TAZEL" }[site];
</script>

<template>
  <div class="doc-layout section-wrap">
    <aside class="doc-sidebar">
      <span class="kicker">{{ kicker }}</span
      ><RouterLink
        v-for="entry in sidebar"
        :key="entry.path"
        :to="entry.path"
        :aria-current="entry.path === path ? 'page' : undefined"
        >{{ entry.label }}</RouterLink
      ><a v-if="site === 'language'" href="https://github.com/Progmasoft/tala/tree/main/Spec"
        >Specification ↗</a
      >
    </aside>
    <article class="doc-content">
      <span class="kicker">{{ page.section }}</span>
      <h1>{{ page.heading }}</h1>
      <p class="doc-lead">{{ page.lead }}</p>
      <template v-for="(block, index) in page.blocks" :key="index">
        <h2 v-if="block.kind === 'heading'">{{ block.text }}</h2>
        <h3 v-else-if="block.kind === 'subheading'">{{ block.text }}</h3>
        <p v-else-if="block.kind === 'text'">{{ block.text }}</p>
        <pre
          v-else-if="block.kind === 'code'"
          class="doc-code"
          dir="ltr"
        ><code>{{ block.code }}</code></pre>
        <dl v-else-if="block.kind === 'terms'" class="doc-boundaries">
          <div v-for="item in block.items" :key="item.term">
            <dt dir="ltr">
              <code>{{ item.term }}</code>
            </dt>
            <dd>{{ item.detail }}</dd>
          </div>
        </dl>
        <div v-else-if="block.kind === 'note'" class="doc-note">
          <h3>{{ block.title }}</h3>
          <p>{{ block.text }}</p>
        </div>
      </template>
    </article>
  </div>
</template>
