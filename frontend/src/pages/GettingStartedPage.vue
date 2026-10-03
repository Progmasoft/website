<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1 -->

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { arrow, locale } from "../preferences";

const text = {
  "en-US": {
    navOverview: "Overview",
    navStart: "Getting started",
    section: "DOCUMENTATION / GETTING STARTED",
    title: "Start with the source",
    lead: "Visual X# is in active development. For now, the repository is the reliable entry point for building the compiler and checking which language features run end to end.",
    step1: "1. Get the repository",
    step1Text:
      "Clone the compiler repository with its submodules. Use a supported Windows 10/11 or recent macOS development host.",
    step2: "2. Check the toolchain",
    step2Text:
      "The repository's Go development command checks local requirements. The compiler uses GHC2024 for its Haskell front end, Clang/LLVM for C++20 native stages, Bazel for native builds, and Temurin JDK 25 for the project DSL.",
    platform:
      "The supported development hosts are Windows 10/11 and macOS Sequoia/Tahoe. On Windows, standalone LLVM clang-cl and LLD are used with Windows SDK and MSVC CRT/STL libraries. On macOS, install the Xcode Command Line Tools; the full Xcode application is not required.",
    toolchainHelp:
      "If the check reports missing tools, the optional bootstrap can install prerequisites through the host package manager. Open a new terminal afterward so PATH changes take effect. LLVM_ROOT may point to the LLVM development installation prefix; do not put a machine-specific path in project files.",
    bootstrap: "Optional host bootstrap",
    step3: "3. Build and test",
    step3Text:
      "Build the native compiler and run its native contract suites. The Go command orchestrates the checks; Bazel remains the owner of the C++20 build graph. Cabal and Gradle handle their Haskell and Kotlin boundaries.",
    step4: "4. Read and check a real program",
    step4Text:
      "The HelloWorld example uses a class method as the entry point. Visual X# does not use a top-level function as its program entry. Check the exact source file, then build it using the current compiler subset.",
    fileCheck: "Check a single source file",
    fileBuild: "Build a native executable",
    subset:
      "The accepted source subset is narrower than the full public specification. A successful build is stronger evidence for a particular program than a syntax example in the specification; a successful test run is stronger evidence for a feature family.",
    step5: "5. Follow the public contract",
    step5Text:
      "Use the public specification for intended language semantics and the repository's Documents for implementation and tooling details. The compiler's -Help output describes the flags accepted by the installed binary.",
    links: [
      {
        title: "Language specification",
        detail: "Syntax and semantic contracts, including valid and invalid examples.",
        href: "https://github.com/Progmasoft/visual-xsharp/tree/main/Spec",
      },
      {
        title: "Building guide",
        detail: "Official hosts, toolchain discovery, and native build targets.",
        href: "https://github.com/Progmasoft/visual-xsharp/blob/main/Documents/BUILDING.md",
      },
      {
        title: "CLI reference",
        detail: "Current commands, flags, artifact behavior, and implementation status.",
        href: "https://github.com/Progmasoft/visual-xsharp/blob/main/Documents/CLI.md",
      },
      {
        title: "Example programs",
        detail: "Source examples next to C# 13, C++20, and Java 21 counterparts.",
        href: "https://github.com/Progmasoft/visual-xsharp/tree/main/Examples",
      },
    ],
    note: "Implementation status",
    noteText:
      "A spec example is not proof of compiler support. Run repository tests and consult current implementation notes before relying on a feature. Binary downloads and a stable installation flow are not promised yet.",
    more: "Understand the design",
    spec: "Public specification",
    examples: "More examples",
  },
  "de-DE": {
    navOverview: "Überblick",
    navStart: "Erste Schritte",
    section: "DOKUMENTATION / ERSTE SCHRITTE",
    title: "Mit dem Quellcode beginnen",
    lead: "Visual X# wird aktiv entwickelt. Das Repository ist derzeit der zuverlässige Einstieg, um den Compiler zu bauen und den tatsächlich funktionierenden Sprachumfang zu prüfen.",
    step1: "1. Repository holen",
    step1Text:
      "Klonen Sie das Compiler-Repository mit seinen Submodulen. Unterstützt werden Windows 10/11 und aktuelle macOS-Entwicklungsrechner.",
    step2: "2. Toolchain prüfen",
    step2Text:
      "Der Go-Entwicklungsbefehl prüft lokale Voraussetzungen. Das Frontend verwendet GHC2024, die nativen C++20-Stufen Clang/LLVM und Bazel; die Projekt-DSL nutzt Temurin JDK 25.",
    platform:
      "Unterstützte Entwicklungsrechner sind Windows 10/11 und macOS Sequoia/Tahoe. Unter Windows werden eigenständiges LLVM clang-cl und LLD mit Windows SDK sowie MSVC-CRT/STL-Bibliotheken verwendet. Unter macOS genügen die Xcode Command Line Tools; die vollständige Xcode-Anwendung ist nicht erforderlich.",
    toolchainHelp:
      "Falls Werkzeuge fehlen, kann der optionale Bootstrap die Voraussetzungen über den Paketmanager installieren. Öffnen Sie danach ein neues Terminal, damit PATH-Änderungen greifen. LLVM_ROOT darf auf das LLVM-Entwicklungspaket zeigen; schreiben Sie keinen rechnerbezogenen Pfad in Projektdateien.",
    bootstrap: "Optionaler Host-Bootstrap",
    step3: "3. Bauen und testen",
    step3Text:
      "Bauen Sie den nativen Compiler und führen Sie die nativen Vertragstests aus. Der Go-Befehl koordiniert die Prüfungen; Bazel besitzt weiterhin den C++20-Buildgraphen. Cabal und Gradle betreuen Haskell und Kotlin.",
    step4: "4. Ein echtes Programm lesen und prüfen",
    step4Text:
      "Im HelloWorld-Beispiel ist eine Klassenmethode der Einstiegspunkt. Eine Top-Level-Funktion ist kein Programmeinstieg in Visual X#. Prüfen Sie die Quelldatei und bauen Sie sie mit dem derzeit unterstützten Compilerumfang.",
    fileCheck: "Eine Quelldatei prüfen",
    fileBuild: "Eine native Anwendung bauen",
    subset:
      "Der unterstützte Quellcode-Teilumfang ist kleiner als die vollständige öffentliche Spezifikation. Ein erfolgreicher Build ist für ein konkretes Programm ein stärkerer Beleg als ein Syntaxbeispiel; ein erfolgreicher Testlauf ist für eine Funktionsgruppe aussagekräftiger.",
    step5: "5. Den öffentlichen Vertrag nachlesen",
    step5Text:
      "Die öffentliche Spezifikation beschreibt die beabsichtigte Sprachsemantik; die Dokumente im Repository erklären Implementierung und Werkzeuge. Die -Help-Ausgabe des installierten Compilers zeigt die tatsächlich akzeptierten Optionen.",
    links: [
      {
        title: "Sprachspezifikation",
        detail: "Syntax und Semantik mit gültigen und ungültigen Beispielen.",
        href: "https://github.com/Progmasoft/visual-xsharp/tree/main/Spec",
      },
      {
        title: "Build-Anleitung",
        detail: "Offizielle Hosts, Toolchain-Suche und native Build-Ziele.",
        href: "https://github.com/Progmasoft/visual-xsharp/blob/main/Documents/BUILDING.md",
      },
      {
        title: "CLI-Referenz",
        detail: "Aktuelle Befehle, Optionen, Artefakte und Implementierungsstand.",
        href: "https://github.com/Progmasoft/visual-xsharp/blob/main/Documents/CLI.md",
      },
      {
        title: "Beispielprogramme",
        detail: "Beispiele neben Fassungen in C# 13, C++20 und Java 21.",
        href: "https://github.com/Progmasoft/visual-xsharp/tree/main/Examples",
      },
    ],
    note: "Implementierungsstand",
    noteText:
      "Ein Spezifikationsbeispiel beweist keine Compiler-Unterstützung. Prüfen Sie Tests und aktuelle Implementierungshinweise, bevor Sie eine Funktion voraussetzen. Stabile Downloads werden noch nicht versprochen.",
    more: "Entwurf verstehen",
    spec: "Öffentliche Spezifikation",
    examples: "Weitere Beispiele",
  },
  "ru-RU": {
    navOverview: "Обзор",
    navStart: "Начало работы",
    section: "ДОКУМЕНТАЦИЯ / НАЧАЛО РАБОТЫ",
    title: "Начните с исходного кода",
    lead: "Visual X# находится в активной разработке. Пока что репозиторий — надёжная отправная точка, чтобы собрать компилятор и проверить, какие возможности языка работают от начала до конца.",
    step1: "1. Получите репозиторий",
    step1Text:
      "Клонируйте репозиторий компилятора вместе с подмодулями. Используйте поддерживаемую машину разработки с Windows 10/11 или актуальной macOS.",
    step2: "2. Проверьте набор инструментов",
    step2Text:
      "Команда разработки на Go из репозитория проверяет локальные требования. Компилятор использует GHC2024 для фронтенда на Haskell, Clang/LLVM для нативных стадий на C++20, Bazel для нативных сборок и Temurin JDK 25 для DSL проектов.",
    platform:
      "Поддерживаемые машины разработки — Windows 10/11 и macOS Sequoia/Tahoe. В Windows используются отдельные LLVM clang-cl и LLD вместе с Windows SDK и библиотеками MSVC CRT/STL. В macOS установите Xcode Command Line Tools; полное приложение Xcode не требуется.",
    toolchainHelp:
      "Если проверка сообщает об отсутствующих инструментах, необязательная начальная настройка может установить их через менеджер пакетов системы. После этого откройте новый терминал, чтобы изменения PATH вступили в силу. LLVM_ROOT может указывать на каталог установки LLVM для разработки; не записывайте путь, относящийся к конкретной машине, в файлы проекта.",
    bootstrap: "Необязательная начальная настройка системы",
    step3: "3. Соберите и протестируйте",
    step3Text:
      "Соберите нативный компилятор и запустите его нативные контрактные наборы тестов. Команда на Go координирует проверки; графом сборки C++20 по-прежнему владеет Bazel. Cabal и Gradle отвечают за свои области — Haskell и Kotlin.",
    step4: "4. Прочитайте и проверьте настоящую программу",
    step4Text:
      "В примере HelloWorld точкой входа служит метод класса. В Visual X# функция верхнего уровня не является точкой входа программы. Проверьте сам исходный файл, а затем соберите его текущим подмножеством компилятора.",
    fileCheck: "Проверить один исходный файл",
    fileBuild: "Собрать нативный исполняемый файл",
    subset:
      "Принимаемое подмножество исходного кода уже полной публичной спецификации. Успешная сборка — более сильное свидетельство для конкретной программы, чем синтаксический пример в спецификации; успешный прогон тестов — более сильное свидетельство для семейства возможностей.",
    step5: "5. Следуйте публичному контракту",
    step5Text:
      "Задуманную семантику языка смотрите в публичной спецификации, а сведения о реализации и инструментах — в каталоге Documents репозитория. Вывод -Help компилятора описывает флаги, которые принимает установленный исполняемый файл.",
    links: [
      {
        title: "Спецификация языка",
        detail: "Синтаксические и семантические контракты с допустимыми и недопустимыми примерами.",
        href: "https://github.com/Progmasoft/visual-xsharp/tree/main/Spec",
      },
      {
        title: "Руководство по сборке",
        detail: "Официальные платформы, поиск набора инструментов и цели нативной сборки.",
        href: "https://github.com/Progmasoft/visual-xsharp/blob/main/Documents/BUILDING.md",
      },
      {
        title: "Справочник по CLI",
        detail: "Текущие команды, флаги, поведение артефактов и состояние реализации.",
        href: "https://github.com/Progmasoft/visual-xsharp/blob/main/Documents/CLI.md",
      },
      {
        title: "Примеры программ",
        detail: "Примеры исходного кода рядом с вариантами на C# 13, C++20 и Java 21.",
        href: "https://github.com/Progmasoft/visual-xsharp/tree/main/Examples",
      },
    ],
    note: "Состояние реализации",
    noteText:
      "Пример из спецификации не доказывает поддержку в компиляторе. Прежде чем полагаться на возможность, запустите тесты репозитория и сверьтесь с актуальными заметками о реализации. Готовые двоичные сборки и стабильный процесс установки пока не обещаны.",
    more: "Понять замысел",
    spec: "Публичная спецификация",
    examples: "Больше примеров",
  },
  "he-IL": {
    navOverview: "סקירה",
    navStart: "צעדים ראשונים",
    section: "תיעוד / צעדים ראשונים",
    title: "מתחילים מקוד המקור",
    lead: "Visual X#‎ נמצאת בפיתוח פעיל. לעת עתה המאגר הוא נקודת הכניסה האמינה לבניית המהדר ולבדיקה אילו יכולות של השפה פועלות מקצה לקצה.",
    step1: "1. השגת המאגר",
    step1Text:
      "שכפלו את מאגר המהדר יחד עם תת־המודולים שלו. השתמשו במחשב פיתוח נתמך עם Windows 10/11 או עם גרסה עדכנית של macOS.",
    step2: "2. בדיקת שרשרת הכלים",
    step2Text:
      "פקודת הפיתוח של המאגר, הכתובה ב-Go, בודקת את הדרישות המקומיות. המהדר משתמש ב-GHC2024 לחזית הכתובה ב-Haskell, ב-Clang/LLVM לשלבים המקומיים ב-C++20, ב-Bazel לבניות המקומיות וב-Temurin JDK 25 ל-DSL של הפרויקטים.",
    platform:
      "מחשבי הפיתוח הנתמכים הם Windows 10/11 ו-macOS Sequoia/Tahoe. ב-Windows נעשה שימוש ב-clang-cl וב-LLD עצמאיים של LLVM יחד עם Windows SDK וספריות ה-CRT/STL של MSVC. ב-macOS יש להתקין את Xcode Command Line Tools; יישום Xcode המלא אינו נדרש.",
    toolchainHelp:
      "אם הבדיקה מדווחת על כלים חסרים, ה-bootstrap האופציונלי יכול להתקין את הדרישות דרך מנהל החבילות של המערכת. לאחר מכן פתחו מסוף חדש כדי ששינויי PATH ייכנסו לתוקף. LLVM_ROOT יכול להצביע על תחילית ההתקנה של חבילת הפיתוח של LLVM; אין לכתוב נתיב ייחודי למחשב בקובצי הפרויקט.",
    bootstrap: "הכנת מחשב אופציונלית",
    step3: "3. בנייה ובדיקה",
    step3Text:
      "בנו את המהדר המקומי והריצו את חבילות בדיקות החוזה המקומיות שלו. פקודת ה-Go מתזמרת את הבדיקות; Bazel נשאר הבעלים של גרף הבנייה של C++20. Cabal ו-Gradle מטפלים בגבולות של Haskell ושל Kotlin.",
    step4: "4. קריאה ובדיקה של תוכנית אמיתית",
    step4Text:
      "בדוגמה HelloWorld נקודת הכניסה היא מתודה של מחלקה. Visual X#‎ אינה משתמשת בפונקציה ברמה העליונה כנקודת הכניסה לתוכנית. בדקו את קובץ המקור המדויק, ואז בנו אותו בתת־הקבוצה הנוכחית של המהדר.",
    fileCheck: "בדיקת קובץ מקור יחיד",
    fileBuild: "בניית קובץ הרצה מקומי",
    subset:
      "תת־הקבוצה של קוד המקור שמתקבלת צרה מהמפרט הציבורי המלא. בנייה מוצלחת היא ראיה חזקה יותר לתוכנית מסוימת מאשר דוגמת תחביר במפרט; הרצת בדיקות מוצלחת היא ראיה חזקה יותר למשפחת יכולות.",
    step5: "5. לעקוב אחר החוזה הציבורי",
    step5Text:
      "המפרט הציבורי מתאר את הסמנטיקה המיועדת של השפה, ומסמכי המאגר מפרטים את המימוש ואת הכלים. הפלט של ‎-Help במהדר מתאר את הדגלים שהקובץ המותקן מקבל.",
    links: [
      {
        title: "מפרט השפה",
        detail: "חוזי תחביר וסמנטיקה, כולל דוגמאות תקינות ושגויות.",
        href: "https://github.com/Progmasoft/visual-xsharp/tree/main/Spec",
      },
      {
        title: "מדריך בנייה",
        detail: "מחשבים רשמיים, איתור שרשרת הכלים ויעדי בנייה מקומיים.",
        href: "https://github.com/Progmasoft/visual-xsharp/blob/main/Documents/BUILDING.md",
      },
      {
        title: "מדריך ה-CLI",
        detail: "הפקודות, הדגלים, התנהגות התוצרים ומצב המימוש הנוכחיים.",
        href: "https://github.com/Progmasoft/visual-xsharp/blob/main/Documents/CLI.md",
      },
      {
        title: "תוכניות לדוגמה",
        detail: "דוגמאות קוד לצד מקבילות ב-C#‎ 13, ב-C++20 וב-Java 21.",
        href: "https://github.com/Progmasoft/visual-xsharp/tree/main/Examples",
      },
    ],
    note: "מצב המימוש",
    noteText:
      "דוגמה במפרט אינה הוכחה לתמיכה במהדר. לפני שמסתמכים על יכולת, הריצו את בדיקות המאגר ועיינו בהערות המימוש העדכניות. הורדות בינאריות ותהליך התקנה יציב עדיין אינם מובטחים.",
    more: "להבין את התכנון",
    spec: "המפרט הציבורי",
    examples: "דוגמאות נוספות",
  },
} as const;
const c = computed(() => text[locale.value]);
const hello = `namespace Examples.HelloWorld;

public class HelloWorld {
    public static void Main() {
        String language = "Visual X#";
        Console.Println("Hello from " + language + "!");
    }
}`;
</script>

<template>
  <div class="doc-layout section-wrap">
    <aside class="doc-sidebar">
      <span class="kicker">VISUAL X#</span
      ><RouterLink to="/docs/overview">{{ c.navOverview }}</RouterLink
      ><RouterLink to="/docs/getting-started" aria-current="page">{{ c.navStart }}</RouterLink
      ><a href="https://github.com/Progmasoft/visual-xsharp/tree/main/Spec">Specification ↗</a>
    </aside>
    <article class="doc-content">
      <span class="kicker">{{ c.section }}</span>
      <h1>{{ c.title }}</h1>
      <p class="doc-lead">{{ c.lead }}</p>
      <h2>{{ c.step1 }}</h2>
      <p>{{ c.step1Text }}</p>
      <pre
        class="doc-code"
      ><code>git clone --recurse-submodules https://github.com/Progmasoft/visual-xsharp.git</code></pre>
      <h2>{{ c.step2 }}</h2>
      <p>{{ c.step2Text }}</p>
      <p>{{ c.platform }}</p>
      <pre class="doc-code"><code>go run scripts/develop.go doctor</code></pre>
      <h3>{{ c.bootstrap }}</h3>
      <p>{{ c.toolchainHelp }}</p>
      <pre class="doc-code"><code>go run scripts/prebuild.go check
go run scripts/prebuild.go install</code></pre>
      <h2>{{ c.step3 }}</h2>
      <p>{{ c.step3Text }}</p>
      <pre class="doc-code"><code>go run scripts/develop.go build
go run scripts/develop.go test</code></pre>
      <h2>{{ c.step4 }}</h2>
      <p>{{ c.step4Text }}</p>
      <pre class="doc-code"><code>{{ hello }}</code></pre>
      <h3>{{ c.fileCheck }}</h3>
      <pre class="doc-code"><code>vxs check -File Examples/HelloWorld/HelloWorld.vxs</code></pre>
      <h3>{{ c.fileBuild }}</h3>
      <pre class="doc-code"><code>vxs build -File Examples/HelloWorld/HelloWorld.vxs</code></pre>
      <p>{{ c.subset }}</p>
      <h2>{{ c.step5 }}</h2>
      <p>{{ c.step5Text }}</p>
      <pre class="doc-code"><code>vxs -Help
vxs build -Help</code></pre>
      <div class="doc-resource-list">
        <a v-for="link in c.links" :key="link.href" :href="link.href">
          <strong>{{ link.title }} <span aria-hidden="true">↗</span></strong>
          <span>{{ link.detail }}</span>
        </a>
      </div>
      <div class="doc-note">
        <h3>{{ c.note }}</h3>
        <p>{{ c.noteText }}</p>
      </div>
      <div class="doc-actions">
        <RouterLink class="button button-primary" to="/docs/overview"
          >{{ c.more }} {{ arrow }}</RouterLink
        ><a class="inline-link" href="https://github.com/Progmasoft/visual-xsharp/tree/main/Spec"
          >{{ c.spec }} ↗</a
        ><a
          class="inline-link"
          href="https://github.com/Progmasoft/visual-xsharp/tree/main/Examples"
          >{{ c.examples }} ↗</a
        >
      </div>
    </article>
  </div>
</template>
