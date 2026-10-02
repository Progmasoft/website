<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1 -->

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { locale } from "../preferences";

const text = {
  "en-US": {
    navOverview: "Overview",
    navStart: "Getting started",
    section: "DOCUMENTATION / OVERVIEW",
    title: "What Visual X# is trying to solve",
    lead: "Visual X# is designed around a simple question: can expressive code remain understandable when ownership, types, and native compilation matter? This page explains the direction, not a promise that every feature is finished.",
    goals: "Design goals",
    modelHeading: "A few language choices",
    modelIntro:
      "These are design contracts described by the public specification. Check the compiler's current coverage before treating a contract as a usable production feature.",
    model: [
      {
        title: "A class owns the entry point",
        body: "A program starts in a parameterless public static void Main() method on the configured entry class. The class may live in any source file; its namespace does not have to mirror folders.",
      },
      {
        title: "Types carry ownership consequences",
        body: "Value types remain value types only when every nested generic argument is a value type. A reference type anywhere in the generic structure makes the result a reference type.",
      },
      {
        title: "One standard library surface",
        body: "System namespaces own core facilities such as console I/O, arrays, text, and math. A standard library namespace is not a separately declared package dependency.",
      },
      {
        title: "Native output, without pretending the pipeline is finished",
        body: "The compiler has a source-to-native path for its implemented subset. The target is broader semantic coverage, verified intermediate boundaries, and reliable diagnostics as the language grows.",
      },
    ],
    pipelineHeading: "The compiler has visible boundaries",
    pipelineIntro:
      "The architecture is intentionally divided so each stage can reject malformed input and preserve what the previous stage established.",
    pipeline: [
      {
        title: "Source and syntax",
        body: "The Haskell lexer and parser produce a parsed AST while retaining source locations for diagnostics.",
      },
      {
        title: "Names and types",
        body: "Renaming, name resolution, and type checking produce distinct resolved and typed AST forms.",
      },
      {
        title: "Language semantics",
        body: "Desugaring and Core optimizations operate before the private CorePrep adapter.",
      },
      {
        title: "Native adaptation",
        body: "C++20 Xpp and Xmm stages carry a verified, target-independent representation toward LLVM.",
      },
      {
        title: "Executable",
        body: "LLVM lowers the verified program to object code, then a platform link step creates a .vxse artifact.",
      },
    ],
    boundariesHeading: "Where the boundaries are today",
    boundaries: [
      {
        label: "Public language contract",
        value: "Spec/ examples and the related Documents/ guides",
      },
      {
        label: "Implementation truth",
        value: "Compiler tests, supported subset, and explicit diagnostics",
      },
      {
        label: "Project definition",
        value: "Visual.XSharp.kts, interpreted by the Kotlin project system",
      },
      {
        label: "Website",
        value: "Language introduction and guides; no account or package-management surface",
      },
    ],
    questionHeading: "Common questions",
    questions: [
      {
        q: "Is Visual X# ready for production?",
        a: "No general production-readiness claim is made. The compiler and runtime are still developing. Use the repository's test gates and release notes to evaluate a specific feature.",
      },
      {
        q: "Is the public Spec an executable test suite?",
        a: "Not in its entirety. It includes intended valid and invalid fragments. Some examples document semantics before complete compiler support exists.",
      },
      {
        q: "Why show the intermediate stages?",
        a: "Each stage has an owner and a verifier boundary. This is meant to make compiler behavior auditable and to keep later stages from inventing source-language meaning.",
      },
      {
        q: "Does Visual X# require a particular IDE?",
        a: "No. The supported developer workflow uses command-line tools on Windows and macOS; the Xide project is a future interface, not a prerequisite.",
      },
    ],
    items: [
      {
        title: "Semantics before shortcuts",
        body: "The source language has a written specification. The compiler separates parsed, resolved, and typed syntax so later passes receive explicit meaning instead of guessing.",
      },
      {
        title: "Ownership you can follow",
        body: "Reference and value behavior is defined through type composition. Automatic reference counting and copy-on-write rules are part of the language model; runtime and lowering support are still being completed.",
      },
      {
        title: "A deliberate native pipeline",
        body: "The front end lowers through Core and CorePrep, then Xpp and Xmm adapt the program for LLVM code generation. Boundaries make validation and diagnostics possible at each stage.",
      },
    ],
    not: "What it is not",
    notText:
      "Visual X# is not presented as a finished replacement for established production languages. The specification records intended semantics; buildable compiler coverage should be checked separately. This language website does not host accounts or package management.",
    next: "Ready to look closer?",
    nextText:
      "Start with a small program, then explore the public specification and source repository.",
    start: "Getting started",
    spec: "Read the specification",
    source: "View source",
  },
  "de-DE": {
    navOverview: "Überblick",
    navStart: "Erste Schritte",
    section: "DOKUMENTATION / ÜBERBLICK",
    title: "Welches Problem Visual X# lösen will",
    lead: "Visual X# stellt eine Frage: Kann ausdrucksstarker Code verständlich bleiben, wenn Ownership, Typen und native Kompilierung wichtig sind? Diese Seite erklärt das Ziel, nicht die Fertigstellung aller Funktionen.",
    goals: "Entwurfsziele",
    modelHeading: "Einige Sprachentscheidungen",
    modelIntro:
      "Diese Verträge beschreibt die öffentliche Spezifikation. Prüfen Sie den aktuellen Compilerumfang, bevor Sie eine Regel als produktiv nutzbare Funktion voraussetzen.",
    model: [
      {
        title: "Der Einstiegspunkt gehört zu einer Klasse",
        body: "Ein Programm beginnt in der parameterlosen Methode public static void Main() der konfigurierten Einstiegsklasse. Die Quelldatei ist frei wählbar; Namespaces müssen Verzeichnisse nicht spiegeln.",
      },
      {
        title: "Typen beeinflussen das Ownership",
        body: "Ein generischer Typ bleibt nur dann ein Werttyp, wenn alle verschachtelten Typargumente Werttypen sind. Ein Referenztyp an beliebiger Stelle macht das Ergebnis zum Referenztyp.",
      },
      {
        title: "Eine Oberfläche für die Standardbibliothek",
        body: "System-Namespaces stellen unter anderem Konsole, Arrays, Text und Mathematik bereit. Ein Standardbibliotheks-Namespace ist keine separat einzutragende Paketabhängigkeit.",
      },
      {
        title: "Native Ausgabe ohne fertige Pipeline vorzutäuschen",
        body: "Für den implementierten Teilumfang gibt es einen Weg von Quellcode zu nativem Code. Das Ziel sind breitere Semantik, geprüfte Zwischenschritte und verlässliche Diagnosen.",
      },
    ],
    pipelineHeading: "Der Compiler hat sichtbare Grenzen",
    pipelineIntro:
      "Die Architektur ist bewusst aufgeteilt, damit jede Stufe fehlerhafte Eingaben ablehnen und die Aussagen der vorherigen Stufe erhalten kann.",
    pipeline: [
      {
        title: "Quellcode und Syntax",
        body: "Lexer und Parser in Haskell erzeugen einen geparsten AST mit Quellpositionen für Diagnosen.",
      },
      {
        title: "Namen und Typen",
        body: "Umbenennung, Namensauflösung und Typprüfung erzeugen getrennte aufgelöste und typisierte AST-Formen.",
      },
      {
        title: "Sprachsemantik",
        body: "Desugaring und Core-Optimierungen liegen vor dem privaten CorePrep-Adapter.",
      },
      {
        title: "Native Anpassung",
        body: "Die C++20-Stufen Xpp und Xmm tragen eine geprüfte, zielunabhängige Darstellung zu LLVM.",
      },
      {
        title: "Ausführbare Datei",
        body: "LLVM senkt das geprüfte Programm zu Objektcode ab; anschließend entsteht durch den Plattform-Linker eine .vxse-Datei.",
      },
    ],
    boundariesHeading: "Die heutigen Zuständigkeiten",
    boundaries: [
      {
        label: "Öffentlicher Sprachvertrag",
        value: "Beispiele unter Spec/ und ergänzende Anleitungen unter Documents/",
      },
      {
        label: "Tatsächliche Implementierung",
        value: "Compiler-Tests, unterstützter Teilumfang und explizite Diagnosen",
      },
      {
        label: "Projektdefinition",
        value: "Visual.XSharp.kts, interpretiert durch das Kotlin-Projektsystem",
      },
      {
        label: "Website",
        value: "Spracheinführung und Anleitungen; keine Konto- oder Paketverwaltung",
      },
    ],
    questionHeading: "Häufige Fragen",
    questions: [
      {
        q: "Ist Visual X# produktionsreif?",
        a: "Eine allgemeine Zusage zur Produktionsreife gibt es nicht. Compiler und Runtime entwickeln sich weiter. Prüfen Sie Tests und Release-Hinweise für die jeweils benötigte Funktion.",
      },
      {
        q: "Ist die öffentliche Spec eine ausführbare Testsuite?",
        a: "Nicht vollständig. Sie enthält beabsichtigte gültige und ungültige Fragmente. Einige Beispiele gehen der vollständigen Compiler-Unterstützung voraus.",
      },
      {
        q: "Warum werden die Zwischenstufen gezeigt?",
        a: "Jede Stufe hat eine Zuständigkeit und eine Prüfgrenze. So bleibt Compilerverhalten nachvollziehbar und spätere Stufen erfinden keine Sprachsemantik.",
      },
      {
        q: "Benötigt Visual X# eine bestimmte IDE?",
        a: "Nein. Der unterstützte Entwicklungsweg nutzt Kommandozeilenwerkzeuge unter Windows und macOS; Xide ist eine künftige Oberfläche, keine Voraussetzung.",
      },
    ],
    items: [
      {
        title: "Semantik vor Abkürzungen",
        body: "Die Sprache hat eine öffentliche Spezifikation. Der Compiler trennt geparste, aufgelöste und typisierte Syntax, damit spätere Schritte nicht raten müssen.",
      },
      {
        title: "Nachvollziehbares Ownership",
        body: "Referenz- und Wertverhalten folgen der Typzusammensetzung. Automatische Referenzzählung und Copy-on-Write gehören zum Modell; Laufzeit und Lowering werden noch vervollständigt.",
      },
      {
        title: "Eine bewusste native Pipeline",
        body: "Das Frontend senkt über Core und CorePrep zu Xpp und Xmm ab; danach folgt LLVM. Die Grenzen ermöglichen Validierung und Diagnose in jeder Phase.",
      },
    ],
    not: "Was es nicht ist",
    notText:
      "Visual X# wird nicht als fertiger Ersatz für etablierte Produktionssprachen dargestellt. Die Spezifikation hält beabsichtigte Semantik fest; der tatsächlich kompilierbare Umfang ist getrennt zu prüfen. Diese Sprachwebsite bietet weder Konten noch Paketverwaltung.",
    next: "Mehr erfahren?",
    nextText:
      "Beginnen Sie mit einem kleinen Programm und lesen Sie anschließend die öffentliche Spezifikation und den Quellcode.",
    start: "Erste Schritte",
    spec: "Spezifikation lesen",
    source: "Quellcode ansehen",
  },
  "ru-RU": {
    navOverview: "Обзор",
    navStart: "Начало работы",
    section: "ДОКУМЕНТАЦИЯ / ОБЗОР",
    title: "Какую задачу решает Visual X#",
    lead: "Visual X# строится вокруг простого вопроса: может ли выразительный код оставаться понятным, когда важны владение, типы и нативная компиляция? Эта страница объясняет направление и не обещает, что каждая возможность уже готова.",
    goals: "Цели проектирования",
    modelHeading: "Несколько решений языка",
    modelIntro:
      "Это проектные контракты, описанные в публичной спецификации. Прежде чем считать контракт возможностью, пригодной для реальной работы, проверьте текущий охват компилятора.",
    model: [
      {
        title: "Точка входа принадлежит классу",
        body: "Программа начинается в методе public static void Main() без параметров в настроенном классе входа. Класс может находиться в любом исходном файле; его пространство имён не обязано повторять каталоги.",
      },
      {
        title: "Типы определяют владение",
        body: "Тип остаётся типом-значением, только если каждый вложенный обобщённый аргумент — тип-значение. Ссылочный тип в любом месте обобщённой структуры делает результат ссылочным типом.",
      },
      {
        title: "Единая стандартная библиотека",
        body: "Пространства имён System содержат базовые средства: консольный ввод-вывод, массивы, текст и математику. Пространство имён стандартной библиотеки не является отдельно объявляемой зависимостью-пакетом.",
      },
      {
        title: "Нативный результат без видимости готового конвейера",
        body: "Для реализованного подмножества у компилятора есть путь от исходного кода до нативного кода. Цель — более широкий охват семантики, проверяемые промежуточные границы и надёжная диагностика по мере роста языка.",
      },
    ],
    pipelineHeading: "У компилятора видимые границы",
    pipelineIntro:
      "Архитектура намеренно разделена, чтобы каждая стадия могла отклонить некорректный вход и сохранить установленное предыдущей стадией.",
    pipeline: [
      {
        title: "Исходный код и синтаксис",
        body: "Лексер и парсер на Haskell строят разобранное AST, сохраняя позиции в исходном коде для диагностики.",
      },
      {
        title: "Имена и типы",
        body: "Переименование, разрешение имён и проверка типов создают отдельные формы AST: разрешённую и типизированную.",
      },
      {
        title: "Семантика языка",
        body: "Раскрытие синтаксического сахара и оптимизации Core выполняются до внутреннего адаптера CorePrep.",
      },
      {
        title: "Нативная адаптация",
        body: "Стадии Xpp и Xmm на C++20 переносят проверенное, не зависящее от целевой платформы представление к LLVM.",
      },
      {
        title: "Исполняемый файл",
        body: "LLVM понижает проверенную программу до объектного кода, после чего шаг компоновки для платформы создаёт артефакт .vxse.",
      },
    ],
    boundariesHeading: "Где проходят границы сегодня",
    boundaries: [
      {
        label: "Публичный контракт языка",
        value: "Примеры в Spec/ и связанные руководства в Documents/",
      },
      {
        label: "Фактическая реализация",
        value: "Тесты компилятора, поддерживаемое подмножество и явная диагностика",
      },
      {
        label: "Описание проекта",
        value: "Visual.XSharp.kts, который интерпретирует система проектов на Kotlin",
      },
      {
        label: "Сайт",
        value: "Введение в язык и руководства; без аккаунтов и управления пакетами",
      },
    ],
    questionHeading: "Частые вопросы",
    questions: [
      {
        q: "Готов ли Visual X# к использованию в продакшене?",
        a: "Общего заявления о готовности к продакшену нет. Компилятор и среда выполнения ещё развиваются. Оценивайте конкретную возможность по тестам репозитория и заметкам к выпускам.",
      },
      {
        q: "Является ли публичная спецификация исполняемым набором тестов?",
        a: "Не целиком. В ней есть задуманные допустимые и недопустимые фрагменты. Некоторые примеры описывают семантику до появления полной поддержки в компиляторе.",
      },
      {
        q: "Зачем показывать промежуточные стадии?",
        a: "У каждой стадии есть владелец и граница проверки. Так поведение компилятора можно проверить, а поздние стадии не придумывают смысл исходного языка.",
      },
      {
        q: "Нужна ли для Visual X# определённая IDE?",
        a: "Нет. Поддерживаемый процесс разработки использует инструменты командной строки в Windows и macOS; проект Xide — будущий интерфейс, а не обязательное условие.",
      },
    ],
    items: [
      {
        title: "Семантика важнее обходных путей",
        body: "У исходного языка есть письменная спецификация. Компилятор разделяет разобранный, разрешённый и типизированный синтаксис, чтобы поздние проходы получали явный смысл, а не догадывались.",
      },
      {
        title: "Владение, за которым можно проследить",
        body: "Поведение ссылок и значений определяется составом типов. Автоматический подсчёт ссылок и правила копирования при записи входят в модель языка; поддержка во время выполнения и понижение ещё завершаются.",
      },
      {
        title: "Продуманный нативный конвейер",
        body: "Фронтенд понижает программу через Core и CorePrep, затем Xpp и Xmm подготавливают её к генерации кода LLVM. Границы позволяют выполнять проверку и диагностику на каждой стадии.",
      },
    ],
    not: "Чем он не является",
    notText:
      "Visual X# не представлен как готовая замена устоявшимся языкам для продакшена. Спецификация фиксирует задуманную семантику; фактически собираемый охват компилятора следует проверять отдельно. На этом сайте языка нет аккаунтов и управления пакетами.",
    next: "Хотите узнать больше?",
    nextText:
      "Начните с небольшой программы, а затем изучите публичную спецификацию и репозиторий с исходным кодом.",
    start: "Начало работы",
    spec: "Читать спецификацию",
    source: "Смотреть исходный код",
  },
} as const;
const c = computed(() => text[locale.value]);
</script>

<template>
  <div class="doc-layout section-wrap">
    <aside class="doc-sidebar">
      <span class="kicker">VISUAL X#</span
      ><RouterLink to="/docs/overview" aria-current="page">{{ c.navOverview }}</RouterLink
      ><RouterLink to="/docs/getting-started">{{ c.navStart }}</RouterLink
      ><a href="https://github.com/Progmasoft/visual-xsharp/tree/main/Spec">Specification ↗</a>
    </aside>
    <article class="doc-content">
      <span class="kicker">{{ c.section }}</span>
      <h1>{{ c.title }}</h1>
      <p class="doc-lead">{{ c.lead }}</p>
      <h2>{{ c.goals }}</h2>
      <div class="doc-points">
        <section v-for="item in c.items" :key="item.title">
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
        </section>
      </div>
      <h2>{{ c.modelHeading }}</h2>
      <p>{{ c.modelIntro }}</p>
      <div class="doc-points">
        <section v-for="item in c.model" :key="item.title">
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
        </section>
      </div>
      <h2>{{ c.pipelineHeading }}</h2>
      <p>{{ c.pipelineIntro }}</p>
      <ol class="doc-pipeline">
        <li v-for="step in c.pipeline" :key="step.title">
          <h3>{{ step.title }}</h3>
          <p>{{ step.body }}</p>
        </li>
      </ol>
      <h2>{{ c.boundariesHeading }}</h2>
      <dl class="doc-boundaries">
        <div v-for="boundary in c.boundaries" :key="boundary.label">
          <dt>{{ boundary.label }}</dt>
          <dd>{{ boundary.value }}</dd>
        </div>
      </dl>
      <h2>{{ c.not }}</h2>
      <p>{{ c.notText }}</p>
      <h2>{{ c.questionHeading }}</h2>
      <div class="doc-points">
        <section v-for="question in c.questions" :key="question.q">
          <h3>{{ question.q }}</h3>
          <p>{{ question.a }}</p>
        </section>
      </div>
      <div class="doc-next">
        <h2>{{ c.next }}</h2>
        <p>{{ c.nextText }}</p>
        <div class="doc-actions">
          <RouterLink class="button button-primary" to="/docs/getting-started"
            >{{ c.start }} →</RouterLink
          ><a
            class="button button-quiet"
            href="https://github.com/Progmasoft/visual-xsharp/tree/main/Spec"
            >{{ c.spec }} ↗</a
          ><a class="inline-link" href="https://github.com/Progmasoft/visual-xsharp"
            >{{ c.source }} ↗</a
          >
        </div>
      </div>
    </article>
  </div>
</template>
