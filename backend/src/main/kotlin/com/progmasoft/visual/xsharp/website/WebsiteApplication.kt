// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

package com.progmasoft.visual.xsharp.website

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

/** Spring Boot application of the Visual X# language website backend. */
@SpringBootApplication
class WebsiteApplication

/**
 * Starts the website backend.
 *
 * @param args Command-line arguments passed through to Spring Boot.
 */
fun main(args: Array<String>) {
    runApplication<WebsiteApplication>(*args)
}
