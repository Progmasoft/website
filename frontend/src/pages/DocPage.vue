<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1 -->

<script setup lang="ts">
import { computed } from "vue";
import DocShell from "../components/DocShell.vue";
import type { DocTopic } from "../content/types";
import { locale } from "../preferences";
import { site } from "../site";

const props = defineProps<{ topic: DocTopic; path: string }>();
const page = computed(() => props.topic[locale.value]);
// The file a page of each site is written in, for its "Edit this page" link.
const source = {
  language: "src/content/syntax.ts",
  talac: "src/content/talac.ts",
  tazel: "src/content/tazel.ts",
  talafmt: "src/content/talafmt.ts",
  talalint: "src/content/talalint.ts",
}[site];
</script>

<template>
  <DocShell :path="path" :edit-path="source">
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
  </DocShell>
</template>
