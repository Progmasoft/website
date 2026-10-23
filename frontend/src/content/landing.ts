// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import type { Locale } from "../locales";
import type { Site } from "../site";
import { talafmtLanding } from "./talafmt.ts";
import { talalintLanding } from "./talalint.ts";

/** One tab of a "Why" section: a strength, a sentence about it and a sample that shows it. */
export type WhyTab = { label: string; caption: string; file: string; code: string };

/** The first page of a site in one language. */
export type LandingText = {
  title: string;
  description: string;
  headline: string;
  lead: string;
  primary: { label: string; to: string };
  secondary: { label: string; to: string };
  whyHeading: string;
  tabs: readonly WhyTab[];
  nextHeading: string;
  next: readonly { label: string; href: string }[];
  copy: string;
  copied: string;
};

// The Tala samples are the programs of Examples/ in the compiler repository, from the namespace line on; a test
// compares them. Each sample on these pages was built and run with talac 0.6.0, and the terminal samples are
// what it printed.
export const helloWorld = `namespace Examples.HelloWorld;

public class HelloWorld {
    public static void Main() {
        String language = "Tala";
        Console.Println("Hello from " + language + "!");
    }
}`;

export const primeNumbers = `namespace Examples.PrimeNumbers;

public class PrimeNumbers {
    private static bool IsPrime(int candidate) {
        if (candidate < 2) {
            return false;
        }

        int divisor = 2;
        while (divisor * divisor <= candidate) {
            if (candidate % divisor == 0) {
                return false;
            }
            divisor++;
        }
        return true;
    }

    public static void Main() {
        int candidate = 2;
        while (candidate <= 50) {
            if (IsPrime(candidate)) {
                Console.Println(candidate);
            }
            candidate++;
        }
    }
}`;

export const gcd = `namespace Examples.GCD;

public class GCD {
    -- Euclid's algorithm is a compact example of loop-carried state.
    public static int Compute(int left, int right) {
        int a = left;
        int b = right;
        while (b \\= 0) {
            int remainder = a % b;
            a = b;
            b = remainder;
        }
        return a;
    }

    public static void Main() {
        Console.Printfn("gcd(1071, 462) = %d", Compute(1071, 462));
    }
}`;

// Not an example of the compiler repository: the smallest program that shows an argument evaluated by need.
export const lazyArguments = `namespace Examples.Lazy;

public class Lazy {
    -- An argument is evaluated when the body needs it, and only then.
    public static int Choose(bool first, int left, int right) {
        if (first) {
            return left;
        }
        return right;
    }

    public static void Main() {
        int zero = 0;
        -- The second argument would divide by zero; it is never needed.
        Console.Println(Choose(true, 42, 1 / zero));
    }
}`;

const gcdIr = `$ talac GCD.tala --entry=Examples.GCD.GCD --emit=llvm-ir -O2
talac: wrote 'GCD.ll' from verified Core through CorePrep, Xpp, Xmm and LLVM

define i64 @Examples.GCD.Compute.2(i64 %0, i64 %1) local_unnamed_addr #0 {
block.0:
  %not.equal.not7 = icmp eq i64 %1, 0
  br i1 %not.equal.not7, label %block.3, label %block.5

block.3:                                          ; preds = %block.5, %block.0
  %r3.0.lcssa = phi i64 [ %0, %block.0 ], [ %r4.08, %block.5 ]
  ret i64 %r3.0.lcssa

block.5:                                          ; preds = %block.0, %block.5
  %r3.09 = phi i64 [ %r4.08, %block.5 ], [ %0, %block.0 ]
  %r4.08 = phi i64 [ %rem, %block.5 ], [ %1, %block.0 ]
  %2 = icmp eq i64 %r3.09, -9223372036854775808
  %3 = icmp eq i64 %r4.08, -1
  %quotient.wraps = and i1 %3, %2
  %divisor = select i1 %quotient.wraps, i64 1, i64 %r4.08
  %rem = srem i64 %r3.09, %divisor
  %not.equal.not = icmp eq i64 %rem, 0
  br i1 %not.equal.not, label %block.3, label %block.5
}`;

const talacOneCommand = `$ talac GCD.tala --entry=Examples.GCD.GCD
talac: linked native executable 'GCD.exe'
$ .\\GCD.exe
gcd(1071, 462) = 21`;
const talacCheck = `$ talac GCD.tala --entry=Examples.GCD.GCD --emit=metadata
talac: compiler artifact 'GCD.tala' is valid through its requested pipeline boundary
talac: wrote 'GCD.talameta'
$ cat GCD.talameta
talameta 1
compiler 0.6.0
entry Examples.GCD.GCD
input GCD.tala`;
const talacStages = `$ talac GCD.tala --entry=Examples.GCD.GCD --emit=core
talac: wrote 'GCD.core'
$ talac GCD.tala --entry=Examples.GCD.GCD --emit=xpp
talac: wrote verified Xpp artifact 'GCD.xpp'
$ talac GCD.tala --entry=Examples.GCD.GCD --emit=xmm
talac: wrote verified Xmm artifact 'GCD.xmm'
$ talac GCD.tala --entry=Examples.GCD.GCD --emit=llvm-ir
talac: wrote 'GCD.ll' from verified Core through CorePrep, Xpp, Xmm and LLVM`;
const talacDiagnostic = `$ talac Broken.tala --entry=Demo.Program
Broken.tala:5:9: TAT0002: binding initializer has the wrong type
talac: frontend: Broken.tala:5:9: TAT0002: binding initializer has the wrong type

-- Broken.tala, line 5:
--         int count = "three";`;

const tazelProject = `project {
  name = "Example"
  version = "0.1.0"
}

compiler {
  buildMode = BuildMode.RELEASE
  warnings = Warnings.ALL
}

sources {
  executable {
    entry = "Example.Program"
  }
}`;
const tazelCommands = `tazel check
tazel build
tazel run -- --port 8080
tazel fmt -- --check
tazel lint -- --fix`;
const tazelTargets = `tazel build --vipkg Server
tazel build -e Client -e Admin
tazel lint --workspace -- --fix`;
const tazelGraph = `$ tazel lock graph
Demo
├── Publisher.Json 1.1.0 [by feature Json]
├── Publisher.Name 1.0.0
├── Local.vipkg (local)
└── [test]
    └── Publisher.Name 2.0.0`;
const tazelHints = `$ tazel biuld
error: 'biuld' is not a command of tazel; write tazel help for the commands
 hint: did you mean tazel build? So close the keys almost had it.`;
const languageTazel = `${tazelProject}

// tazel build
// tazel run`;

type TabWords<K extends string> = Record<K, { label: string; caption: string }>;

function languageTabs(
  words: TabWords<"simple" | "loops" | "lazy" | "inspect" | "tazel">,
): WhyTab[] {
  return [
    { ...words.simple, file: "HelloWorld.tala", code: helloWorld },
    { ...words.loops, file: "PrimeNumbers.tala", code: primeNumbers },
    { ...words.lazy, file: "Lazy.tala", code: lazyArguments },
    { ...words.inspect, file: "terminal", code: gcdIr },
    { ...words.tazel, file: "BUILD.kts", code: languageTazel },
  ];
}

function talacTabs(
  words: TabWords<"one" | "check" | "stages" | "native" | "diagnostics">,
): WhyTab[] {
  return [
    { ...words.one, file: "terminal", code: talacOneCommand },
    { ...words.check, file: "terminal", code: talacCheck },
    { ...words.stages, file: "terminal", code: talacStages },
    { ...words.native, file: "terminal", code: gcdIr },
    { ...words.diagnostics, file: "terminal", code: talacDiagnostic },
  ];
}

function tazelTabs(
  words: TabWords<"project" | "commands" | "targets" | "graph" | "hints">,
): WhyTab[] {
  return [
    { ...words.project, file: "BUILD.kts", code: tazelProject },
    { ...words.commands, file: "terminal", code: tazelCommands },
    { ...words.targets, file: "terminal", code: tazelTargets },
    { ...words.graph, file: "terminal", code: tazelGraph },
    { ...words.hints, file: "terminal", code: tazelHints },
  ];
}

const repository = "https://github.com/Progmasoft/tala";
const tazelRepository = "https://github.com/Progmasoft/tazel";

export const landing: Record<Site, Record<Locale, LandingText>> = {
  language: {
    "en-US": {
      title: "Tala — Make the whole program understandable",
      description:
        "Meet Tala: a native programming language built around readable source, explicit ownership, and an inspectable compiler pipeline.",
      headline: "Make the whole program understandable.",
      lead: "Tala is a native language with readable source, explicit ownership and a compiler whose every stage you can look at.",
      primary: { label: "Get started", to: "/docs/getting-started" },
      secondary: { label: "Read the overview", to: "/docs/overview" },
      whyHeading: "Why Tala?",
      tabs: languageTabs({
        simple: {
          label: "Simple",
          caption: "A class holds the entry point, and the first program says what it does.",
        },
        loops: {
          label: "Loops and conditions",
          caption: "while, if and return read the way they run; \\= means not equal.",
        },
        lazy: {
          label: "Lazy by default",
          caption:
            "An argument is evaluated when the body needs it. This program prints 42 and never divides by zero.",
        },
        inspect: {
          label: "A compiler you can inspect",
          caption:
            "Talac shows what it made of your code: here, the LLVM IR of the gcd loop of an example program.",
        },
        tazel: {
          label: "Builds with Tazel",
          caption: "A Kotlin project file and one command for each job.",
        },
      }),
      nextHeading: "Next",
      next: [
        { label: "Syntax", href: "/docs/syntax" },
        { label: "Specification", href: `${repository}/tree/main/Spec` },
        { label: "Examples", href: `${repository}/tree/main/Examples` },
      ],
      copy: "Copy",
      copied: "Copied",
    },
    "de-DE": {
      title: "Tala — Das ganze Programm verstehen",
      description:
        "Tala ist eine native Programmiersprache mit lesbarem Quellcode, explizitem Ownership und nachvollziehbarer Compiler-Pipeline.",
      headline: "Das ganze Programm verstehen.",
      lead: "Tala ist eine native Sprache mit lesbarem Quellcode, explizitem Ownership und einem Compiler, dessen Stufen man alle einsehen kann.",
      primary: { label: "Erste Schritte", to: "/docs/getting-started" },
      secondary: { label: "Zum Überblick", to: "/docs/overview" },
      whyHeading: "Warum Tala?",
      tabs: languageTabs({
        simple: {
          label: "Einfach",
          caption:
            "Eine Klasse enthält den Einstiegspunkt, und das erste Programm sagt, was es tut.",
        },
        loops: {
          label: "Schleifen und Bedingungen",
          caption: "while, if und return lesen sich, wie sie laufen; \\= heißt ungleich.",
        },
        lazy: {
          label: "Standardmäßig lazy",
          caption:
            "Ein Argument wird ausgewertet, wenn der Rumpf es braucht. Dieses Programm gibt 42 aus und teilt nie durch null.",
        },
        inspect: {
          label: "Ein Compiler zum Hineinsehen",
          caption:
            "Talac zeigt, was er aus Ihrem Code gemacht hat: hier das LLVM-IR der gcd-Schleife eines Beispielprogramms.",
        },
        tazel: {
          label: "Bauen mit Tazel",
          caption: "Eine Projektdatei in Kotlin und ein Befehl für jede Aufgabe.",
        },
      }),
      nextHeading: "Weiter",
      next: [
        { label: "Syntax", href: "/docs/syntax" },
        { label: "Spezifikation", href: `${repository}/tree/main/Spec` },
        { label: "Beispiele", href: `${repository}/tree/main/Examples` },
      ],
      copy: "Kopieren",
      copied: "Kopiert",
    },
    "ru-RU": {
      title: "Tala — Сделать понятной всю программу",
      description:
        "Tala — нативный язык программирования с читаемым исходным кодом, явным владением и прозрачным конвейером компилятора.",
      headline: "Сделать понятной всю программу.",
      lead: "Tala — нативный язык с читаемым кодом, явным владением и компилятором, каждую стадию которого можно увидеть.",
      primary: { label: "Начать", to: "/docs/getting-started" },
      secondary: { label: "Обзор языка", to: "/docs/overview" },
      whyHeading: "Почему Tala?",
      tabs: languageTabs({
        simple: {
          label: "Просто",
          caption: "Точка входа — в классе, а первая программа говорит, что делает.",
        },
        loops: {
          label: "Циклы и условия",
          caption: "while, if и return читаются так, как выполняются; \\= означает «не равно».",
        },
        lazy: {
          label: "Ленивый по умолчанию",
          caption:
            "Аргумент вычисляется, когда он нужен телу. Эта программа печатает 42 и никогда не делит на ноль.",
        },
        inspect: {
          label: "Компилятор, который видно",
          caption:
            "Talac показывает, во что он превратил код: здесь LLVM IR цикла gcd из программы-примера.",
        },
        tazel: {
          label: "Сборка с Tazel",
          caption: "Файл проекта на Kotlin и одна команда на каждую задачу.",
        },
      }),
      nextHeading: "Дальше",
      next: [
        { label: "Синтаксис", href: "/docs/syntax" },
        { label: "Спецификация", href: `${repository}/tree/main/Spec` },
        { label: "Примеры", href: `${repository}/tree/main/Examples` },
      ],
      copy: "Копировать",
      copied: "Скопировано",
    },
    "he-IL": {
      title: "Tala — להפוך את התוכנית כולה למובנת",
      description:
        "הכירו את Tala: שפת תכנות שמהודרת לקוד מכונה והבנויה סביב קוד מקור קריא, בעלות מפורשת ותהליך הידור שאפשר לבחון.",
      headline: "להפוך את התוכנית כולה למובנת.",
      lead: "Tala היא שפה נייטיב עם קוד קריא, בעלות מפורשת ומהדר שאפשר לראות כל שלב שלו.",
      primary: { label: "צעדים ראשונים", to: "/docs/getting-started" },
      secondary: { label: "לסקירה", to: "/docs/overview" },
      whyHeading: "למה Tala?",
      tabs: languageTabs({
        simple: {
          label: "פשוטה",
          caption: "מחלקה מחזיקה את נקודת הכניסה, והתוכנית הראשונה אומרת מה היא עושה.",
        },
        loops: {
          label: "לולאות ותנאים",
          caption: "‏while, ‏if ו-return נקראים כפי שהם רצים; ‎\\= פירושו שונה.",
        },
        lazy: {
          label: "עצלה כברירת מחדל",
          caption:
            "ארגומנט מחושב כשגוף המתודה צריך אותו. התוכנית הזאת מדפיסה 42 ואף פעם לא מחלקת באפס.",
        },
        inspect: {
          label: "מהדר שאפשר לראות",
          caption: "‏Talac מראה מה הוא עשה מהקוד: כאן, ה-LLVM IR של לולאת gcd מתוכנית לדוגמה.",
        },
        tazel: {
          label: "בנייה עם Tazel",
          caption: "קובץ פרויקט ב-Kotlin ופקודה אחת לכל משימה.",
        },
      }),
      nextHeading: "המשך",
      next: [
        { label: "תחביר", href: "/docs/syntax" },
        { label: "מפרט", href: `${repository}/tree/main/Spec` },
        { label: "דוגמאות", href: `${repository}/tree/main/Examples` },
      ],
      copy: "העתקה",
      copied: "הועתק",
    },
  },
  talac: {
    "en-US": {
      title: "Talac — The Tala compiler",
      description:
        "Talac compiles Tala to a native program, checks a program without building it, and writes every stage of the pipeline on request.",
      headline: "From source to a native program, one stage at a time.",
      lead: "Talac is the compiler of Tala: one command builds a native program, and every stage on the way is yours to look at.",
      primary: { label: "Command line", to: "/docs/command-line" },
      secondary: { label: "Outputs", to: "/docs/outputs" },
      whyHeading: "Why Talac?",
      tabs: talacTabs({
        one: {
          label: "One command",
          caption: "Sources in, a native executable out, named after the first input.",
        },
        check: {
          label: "Check without building",
          caption:
            "--emit=metadata runs every verifier and writes a short record instead of a program.",
        },
        stages: {
          label: "Every stage",
          caption:
            "Core, Xpp, Xmm and LLVM IR can each be written out, and each is verified before it is.",
        },
        native: {
          label: "Native code",
          caption:
            "LLVM optimizes the verified Xmm; -O2 turned the gcd loop of an example into this.",
        },
        diagnostics: {
          label: "Diagnostics",
          caption: "An error names its file, line, column and a stable code.",
        },
      }),
      nextHeading: "Next",
      next: [
        { label: "Tala", href: "https://tala.run/" },
        { label: "Tazel", href: "https://tazel.tala.run/" },
        { label: "Source", href: `${repository}/tree/main/Talac` },
      ],
      copy: "Copy",
      copied: "Copied",
    },
    "de-DE": {
      title: "Talac — Der Compiler von Tala",
      description:
        "Talac übersetzt Tala in ein natives Programm, prüft ein Programm, ohne es zu bauen, und schreibt auf Wunsch jede Stufe der Pipeline.",
      headline: "Vom Quellcode zum nativen Programm, Stufe für Stufe.",
      lead: "Talac ist der Compiler von Tala: Ein Befehl baut ein natives Programm, und jede Stufe auf dem Weg können Sie einsehen.",
      primary: { label: "Kommandozeile", to: "/docs/command-line" },
      secondary: { label: "Ausgaben", to: "/docs/outputs" },
      whyHeading: "Warum Talac?",
      tabs: talacTabs({
        one: {
          label: "Ein Befehl",
          caption:
            "Quellen hinein, eine native ausführbare Datei heraus, benannt nach der ersten Eingabe.",
        },
        check: {
          label: "Prüfen ohne Bauen",
          caption:
            "--emit=metadata führt jeden Verifier aus und schreibt statt eines Programms einen kurzen Eintrag.",
        },
        stages: {
          label: "Jede Stufe",
          caption:
            "Core, Xpp, Xmm und LLVM-IR lassen sich einzeln schreiben, und jede wird vorher verifiziert.",
        },
        native: {
          label: "Nativer Code",
          caption:
            "LLVM optimiert das verifizierte Xmm; -O2 hat die gcd-Schleife eines Beispiels so übersetzt.",
        },
        diagnostics: {
          label: "Diagnosen",
          caption: "Ein Fehler nennt Datei, Zeile, Spalte und einen festen Code.",
        },
      }),
      nextHeading: "Weiter",
      next: [
        { label: "Tala", href: "https://tala.run/" },
        { label: "Tazel", href: "https://tazel.tala.run/" },
        { label: "Quellcode", href: `${repository}/tree/main/Talac` },
      ],
      copy: "Kopieren",
      copied: "Kopiert",
    },
    "ru-RU": {
      title: "Talac — Компилятор Tala",
      description:
        "Talac компилирует Tala в нативную программу, проверяет программу без сборки и по запросу записывает каждую стадию конвейера.",
      headline: "От исходного кода к нативной программе, стадия за стадией.",
      lead: "Talac — компилятор Tala: одна команда собирает нативную программу, а каждую стадию по пути можно посмотреть.",
      primary: { label: "Командная строка", to: "/docs/command-line" },
      secondary: { label: "Результаты", to: "/docs/outputs" },
      whyHeading: "Почему Talac?",
      tabs: talacTabs({
        one: {
          label: "Одна команда",
          caption:
            "На входе исходники, на выходе нативный исполняемый файл с именем первого входа.",
        },
        check: {
          label: "Проверка без сборки",
          caption:
            "--emit=metadata запускает все верификаторы и вместо программы записывает короткую запись.",
        },
        stages: {
          label: "Каждая стадия",
          caption:
            "Core, Xpp, Xmm и LLVM IR можно записать по отдельности, и каждая сначала проверяется.",
        },
        native: {
          label: "Нативный код",
          caption: "LLVM оптимизирует проверенный Xmm; с -O2 цикл gcd из примера стал таким.",
        },
        diagnostics: {
          label: "Диагностика",
          caption: "Ошибка называет файл, строку, столбец и постоянный код.",
        },
      }),
      nextHeading: "Дальше",
      next: [
        { label: "Tala", href: "https://tala.run/" },
        { label: "Tazel", href: "https://tazel.tala.run/" },
        { label: "Исходный код", href: `${repository}/tree/main/Talac` },
      ],
      copy: "Копировать",
      copied: "Скопировано",
    },
    "he-IL": {
      title: "Talac — המהדר של Tala",
      description:
        "‏Talac מהדר את Tala לתוכנית נייטיב, בודק תוכנית בלי לבנות אותה, וכותב לפי בקשה כל שלב בצינור.",
      headline: "מקוד מקור לתוכנית נייטיב, שלב אחר שלב.",
      lead: "‏Talac הוא המהדר של Tala: פקודה אחת בונה תוכנית נייטיב, ואת כל שלב בדרך אפשר לראות.",
      primary: { label: "שורת הפקודה", to: "/docs/command-line" },
      secondary: { label: "פלטים", to: "/docs/outputs" },
      whyHeading: "למה Talac?",
      tabs: talacTabs({
        one: {
          label: "פקודה אחת",
          caption: "קבצי מקור נכנסים, קובץ הרצה נייטיב יוצא, בשם הקלט הראשון.",
        },
        check: {
          label: "בדיקה בלי בנייה",
          caption: "‎--emit=metadata מריץ כל מאמת וכותב רשומה קצרה במקום תוכנית.",
        },
        stages: {
          label: "כל שלב",
          caption: "אפשר לכתוב כל אחד מ-Core, ‏Xpp, ‏Xmm ו-LLVM IR, וכל אחד מאומת לפני כן.",
        },
        native: {
          label: "קוד נייטיב",
          caption: "‏LLVM מבצע אופטימיזציה ל-Xmm המאומת; עם ‎-O2 לולאת gcd מדוגמה הפכה לזה.",
        },
        diagnostics: {
          label: "אבחונים",
          caption: "שגיאה מציינת קובץ, שורה, עמודה וקוד קבוע.",
        },
      }),
      nextHeading: "המשך",
      next: [
        { label: "Tala", href: "https://tala.run/" },
        { label: "Tazel", href: "https://tazel.tala.run/" },
        { label: "קוד מקור", href: `${repository}/tree/main/Talac` },
      ],
      copy: "העתקה",
      copied: "הועתק",
    },
  },
  tazel: {
    "en-US": {
      title: "Tazel — The build system of Tala",
      description:
        "Tazel builds, runs, formats and lints Tala projects from a Kotlin project file, and keeps their dependencies in a lockfile.",
      headline: "One project file. One command for each job.",
      lead: "Tazel reads a Kotlin project file and starts Talac, talafmt and talalint for you. The name joins Tala and Bazel.",
      primary: { label: "Commands", to: "/docs/commands" },
      secondary: { label: "The project file", to: "/docs/project-file" },
      whyHeading: "Why Tazel?",
      tabs: tazelTabs({
        project: {
          label: "Kotlin project file",
          caption:
            "BUILD.kts is a Kotlin script with a typed DSL, so an editor completes and checks it.",
        },
        commands: {
          label: "Everyday commands",
          caption:
            "check, build, run, fmt and lint; what follows -- goes to the program or the tool.",
        },
        targets: {
          label: "Selecting targets",
          caption: "Work on one ViPkg, one executable or a whole workspace.",
        },
        graph: {
          label: "Lockfile and graph",
          caption:
            "Dependencies are recorded in LOCK.sqlite3; lock graph shows them and who uses what.",
        },
        hints: {
          label: "Helpful errors",
          caption: "A mistyped command, flag or name gets a hint with what was probably meant.",
        },
      }),
      nextHeading: "Next",
      next: [
        { label: "Tala", href: "https://tala.run/" },
        { label: "Talac", href: "https://talac.tala.run/" },
        { label: "Source", href: tazelRepository },
      ],
      copy: "Copy",
      copied: "Copied",
    },
    "de-DE": {
      title: "Tazel — Das Build-System von Tala",
      description:
        "Tazel baut, startet, formatiert und prüft Tala-Projekte aus einer Kotlin-Projektdatei und hält ihre Abhängigkeiten in einer Lockdatei fest.",
      headline: "Eine Projektdatei. Ein Befehl für jede Aufgabe.",
      lead: "Tazel liest eine Projektdatei in Kotlin und startet Talac, talafmt und talalint für Sie. Der Name verbindet Tala und Bazel.",
      primary: { label: "Befehle", to: "/docs/commands" },
      secondary: { label: "Die Projektdatei", to: "/docs/project-file" },
      whyHeading: "Warum Tazel?",
      tabs: tazelTabs({
        project: {
          label: "Projektdatei in Kotlin",
          caption:
            "BUILD.kts ist ein Kotlin-Skript mit typisierter DSL, also ergänzt und prüft es ein Editor.",
        },
        commands: {
          label: "Alltägliche Befehle",
          caption:
            "check, build, run, fmt und lint; was nach -- folgt, geht an das Programm oder das Werkzeug.",
        },
        targets: {
          label: "Ziele auswählen",
          caption: "An einem ViPkg, einer ausführbaren Datei oder einem ganzen Workspace arbeiten.",
        },
        graph: {
          label: "Lockdatei und Graph",
          caption:
            "Abhängigkeiten stehen in LOCK.sqlite3; lock graph zeigt sie und wer was verwendet.",
        },
        hints: {
          label: "Hilfreiche Fehler",
          caption:
            "Ein vertippter Befehl, eine Option oder ein Name bekommt einen Hinweis auf das Gemeinte.",
        },
      }),
      nextHeading: "Weiter",
      next: [
        { label: "Tala", href: "https://tala.run/" },
        { label: "Talac", href: "https://talac.tala.run/" },
        { label: "Quellcode", href: tazelRepository },
      ],
      copy: "Kopieren",
      copied: "Kopiert",
    },
    "ru-RU": {
      title: "Tazel — Система сборки Tala",
      description:
        "Tazel собирает, запускает, форматирует и проверяет проекты Tala по файлу проекта на Kotlin и хранит их зависимости в lock-файле.",
      headline: "Один файл проекта. Одна команда на каждую задачу.",
      lead: "Tazel читает файл проекта на Kotlin и сам запускает Talac, talafmt и talalint. Название соединяет Tala и Bazel.",
      primary: { label: "Команды", to: "/docs/commands" },
      secondary: { label: "Файл проекта", to: "/docs/project-file" },
      whyHeading: "Почему Tazel?",
      tabs: tazelTabs({
        project: {
          label: "Файл проекта на Kotlin",
          caption:
            "BUILD.kts — скрипт Kotlin с типизированным DSL, поэтому редактор дополняет и проверяет его.",
        },
        commands: {
          label: "Повседневные команды",
          caption:
            "check, build, run, fmt и lint; всё после -- передаётся программе или инструменту.",
        },
        targets: {
          label: "Выбор целей",
          caption:
            "Работа с одним ViPkg, одним исполняемым файлом или целым рабочим пространством.",
        },
        graph: {
          label: "Lock-файл и граф",
          caption:
            "Зависимости записаны в LOCK.sqlite3; lock graph показывает их и кто что использует.",
        },
        hints: {
          label: "Понятные ошибки",
          caption:
            "Команда, параметр или имя с опечаткой получают подсказку о том, что имелось в виду.",
        },
      }),
      nextHeading: "Дальше",
      next: [
        { label: "Tala", href: "https://tala.run/" },
        { label: "Talac", href: "https://talac.tala.run/" },
        { label: "Исходный код", href: tazelRepository },
      ],
      copy: "Копировать",
      copied: "Скопировано",
    },
    "he-IL": {
      title: "Tazel — מערכת הבנייה של Tala",
      description:
        "Tazel בונה, מריץ, מעצב ובודק פרויקטים של Tala מקובץ פרויקט ב-Kotlin, ושומר את התלויות שלהם בקובץ נעילה.",
      headline: "קובץ פרויקט אחד. פקודה אחת לכל משימה.",
      lead: "Tazel קורא קובץ פרויקט ב-Kotlin ומפעיל בשבילכם את Talac, ‏talafmt ו-talalint. השם מחבר את Tala ואת Bazel.",
      primary: { label: "פקודות", to: "/docs/commands" },
      secondary: { label: "קובץ הפרויקט", to: "/docs/project-file" },
      whyHeading: "למה Tazel?",
      tabs: tazelTabs({
        project: {
          label: "קובץ פרויקט ב-Kotlin",
          caption: "‏BUILD.kts הוא סקריפט Kotlin עם DSL בעל טיפוסים, כך שעורך משלים ובודק אותו.",
        },
        commands: {
          label: "פקודות יומיומיות",
          caption: "‏check, ‏build, ‏run, ‏fmt ו-lint; מה שאחרי ‎-- עובר לתוכנית או לכלי.",
        },
        targets: {
          label: "בחירת יעדים",
          caption: "עבודה על ViPkg אחד, על קובץ הרצה אחד או על סביבת עבודה שלמה.",
        },
        graph: {
          label: "קובץ נעילה וגרף",
          caption: "התלויות נרשמות ב-LOCK.sqlite3; ‏lock graph מציג אותן ומי משתמש במה.",
        },
        hints: {
          label: "שגיאות מועילות",
          caption: "פקודה, אפשרות או שם עם שגיאת הקלדה מקבלים רמז למה שהתכוונתם.",
        },
      }),
      nextHeading: "המשך",
      next: [
        { label: "Tala", href: "https://tala.run/" },
        { label: "Talac", href: "https://talac.tala.run/" },
        { label: "קוד מקור", href: tazelRepository },
      ],
      copy: "העתקה",
      copied: "הועתק",
    },
  },
  talafmt: talafmtLanding,
  talalint: talalintLanding,
};
