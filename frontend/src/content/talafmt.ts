// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import type { Locale } from "../locales";
import type { LandingText, WhyTab } from "./landing";
import type { DocRoute, DocTopic } from "./types";

// talafmt.tala.run. The facts follow the README of Progmasoft/talafmt, version 0.1.0; commands are the same in every
// language and only the prose is translated.
const inPlace = `talafmt Program.tala Library.tala`;
const check = `talafmt --check Program.tala Library.tala`;
const reports = `talafmt --emit=stdout Program.tala
talafmt --emit=json Program.tala`;
const tazel = `tazel fmt
tazel fmt -- --check`;
const usage = `talafmt Program.tala Library.tala
talafmt --check Program.tala Library.tala
talafmt --emit=stdout Program.tala
talafmt --help
talafmt --version`;
const repository = "https://github.com/Progmasoft/talafmt";

type TabWords = Record<"place" | "check" | "reports" | "tazel", { label: string; caption: string }>;

function tabs(words: TabWords): WhyTab[] {
  return [
    { ...words.place, file: "terminal", code: inPlace },
    { ...words.check, file: "terminal", code: check },
    { ...words.reports, file: "terminal", code: reports },
    { ...words.tazel, file: "terminal", code: tazel },
  ];
}

const next = (source: string) => [
  { label: "Tala", href: "https://tala.run/" },
  { label: "Talalint", href: "https://talalint.tala.run/" },
  { label: source, href: repository },
];

export const talafmtLanding: Record<Locale, LandingText> = {
  "en-US": {
    title: "Talafmt — The Tala formatter",
    description:
      "talafmt gives every Tala file one layout: indentation, line endings, trailing whitespace and the final newline, never the text inside strings and comments.",
    headline: "One layout for every Tala file.",
    lead: "talafmt reads each file with the Tala lexer and parser before it changes anything, then evens out indentation, line endings, trailing whitespace and the final newline.",
    primary: { label: "Command line", to: "/docs/command-line" },
    secondary: { label: "What it changes", to: "/docs/layout" },
    whyHeading: "Why Talafmt?",
    tabs: tabs({
      place: {
        label: "In place",
        caption:
          "Without options talafmt formats every file it is given in place and prints nothing.",
      },
      check: {
        label: "In continuous integration",
        caption: "--check changes nothing and fails when any file would change.",
      },
      reports: {
        label: "Reports",
        caption:
          "stdout, coverage, checkstyle and json write the result to standard output and leave the files alone.",
      },
      tazel: {
        label: "From Tazel",
        caption: "Tazel runs talafmt over the whole project; options for talafmt follow --.",
      },
    }),
    nextHeading: "Next",
    next: next("Source"),
    copy: "Copy",
    copied: "Copied",
  },
  "de-DE": {
    title: "Talafmt — Der Formatierer von Tala",
    description:
      "talafmt gibt jeder Tala-Datei ein Layout: Einrückung, Zeilenenden, Leerzeichen am Zeilenende und den letzten Zeilenumbruch, nie den Text in Strings und Kommentaren.",
    headline: "Ein Layout für jede Tala-Datei.",
    lead: "talafmt liest jede Datei mit Lexer und Parser von Tala, bevor es etwas ändert, und gleicht dann Einrückung, Zeilenenden, Leerzeichen am Zeilenende und den letzten Zeilenumbruch an.",
    primary: { label: "Befehlszeile", to: "/docs/command-line" },
    secondary: { label: "Was es ändert", to: "/docs/layout" },
    whyHeading: "Warum Talafmt?",
    tabs: tabs({
      place: {
        label: "Direkt in der Datei",
        caption:
          "Ohne Optionen formatiert talafmt jede übergebene Datei direkt und gibt nichts aus.",
      },
      check: {
        label: "In der kontinuierlichen Integration",
        caption: "--check ändert nichts und schlägt fehl, wenn sich eine Datei ändern würde.",
      },
      reports: {
        label: "Berichte",
        caption:
          "stdout, coverage, checkstyle und json schreiben das Ergebnis in die Standardausgabe und lassen die Dateien in Ruhe.",
      },
      tazel: {
        label: "Aus Tazel",
        caption:
          "Tazel führt talafmt über das ganze Projekt aus; Optionen für talafmt folgen nach --.",
      },
    }),
    nextHeading: "Weiter",
    next: next("Quellcode"),
    copy: "Kopieren",
    copied: "Kopiert",
  },
  "ru-RU": {
    title: "Talafmt — форматировщик Tala",
    description:
      "talafmt приводит каждый файл Tala к одному оформлению: отступы, концы строк, пробелы в конце строк и последний перевод строки, но никогда не текст внутри строк и комментариев.",
    headline: "Единое оформление для каждого файла Tala.",
    lead: "talafmt читает каждый файл лексером и парсером Tala, прежде чем что-либо менять, а затем выравнивает отступы, концы строк, пробелы в конце строк и последний перевод строки.",
    primary: { label: "Командная строка", to: "/docs/command-line" },
    secondary: { label: "Что он меняет", to: "/docs/layout" },
    whyHeading: "Почему Talafmt?",
    tabs: tabs({
      place: {
        label: "На месте",
        caption:
          "Без параметров talafmt форматирует каждый переданный файл на месте и ничего не выводит.",
      },
      check: {
        label: "В непрерывной интеграции",
        caption:
          "--check ничего не меняет и завершается с ошибкой, если какой-либо файл изменился бы.",
      },
      reports: {
        label: "Отчёты",
        caption:
          "stdout, coverage, checkstyle и json пишут результат в стандартный вывод и не трогают файлы.",
      },
      tazel: {
        label: "Из Tazel",
        caption: "Tazel запускает talafmt для всего проекта; параметры для talafmt идут после --.",
      },
    }),
    nextHeading: "Дальше",
    next: next("Исходный код"),
    copy: "Копировать",
    copied: "Скопировано",
  },
  "he-IL": {
    title: "Talafmt — מעצב הקוד של Tala",
    description:
      "talafmt נותן לכל קובץ Tala פריסה אחת: הזחה, סופי שורה, רווחים בסוף שורה והשורה החדשה האחרונה, ולעולם לא את הטקסט שבתוך מחרוזות והערות.",
    headline: "פריסה אחת לכל קובץ Tala.",
    lead: "talafmt קורא כל קובץ עם המנתח הלקסיקלי והתחבירי של Tala לפני שהוא משנה משהו, ואז מיישר הזחה, סופי שורה, רווחים בסוף שורה והשורה החדשה האחרונה.",
    primary: { label: "שורת הפקודה", to: "/docs/command-line" },
    secondary: { label: "מה הוא משנה", to: "/docs/layout" },
    whyHeading: "למה Talafmt?",
    tabs: tabs({
      place: {
        label: "במקום",
        caption: "בלי אפשרויות talafmt מעצב במקום כל קובץ שניתן לו ולא מדפיס דבר.",
      },
      check: {
        label: "באינטגרציה רציפה",
        caption: "‏--check לא משנה דבר ונכשל כשקובץ כלשהו היה משתנה.",
      },
      reports: {
        label: "דוחות",
        caption:
          "stdout,‏ coverage,‏ checkstyle ו־json כותבים את התוצאה לפלט התקני ומשאירים את הקבצים כמו שהם.",
      },
      tazel: {
        label: "מתוך Tazel",
        caption: "Tazel מריץ את talafmt על כל הפרויקט; אפשרויות ל־talafmt באות אחרי ‎--.",
      },
    }),
    nextHeading: "הלאה",
    next: next("קוד מקור"),
    copy: "העתקה",
    copied: "הועתק",
  },
};

const optionTerms = (d: {
  inputs: string;
  check: string;
  emit: string;
  help: string;
  version: string;
}) => [
  { term: "Program.tala Library.tala …", detail: d.inputs },
  { term: "--check", detail: d.check },
  { term: "--emit=files|stdout|coverage|checkstyle|json", detail: d.emit },
  { term: "--help, -h", detail: d.help },
  { term: "--version, -v", detail: d.version },
];

const commandLine: DocTopic = {
  "en-US": {
    nav: "Command line",
    title: "Command line · Talafmt",
    description:
      "The command line of talafmt, the Tala formatter: inputs, --check, --emit and exit statuses.",
    section: "TALAFMT / COMMAND LINE",
    heading: "The formatter and its command line",
    lead: "talafmt takes Tala sources and formats them in place. It formats nothing it cannot read: every input is checked with the Tala lexer and parser first.",
    blocks: [
      { kind: "code", code: usage },
      {
        kind: "terms",
        items: optionTerms({
          inputs:
            "One or more sources. The project configuration is evaluated once for all of them.",
          check: "Changes nothing; the exit status fails when any source would change.",
          emit: "files, the default, writes the sources in place. The others write the formatted source or a report to standard output and leave the files alone.",
          help: "Prints the help.",
          version: "Prints the version of talafmt.",
        }),
      },
      { kind: "heading", text: "How the command line is read" },
      {
        kind: "text",
        text: "A typed parser written by hand reads the command line. A line it cannot read ends with exit status 2, before any file is touched.",
      },
    ],
  },
  "de-DE": {
    nav: "Befehlszeile",
    title: "Befehlszeile · Talafmt",
    description:
      "Die Befehlszeile von talafmt, dem Formatierer von Tala: Eingaben, --check, --emit und Exit-Status.",
    section: "TALAFMT / BEFEHLSZEILE",
    heading: "Der Formatierer und seine Befehlszeile",
    lead: "talafmt nimmt Tala-Quellen und formatiert sie direkt. Es formatiert nichts, was es nicht lesen kann: Jede Eingabe wird zuerst mit Lexer und Parser von Tala geprüft.",
    blocks: [
      { kind: "code", code: usage },
      {
        kind: "terms",
        items: optionTerms({
          inputs:
            "Eine oder mehrere Quellen. Die Projektkonfiguration wird einmal für alle ausgewertet.",
          check: "Ändert nichts; der Exit-Status schlägt fehl, wenn sich eine Quelle ändern würde.",
          emit: "files, die Vorgabe, schreibt die Quellen direkt. Die anderen schreiben die formatierte Quelle oder einen Bericht in die Standardausgabe und lassen die Dateien in Ruhe.",
          help: "Gibt die Hilfe aus.",
          version: "Gibt die Version von talafmt aus.",
        }),
      },
      { kind: "heading", text: "Wie die Befehlszeile gelesen wird" },
      {
        kind: "text",
        text: "Ein von Hand geschriebener, typisierter Parser liest die Befehlszeile. Eine Zeile, die er nicht lesen kann, endet mit Exit-Status 2, bevor eine Datei berührt wird.",
      },
    ],
  },
  "ru-RU": {
    nav: "Командная строка",
    title: "Командная строка · Talafmt",
    description:
      "Командная строка talafmt, форматировщика Tala: входные файлы, --check, --emit и коды завершения.",
    section: "TALAFMT / КОМАНДНАЯ СТРОКА",
    heading: "Форматировщик и его командная строка",
    lead: "talafmt принимает исходные тексты Tala и форматирует их на месте. Он не форматирует то, что не может прочитать: каждый вход сначала проверяется лексером и парсером Tala.",
    blocks: [
      { kind: "code", code: usage },
      {
        kind: "terms",
        items: optionTerms({
          inputs:
            "Один или несколько исходных файлов. Конфигурация проекта вычисляется один раз для всех.",
          check:
            "Ничего не меняет; код завершения сообщает об ошибке, если какой-либо файл изменился бы.",
          emit: "files, по умолчанию, записывает файлы на месте. Остальные пишут отформатированный текст или отчёт в стандартный вывод и не трогают файлы.",
          help: "Выводит справку.",
          version: "Выводит версию talafmt.",
        }),
      },
      { kind: "heading", text: "Как читается командная строка" },
      {
        kind: "text",
        text: "Командную строку читает типизированный парсер, написанный вручную. Строка, которую он не может прочитать, завершается с кодом 2 до того, как будет затронут хоть один файл.",
      },
    ],
  },
  "he-IL": {
    nav: "שורת הפקודה",
    title: "שורת הפקודה · Talafmt",
    description:
      "שורת הפקודה של talafmt, מעצב הקוד של Tala: קלטים, ‎--check,‏ ‎--emit וקודי יציאה.",
    section: "TALAFMT / שורת הפקודה",
    heading: "מעצב הקוד ושורת הפקודה שלו",
    lead: "talafmt מקבל קובצי Tala ומעצב אותם במקום. הוא לא מעצב שום דבר שהוא לא יכול לקרוא: כל קלט נבדק קודם עם המנתח הלקסיקלי והתחבירי של Tala.",
    blocks: [
      { kind: "code", code: usage },
      {
        kind: "terms",
        items: optionTerms({
          inputs: "קובץ מקור אחד או יותר. תצורת הפרויקט מחושבת פעם אחת לכולם.",
          check: "לא משנה דבר; קוד היציאה נכשל כשקובץ כלשהו היה משתנה.",
          emit: "files, ברירת המחדל, כותב את הקבצים במקום. האחרים כותבים את הקוד המעוצב או דוח לפלט התקני ומשאירים את הקבצים כמו שהם.",
          help: "מדפיס את העזרה.",
          version: "מדפיס את הגרסה של talafmt.",
        }),
      },
      { kind: "heading", text: "איך נקראת שורת הפקודה" },
      {
        kind: "text",
        text: "מנתח עם טיפוסים שנכתב ביד קורא את שורת הפקודה. שורה שהוא לא יכול לקרוא מסתיימת בקוד יציאה 2, לפני שקובץ כלשהו נוגע.",
      },
    ],
  },
};

const layout: DocTopic = {
  "en-US": {
    nav: "What it changes",
    title: "What it changes · Talafmt",
    description:
      "What talafmt changes in a Tala source, what it never touches, and how it handles encodings.",
    section: "TALAFMT / LAYOUT",
    heading: "What talafmt changes",
    lead: "talafmt changes the physical layout of a source and nothing it means. The compiler's lossless model of the source tells code apart from comments, character literals, strings and raw strings.",
    blocks: [
      {
        kind: "text",
        text: "Blocks in braces are indented four spaces per level, one line ending is used throughout the file, horizontal whitespace at the end of a line is removed, and the file ends with one newline.",
      },
      { kind: "heading", text: "What it never touches" },
      {
        kind: "text",
        text: "Braces inside comments, character literals, strings and raw strings never change the indentation. Lines crossed by a multi-line raw string or a long comment keep their inner indentation and trailing whitespace exactly.",
      },
      { kind: "heading", text: "Encodings" },
      {
        kind: "text",
        text: "talafmt.kts selects the input encoding, the output encoding and whether a byte order mark is written; every run obeys it. UTF-16 and UTF-32 output is little-endian.",
      },
      {
        kind: "note",
        title: "Version 0.1.0",
        text: "talafmt accepts what the compiler it is built with accepts; version 0.1.0 is built with the compiler of Tala 0.1.0.",
      },
    ],
  },
  "de-DE": {
    nav: "Was es ändert",
    title: "Was es ändert · Talafmt",
    description:
      "Was talafmt an einer Tala-Quelle ändert, was es nie berührt und wie es mit Kodierungen umgeht.",
    section: "TALAFMT / LAYOUT",
    heading: "Was talafmt ändert",
    lead: "talafmt ändert das physische Layout einer Quelle und nichts an ihrer Bedeutung. Das verlustfreie Quellmodell des Compilers unterscheidet Code von Kommentaren, Zeichenliteralen, Strings und Raw-Strings.",
    blocks: [
      {
        kind: "text",
        text: "Blöcke in geschweiften Klammern werden je Ebene um vier Leerzeichen eingerückt, die ganze Datei erhält ein einheitliches Zeilenende, horizontale Leerzeichen am Zeilenende werden entfernt, und die Datei endet mit genau einem Zeilenumbruch.",
      },
      { kind: "heading", text: "Was es nie berührt" },
      {
        kind: "text",
        text: "Klammern in Kommentaren, Zeichenliteralen, Strings und Raw-Strings ändern die Einrückung nie. Zeilen, die ein mehrzeiliger Raw-String oder ein langer Kommentar kreuzt, behalten ihre innere Einrückung und ihre Leerzeichen am Zeilenende genau.",
      },
      { kind: "heading", text: "Kodierungen" },
      {
        kind: "text",
        text: "talafmt.kts wählt die Eingabekodierung, die Ausgabekodierung und ob eine Byte-Order-Mark geschrieben wird; jeder Lauf folgt ihr. UTF-16- und UTF-32-Ausgaben sind Little-Endian.",
      },
      {
        kind: "note",
        title: "Version 0.1.0",
        text: "talafmt akzeptiert, was der Compiler akzeptiert, mit dem es gebaut ist; Version 0.1.0 ist mit dem Compiler von Tala 0.1.0 gebaut.",
      },
    ],
  },
  "ru-RU": {
    nav: "Что он меняет",
    title: "Что он меняет · Talafmt",
    description:
      "Что talafmt меняет в исходном тексте Tala, чего никогда не касается и как работает с кодировками.",
    section: "TALAFMT / ОФОРМЛЕНИЕ",
    heading: "Что меняет talafmt",
    lead: "talafmt меняет физическое оформление исходного текста и ничего в его смысле. Модель исходного текста компилятора без потерь отличает код от комментариев, символьных литералов, строк и сырых строк.",
    blocks: [
      {
        kind: "text",
        text: "Блоки в фигурных скобках получают по четыре пробела на уровень, во всём файле используется один вид конца строки, горизонтальные пробелы в конце строки удаляются, а файл заканчивается одним переводом строки.",
      },
      { kind: "heading", text: "Чего он никогда не касается" },
      {
        kind: "text",
        text: "Скобки внутри комментариев, символьных литералов, строк и сырых строк никогда не меняют отступы. Строки, которые пересекает многострочная сырая строка или длинный комментарий, точно сохраняют свои внутренние отступы и пробелы в конце.",
      },
      { kind: "heading", text: "Кодировки" },
      {
        kind: "text",
        text: "talafmt.kts выбирает входную и выходную кодировку и то, пишется ли метка порядка байтов; каждый запуск ей следует. Вывод в UTF-16 и UTF-32 — little-endian.",
      },
      {
        kind: "note",
        title: "Версия 0.1.0",
        text: "talafmt принимает то, что принимает компилятор, с которым он собран; версия 0.1.0 собрана с компилятором Tala 0.1.0.",
      },
    ],
  },
  "he-IL": {
    nav: "מה הוא משנה",
    title: "מה הוא משנה · Talafmt",
    description: "מה talafmt משנה בקובץ Tala, במה הוא לעולם לא נוגע, ואיך הוא מטפל בקידודים.",
    section: "TALAFMT / פריסה",
    heading: "מה talafmt משנה",
    lead: "talafmt משנה את הפריסה הפיזית של קובץ ושום דבר במשמעות שלו. המודל ללא אובדן של המהדר מבחין בין קוד לבין הערות, ליטרלים של תווים, מחרוזות ומחרוזות גולמיות.",
    blocks: [
      {
        kind: "text",
        text: "בלוקים בסוגריים מסולסלים מוזחים בארבעה רווחים לכל רמה, סוף שורה אחד משמש בכל הקובץ, רווחים אופקיים בסוף שורה מוסרים, והקובץ מסתיים בשורה חדשה אחת.",
      },
      { kind: "heading", text: "במה הוא לעולם לא נוגע" },
      {
        kind: "text",
        text: "סוגריים בתוך הערות, ליטרלים של תווים, מחרוזות ומחרוזות גולמיות לעולם לא משנים את ההזחה. שורות שעוברת דרכן מחרוזת גולמית מרובת שורות או הערה ארוכה שומרות בדיוק על ההזחה הפנימית ועל הרווחים שבסופן.",
      },
      { kind: "heading", text: "קידודים" },
      {
        kind: "text",
        text: "talafmt.kts בוחר את קידוד הקלט, את קידוד הפלט ואם לכתוב סימן סדר בתים; כל הרצה מצייתת לו. פלט UTF-16 ו־UTF-32 הוא little-endian.",
      },
      {
        kind: "note",
        title: "גרסה 0.1.0",
        text: "talafmt מקבל את מה שהמהדר שאיתו הוא נבנה מקבל; גרסה 0.1.0 נבנתה עם המהדר של Tala 0.1.0.",
      },
    ],
  },
};

export const talafmtRoutes: readonly DocRoute[] = [
  { path: "/docs/command-line", topic: commandLine },
  { path: "/docs/layout", topic: layout },
];
