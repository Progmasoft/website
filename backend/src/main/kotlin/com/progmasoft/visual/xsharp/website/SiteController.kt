// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

package com.progmasoft.visual.xsharp.website

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

data class SiteInformation(
    val name: String,
    val phase: String,
    val defaultLocale: String,
    val supportedLocales: List<String>,
    val forumOpen: Boolean,
)

@RestController
class SiteController {
    // This API reports only the language website's own public state. It does
    // not mirror a package catalog, account service, or any other application.
    @GetMapping("/api/v1/site")
    fun information(): SiteInformation =
        SiteInformation(
            name = "Visual X#",
            phase = "development",
            defaultLocale = "en-US",
            supportedLocales = listOf("en-US", "de-DE", "ru-RU"),
            forumOpen = false,
        )

    // Used by the local service manager without disclosing build or host data.
    @GetMapping("/health")
    fun health(): ResponseEntity<Void> = ResponseEntity.ok().build()
}
