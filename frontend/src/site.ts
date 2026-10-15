// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

/**
 * The three sites one build serves. tala.run is about the language; talac.tala.run documents the compiler and
 * tazel.tala.run the build system. Which one a visitor sees follows from the host name alone.
 */
export type Site = "language" | "talac" | "tazel";

export const siteHosts: Record<Site, string> = {
  language: "tala.run",
  talac: "talac.tala.run",
  tazel: "tazel.tala.run",
};

export const forumUrl = "https://forum.tala.run/";

/** The first page of each site. */
export const siteHome: Record<Site, string> = {
  language: "/",
  talac: "/docs/command-line",
  tazel: "/docs/commands",
};

/** The documentation topics of each site, in the order the sidebar lists them. */
export const siteTopics: Record<Site, readonly string[]> = {
  language: ["/docs/overview", "/docs/getting-started", "/docs/syntax"],
  talac: ["/docs/command-line", "/docs/outputs"],
  tazel: ["/docs/commands", "/docs/project-file"],
};

const localHost = /^(localhost|127\.0\.0\.1|\[::1\]|.+\.localhost)$/;
const developmentKey = "tala-site";

function isSite(value: string | null): value is Site {
  return value === "language" || value === "talac" || value === "tazel";
}

/**
 * The site a host name belongs to. A development host has no subdomains, so there `?site=talac` or `?site=tazel`
 * selects a site and the choice is kept for the rest of the tab.
 */
export function siteOf(
  hostname: string,
  search: string,
  storage?: Pick<Storage, "getItem" | "setItem">,
): Site {
  if (hostname === siteHosts.talac) return "talac";
  if (hostname === siteHosts.tazel) return "tazel";
  if (!localHost.test(hostname)) return "language";
  const requested = new URLSearchParams(search).get("site");
  try {
    if (isSite(requested)) {
      storage?.setItem(developmentKey, requested);
      return requested;
    }
    const remembered = storage?.getItem(developmentKey) ?? null;
    return isSite(remembered) ? remembered : "language";
  } catch {
    return isSite(requested) ? requested : "language";
  }
}

/** The address of a page of another site; on a development host it stays on the same host. */
export function siteUrl(site: Site, path: string, hostname: string): string {
  if (localHost.test(hostname)) return `${path}?site=${site}`;
  return `https://${siteHosts[site]}${path}`;
}

function currentSite(): Site {
  // Tests import the modules that read the site without a browser around them.
  if (typeof window === "undefined") return "language";
  let storage: Storage | undefined;
  try {
    storage = window.sessionStorage;
  } catch {
    storage = undefined;
  }
  return siteOf(window.location.hostname, window.location.search, storage);
}

/** The site of this page. */
export const site: Site = currentSite();
