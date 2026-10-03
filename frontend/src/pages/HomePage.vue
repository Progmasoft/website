<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1 -->

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { arrow, locale } from "../preferences";

const translations = {
  "en-US": {
    eyebrow: "A language for building with clarity",
    title: "Make the whole program understandable.",
    intro:
      "Visual X# aims to pair expressive source code with explicit ownership, a visible compiler pipeline, and native output. It is being built in the open; the specification describes the intended language, while implementation coverage is still growing.",
    start: "Start reading",
    overview: "Why Visual X#?",
    github: "Follow development",
    stage: "Language and compiler in active development",
    why: "Why Visual X#?",
    whyIntro:
      "Good tools should let you reason about what your code means, what it owns, and what the compiler does next.",
    features: [
      {
        number: "01",
        title: "Readable source, explicit meaning",
        text: "The language specification separates syntax from semantic rules, with examples that mark valid and invalid forms. Fewer hidden assumptions make large codebases easier to discuss.",
      },
      {
        number: "02",
        title: "Ownership is a language concern",
        text: "Reference, value, and copy-on-write types are distinguished; AARC and explicit intermediate operations are part of the compiler design. This is a direction under implementation, not a claim of finished runtime coverage.",
      },
      {
        number: "03",
        title: "A compiler you can inspect",
        text: "Parsing, name resolution, type checking, Core, Xpp, and Xmm have separate responsibilities. The path to LLVM and a native executable is visible rather than a black box.",
      },
    ],
    codeTitle: "A familiar starting point",
    codeCaption:
      "The first program is deliberately ordinary. The design depth appears as programs grow.",
    statusLabel: "CURRENT STATE",
    statusTitle: "A design you can inspect. A compiler still growing.",
    statusLead:
      "The specification and the implementation have different jobs. We keep both visible so you can tell an intended rule from a feature you can run today.",
    statusItems: [
      {
        title: "Read the contract",
        body: "The public Spec records the language grammar and semantics, including examples that distinguish valid and invalid forms. It can describe behavior ahead of compiler support.",
        link: "Open the specification",
        href: "https://github.com/Progmasoft/visual-xsharp/tree/main/Spec",
      },
      {
        title: "Check the implementation",
        body: "The current compiler, its component tests, and the CLI reference show which source paths and outputs work now. For a new feature, test a small program before relying on it.",
        link: "Read the CLI reference",
        href: "https://github.com/Progmasoft/visual-xsharp/blob/main/Documents/CLI.md",
      },
      {
        title: "Follow the work",
        body: "The repository contains the language, native compiler stages, project tooling, examples, and development documents. This site is a guide into that work, not a claim of a finished toolchain.",
        link: "Visit the repository",
        href: "https://github.com/Progmasoft/visual-xsharp",
      },
    ],
    journey: "Explore the language",
    journeyText:
      "Read the overview for the design, then follow the getting-started guide for the current toolchain. We label work in progress honestly.",
    disclaimer:
      "Status: evolving language and compiler. Examples in the specification may describe intended behavior ahead of complete compiler support.",
  },
  "de-DE": {
    eyebrow: "Eine Sprache für nachvollziehbare Software",
    title: "Das ganze Programm verstehen.",
    intro:
      "Visual X# verbindet ausdrucksstarken Quellcode mit explizitem Ownership, einer nachvollziehbaren Compiler-Pipeline und nativer Ausgabe. Die Entwicklung erfolgt offen; die Spezifikation beschreibt das Ziel, während die Implementierung noch wächst.",
    start: "Dokumentation lesen",
    overview: "Warum Visual X#?",
    github: "Entwicklung verfolgen",
    stage: "Sprache und Compiler in aktiver Entwicklung",
    why: "Warum Visual X#?",
    whyIntro:
      "Gute Werkzeuge helfen zu verstehen, was Code bedeutet, wem Daten gehören und was der Compiler als Nächstes tut.",
    features: [
      {
        number: "01",
        title: "Lesbarer Code, klare Bedeutung",
        text: "Die Spezifikation trennt Syntax und Semantik und kennzeichnet gültige wie ungültige Beispiele. Weniger versteckte Annahmen erleichtern Diskussionen über große Codebasen.",
      },
      {
        number: "02",
        title: "Ownership gehört zur Sprache",
        text: "Referenz-, Wert- und Copy-on-Write-Typen sind unterschieden; AARC und explizite Zwischenschritte gehören zum Compilerentwurf. Die Laufzeitunterstützung ist noch im Aufbau.",
      },
      {
        number: "03",
        title: "Ein nachvollziehbarer Compiler",
        text: "Parsing, Namensauflösung, Typprüfung, Core, Xpp und Xmm haben getrennte Aufgaben. Der Weg zu LLVM und einer nativen Anwendung bleibt sichtbar.",
      },
    ],
    codeTitle: "Ein vertrauter Anfang",
    codeCaption:
      "Das erste Programm ist bewusst einfach. Die Tiefe des Entwurfs zeigt sich bei größeren Programmen.",
    statusLabel: "AKTUELLER STAND",
    statusTitle: "Ein nachvollziehbarer Entwurf. Ein Compiler im Aufbau.",
    statusLead:
      "Spezifikation und Implementierung haben unterschiedliche Aufgaben. Wir zeigen beide, damit geplante Regeln nicht mit heute ausführbaren Funktionen verwechselt werden.",
    statusItems: [
      {
        title: "Den Vertrag lesen",
        body: "Die öffentliche Spec beschreibt Grammatik und Semantik, auch mit gültigen und ungültigen Beispielen. Sie kann der vollständigen Compiler-Unterstützung voraus sein.",
        link: "Spezifikation öffnen",
        href: "https://github.com/Progmasoft/visual-xsharp/tree/main/Spec",
      },
      {
        title: "Die Implementierung prüfen",
        body: "Compiler, Komponententests und CLI-Referenz zeigen, welche Quellcodepfade und Ausgaben heute funktionieren. Probieren Sie eine neue Funktion zuerst in einem kleinen Programm aus.",
        link: "CLI-Referenz lesen",
        href: "https://github.com/Progmasoft/visual-xsharp/blob/main/Documents/CLI.md",
      },
      {
        title: "Die Entwicklung verfolgen",
        body: "Das Repository enthält Sprache, native Compilerstufen, Projektwerkzeuge, Beispiele und Entwicklerdokumentation. Diese Seite führt dorthin, statt eine fertige Toolchain zu versprechen.",
        link: "Repository besuchen",
        href: "https://github.com/Progmasoft/visual-xsharp",
      },
    ],
    journey: "Die Sprache entdecken",
    journeyText:
      "Der Überblick erklärt den Entwurf; die Anleitung zum Einstieg zeigt die aktuelle Toolchain. Unfertige Teile kennzeichnen wir offen.",
    disclaimer:
      "Status: Sprache und Compiler entwickeln sich weiter. Beispiele in der Spezifikation können dem derzeitigen Implementierungsstand voraus sein.",
  },
  "ru-RU": {
    eyebrow: "Язык для ясной разработки",
    title: "Сделать понятной всю программу.",
    intro:
      "Visual X# стремится соединить выразительный исходный код с явным владением, прозрачным конвейером компилятора и нативным результатом. Он создаётся открыто: спецификация описывает задуманный язык, а охват реализации пока растёт.",
    start: "Начать чтение",
    overview: "Почему Visual X#?",
    github: "Следить за разработкой",
    stage: "Язык и компилятор в активной разработке",
    why: "Почему Visual X#?",
    whyIntro:
      "Хорошие инструменты помогают рассуждать о том, что означает ваш код, чем он владеет и что компилятор сделает дальше.",
    features: [
      {
        number: "01",
        title: "Читаемый код, явный смысл",
        text: "Спецификация языка отделяет синтаксис от семантических правил и помечает в примерах допустимые и недопустимые формы. Чем меньше скрытых допущений, тем проще обсуждать большие кодовые базы.",
      },
      {
        number: "02",
        title: "Владение — часть языка",
        text: "Ссылочные типы, типы-значения и типы с копированием при записи различаются; AARC и явные промежуточные операции входят в проект компилятора. Это направление в процессе реализации, а не заявление о готовой поддержке во время выполнения.",
      },
      {
        number: "03",
        title: "Компилятор, который можно изучить",
        text: "У разбора, разрешения имён, проверки типов, Core, Xpp и Xmm отдельные обязанности. Путь к LLVM и нативному исполняемому файлу виден, а не скрыт в чёрном ящике.",
      },
    ],
    codeTitle: "Знакомая отправная точка",
    codeCaption:
      "Первая программа намеренно обычна. Глубина замысла проявляется по мере роста программ.",
    statusLabel: "ТЕКУЩЕЕ СОСТОЯНИЕ",
    statusTitle: "Проект, который можно изучить. Компилятор, который ещё растёт.",
    statusLead:
      "У спецификации и реализации разные задачи. Мы показываем обе, чтобы задуманное правило можно было отличить от возможности, которую уже можно запустить.",
    statusItems: [
      {
        title: "Прочитайте контракт",
        body: "Публичная спецификация фиксирует грамматику и семантику языка, включая примеры, различающие допустимые и недопустимые формы. Она может описывать поведение раньше, чем его поддержит компилятор.",
        link: "Открыть спецификацию",
        href: "https://github.com/Progmasoft/visual-xsharp/tree/main/Spec",
      },
      {
        title: "Проверьте реализацию",
        body: "Текущий компилятор, тесты его компонентов и справочник по CLI показывают, какие пути исходного кода и результаты работают сейчас. Новую возможность сначала проверьте на небольшой программе.",
        link: "Читать справочник по CLI",
        href: "https://github.com/Progmasoft/visual-xsharp/blob/main/Documents/CLI.md",
      },
      {
        title: "Следите за работой",
        body: "В репозитории находятся язык, нативные стадии компилятора, инструменты проектов, примеры и документы для разработчиков. Этот сайт — путеводитель по этой работе, а не заявление о готовом наборе инструментов.",
        link: "Перейти в репозиторий",
        href: "https://github.com/Progmasoft/visual-xsharp",
      },
    ],
    journey: "Познакомьтесь с языком",
    journeyText:
      "Прочитайте обзор, чтобы понять замысел, затем следуйте руководству по началу работы с текущим набором инструментов. Незавершённое мы честно помечаем.",
    disclaimer:
      "Статус: язык и компилятор развиваются. Примеры в спецификации могут описывать задуманное поведение раньше его полной поддержки компилятором.",
  },
  "he-IL": {
    eyebrow: "שפה לבנייה מתוך בהירות",
    title: "להפוך את התוכנית כולה למובנת.",
    intro:
      "Visual X#‎ שואפת לשלב קוד מקור רב־הבעה עם בעלות מפורשת, צינור מהדר גלוי ופלט מקומי. היא נבנית בפתיחות: המפרט מתאר את השפה המיועדת, וכיסוי המימוש עדיין הולך וגדל.",
    start: "להתחיל לקרוא",
    overview: "למה Visual X#‎?",
    github: "למעקב אחר הפיתוח",
    stage: "השפה והמהדר בפיתוח פעיל",
    why: "למה Visual X#‎?",
    whyIntro: "כלים טובים צריכים לאפשר לך להבין מה הקוד שלך אומר, מה בבעלותו ומה המהדר יעשה בהמשך.",
    features: [
      {
        number: "01",
        title: "קוד קריא, משמעות מפורשת",
        text: "מפרט השפה מפריד בין תחביר לכללים סמנטיים, עם דוגמאות שמסמנות צורות תקינות ושגויות. פחות הנחות נסתרות מקלות על דיון בבסיסי קוד גדולים.",
      },
      {
        number: "02",
        title: "בעלות היא עניין של השפה",
        text: "יש הבחנה בין טיפוסי הפניה, טיפוסי ערך וטיפוסי העתקה־בעת־כתיבה; AARC ופעולות ביניים מפורשות הם חלק מתכנון המהדר. זהו כיוון שנמצא במימוש, לא הצהרה על תמיכה מוגמרת בזמן ריצה.",
      },
      {
        number: "03",
        title: "מהדר שאפשר לבחון",
        text: "לניתוח התחבירי, לפענוח השמות, לבדיקת הטיפוסים, ל-Core, ל-Xpp ול-Xmm יש תחומי אחריות נפרדים. הדרך אל LLVM ואל קובץ הרצה מקומי גלויה ואינה קופסה שחורה.",
      },
    ],
    codeTitle: "נקודת התחלה מוכרת",
    codeCaption: "התוכנית הראשונה רגילה בכוונה. עומק התכנון מתגלה ככל שהתוכניות גדלות.",
    statusLabel: "המצב הנוכחי",
    statusTitle: "תכנון שאפשר לבחון. מהדר שעדיין גדל.",
    statusLead:
      "למפרט ולמימוש תפקידים שונים. אנחנו מציגים את שניהם כדי שאפשר יהיה להבחין בין כלל מתוכנן לבין יכולת שאפשר להריץ כבר היום.",
    statusItems: [
      {
        title: "לקרוא את החוזה",
        body: "המפרט הציבורי מתעד את הדקדוק והסמנטיקה של השפה, כולל דוגמאות שמבחינות בין צורות תקינות לשגויות. הוא יכול לתאר התנהגות לפני שהמהדר תומך בה.",
        link: "לפתיחת המפרט",
        href: "https://github.com/Progmasoft/visual-xsharp/tree/main/Spec",
      },
      {
        title: "לבדוק את המימוש",
        body: "המהדר הנוכחי, בדיקות הרכיבים שלו ומדריך ה-CLI מראים אילו נתיבי קוד מקור ואילו תוצרים עובדים כעת. לפני שמסתמכים על יכולת חדשה, כדאי לבדוק אותה בתוכנית קטנה.",
        link: "לקריאת מדריך ה-CLI",
        href: "https://github.com/Progmasoft/visual-xsharp/blob/main/Documents/CLI.md",
      },
      {
        title: "לעקוב אחר העבודה",
        body: "המאגר מכיל את השפה, את שלבי המהדר המקומיים, את כלי הפרויקט, דוגמאות ומסמכי פיתוח. האתר הזה הוא מדריך אל העבודה הזאת, לא הצהרה על שרשרת כלים מוגמרת.",
        link: "למאגר",
        href: "https://github.com/Progmasoft/visual-xsharp",
      },
    ],
    journey: "להכיר את השפה",
    journeyText:
      "קראו את הסקירה כדי להבין את התכנון, ואז המשיכו למדריך הצעדים הראשונים עם שרשרת הכלים הנוכחית. עבודה שטרם הושלמה מסומנת ביושר.",
    disclaimer:
      "מצב: שפה ומהדר מתפתחים. דוגמאות במפרט עשויות לתאר התנהגות מתוכננת לפני שקיימת לה תמיכה מלאה במהדר.",
  },
} as const;
const c = computed(() => translations[locale.value]);
const example = `namespace Examples.HelloWorld;

public class HelloWorld {
    public static void Main() {
        String language = "Visual X#";
        Console.Println("Hello from " + language + "!");
    }
}`;
</script>

<template>
  <section class="hero section-wrap">
    <img class="hero-logo" src="/visual-xsharp.svg" width="520" height="293" alt="Visual X# logo" />
    <div class="hero-copy">
      <div class="eyebrow">{{ c.eyebrow }}</div>
      <h1>{{ c.title }}</h1>
      <p class="hero-intro">{{ c.intro }}</p>
      <div class="hero-actions">
        <RouterLink class="button button-primary" to="/docs/getting-started"
          >{{ c.start }} <span aria-hidden="true">{{ arrow }}</span></RouterLink
        ><RouterLink class="button button-quiet" to="/docs/overview">{{ c.overview }}</RouterLink>
      </div>
      <p class="release-note">{{ c.stage }}</p>
    </div>
  </section>
  <section class="why-section section-wrap" aria-labelledby="why-heading">
    <div class="section-lead">
      <span class="kicker">01 / PRINCIPLES</span>
      <h2 id="why-heading">{{ c.why }}</h2>
      <p>{{ c.whyIntro }}</p>
    </div>
    <div class="feature-list">
      <article v-for="feature in c.features" :key="feature.number" class="feature-row">
        <small>{{ feature.number }}</small>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.text }}</p>
      </article>
    </div>
  </section>
  <section class="example-section section-wrap" aria-labelledby="example-heading">
    <div class="example-copy">
      <span class="kicker">02 / SOURCE</span>
      <h2 id="example-heading">{{ c.codeTitle }}</h2>
      <p>{{ c.codeCaption }}</p>
      <RouterLink class="inline-link" to="/docs/overview">{{ c.overview }} {{ arrow }}</RouterLink>
    </div>
    <div class="code-card">
      <div class="code-bar"><span>HelloWorld.vxs</span></div>
      <pre><code>{{ example }}</code></pre>
    </div>
  </section>
  <section class="status-section section-wrap" aria-labelledby="status-heading">
    <div class="section-lead">
      <span class="kicker">{{ c.statusLabel }}</span>
      <h2 id="status-heading">{{ c.statusTitle }}</h2>
      <p>{{ c.statusLead }}</p>
    </div>
    <div class="status-list">
      <article v-for="item in c.statusItems" :key="item.title">
        <h3>{{ item.title }}</h3>
        <p>{{ item.body }}</p>
        <a class="inline-link" :href="item.href"
          >{{ item.link }} <span aria-hidden="true">↗</span></a
        >
      </article>
    </div>
  </section>
  <section class="journey section-wrap">
    <div>
      <span class="kicker">03 / NEXT STEPS</span>
      <h2>{{ c.journey }}</h2>
      <p>{{ c.journeyText }}</p>
    </div>
    <RouterLink class="button button-primary" to="/docs/overview"
      >{{ c.overview }} {{ arrow }}</RouterLink
    >
  </section>
  <p class="status-disclaimer section-wrap">{{ c.disclaimer }}</p>
</template>
