// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

/**
 * The sites one build serves. tala.run is about the language; talac.tala.run documents the compiler,
 * tazel.tala.run the build system, talafmt.tala.run the formatter and talalint.tala.run the linter. Which one a
 * visitor sees follows from the host name alone.
 */
export const sites = ["language", "talac", "tazel", "talafmt", "talalint"] as const;
export type Site = (typeof sites)[number];

export const siteHosts: Record<Site, string> = {
  language: "tala.run",
  talac: "talac.tala.run",
  tazel: "tazel.tala.run",
  talafmt: "talafmt.tala.run",
  talalint: "talalint.tala.run",
};

/** The name of each site, the same in every language. */
export const siteBrand: Record<Site, string> = {
  language: "Tala",
  talac: "Talac",
  tazel: "Tazel",
  talafmt: "Talafmt",
  talalint: "Talalint",
};

export const forumUrl = "https://forum.tala.run/";

/** The first page of each site: its landing page. */
export const siteHome: Record<Site, string> = {
  language: "/",
  talac: "/",
  tazel: "/",
  talafmt: "/",
  talalint: "/",
};

/** The documentation topics of each site, in the order the sidebar lists them. */
export const siteTopics: Record<Site, readonly string[]> = {
  language: ["/docs/overview", "/docs/getting-started", "/docs/syntax"],
  talac: ["/docs/command-line", "/docs/outputs"],
  tazel: ["/docs/commands", "/docs/project-file"],
  talafmt: ["/docs/command-line", "/docs/layout"],
  talalint: ["/docs/command-line", "/docs/checks"],
};

const localHost = /^(localhost|127\.0\.0\.1|\[::1\]|.+\.localhost)$/;
const developmentKey = "tala-site";

function isSite(value: string | null): value is Site {
  return sites.includes(value as Site);
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
  const hosted = sites.find(
    (candidate) => candidate !== "language" && siteHosts[candidate] === hostname,
  );
  if (hosted) return hosted;
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
