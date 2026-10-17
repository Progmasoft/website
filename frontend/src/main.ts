// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import { createApp, watch } from "vue";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import App from "./App.vue";
import { contentRoutes } from "./content/routes";
import DocPage from "./pages/DocPage.vue";
import LandingPage from "./pages/LandingPage.vue";
import OverviewPage from "./pages/OverviewPage.vue";
import GettingStartedPage from "./pages/GettingStartedPage.vue";
import { locale } from "./preferences";
import { applyPageMetadata } from "./seo";
import { site } from "./site";
import "./styles/site.css";

// Every site opens on its own landing page. tala.run also has two pages built by hand; the rest of the
// documentation of each site is rendered from content.
const pages: RouteRecordRaw[] = [
  { path: "/", component: LandingPage },
  ...(site === "language"
    ? [
        { path: "/docs/overview", component: OverviewPage },
        { path: "/docs/getting-started", component: GettingStartedPage },
      ]
    : []),
];
const documentation: RouteRecordRaw[] = contentRoutes[site].map((route) => ({
  path: route.path,
  component: DocPage,
  props: { topic: route.topic, path: route.path },
}));

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [...pages, ...documentation, { path: "/:pathMatch(.*)*", redirect: "/" }],
});

router.afterEach((to) => applyPageMetadata(to.path, locale.value));
watch(locale, (value) => applyPageMetadata(router.currentRoute.value.path, value));

createApp(App).use(router).mount("#app");
