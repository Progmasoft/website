// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import { createApp, watch } from "vue";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import App from "./App.vue";
import { contentRoutes } from "./content/routes";
import DocPage from "./pages/DocPage.vue";
import HomePage from "./pages/HomePage.vue";
import OverviewPage from "./pages/OverviewPage.vue";
import GettingStartedPage from "./pages/GettingStartedPage.vue";
import { locale } from "./preferences";
import { applyPageMetadata } from "./seo";
import { site, siteHome } from "./site";
import "./styles/site.css";

// tala.run has its home page and two pages built by hand; the documentation of Talac and Tazel, on their own
// hosts, is rendered from content and opens on its first topic.
const pages: RouteRecordRaw[] =
  site === "language"
    ? [
        { path: "/", component: HomePage },
        { path: "/docs/overview", component: OverviewPage },
        { path: "/docs/getting-started", component: GettingStartedPage },
      ]
    : [{ path: "/", redirect: siteHome[site] }];
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
