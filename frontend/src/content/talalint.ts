// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import type { Locale } from "../locales";
import type { LandingText, WhyTab } from "./landing";
import type { DocRoute, DocTopic } from "./types";

// talalint.tala.run. The facts follow the README of Progmasoft/talalint, version 0.1.0; commands and check names are
// the same in every language and only the prose is translated.
const report = `talalint Program.tala Library.tala`;
const fix = `talalint --fix Program.tala`;
const checks = `compiler.TAT0080   a method reference that does not select one overload
compiler.TAT0076   a format the compiler rejects`;
const tazel = `tazel lint
tazel lint -- --fix`;
const usage = `talalint Program.tala
talalint --fix Program.tala
talalint --help
talalint --version`;
const repository = "https://github.com/Progmasoft/talalint";

type TabWords = Record<"report" | "compiler" | "fix" | "tazel", { label: string; caption: string }>;

function tabs(words: TabWords): WhyTab[] {
  return [
    { ...words.report, file: "terminal", code: report },
    { ...words.compiler, file: "checks", code: checks },
    { ...words.fix, file: "terminal", code: fix },
    { ...words.tazel, file: "terminal", code: tazel },
  ];
}

const next = (source: string) => [
  { label: "Tala", href: "https://tala.run/" },
  { label: "Talafmt", href: "https://talafmt.tala.run/" },
  { label: source, href: repository },
];

export const talalintLanding: Record<Locale, LandingText> = {
  "en-US": {
    title: "Talalint — The Tala linter",
    description:
      "talalint reports what is wrong with Tala sources: the diagnostics of the Tala compiler and checks of the physical source, with safe fixes.",
    headline: "Know what is wrong before it runs.",
    lead: "talalint reports the diagnostics of the Tala compiler frontend and checks the physical source itself. --fix repairs only what is safe to repair.",
    primary: { label: "Command line", to: "/docs/command-line" },
    secondary: { label: "What it checks", to: "/docs/checks" },
    whyHeading: "Why Talalint?",
    tabs: tabs({
      report: {
        label: "Report",
        caption: "Every finding of every file it is given, with where it is.",
      },
      compiler: {
        label: "The compiler's judgement",
        caption:
          "Semantic diagnostics come from the compiler frontend itself, under the compiler check.",
      },
      fix: {
        label: "Safe fixes",
        caption: "--fix repairs the physical source and never rewrites what the compiler reports.",
      },
      tazel: {
        label: "From Tazel",
        caption: "Tazel runs talalint over the whole project; options for talalint follow --.",
      },
    }),
    nextHeading: "Next",
    next: next("Source"),
    copy: "Copy",
    copied: "Copied",
  },
  "de-DE": {
    title: "Talalint — Der Linter von Tala",
    description:
      "talalint meldet, was an Tala-Quellen nicht stimmt: die Diagnosen des Tala-Compilers und Prüfungen der physischen Quelle, mit sicheren Korrekturen.",
    headline: "Wissen, was nicht stimmt, bevor es läuft.",
    lead: "talalint meldet die Diagnosen des Tala-Compiler-Frontends und prüft die physische Quelle selbst. --fix repariert nur, was sicher zu reparieren ist.",
    primary: { label: "Befehlszeile", to: "/docs/command-line" },
    secondary: { label: "Was es prüft", to: "/docs/checks" },
    whyHeading: "Warum Talalint?",
    tabs: tabs({
      report: {
        label: "Bericht",
        caption: "Jeder Befund jeder übergebenen Datei, mit seiner Stelle.",
      },
      compiler: {
        label: "Das Urteil des Compilers",
        caption:
          "Semantische Diagnosen kommen direkt aus dem Compiler-Frontend, unter der Prüfung compiler.",
      },
      fix: {
        label: "Sichere Korrekturen",
        caption:
          "--fix repariert die physische Quelle und schreibt nie um, was der Compiler meldet.",
      },
      tazel: {
        label: "Aus Tazel",
        caption:
          "Tazel führt talalint über das ganze Projekt aus; Optionen für talalint folgen nach --.",
      },
    }),
    nextHeading: "Weiter",
    next: next("Quellcode"),
    copy: "Kopieren",
    copied: "Kopiert",
  },
  "ru-RU": {
    title: "Talalint — линтер Tala",
    description:
      "talalint сообщает, что не так в исходных текстах Tala: диагностику компилятора Tala и проверки физического текста, с безопасными исправлениями.",
    headline: "Узнайте, что не так, до запуска.",
    lead: "talalint сообщает диагностику фронтенда компилятора Tala и сам проверяет физический текст. --fix исправляет только то, что безопасно исправлять.",
    primary: { label: "Командная строка", to: "/docs/command-line" },
    secondary: { label: "Что он проверяет", to: "/docs/checks" },
    whyHeading: "Почему Talalint?",
    tabs: tabs({
      report: {
        label: "Отчёт",
        caption: "Каждая находка в каждом переданном файле, с её местом.",
      },
      compiler: {
        label: "Суждение компилятора",
        caption:
          "Семантическая диагностика приходит прямо из фронтенда компилятора, в проверке compiler.",
      },
      fix: {
        label: "Безопасные исправления",
        caption:
          "--fix исправляет физический текст и никогда не переписывает то, о чём сообщает компилятор.",
      },
      tazel: {
        label: "Из Tazel",
        caption:
          "Tazel запускает talalint для всего проекта; параметры для talalint идут после --.",
      },
    }),
    nextHeading: "Дальше",
    next: next("Исходный код"),
    copy: "Копировать",
    copied: "Скопировано",
  },
  "he-IL": {
    title: "Talalint — הלינטר של Tala",
    description:
      "talalint מדווח מה לא תקין בקוד Tala: האבחונים של מהדר Tala ובדיקות של הטקסט הפיזי, עם תיקונים בטוחים.",
    headline: "לדעת מה לא תקין לפני שזה רץ.",
    lead: "talalint מדווח על האבחונים של החלק הקדמי של מהדר Tala ובודק בעצמו את הטקסט הפיזי. ‎--fix מתקן רק את מה שבטוח לתקן.",
    primary: { label: "שורת הפקודה", to: "/docs/command-line" },
    secondary: { label: "מה הוא בודק", to: "/docs/checks" },
    whyHeading: "למה Talalint?",
    tabs: tabs({
      report: {
        label: "דוח",
        caption: "כל ממצא בכל קובץ שניתן לו, עם המקום שלו.",
      },
      compiler: {
        label: "השיפוט של המהדר",
        caption: "אבחונים סמנטיים מגיעים ישירות מהחלק הקדמי של המהדר, תחת הבדיקה compiler.",
      },
      fix: {
        label: "תיקונים בטוחים",
        caption: "‏--fix מתקן את הטקסט הפיזי ולעולם לא משכתב את מה שהמהדר מדווח.",
      },
      tazel: {
        label: "מתוך Tazel",
        caption: "Tazel מריץ את talalint על כל הפרויקט; אפשרויות ל־talalint באות אחרי ‎--.",
      },
    }),
    nextHeading: "הלאה",
    next: next("קוד מקור"),
    copy: "העתקה",
    copied: "הועתק",
  },
};

const optionTerms = (d: { inputs: string; fix: string; help: string; version: string }) => [
  { term: "Program.tala …", detail: d.inputs },
  { term: "--fix", detail: d.fix },
  { term: "--help, -h", detail: d.help },
  { term: "--version, -v", detail: d.version },
];

const commandLine: DocTopic = {
  "en-US": {
    nav: "Command line",
    title: "Command line · Talalint",
    description: "The command line of talalint, the Tala linter: inputs, --fix and exit statuses.",
    section: "TALALINT / COMMAND LINE",
    heading: "The linter and its command line",
    lead: "talalint takes Tala sources and reports what it finds. It changes a file only when --fix asks it to, and then only safely.",
    blocks: [
      { kind: "code", code: usage },
      {
        kind: "terms",
        items: optionTerms({
          inputs: "One or more sources to check.",
          fix: "Applies the safe fixes, the layout talafmt gives with its defaults, then reports what is left; compiler diagnostics are never rewritten.",
          help: "Prints the help.",
          version: "Prints the version of talalint.",
        }),
      },
      { kind: "heading", text: "How the command line is read" },
      {
        kind: "text",
        text: "A typed parser written by hand reads the command line. A line it cannot read ends with exit status 2.",
      },
    ],
  },
  "de-DE": {
    nav: "Befehlszeile",
    title: "Befehlszeile · Talalint",
    description:
      "Die Befehlszeile von talalint, dem Linter von Tala: Eingaben, --fix und Exit-Status.",
    section: "TALALINT / BEFEHLSZEILE",
    heading: "Der Linter und seine Befehlszeile",
    lead: "talalint nimmt Tala-Quellen und meldet, was es findet. Es ändert eine Datei nur, wenn --fix es verlangt, und dann nur sicher.",
    blocks: [
      { kind: "code", code: usage },
      {
        kind: "terms",
        items: optionTerms({
          inputs: "Eine oder mehrere zu prüfende Quellen.",
          fix: "Wendet die sicheren Korrekturen an, das Layout von talafmt mit seinen Vorgaben, und meldet danach, was übrig ist; Compiler-Diagnosen werden nie umgeschrieben.",
          help: "Gibt die Hilfe aus.",
          version: "Gibt die Version von talalint aus.",
        }),
      },
      { kind: "heading", text: "Wie die Befehlszeile gelesen wird" },
      {
        kind: "text",
        text: "Ein von Hand geschriebener, typisierter Parser liest die Befehlszeile. Eine Zeile, die er nicht lesen kann, endet mit Exit-Status 2.",
      },
    ],
  },
  "ru-RU": {
    nav: "Командная строка",
    title: "Командная строка · Talalint",
    description: "Командная строка talalint, линтера Tala: входные файлы, --fix и коды завершения.",
    section: "TALALINT / КОМАНДНАЯ СТРОКА",
    heading: "Линтер и его командная строка",
    lead: "talalint принимает исходные тексты Tala и сообщает о найденном. Он меняет файл, только если об этом просит --fix, и тогда только безопасно.",
    blocks: [
      { kind: "code", code: usage },
      {
        kind: "terms",
        items: optionTerms({
          inputs: "Один или несколько исходных файлов для проверки.",
          fix: "Применяет безопасные исправления — оформление talafmt с настройками по умолчанию — и сообщает, что осталось; диагностика компилятора никогда не переписывается.",
          help: "Выводит справку.",
          version: "Выводит версию talalint.",
        }),
      },
      { kind: "heading", text: "Как читается командная строка" },
      {
        kind: "text",
        text: "Командную строку читает типизированный парсер, написанный вручную. Строка, которую он не может прочитать, завершается с кодом 2.",
      },
    ],
  },
  "he-IL": {
    nav: "שורת הפקודה",
    title: "שורת הפקודה · Talalint",
    description: "שורת הפקודה של talalint, הלינטר של Tala: קלטים, ‎--fix וקודי יציאה.",
    section: "TALALINT / שורת הפקודה",
    heading: "הלינטר ושורת הפקודה שלו",
    lead: "talalint מקבל קובצי Tala ומדווח על מה שהוא מוצא. הוא משנה קובץ רק כש־‎--fix מבקש, ואז רק באופן בטוח.",
    blocks: [
      { kind: "code", code: usage },
      {
        kind: "terms",
        items: optionTerms({
          inputs: "קובץ מקור אחד או יותר לבדיקה.",
          fix: "מחיל את התיקונים הבטוחים, הפריסה של talafmt עם ברירות המחדל שלו, ואז מדווח על מה שנשאר; אבחוני המהדר לעולם לא משוכתבים.",
          help: "מדפיס את העזרה.",
          version: "מדפיס את הגרסה של talalint.",
        }),
      },
      { kind: "heading", text: "איך נקראת שורת הפקודה" },
      {
        kind: "text",
        text: "מנתח עם טיפוסים שנכתב ביד קורא את שורת הפקודה. שורה שהוא לא יכול לקרוא מסתיימת בקוד יציאה 2.",
      },
    ],
  },
};

const checkTerms = (d: {
  compiler: string;
  whitespace: string;
  endings: string;
  newline: string;
}) => [
  { term: "compiler.<code>", detail: d.compiler },
  { term: "format.trailingWhitespace", detail: d.whitespace },
  { term: "format.mixedLineEndings", detail: d.endings },
  { term: "format.missingFinalNewline", detail: d.newline },
];

const checksTopic: DocTopic = {
  "en-US": {
    nav: "What it checks",
    title: "What it checks · Talalint",
    description:
      "The checks of talalint 0.1.0: the compiler's diagnostics and its own checks of the physical source.",
    section: "TALALINT / CHECKS",
    heading: "What talalint checks",
    lead: "talalint reports what the compiler it is built with reports, and adds checks of its own on the physical source.",
    blocks: [
      {
        kind: "terms",
        items: checkTerms({
          compiler:
            "The semantic diagnostics of the Tala compiler frontend, named after their compiler code.",
          whitespace: "Spaces or tabs at the end of a physical line.",
          endings: "More than one line-ending convention in one file.",
          newline: "A non-empty file without a final newline.",
        }),
      },
      { kind: "heading", text: "Diagnostics of the compiler" },
      {
        kind: "text",
        text: "Version 0.1.0 is built with the compiler of Tala 0.1.0. Its diagnostics arrive under the compiler check with the compiler's code:",
      },
      { kind: "code", code: checks },
      {
        kind: "note",
        title: "Fixes",
        text: "--fix rewrites each file with the layout talafmt gives with its defaults, which clears the three format findings and also re-indents blocks; then talalint reports what is left. A compiler diagnostic is reported and left for you to fix.",
      },
    ],
  },
  "de-DE": {
    nav: "Was es prüft",
    title: "Was es prüft · Talalint",
    description:
      "Die Prüfungen von talalint 0.1.0: die Diagnosen des Compilers und eigene Prüfungen der physischen Quelle.",
    section: "TALALINT / PRÜFUNGEN",
    heading: "Was talalint prüft",
    lead: "talalint meldet, was der Compiler meldet, mit dem es gebaut ist, und ergänzt eigene Prüfungen der physischen Quelle.",
    blocks: [
      {
        kind: "terms",
        items: checkTerms({
          compiler:
            "Die semantischen Diagnosen des Tala-Compiler-Frontends, benannt nach ihrem Compiler-Code.",
          whitespace: "Leerzeichen oder Tabulatoren am Ende einer physischen Zeile.",
          endings: "Mehr als eine Zeilenende-Konvention in einer Datei.",
          newline: "Eine nicht leere Datei ohne Zeilenumbruch am Ende.",
        }),
      },
      { kind: "heading", text: "Diagnosen des Compilers" },
      {
        kind: "text",
        text: "Version 0.1.0 ist mit dem Compiler von Tala 0.1.0 gebaut. Seine Diagnosen erscheinen unter der Prüfung compiler mit dem Code des Compilers:",
      },
      { kind: "code", code: checks },
      {
        kind: "note",
        title: "Korrekturen",
        text: "--fix schreibt jede Datei mit dem Layout neu, das talafmt mit seinen Vorgaben erzeugt; das beseitigt die drei format-Befunde und rückt auch Blöcke neu ein. Danach meldet talalint, was übrig ist. Eine Compiler-Diagnose wird gemeldet und bleibt Ihnen überlassen.",
      },
    ],
  },
  "ru-RU": {
    nav: "Что он проверяет",
    title: "Что он проверяет · Talalint",
    description:
      "Проверки talalint 0.1.0: диагностика компилятора и собственные проверки физического текста.",
    section: "TALALINT / ПРОВЕРКИ",
    heading: "Что проверяет talalint",
    lead: "talalint сообщает то, о чём сообщает компилятор, с которым он собран, и добавляет собственные проверки физического текста.",
    blocks: [
      {
        kind: "terms",
        items: checkTerms({
          compiler:
            "Семантическая диагностика фронтенда компилятора Tala, названная по коду компилятора.",
          whitespace: "Пробелы или табуляции в конце физической строки.",
          endings: "Больше одного вида концов строк в одном файле.",
          newline: "Непустой файл без перевода строки в конце.",
        }),
      },
      { kind: "heading", text: "Диагностика компилятора" },
      {
        kind: "text",
        text: "Версия 0.1.0 собрана с компилятором Tala 0.1.0. Его диагностика приходит в проверке compiler с кодом компилятора:",
      },
      { kind: "code", code: checks },
      {
        kind: "note",
        title: "Исправления",
        text: "--fix переписывает каждый файл в оформлении, которое даёт talafmt с настройками по умолчанию: это убирает три находки format и заодно выравнивает отступы блоков. Затем talalint сообщает, что осталось. Диагностика компилятора сообщается, а исправлять её — вам.",
      },
    ],
  },
  "he-IL": {
    nav: "מה הוא בודק",
    title: "מה הוא בודק · Talalint",
    description: "הבדיקות של talalint 0.1.0: האבחונים של המהדר ובדיקות משלו על הטקסט הפיזי.",
    section: "TALALINT / בדיקות",
    heading: "מה talalint בודק",
    lead: "talalint מדווח את מה שהמהדר שאיתו הוא נבנה מדווח, ומוסיף בדיקות משלו על הטקסט הפיזי.",
    blocks: [
      {
        kind: "terms",
        items: checkTerms({
          compiler: "האבחונים הסמנטיים של החלק הקדמי של מהדר Tala, בשם הקוד שלהם במהדר.",
          whitespace: "רווחים או טאבים בסוף שורה פיזית.",
          endings: "יותר ממוסכמה אחת של סוף שורה בקובץ אחד.",
          newline: "קובץ לא ריק בלי שורה חדשה בסופו.",
        }),
      },
      { kind: "heading", text: "האבחונים של המהדר" },
      {
        kind: "text",
        text: "גרסה 0.1.0 נבנתה עם המהדר של Tala 0.1.0. האבחונים שלו מגיעים תחת הבדיקה compiler עם הקוד של המהדר:",
      },
      { kind: "code", code: checks },
      {
        kind: "note",
        title: "תיקונים",
        text: "‏--fix כותב כל קובץ מחדש בפריסה ש־talafmt נותן עם ברירות המחדל שלו; זה מנקה את שלושת ממצאי format וגם מזיח מחדש בלוקים. אחר כך talalint מדווח על מה שנשאר. אבחון של המהדר מדווח ונשאר לתיקון שלכם.",
      },
    ],
  },
};

export const talalintRoutes: readonly DocRoute[] = [
  { path: "/docs/command-line", topic: commandLine },
  { path: "/docs/checks", topic: checksTopic },
];
