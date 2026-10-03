// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

plugins {
    kotlin("jvm") version "2.3.21"
    kotlin("plugin.spring") version "2.3.21"
    id("org.springframework.boot") version "4.1.1"
    id("org.jetbrains.dokka") version "2.2.0"
    jacoco
}

group = "com.progmasoft.visual.xsharp.website"
version = "1.0.0"

repositories { mavenCentral() }

dependencyLocking {
    // Keep transitive versions stable between developer machines and CI runs.
    lockAllConfigurations()
}

kotlin { jvmToolchain(25) }

dependencies {
    implementation(platform(org.springframework.boot.gradle.plugin.SpringBootPlugin.BOM_COORDINATES))
    implementation("org.springframework.boot:spring-boot-starter-webmvc")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

    testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.test { useJUnitPlatform() }

dokka {
    dokkaPublications.configureEach {
        // The documentation build is a gate: a broken link, an unresolved
        // reference or an undocumented declaration fails it.
        failOnWarning = true
    }
    dokkaSourceSets.configureEach {
        reportUndocumented = true
    }
}

jacoco { toolVersion = "0.8.15" }

tasks.jacocoTestReport {
    dependsOn(tasks.test)
    reports {
        xml.required = true
        html.required = false
    }
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
