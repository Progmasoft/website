<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1 -->

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { WhyTab } from "../content/landing";

/**
 * A row of tabs over one code panel. Each tab shows one strength with a short caption and a sample that the
 * compiler repository checks. The arrow keys, Home and End move between tabs, as the ARIA tabs pattern asks.
 */
const props = defineProps<{
  tabs: readonly WhyTab[];
  copyLabel: string;
  copiedLabel: string;
  id: string;
}>();

const selected = ref(0);
const copied = ref(false);
const current = computed(() => props.tabs[selected.value] ?? props.tabs[0]);
const buttons = ref<HTMLButtonElement[]>([]);

watch(
  () => props.tabs,
  () => {
    selected.value = 0;
  },
);

function select(index: number, focus = false) {
  const count = props.tabs.length;
  selected.value = (index + count) % count;
  copied.value = false;
  if (focus) buttons.value[selected.value]?.focus();
}

function onKey(event: KeyboardEvent) {
  const moves: Record<string, () => number> = {
    ArrowRight: () => selected.value + 1,
    ArrowLeft: () => selected.value - 1,
    Home: () => 0,
    End: () => props.tabs.length - 1,
  };
  const move = moves[event.key];
  if (!move) return;
  event.preventDefault();
  select(move(), true);
}

async function copy() {
  try {
    await navigator.clipboard.writeText(current.value.code);
    copied.value = true;
  } catch {
    copied.value = false;
  }
}
</script>

<template>
  <div class="why-tabs">
    <div class="why-tablist" role="tablist" @keydown="onKey">
      <button
        v-for="(tab, index) in tabs"
        :id="`${id}-tab-${index}`"
        :key="tab.label"
        ref="buttons"
        role="tab"
        type="button"
        :aria-selected="index === selected"
        :aria-controls="`${id}-panel`"
        :tabindex="index === selected ? 0 : -1"
        @click="select(index)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div
      :id="`${id}-panel`"
      class="why-panel"
      role="tabpanel"
      :aria-labelledby="`${id}-tab-${selected}`"
    >
      <p class="why-caption">{{ current.caption }}</p>
      <div class="why-code" dir="ltr">
        <div class="why-code-bar">
          <span>{{ current.file }}</span>
          <button type="button" class="why-copy" @click="copy">
            {{ copied ? copiedLabel : copyLabel }}
          </button>
        </div>
        <pre><code>{{ current.code }}</code></pre>
      </div>
    </div>
  </div>
</template>
