// SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

if (window.location.hostname === "repo.xsharp-lang.xyz") {
  document.documentElement.dataset.surface = "repository";
  document.title = "X# Package Registry";

  const description = document.querySelector('meta[name="description"]');
  description?.setAttribute(
    "content",
    "The X# package registry is online, but no xspkg packages have been published yet.",
  );
}
