// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import type { DocRoute, DocTopic } from "./types";

// Commands and values are the same in every language; only the prose is translated.
const compile = `talac Program.tala --entry=Namespace.Program
.\\Program.exe`;
const program = `talac Main.tala Helper.tala --entry=Demo.Program`;
const check = `talac Helper.tala --emit=metadata`;
const warnings = `talac Program.tala --entry=Demo.Program --warnings=all,shadow
talac Program.tala --entry=Demo.Program --warnings=all --warnings=shadow`;
const stages = `talac Main.tala --entry=Demo.Program --emit=xpp
talac Main.xpp --build=xpp --emit=xmm
talac Main.xmm --build=xmm --emit=llvm-ir`;
const record = `talameta 1
compiler 0.6.0
entry Demo.Program
input Sources/Main.tala
input Sources/Helper.tala`;

const optionTerms = (d: {
  version: string;
  help: string;
  entry: string;
  standard: string;
  target: string;
  werror: string;
  warnings: string;
  backend: string;
  opt: string;
  llvm: string;
  passes: string;
  emit: string;
  build: string;
  type: string;
}) => [
  { term: "--version, -v", detail: d.version },
  { term: "--help, -h", detail: d.help },
  { term: "--entry=Namespace.Class", detail: d.entry },
  { term: "--standard=26", detail: d.standard },
  { term: "--target=<triple>, -t<triple>", detail: d.target },
  { term: "--warnings-as-errors=true|false", detail: d.werror },
  { term: "--warnings=none|low|medium|all[,shadow]", detail: d.warnings },
  { term: "--codegen-backend=llvm", detail: d.backend },
  { term: "--opt-level=0|1|2|3|g, -O2", detail: d.opt },
  { term: "--llvm-compiler, --llvm-lto, --llvm-args", detail: d.llvm },
  { term: "--xpp-optimization-passes, --xmm-optimization-passes", detail: d.passes },
  { term: "--emit=…", detail: d.emit },
  { term: "--build=…", detail: d.build },
  { term: "--vipkg-type=executable|staticlib|cdylib|talalib", detail: d.type },
];

const commandLine: DocTopic = {
  "en-US": {
    nav: "Command line",
    title: "Command line · Talac",
    description:
      "The command line of Talac, the Tala compiler: inputs, options, the entry class and warnings.",
    section: "TALAC / COMMAND LINE",
    heading: "The compiler and its command line",
    lead: "Talac is the compiler and nothing else: sources or artifacts go in, one artifact comes out. Projects, dependencies, formatting and linting belong to Tazel, which starts Talac as a separate program.",
    blocks: [
      { kind: "code", code: compile },
      {
        kind: "text",
        text: "The output is written beside the first input, under that input's name. An executable takes the usual extension of the host: .exe on Windows, none elsewhere. Several inputs are one program.",
      },
      { kind: "code", code: program },
      { kind: "heading", text: "How options are written" },
      {
        kind: "text",
        text: "A long option takes its value after =, as in --emit=core. A short option takes it joined or after =: -O2 or -O=2. Not every long option has a short one. -- ends the options; everything after it is an input. Names and values are case-sensitive.",
      },
      {
        kind: "terms",
        items: optionTerms({
          version: "Prints the version of the compiler.",
          help: "Prints the help.",
          entry: "The class whose parameterless public static void Main() starts the program.",
          standard: "The language standard. 26 is the only one and the default.",
          target: "An LLVM target triple. The default is the target of the host.",
          werror: "Turns warnings into errors. Default false.",
          warnings: "The warning level, default medium, and the shadow warning.",
          backend: "The code generator. LLVM is the only one.",
          opt: "The optimization level, default 2.",
          llvm: "The LLVM compilation mode, link-time optimization and arguments handed to LLVM.",
          passes: "Turn the optimization passes of the Xpp and Xmm stages on or off. Default true.",
          emit: "What to write; see Outputs.",
          build: "What the inputs are; see Outputs.",
          type: "The kind of package to write. Default executable.",
        }),
      },
      { kind: "heading", text: "The entry" },
      {
        kind: "text",
        text: "--entry is required when anything is built from Tala sources, and it cannot be written for a library. An artifact input already carries its entry. A check builds nothing, so one source can be checked without an entry; several sources are one program and still need it.",
      },
      { kind: "code", code: check },
      { kind: "heading", text: "Warnings" },
      {
        kind: "text",
        text: "--warnings sets a level and, separately, the shadow warning, which reports a local that hides a name of an outer scope. No level turns shadow on, all included; it is asked for by name. A command line holds at most one level and one shadow, and none cannot be combined with shadow.",
      },
      { kind: "code", code: warnings },
      {
        kind: "note",
        title: "Not implemented yet",
        text: "An option the compiler reads but cannot carry out is refused by name with exit code 2: the library package types and --header, --llvm-compiler=orc, link-time optimization, --llvm-args, LLVM IR or bitcode as input, and --warnings=shadow, whose warning is not in the frontend yet.",
      },
    ],
  },
  "de-DE": {
    nav: "Befehlszeile",
    title: "Befehlszeile · Talac",
    description:
      "Die Befehlszeile von Talac, dem Tala-Compiler: Eingaben, Optionen, die Einstiegsklasse und Warnungen.",
    section: "TALAC / BEFEHLSZEILE",
    heading: "Der Compiler und seine Befehlszeile",
    lead: "Talac ist der Compiler und nichts sonst: Quellen oder Artefakte gehen hinein, ein Artefakt kommt heraus. Projekte, Abhängigkeiten, Formatierung und Linting gehören zu Tazel, das Talac als eigenes Programm startet.",
    blocks: [
      { kind: "code", code: compile },
      {
        kind: "text",
        text: "Die Ausgabe landet neben der ersten Eingabe und trägt deren Namen. Eine ausführbare Datei bekommt die übliche Endung des Hosts: .exe unter Windows, sonst keine. Mehrere Eingaben sind ein Programm.",
      },
      { kind: "code", code: program },
      { kind: "heading", text: "Wie Optionen geschrieben werden" },
      {
        kind: "text",
        text: "Eine lange Option nimmt ihren Wert nach =, etwa --emit=core. Eine kurze Option nimmt ihn direkt angehängt oder nach =: -O2 oder -O=2. Nicht jede lange Option hat eine kurze. -- beendet die Optionen; alles danach ist eine Eingabe. Namen und Werte unterscheiden Groß- und Kleinschreibung.",
      },
      {
        kind: "terms",
        items: optionTerms({
          version: "Gibt die Version des Compilers aus.",
          help: "Gibt die Hilfe aus.",
          entry: "Die Klasse, deren parameterloses public static void Main() das Programm startet.",
          standard: "Der Sprachstandard. 26 ist der einzige und die Vorgabe.",
          target: "Ein LLVM-Target-Triple. Vorgabe ist das Ziel des Hosts.",
          werror: "Macht Warnungen zu Fehlern. Vorgabe false.",
          warnings: "Die Warnstufe, Vorgabe medium, und die Shadow-Warnung.",
          backend: "Der Codegenerator. LLVM ist der einzige.",
          opt: "Die Optimierungsstufe, Vorgabe 2.",
          llvm: "Der LLVM-Kompilierungsmodus, Link-Time-Optimierung und an LLVM übergebene Argumente.",
          passes:
            "Schaltet die Optimierungsdurchläufe der Stufen Xpp und Xmm ein oder aus. Vorgabe true.",
          emit: "Was geschrieben wird; siehe Ausgaben.",
          build: "Was die Eingaben sind; siehe Ausgaben.",
          type: "Die Art des Pakets. Vorgabe executable.",
        }),
      },
      { kind: "heading", text: "Der Einstieg" },
      {
        kind: "text",
        text: "--entry ist nötig, sobald aus Tala-Quellen etwas gebaut wird, und darf für eine Bibliothek nicht angegeben werden. Ein Artefakt bringt seinen Einstieg schon mit. Eine Prüfung baut nichts, daher kann eine einzelne Quelle ohne Einstieg geprüft werden; mehrere Quellen sind ein Programm und brauchen ihn weiterhin.",
      },
      { kind: "code", code: check },
      { kind: "heading", text: "Warnungen" },
      {
        kind: "text",
        text: "--warnings setzt eine Stufe und getrennt davon die Shadow-Warnung, die eine lokale Variable meldet, die einen Namen eines äußeren Bereichs verdeckt. Keine Stufe schaltet shadow ein, auch all nicht; sie wird beim Namen verlangt. Eine Befehlszeile enthält höchstens eine Stufe und ein shadow, und none lässt sich nicht mit shadow kombinieren.",
      },
      { kind: "code", code: warnings },
      {
        kind: "note",
        title: "Noch nicht umgesetzt",
        text: "Eine Option, die der Compiler liest, aber nicht ausführen kann, wird mit Namen und Exit-Code 2 abgelehnt: die Bibliothekspaket-Arten und --header, --llvm-compiler=orc, Link-Time-Optimierung, --llvm-args, LLVM-IR oder Bitcode als Eingabe sowie --warnings=shadow, dessen Warnung noch nicht im Frontend ist.",
      },
    ],
  },
  "ru-RU": {
    nav: "Командная строка",
    title: "Командная строка · Talac",
    description:
      "Командная строка Talac, компилятора Tala: входные файлы, параметры, класс точки входа и предупреждения.",
    section: "TALAC / КОМАНДНАЯ СТРОКА",
    heading: "Компилятор и его командная строка",
    lead: "Talac — это компилятор и ничего больше: на вход подаются исходники или артефакты, на выходе получается один артефакт. Проекты, зависимости, форматирование и линтинг относятся к Tazel, который запускает Talac как отдельную программу.",
    blocks: [
      { kind: "code", code: compile },
      {
        kind: "text",
        text: "Результат записывается рядом с первым входным файлом под его именем. Исполняемый файл получает обычное для системы расширение: .exe в Windows, без расширения в остальных системах. Несколько входных файлов образуют одну программу.",
      },
      { kind: "code", code: program },
      { kind: "heading", text: "Как записываются параметры" },
      {
        kind: "text",
        text: "Длинный параметр принимает значение после =, например --emit=core. Короткий принимает его слитно или после =: -O2 или -O=2. Не у каждого длинного параметра есть короткий. -- завершает параметры; всё после него — входные файлы. Имена и значения чувствительны к регистру.",
      },
      {
        kind: "terms",
        items: optionTerms({
          version: "Выводит версию компилятора.",
          help: "Выводит справку.",
          entry: "Класс, чей метод public static void Main() без параметров запускает программу.",
          standard: "Стандарт языка. 26 — единственный и значение по умолчанию.",
          target: "Целевая тройка LLVM. По умолчанию — платформа системы.",
          werror: "Превращает предупреждения в ошибки. По умолчанию false.",
          warnings: "Уровень предупреждений, по умолчанию medium, и предупреждение shadow.",
          backend: "Генератор кода. LLVM — единственный.",
          opt: "Уровень оптимизации, по умолчанию 2.",
          llvm: "Режим компиляции LLVM, оптимизация при компоновке и аргументы, передаваемые LLVM.",
          passes: "Включают или выключают проходы оптимизации стадий Xpp и Xmm. По умолчанию true.",
          emit: "Что записать; см. «Результаты».",
          build: "Что подаётся на вход; см. «Результаты».",
          type: "Вид создаваемого пакета. По умолчанию executable.",
        }),
      },
      { kind: "heading", text: "Точка входа" },
      {
        kind: "text",
        text: "--entry обязателен, когда что-либо собирается из исходников Tala, и его нельзя указывать для библиотеки. Артефакт уже содержит свою точку входа. Проверка ничего не собирает, поэтому один исходник можно проверить без точки входа; несколько исходников — это одна программа, и им она по-прежнему нужна.",
      },
      { kind: "code", code: check },
      { kind: "heading", text: "Предупреждения" },
      {
        kind: "text",
        text: "--warnings задаёт уровень и отдельно предупреждение shadow, которое сообщает о локальной переменной, скрывающей имя внешней области. Ни один уровень, включая all, не включает shadow; его запрашивают по имени. В командной строке не больше одного уровня и одного shadow, а none нельзя сочетать с shadow.",
      },
      { kind: "code", code: warnings },
      {
        kind: "note",
        title: "Пока не реализовано",
        text: "Параметр, который компилятор читает, но не может выполнить, отклоняется по имени с кодом выхода 2: виды библиотечных пакетов и --header, --llvm-compiler=orc, оптимизация при компоновке, --llvm-args, LLVM IR или биткод на входе, а также --warnings=shadow, чьего предупреждения во фронтенде ещё нет.",
      },
    ],
  },
  "he-IL": {
    nav: "שורת הפקודה",
    title: "שורת הפקודה · Talac",
    description: "שורת הפקודה של Talac, המהדר של Tala: קלטים, אפשרויות, מחלקת הכניסה ואזהרות.",
    section: "TALAC / שורת הפקודה",
    heading: "המהדר ושורת הפקודה שלו",
    lead: "Talac הוא המהדר ותו לא: קבצי מקור או תוצרים נכנסים, ותוצר אחד יוצא. פרויקטים, תלויות, עיצוב קוד ובדיקות lint שייכים ל-Tazel, שמפעיל את Talac כתוכנית נפרדת.",
    blocks: [
      { kind: "code", code: compile },
      {
        kind: "text",
        text: "הפלט נכתב ליד הקלט הראשון, בשמו. קובץ הרצה מקבל את הסיומת הרגילה של המערכת: ‎.exe ב-Windows, ובלי סיומת בשאר המערכות. כמה קלטים הם תוכנית אחת.",
      },
      { kind: "code", code: program },
      { kind: "heading", text: "איך כותבים אפשרויות" },
      {
        kind: "text",
        text: "אפשרות ארוכה מקבלת את ערכה אחרי =, למשל ‎--emit=core. אפשרות קצרה מקבלת אותו צמוד או אחרי =: ‎-O2 או ‎-O=2. לא לכל אפשרות ארוכה יש קצרה. ‎-- מסיים את האפשרויות; כל מה שאחריו הוא קלט. שמות וערכים רגישים לאותיות גדולות וקטנות.",
      },
      {
        kind: "terms",
        items: optionTerms({
          version: "מדפיס את גרסת המהדר.",
          help: "מדפיס את העזרה.",
          entry: "המחלקה שה-public static void Main() שלה, ללא פרמטרים, מתחיל את התוכנית.",
          standard: "תקן השפה. 26 הוא היחיד וברירת המחדל.",
          target: "משולש מטרה של LLVM. ברירת המחדל היא המטרה של המערכת.",
          werror: "הופך אזהרות לשגיאות. ברירת מחדל false.",
          warnings: "רמת האזהרות, ברירת מחדל medium, ואזהרת shadow.",
          backend: "מחולל הקוד. LLVM הוא היחיד.",
          opt: "רמת האופטימיזציה, ברירת מחדל 2.",
          llvm: "מצב ההידור של LLVM, אופטימיזציה בזמן קישור וארגומנטים שעוברים ל-LLVM.",
          passes: "מפעילים או מכבים את מעברי האופטימיזציה של שלבי Xpp ו-Xmm. ברירת מחדל true.",
          emit: "מה לכתוב; ראו פלטים.",
          build: "מה הקלטים; ראו פלטים.",
          type: "סוג החבילה. ברירת מחדל executable.",
        }),
      },
      { kind: "heading", text: "נקודת הכניסה" },
      {
        kind: "text",
        text: "‎--entry נדרש בכל בנייה מקבצי Tala, ואי אפשר לכתוב אותו עבור ספרייה. תוצר כבר נושא את נקודת הכניסה שלו. בדיקה אינה בונה דבר, ולכן אפשר לבדוק קובץ מקור אחד בלי נקודת כניסה; כמה קבצים הם תוכנית אחת ועדיין זקוקים לה.",
      },
      { kind: "code", code: check },
      { kind: "heading", text: "אזהרות" },
      {
        kind: "text",
        text: "‎--warnings קובע רמה, ובנפרד את אזהרת shadow, שמדווחת על משתנה מקומי שמסתיר שם מתחום חיצוני. אף רמה, גם לא all, אינה מפעילה את shadow; מבקשים אותה בשמה. בשורת פקודה יש לכל היותר רמה אחת ו-shadow אחד, ואי אפשר לשלב none עם shadow.",
      },
      { kind: "code", code: warnings },
      {
        kind: "note",
        title: "עוד לא מומש",
        text: "אפשרות שהמהדר קורא אבל אינו יכול לבצע נדחית בשמה עם קוד יציאה 2: סוגי חבילות הספרייה ו-‎--header, ‏‎--llvm-compiler=orc, אופטימיזציה בזמן קישור, ‎--llvm-args, ‏LLVM IR או bitcode כקלט, ו-‎--warnings=shadow, שהאזהרה שלו עוד אינה בחזית המהדר.",
      },
    ],
  },
};

const outputTerms = (
  d: Record<"executable" | "object" | "stages" | "assembly" | "llvm" | "metadata", string>,
) => [
  { term: "--emit=executable", detail: d.executable },
  { term: "--emit=object", detail: d.object },
  { term: "--emit=core | xpp | xmm", detail: d.stages },
  { term: "--emit=assembly", detail: d.assembly },
  { term: "--emit=llvm-ir | llvm-bitcode", detail: d.llvm },
  { term: "--emit=metadata", detail: d.metadata },
];

const outputs: DocTopic = {
  "en-US": {
    nav: "Outputs",
    title: "Outputs · Talac",
    description:
      "What Talac reads and writes: --build and --emit, the intermediate stages, and the record of a check.",
    section: "TALAC / OUTPUTS",
    heading: "Inputs and outputs",
    lead: "--build says what the inputs are and --emit says what to write. The default is to build an executable from Tala sources. The output cannot be an earlier stage than the input.",
    blocks: [
      {
        kind: "terms",
        items: outputTerms({
          executable: "A program of the host. The default.",
          object: "<name>.o, an object file.",
          stages: "The verified artifact of that intermediate stage.",
          assembly: "The assembly LLVM generates.",
          llvm: "<name>.ll or <name>.bc.",
          metadata: "<name>.talameta: the program is checked and no code is generated.",
        }),
      },
      { kind: "heading", text: "Starting from a stage" },
      {
        kind: "text",
        text: "--build=tala, object, core, xpp or xmm names the kind of the inputs. Each artifact is checked by the verifier of its stage before the pipeline continues. CorePrep is an internal stage: it has no --emit value and no file extension.",
      },
      { kind: "code", code: stages },
      { kind: "heading", text: "The record of a check" },
      {
        kind: "text",
        text: "--emit=metadata runs every verifier and generates no code. A program that is rejected leaves no file. An accepted one leaves a UTF-8 text with one field per line: the format, the compiler, the entry when one was given, and every input as it was written, with /.",
      },
      { kind: "code", code: record },
    ],
  },
  "de-DE": {
    nav: "Ausgaben",
    title: "Ausgaben · Talac",
    description:
      "Was Talac liest und schreibt: --build und --emit, die Zwischenstufen und der Nachweis einer Prüfung.",
    section: "TALAC / AUSGABEN",
    heading: "Eingaben und Ausgaben",
    lead: "--build sagt, was die Eingaben sind, und --emit, was geschrieben wird. Vorgabe ist eine ausführbare Datei aus Tala-Quellen. Die Ausgabe kann keine frühere Stufe sein als die Eingabe.",
    blocks: [
      {
        kind: "terms",
        items: outputTerms({
          executable: "Ein Programm des Hosts. Die Vorgabe.",
          object: "<name>.o, eine Objektdatei.",
          stages: "Das geprüfte Artefakt dieser Zwischenstufe.",
          assembly: "Der Assembler-Code, den LLVM erzeugt.",
          llvm: "<name>.ll oder <name>.bc.",
          metadata: "<name>.talameta: Das Programm wird geprüft, es wird kein Code erzeugt.",
        }),
      },
      { kind: "heading", text: "Von einer Stufe aus beginnen" },
      {
        kind: "text",
        text: "--build=tala, object, core, xpp oder xmm benennt die Art der Eingaben. Jedes Artefakt wird vom Prüfer seiner Stufe kontrolliert, bevor die Pipeline weiterläuft. CorePrep ist eine interne Stufe: Sie hat keinen --emit-Wert und keine Dateiendung.",
      },
      { kind: "code", code: stages },
      { kind: "heading", text: "Der Nachweis einer Prüfung" },
      {
        kind: "text",
        text: "--emit=metadata führt jeden Prüfer aus und erzeugt keinen Code. Ein abgelehntes Programm hinterlässt keine Datei. Ein angenommenes hinterlässt UTF-8-Text mit einem Feld pro Zeile: das Format, den Compiler, den Einstieg, falls einer angegeben war, und jede Eingabe so, wie sie geschrieben wurde, mit /.",
      },
      { kind: "code", code: record },
    ],
  },
  "ru-RU": {
    nav: "Результаты",
    title: "Результаты · Talac",
    description:
      "Что Talac читает и записывает: --build и --emit, промежуточные стадии и запись о проверке.",
    section: "TALAC / РЕЗУЛЬТАТЫ",
    heading: "Входные данные и результаты",
    lead: "--build говорит, что подаётся на вход, а --emit — что записать. По умолчанию из исходников Tala собирается исполняемый файл. Результат не может быть более ранней стадией, чем вход.",
    blocks: [
      {
        kind: "terms",
        items: outputTerms({
          executable: "Программа для системы. Значение по умолчанию.",
          object: "<name>.o, объектный файл.",
          stages: "Проверенный артефакт этой промежуточной стадии.",
          assembly: "Ассемблерный код, который создаёт LLVM.",
          llvm: "<name>.ll или <name>.bc.",
          metadata: "<name>.talameta: программа проверяется, код не создаётся.",
        }),
      },
      { kind: "heading", text: "Начать с промежуточной стадии" },
      {
        kind: "text",
        text: "--build=tala, object, core, xpp или xmm задаёт вид входных файлов. Каждый артефакт проверяется верификатором своей стадии, прежде чем конвейер продолжит работу. CorePrep — внутренняя стадия: у неё нет значения --emit и расширения файла.",
      },
      { kind: "code", code: stages },
      { kind: "heading", text: "Запись о проверке" },
      {
        kind: "text",
        text: "--emit=metadata запускает все верификаторы и не создаёт кода. Отклонённая программа не оставляет файла. Принятая оставляет текст в UTF-8, по полю на строку: формат, компилятор, точку входа, если она указана, и каждый входной файл так, как он был записан, с /.",
      },
      { kind: "code", code: record },
    ],
  },
  "he-IL": {
    nav: "פלטים",
    title: "פלטים · Talac",
    description: "מה Talac קורא וכותב: ‎--build ו-‎--emit, שלבי הביניים והרשומה של בדיקה.",
    section: "TALAC / פלטים",
    heading: "קלטים ופלטים",
    lead: "‎--build אומר מה הקלטים, ו-‎--emit אומר מה לכתוב. ברירת המחדל היא לבנות קובץ הרצה מקבצי Tala. הפלט אינו יכול להיות שלב מוקדם יותר מהקלט.",
    blocks: [
      {
        kind: "terms",
        items: outputTerms({
          executable: "תוכנית של המערכת. ברירת המחדל.",
          object: "‏<name>.o, קובץ אובייקט.",
          stages: "התוצר המאומת של שלב הביניים הזה.",
          assembly: "קוד האסמבלי ש-LLVM מייצר.",
          llvm: "‏<name>.ll או <name>.bc.",
          metadata: "‏<name>.talameta: התוכנית נבדקת ולא נוצר קוד.",
        }),
      },
      { kind: "heading", text: "להתחיל משלב ביניים" },
      {
        kind: "text",
        text: "‎--build=tala, object, core, xpp או xmm מציין את סוג הקלטים. כל תוצר נבדק על ידי המאמת של השלב שלו לפני שהצינור ממשיך. CorePrep הוא שלב פנימי: אין לו ערך ‎--emit ואין לו סיומת קובץ.",
      },
      { kind: "code", code: stages },
      { kind: "heading", text: "הרשומה של בדיקה" },
      {
        kind: "text",
        text: "‎--emit=metadata מריץ כל מאמת ואינו מייצר קוד. תוכנית שנדחתה אינה משאירה קובץ. תוכנית שהתקבלה משאירה טקסט UTF-8 עם שדה אחד בכל שורה: הפורמט, המהדר, נקודת הכניסה אם ניתנה, וכל קלט כפי שנכתב, עם /.",
      },
      { kind: "code", code: record },
    ],
  },
};

export const talacRoutes: readonly DocRoute[] = [
  { path: "/docs/command-line", topic: commandLine },
  { path: "/docs/outputs", topic: outputs },
];
