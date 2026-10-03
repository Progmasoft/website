// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

package com.progmasoft.visual.xsharp.website

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Public state of the language website, as served by `/api/v1/site`.
 *
 * @property name Product name shown by clients.
 * @property phase Development phase of the language, for example `development`.
 * @property defaultLocale Locale a client falls back to when the visitor's
 *   browser prefers no supported language.
 * @property supportedLocales Every locale the website is published in.
 * @property forumOpen Whether the community forum accepts visitors.
 */
data class SiteInformation(
    val name: String,
    val phase: String,
    val defaultLocale: String,
    val supportedLocales: List<String>,
    val forumOpen: Boolean,
)

/** HTTP endpoints of the language website's own backend. */
@RestController
class SiteController {
    /**
     * Reports the website's own public state.
     *
     * The response does not mirror a package catalog, an account service, or
     * any other application.
     *
     * @return The current [SiteInformation].
     */
    @GetMapping("/api/v1/site")
    fun information(): SiteInformation =
        SiteInformation(
            name = "Visual X#",
            phase = "development",
            defaultLocale = "en-US",
            supportedLocales = listOf("en-US", "de-DE", "ru-RU", "he-IL"),
            forumOpen = false,
        )

    /**
     * Liveness probe for the local service manager.
     *
     * @return An empty `200 OK`; no build or host data is disclosed.
     */
    @GetMapping("/health")
    fun health(): ResponseEntity<Void> = ResponseEntity.ok().build()
}
