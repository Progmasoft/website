// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

package com.progmasoft.visual.xsharp.website

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post

@SpringBootTest
@AutoConfigureMockMvc
class SiteControllerTest(
    @Autowired private val client: MockMvc,
) {
    @Test
    fun `site information is about Visual XSharp rather than the package registry`() {
        val response = client.perform(get("/api/v1/site")).andReturn().response
        assertEquals(200, response.status)
        assertEquals("application/json", response.contentType)
        val body = response.contentAsString
        assertTrue(body.contains("\"name\":\"Visual X#\""))
        assertTrue(body.contains("\"defaultLocale\":\"en-US\""))
        assertTrue(body.contains("\"supportedLocales\":[\"en-US\",\"de-DE\"]"))
        assertTrue(body.contains("\"forumOpen\":false"))
        assertFalse(body.contains("viget", ignoreCase = true))
    }

    @Test
    fun `health endpoint has an empty successful response`() {
        val response = client.perform(get("/health")).andReturn().response
        assertEquals(200, response.status)
        assertEquals("", response.contentAsString)
    }

    @Test
    fun `site information is read only`() {
        assertEquals(405, client.perform(post("/api/v1/site")).andReturn().response.status)
    }

    @Test
    fun `registry and account endpoints are absent`() {
        for (path in listOf("/api/v1/status", "/api/v1/packages", "/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/tokens", "/login", "/register")) {
            assertEquals(404, client.perform(get(path)).andReturn().response.status)
        }
    }
}
