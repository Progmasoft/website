<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1 -->

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import WhyTabs from "../components/WhyTabs.vue";
import { landing } from "../content/landing";
import { locale } from "../preferences";
import { site, siteBrand } from "../site";

/**
 * The first page of a site: one headline, two ways in, the "Why" tabs and a short row of next links. The state of
 * the project is said once, in the header, rather than in every paragraph.
 */
const text = computed(() => landing[site][locale.value]);
const brand = siteBrand[site];
</script>

<template>
  <div class="landing">
    <section class="landing-hero">
      <p class="landing-brand">{{ brand }}</p>
      <h1>{{ text.headline }}</h1>
      <p class="landing-lead">{{ text.lead }}</p>
      <div class="landing-actions">
        <RouterLink class="button button-primary" :to="text.primary.to">{{
          text.primary.label
        }}</RouterLink>
        <RouterLink class="button button-quiet" :to="text.secondary.to">{{
          text.secondary.label
        }}</RouterLink>
      </div>
    </section>

    <section class="landing-why" aria-labelledby="why-heading">
      <h2 id="why-heading">{{ text.whyHeading }}</h2>
      <WhyTabs
        :id="`why-${site}`"
        :tabs="text.tabs"
        :copy-label="text.copy"
        :copied-label="text.copied"
      />
    </section>

    <section class="landing-next" aria-labelledby="next-heading">
      <h2 id="next-heading">{{ text.nextHeading }}</h2>
      <ul>
        <li v-for="link in text.next" :key="link.href">
          <RouterLink v-if="link.href.startsWith('/')" :to="link.href"
            >{{ link.label }} →</RouterLink
          >
          <a v-else :href="link.href">{{ link.label }} ↗</a>
        </li>
      </ul>
    </section>
  </div>
</template>
