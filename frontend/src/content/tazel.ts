// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import type { DocRoute, DocTopic } from "./types";

const everyday = `tazel check
tazel build
tazel run -- arguments for the program
tazel fmt -- --check
tazel lint -- --fix`;
const selection = `tazel build --vipkg Name          tazel build -p Name
tazel build --executable Name     tazel build -e Name
tazel build --library Name        tazel build -l Name`;
const minimal = `project {
  name = "Example"
}

sources {
  executable {
    entry = "Example.Program"
  }
}`;
const compiler = `compiler {
  standard = talaStandardOf(26)
  buildMode = BuildMode.RELEASE
  warnings = Warnings.ALL
  wshadow = true
  optLevel = OptLevel.O3

  llvm {
    lto = LlvmLto.NONE
  }
}`;
const dependencies = `dependencies {
  dependency("Publisher") {
    name = "Toml"
    version = "1.0.0"
    feature = "TOML"
  }

  localDependency { path = "Dependency.vipkg" }
  testDependency("Publisher") {
    name = "TestDep"
    version = "0.1.0"
  }
}`;
const workspace = `workspace {
  members("./Server", "../Shared", "Client")
  defaultMembers("./Server")
  exclude("OldProject")
}`;

const commandTerms = (
  d: Record<
    | "check"
    | "build"
    | "run"
    | "test"
    | "resolve"
    | "dump"
    | "fmt"
    | "lint"
    | "version"
    | "help"
    | "registry",
    string
  >,
) => [
  { term: "tazel check", detail: d.check },
  { term: "tazel build", detail: d.build },
  { term: "tazel run [-- arguments]", detail: d.run },
  { term: "tazel test", detail: d.test },
  { term: "tazel lock resolve", detail: d.resolve },
  { term: "tazel lock create-dump", detail: d.dump },
  { term: "tazel fmt [-- options]", detail: d.fmt },
  { term: "tazel lint [--workspace] [-- options]", detail: d.lint },
  { term: "tazel version", detail: d.version },
  { term: "tazel help [command]", detail: d.help },
  { term: "tazel install, update, vipkg create, viget push, viget update", detail: d.registry },
];

const commands: DocTopic = {
  "en-US": {
    nav: "Commands",
    title: "Commands · Tazel",
    description:
      "The commands of Tazel, the build system and package manager of Tala, and how they select targets.",
    section: "TAZEL / COMMANDS",
    heading: "The build system and its commands",
    lead: "Tazel reads the project file, finds the sources and starts Talac, talafmt or talalint as separate programs. It compiles nothing itself. The name joins Tala and Bazel.",
    blocks: [
      { kind: "code", code: everyday },
      {
        kind: "terms",
        items: commandTerms({
          check:
            "Starts Talac with --emit=metadata and the compiler options of the project. Writes no executable.",
          build:
            "Builds the executables into the output directory of the build mode, under the name of the target.",
          run: "Builds the executables and runs them; what follows -- goes to the program.",
          test: "Builds and runs the test suites.",
          resolve: "Records the declared dependencies in LOCK.sqlite3.",
          dump: "Writes LOCK.dump, the lockfile as SQL text.",
          fmt: "Formats the sources with talafmt.",
          lint: "Lints the sources with talalint.",
          version: "Prints the version of Tazel.",
          help: "Prints the help, or the help of one command.",
          registry:
            "Commands that need ViGet or a library build; they are refused by name until those exist.",
        }),
      },
      { kind: "heading", text: "Selecting targets" },
      {
        kind: "text",
        text: "check, build, run, test and lint work on everything unless a selection names what to work on. A flag of Tazel takes its value from the next argument and may be written several times. A name that selects nothing is an error.",
      },
      { kind: "code", code: selection },
      { kind: "heading", text: "Passing arguments on" },
      {
        kind: "text",
        text: "Everything after -- goes unread to the program a command starts: tazel lint -- --fix hands --fix to talalint, tazel run -- --port 8080 hands --port 8080 to the program.",
      },
      { kind: "heading", text: "Workspaces and tools" },
      {
        kind: "text",
        text: "At the root of a workspace, build, check, run and test work on every member; fmt and lint on the default members, or on the root when there are none; tazel lint --workspace on every member. Tazel finds a tool through TAZEL_TALAC, TAZEL_TALAFMT or TAZEL_TALALINT, then in its own installation, then on PATH.",
      },
      {
        kind: "note",
        title: "Not implemented yet",
        text: "Library targets, projects with dependencies, test suites, .vipkg creation and every command that needs ViGet are refused by name with exit code 1. check, build and run compile for the host.",
      },
    ],
  },
  "de-DE": {
    nav: "Befehle",
    title: "Befehle · Tazel",
    description:
      "Die Befehle von Tazel, dem Build-System und Paketmanager von Tala, und wie sie Ziele auswählen.",
    section: "TAZEL / BEFEHLE",
    heading: "Das Build-System und seine Befehle",
    lead: "Tazel liest die Projektdatei, findet die Quellen und startet Talac, talafmt oder talalint als eigene Programme. Selbst kompiliert es nichts. Der Name verbindet Tala und Bazel.",
    blocks: [
      { kind: "code", code: everyday },
      {
        kind: "terms",
        items: commandTerms({
          check:
            "Startet Talac mit --emit=metadata und den Compiler-Optionen des Projekts. Schreibt keine ausführbare Datei.",
          build:
            "Baut die ausführbaren Dateien in das Ausgabeverzeichnis des Build-Modus, unter dem Namen des Ziels.",
          run: "Baut die ausführbaren Dateien und startet sie; was nach -- folgt, geht an das Programm.",
          test: "Baut die Testsuiten und führt sie aus.",
          resolve: "Hält die deklarierten Abhängigkeiten in LOCK.sqlite3 fest.",
          dump: "Schreibt LOCK.dump, die Lockdatei als SQL-Text.",
          fmt: "Formatiert die Quellen mit talafmt.",
          lint: "Prüft die Quellen mit talalint.",
          version: "Gibt die Version von Tazel aus.",
          help: "Gibt die Hilfe aus, oder die Hilfe eines Befehls.",
          registry:
            "Befehle, die ViGet oder einen Bibliotheks-Build brauchen; sie werden mit Namen abgelehnt, bis es beides gibt.",
        }),
      },
      { kind: "heading", text: "Ziele auswählen" },
      {
        kind: "text",
        text: "check, build, run, test und lint arbeiten an allem, sofern keine Auswahl etwas benennt. Eine Option von Tazel nimmt ihren Wert aus dem nächsten Argument und darf mehrfach geschrieben werden. Ein Name, der nichts auswählt, ist ein Fehler.",
      },
      { kind: "code", code: selection },
      { kind: "heading", text: "Argumente weiterreichen" },
      {
        kind: "text",
        text: "Alles nach -- geht ungelesen an das Programm, das ein Befehl startet: tazel lint -- --fix reicht --fix an talalint weiter, tazel run -- --port 8080 reicht --port 8080 an das Programm weiter.",
      },
      { kind: "heading", text: "Workspaces und Werkzeuge" },
      {
        kind: "text",
        text: "In der Wurzel eines Workspace arbeiten build, check, run und test an jedem Mitglied; fmt und lint an den Standardmitgliedern oder, wenn es keine gibt, an der Wurzel; tazel lint --workspace an jedem Mitglied. Tazel findet ein Werkzeug über TAZEL_TALAC, TAZEL_TALAFMT oder TAZEL_TALALINT, dann in seiner eigenen Installation, dann über PATH.",
      },
      {
        kind: "note",
        title: "Noch nicht umgesetzt",
        text: "Bibliotheksziele, Projekte mit Abhängigkeiten, Testsuiten, die Erstellung von .vipkg und jeder Befehl, der ViGet braucht, werden mit Namen und Exit-Code 1 abgelehnt. check, build und run kompilieren für den Host.",
      },
    ],
  },
  "ru-RU": {
    nav: "Команды",
    title: "Команды · Tazel",
    description: "Команды Tazel, системы сборки и менеджера пакетов Tala, и как они выбирают цели.",
    section: "TAZEL / КОМАНДЫ",
    heading: "Система сборки и её команды",
    lead: "Tazel читает файл проекта, находит исходники и запускает Talac, talafmt или talalint как отдельные программы. Сам он ничего не компилирует. Название соединяет Tala и Bazel.",
    blocks: [
      { kind: "code", code: everyday },
      {
        kind: "terms",
        items: commandTerms({
          check:
            "Запускает Talac с --emit=metadata и параметрами компилятора из проекта. Исполняемый файл не создаётся.",
          build: "Собирает исполняемые файлы в каталог результатов режима сборки под именем цели.",
          run: "Собирает исполняемые файлы и запускает их; всё после -- передаётся программе.",
          test: "Собирает и запускает наборы тестов.",
          resolve: "Записывает объявленные зависимости в LOCK.sqlite3.",
          dump: "Записывает LOCK.dump — lock-файл в виде SQL-текста.",
          fmt: "Форматирует исходники с помощью talafmt.",
          lint: "Проверяет исходники с помощью talalint.",
          version: "Выводит версию Tazel.",
          help: "Выводит справку или справку по одной команде.",
          registry:
            "Команды, которым нужны ViGet или сборка библиотек; пока их нет, они отклоняются по имени.",
        }),
      },
      { kind: "heading", text: "Выбор целей" },
      {
        kind: "text",
        text: "check, build, run, test и lint работают со всем, если выбор не называет конкретные цели. Параметр Tazel берёт значение из следующего аргумента и может повторяться. Имя, которое ничего не выбирает, — ошибка.",
      },
      { kind: "code", code: selection },
      { kind: "heading", text: "Передача аргументов" },
      {
        kind: "text",
        text: "Всё после -- без разбора передаётся программе, которую запускает команда: tazel lint -- --fix передаёт --fix в talalint, tazel run -- --port 8080 передаёт --port 8080 программе.",
      },
      { kind: "heading", text: "Рабочие пространства и инструменты" },
      {
        kind: "text",
        text: "В корне рабочего пространства build, check, run и test работают с каждым участником; fmt и lint — с участниками по умолчанию, а если их нет, с корнем; tazel lint --workspace — с каждым участником. Инструмент Tazel ищет через TAZEL_TALAC, TAZEL_TALAFMT или TAZEL_TALALINT, затем в своей установке, затем в PATH.",
      },
      {
        kind: "note",
        title: "Пока не реализовано",
        text: "Библиотечные цели, проекты с зависимостями, наборы тестов, создание .vipkg и все команды, которым нужен ViGet, отклоняются по имени с кодом выхода 1. check, build и run компилируют для текущей системы.",
      },
    ],
  },
  "he-IL": {
    nav: "פקודות",
    title: "פקודות · Tazel",
    description: "הפקודות של Tazel, מערכת הבנייה ומנהל החבילות של Tala, ואיך הן בוחרות יעדים.",
    section: "TAZEL / פקודות",
    heading: "מערכת הבנייה והפקודות שלה",
    lead: "Tazel קורא את קובץ הפרויקט, מוצא את קבצי המקור ומפעיל את Talac, ‏talafmt או talalint כתוכניות נפרדות. הוא עצמו אינו מהדר דבר. השם מחבר את Tala ואת Bazel.",
    blocks: [
      { kind: "code", code: everyday },
      {
        kind: "terms",
        items: commandTerms({
          check:
            "מפעיל את Talac עם ‎--emit=metadata ועם אפשרויות המהדר של הפרויקט. אינו כותב קובץ הרצה.",
          build: "בונה את קובצי ההרצה לתיקיית הפלט של מצב הבנייה, בשם היעד.",
          run: "בונה את קובצי ההרצה ומריץ אותם; מה שאחרי ‎-- עובר לתוכנית.",
          test: "בונה ומריץ את חבילות הבדיקה.",
          resolve: "רושם את התלויות המוצהרות ב-LOCK.sqlite3.",
          dump: "כותב את LOCK.dump, קובץ הנעילה כטקסט SQL.",
          fmt: "מעצב את קבצי המקור עם talafmt.",
          lint: "בודק את קבצי המקור עם talalint.",
          version: "מדפיס את גרסת Tazel.",
          help: "מדפיס את העזרה, או את העזרה של פקודה אחת.",
          registry: "פקודות שזקוקות ל-ViGet או לבניית ספרייה; הן נדחות בשמן עד שאלה יהיו קיימים.",
        }),
      },
      { kind: "heading", text: "בחירת יעדים" },
      {
        kind: "text",
        text: "check, ‏build, ‏run, ‏test ו-lint פועלות על הכול, אלא אם בחירה מציינת על מה לפעול. אפשרות של Tazel לוקחת את ערכה מהארגומנט הבא ואפשר לכתוב אותה כמה פעמים. שם שאינו בוחר דבר הוא שגיאה.",
      },
      { kind: "code", code: selection },
      { kind: "heading", text: "העברת ארגומנטים הלאה" },
      {
        kind: "text",
        text: "כל מה שאחרי ‎-- עובר בלי קריאה לתוכנית שהפקודה מפעילה: ‏tazel lint -- --fix מעביר ‎--fix ל-talalint, ו-tazel run -- --port 8080 מעביר ‎--port 8080 לתוכנית.",
      },
      { kind: "heading", text: "סביבות עבודה וכלים" },
      {
        kind: "text",
        text: "בשורש של סביבת עבודה, build, ‏check, ‏run ו-test פועלות על כל חבר; fmt ו-lint על חברי ברירת המחדל, או על השורש כשאין כאלה; ‏tazel lint --workspace על כל חבר. Tazel מוצא כלי דרך TAZEL_TALAC, ‏TAZEL_TALAFMT או TAZEL_TALALINT, אחר כך בהתקנה שלו עצמו, ואחר כך ב-PATH.",
      },
      {
        kind: "note",
        title: "עוד לא מומש",
        text: "יעדי ספרייה, פרויקטים עם תלויות, חבילות בדיקה, יצירת ‎.vipkg וכל פקודה שזקוקה ל-ViGet נדחים בשמם עם קוד יציאה 1. ‏check, ‏build ו-run מהדרים עבור המערכת הנוכחית.",
      },
    ],
  },
};

const projectFile: DocTopic = {
  "en-US": {
    nav: "Project file",
    title: "Project file · Tazel",
    description:
      "The project file of Tazel: its names, the project, compiler and sources blocks, dependencies and workspaces.",
    section: "TAZEL / PROJECT FILE",
    heading: "The project file",
    lead: "A project is described by one Kotlin script that Tazel evaluates itself; no Kotlin installation is needed. The compiler never reads it.",
    blocks: [
      {
        kind: "text",
        text: "The file has one of five names, looked for in this order: BUILD.kts, BUILD.tzl, BUILD.tazel, BUILD and Tazel.build. The first that exists is used; the names are case-sensitive. A command works on the project of the nearest directory, upward, that holds one.",
      },
      { kind: "code", code: minimal },
      {
        kind: "text",
        text: "This compiles every .tala file below Sources/ and writes build/debug/Example (Example.exe on Windows). entry names a class by its namespace; that class provides the parameterless public static void Main(). Neither file names nor directories have to mirror namespaces.",
      },
      { kind: "heading", text: "Compiler settings" },
      {
        kind: "text",
        text: "Tazel writes every setting onto the command line of Talac, the defaults too. optLevel defaults to O0 in a debug build and O3 in a release build. No warning level turns wshadow on, and wshadow with Warnings.NONE is rejected.",
      },
      { kind: "code", code: compiler },
      { kind: "heading", text: "Dependencies" },
      {
        kind: "text",
        text: "A dependency is a package of ViGet written as a publisher, a name and an exact version; feature makes it optional. localDependency names a .vipkg inside the project, and testDependency and localTestDependency serve the test suites only. LOCK.sqlite3 records what is declared.",
      },
      { kind: "code", code: dependencies },
      { kind: "heading", text: "Workspaces" },
      {
        kind: "text",
        text: "Each member is a directory with a project file of its own, written relative to this one. A project that only gathers members needs no sources.",
      },
      { kind: "code", code: workspace },
      {
        kind: "note",
        title: "Host values",
        text: "OS and ARCH are the operating system and architecture Tazel runs on, compared with values such as OperatingSystem.WINDOWS. panic(message) stops the evaluation, and eprint(value) writes to standard error.",
      },
    ],
  },
  "de-DE": {
    nav: "Projektdatei",
    title: "Projektdatei · Tazel",
    description:
      "Die Projektdatei von Tazel: ihre Namen, die Blöcke project, compiler und sources, Abhängigkeiten und Workspaces.",
    section: "TAZEL / PROJEKTDATEI",
    heading: "Die Projektdatei",
    lead: "Ein Projekt wird von einem Kotlin-Skript beschrieben, das Tazel selbst auswertet; eine Kotlin-Installation ist nicht nötig. Der Compiler liest es nie.",
    blocks: [
      {
        kind: "text",
        text: "Die Datei hat einen von fünf Namen, gesucht in dieser Reihenfolge: BUILD.kts, BUILD.tzl, BUILD.tazel, BUILD und Tazel.build. Der erste vorhandene gilt; die Namen unterscheiden Groß- und Kleinschreibung. Ein Befehl arbeitet am Projekt des nächsten Verzeichnisses darüber, das eine solche Datei enthält.",
      },
      { kind: "code", code: minimal },
      {
        kind: "text",
        text: "Das kompiliert jede .tala-Datei unter Sources/ und schreibt build/debug/Example (unter Windows Example.exe). entry benennt eine Klasse mit ihrem Namespace; diese Klasse stellt das parameterlose public static void Main() bereit. Weder Dateinamen noch Verzeichnisse müssen Namespaces abbilden.",
      },
      { kind: "heading", text: "Compiler-Einstellungen" },
      {
        kind: "text",
        text: "Tazel schreibt jede Einstellung auf die Befehlszeile von Talac, auch die Vorgaben. optLevel ist in einem Debug-Build O0 und in einem Release-Build O3. Keine Warnstufe schaltet wshadow ein, und wshadow zusammen mit Warnings.NONE wird abgelehnt.",
      },
      { kind: "code", code: compiler },
      { kind: "heading", text: "Abhängigkeiten" },
      {
        kind: "text",
        text: "Eine Abhängigkeit ist ein Paket aus ViGet, angegeben mit Herausgeber, Name und exakter Version; feature macht sie optional. localDependency benennt eine .vipkg im Projekt, testDependency und localTestDependency dienen nur den Testsuiten. LOCK.sqlite3 hält fest, was deklariert ist.",
      },
      { kind: "code", code: dependencies },
      { kind: "heading", text: "Workspaces" },
      {
        kind: "text",
        text: "Jedes Mitglied ist ein Verzeichnis mit eigener Projektdatei, angegeben relativ zu dieser. Ein Projekt, das nur Mitglieder sammelt, braucht keine Quellen.",
      },
      { kind: "code", code: workspace },
      {
        kind: "note",
        title: "Werte des Hosts",
        text: "OS und ARCH sind Betriebssystem und Architektur, auf denen Tazel läuft, verglichen mit Werten wie OperatingSystem.WINDOWS. panic(message) beendet die Auswertung, eprint(value) schreibt in die Standardfehlerausgabe.",
      },
    ],
  },
  "ru-RU": {
    nav: "Файл проекта",
    title: "Файл проекта · Tazel",
    description:
      "Файл проекта Tazel: его имена, блоки project, compiler и sources, зависимости и рабочие пространства.",
    section: "TAZEL / ФАЙЛ ПРОЕКТА",
    heading: "Файл проекта",
    lead: "Проект описывается одним скриптом на Kotlin, который Tazel выполняет сам; установка Kotlin не нужна. Компилятор его никогда не читает.",
    blocks: [
      {
        kind: "text",
        text: "У файла одно из пяти имён, которые ищутся в таком порядке: BUILD.kts, BUILD.tzl, BUILD.tazel, BUILD и Tazel.build. Используется первое найденное; имена чувствительны к регистру. Команда работает с проектом ближайшего каталога выше, где такой файл есть.",
      },
      { kind: "code", code: minimal },
      {
        kind: "text",
        text: "Так компилируется каждый .tala-файл в Sources/ и записывается build/debug/Example (в Windows — Example.exe). entry называет класс вместе с его пространством имён; этот класс содержит public static void Main() без параметров. Ни имена файлов, ни каталоги не обязаны повторять пространства имён.",
      },
      { kind: "heading", text: "Настройки компилятора" },
      {
        kind: "text",
        text: "Tazel передаёт в командную строку Talac каждую настройку, в том числе значения по умолчанию. optLevel по умолчанию O0 в отладочной сборке и O3 в релизной. Ни один уровень предупреждений не включает wshadow, а wshadow вместе с Warnings.NONE отклоняется.",
      },
      { kind: "code", code: compiler },
      { kind: "heading", text: "Зависимости" },
      {
        kind: "text",
        text: "Зависимость — это пакет из ViGet, записанный издателем, именем и точной версией; feature делает её необязательной. localDependency указывает на .vipkg внутри проекта, а testDependency и localTestDependency служат только наборам тестов. LOCK.sqlite3 записывает то, что объявлено.",
      },
      { kind: "code", code: dependencies },
      { kind: "heading", text: "Рабочие пространства" },
      {
        kind: "text",
        text: "Каждый участник — это каталог со своим файлом проекта, путь к которому записан относительно этого файла. Проекту, который только объединяет участников, исходники не нужны.",
      },
      { kind: "code", code: workspace },
      {
        kind: "note",
        title: "Значения системы",
        text: "OS и ARCH — операционная система и архитектура, на которых работает Tazel; их сравнивают со значениями вроде OperatingSystem.WINDOWS. panic(message) прерывает выполнение, а eprint(value) пишет в стандартный поток ошибок.",
      },
    ],
  },
  "he-IL": {
    nav: "קובץ הפרויקט",
    title: "קובץ הפרויקט · Tazel",
    description:
      "קובץ הפרויקט של Tazel: השמות שלו, הבלוקים project, ‏compiler ו-sources, תלויות וסביבות עבודה.",
    section: "TAZEL / קובץ הפרויקט",
    heading: "קובץ הפרויקט",
    lead: "פרויקט מתואר בסקריפט Kotlin אחד ש-Tazel מריץ בעצמו; אין צורך בהתקנת Kotlin. המהדר אינו קורא אותו לעולם.",
    blocks: [
      {
        kind: "text",
        text: "לקובץ יש אחד מחמישה שמות, שמחפשים אותם בסדר הזה: BUILD.kts, ‏BUILD.tzl, ‏BUILD.tazel, ‏BUILD ו-Tazel.build. הראשון שקיים הוא שקובע; השמות רגישים לאותיות גדולות וקטנות. פקודה פועלת על הפרויקט של התיקייה הקרובה ביותר, כלפי מעלה, שמכילה קובץ כזה.",
      },
      { kind: "code", code: minimal },
      {
        kind: "text",
        text: "כך מהודר כל קובץ ‎.tala שתחת Sources/‎ ונכתב build/debug/Example (ב-Windows‏ Example.exe). ‏entry מציין מחלקה יחד עם מרחב השמות שלה; המחלקה הזו מספקת את public static void Main() ללא פרמטרים. לא שמות הקבצים ולא התיקיות צריכים לשקף את מרחבי השמות.",
      },
      { kind: "heading", text: "הגדרות המהדר" },
      {
        kind: "text",
        text: "Tazel כותב כל הגדרה לשורת הפקודה של Talac, גם את ברירות המחדל. ברירת המחדל של optLevel היא O0 בבניית debug ו-O3 בבניית release. אף רמת אזהרות אינה מפעילה את wshadow, ו-wshadow יחד עם Warnings.NONE נדחה.",
      },
      { kind: "code", code: compiler },
      { kind: "heading", text: "תלויות" },
      {
        kind: "text",
        text: "תלות היא חבילה מ-ViGet שנכתבת עם מפרסם, שם וגרסה מדויקת; feature הופך אותה לאופציונלית. localDependency מציין קובץ ‎.vipkg בתוך הפרויקט, ו-testDependency ו-localTestDependency משרתים רק את חבילות הבדיקה. LOCK.sqlite3 רושם את מה שהוצהר.",
      },
      { kind: "code", code: dependencies },
      { kind: "heading", text: "סביבות עבודה" },
      {
        kind: "text",
        text: "כל חבר הוא תיקייה עם קובץ פרויקט משלה, שנכתבת ביחס לקובץ הזה. פרויקט שרק מאגד חברים אינו צריך קבצי מקור.",
      },
      { kind: "code", code: workspace },
      {
        kind: "note",
        title: "ערכי המערכת",
        text: "OS ו-ARCH הם מערכת ההפעלה והארכיטקטורה ש-Tazel רץ עליהן, ומשווים אותם לערכים כמו OperatingSystem.WINDOWS. ‏panic(message) עוצר את ההרצה, ו-eprint(value) כותב לפלט השגיאות.",
      },
    ],
  },
};

export const tazelRoutes: readonly DocRoute[] = [
  { path: "/docs/commands", topic: commands },
  { path: "/docs/project-file", topic: projectFile },
];
