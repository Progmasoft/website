// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import { createApp, watch } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import HomePage from "./pages/HomePage.vue";
import OverviewPage from "./pages/OverviewPage.vue";
import GettingStartedPage from "./pages/GettingStartedPage.vue";
import { locale } from "./preferences";
import { applyPageMetadata } from "./seo";
import "./styles/site.css";

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: "/", component: HomePage },
    { path: "/docs/overview", component: OverviewPage },
    {
      path: "/docs/getting-started",
      component: GettingStartedPage,
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

router.afterEach((to) => applyPageMetadata(to.path, locale.value));
watch(locale, (value) => applyPageMetadata(router.currentRoute.value.path, value));

createApp(App).use(router).mount("#app");
