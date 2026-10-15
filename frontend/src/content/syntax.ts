// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

import type { DocRoute, DocTopic } from "./types";

// Every sample below is taken from the public specification under Spec/Language.
const program = `namespace Examples.HelloWorld;

public class HelloWorld {
    public static void Main() {
        String language = "Tala";
        Console.Println("Hello from " + language + "!");
    }
}`;
const comments = `-- A comment runs to the end of the line.

--[[
normal
long comment
]]

++value;      -- there is ++, and no decrement:
value -= 1;   -- -- always starts a comment`;
const declarations = `class User {              -- internal
    String name;          -- internal
    void Print() {}       -- internal
}

data Point {              -- a copy-on-write value type
    int x;
    int y;
}

object Application {      -- one named singleton
}`;
const operators = `2 ** 3 ** 2      -- power, right-associative: 2 ** (3 ** 2)
first \\= second  -- inequality
not true         -- logical NOT; ! is bitwise
a < b && b < c   -- relations do not chain`;
const evaluation = `int total = Sum(values); -- nothing is computed here

if (verbose) {
    Print(total);        -- Sum(values) is computed here, if this is reached
}`;

const specification = "https://github.com/Progmasoft/tala/tree/main/Spec/Language";

const syntax: DocTopic = {
  "en-US": {
    nav: "Syntax",
    title: "Syntax · Tala",
    description:
      "A first look at the syntax of Tala: programs, comments, declarations, operators and evaluation by need.",
    section: "DOCUMENTATION / SYNTAX",
    heading: "A first look at the syntax",
    lead: "The examples on this page come from the public specification. It is the normative description of the language and lists valid and invalid forms side by side.",
    blocks: [
      { kind: "heading", text: "A program" },
      {
        kind: "text",
        text: "A program starts in the parameterless public static void Main() of a class. There is no top-level function. A file declares its namespace; the namespace does not have to match the path of the file.",
      },
      { kind: "code", code: program },
      { kind: "heading", text: "Comments" },
      {
        kind: "text",
        text: "-- starts a comment wherever it stands outside a string. That is why the language has ++ and no decrement operator: write value -= 1.",
      },
      { kind: "code", code: comments },
      { kind: "heading", text: "Declarations" },
      {
        kind: "text",
        text: "Names are case-sensitive. A declaration without an access modifier is internal; no context defaults to private. There are no forward and no partial declarations, and declaration order does not affect visibility.",
      },
      { kind: "code", code: declarations },
      { kind: "heading", text: "Operators" },
      {
        kind: "text",
        text: "Precedence is fixed; there are no user-defined precedence groups. Inequality is \\=, logical NOT is not, and && and || join Boolean values. // is integer division that rounds, and + joins Strings.",
      },
      { kind: "code", code: operators },
      { kind: "heading", text: "Evaluation by need" },
      {
        kind: "text",
        text: "Tala evaluates by need: binding a name computes nothing, a value is computed when it is first needed, and at most once. A value that is never needed is never computed.",
      },
      { kind: "code", code: evaluation },
      {
        kind: "note",
        title: "The specification",
        text: `The full rules, with every valid and invalid example, are in ${specification}. A specification example is not proof that the current compiler accepts it.`,
      },
    ],
  },
  "de-DE": {
    nav: "Syntax",
    title: "Syntax · Tala",
    description:
      "Ein erster Blick auf die Syntax von Tala: Programme, Kommentare, Deklarationen, Operatoren und Auswertung nach Bedarf.",
    section: "DOKUMENTATION / SYNTAX",
    heading: "Ein erster Blick auf die Syntax",
    lead: "Die Beispiele dieser Seite stammen aus der öffentlichen Spezifikation. Sie ist die maßgebliche Beschreibung der Sprache und stellt gültige und ungültige Formen nebeneinander.",
    blocks: [
      { kind: "heading", text: "Ein Programm" },
      {
        kind: "text",
        text: "Ein Programm beginnt im parameterlosen public static void Main() einer Klasse. Es gibt keine Funktion auf oberster Ebene. Eine Datei deklariert ihren Namespace; er muss nicht zum Pfad der Datei passen.",
      },
      { kind: "code", code: program },
      { kind: "heading", text: "Kommentare" },
      {
        kind: "text",
        text: "-- beginnt außerhalb eines Strings überall einen Kommentar. Deshalb hat die Sprache ++ und keinen Dekrement-Operator: Man schreibt value -= 1.",
      },
      { kind: "code", code: comments },
      { kind: "heading", text: "Deklarationen" },
      {
        kind: "text",
        text: "Namen unterscheiden Groß- und Kleinschreibung. Eine Deklaration ohne Zugriffsmodifizierer ist internal; kein Kontext ist standardmäßig private. Es gibt keine Vorwärts- und keine partiellen Deklarationen, und die Reihenfolge der Deklarationen beeinflusst die Sichtbarkeit nicht.",
      },
      { kind: "code", code: declarations },
      { kind: "heading", text: "Operatoren" },
      {
        kind: "text",
        text: "Die Rangfolge ist fest; benutzerdefinierte Rangfolgegruppen gibt es nicht. Ungleichheit ist \\=, logisches NICHT ist not, && und || verbinden Wahrheitswerte. // ist ganzzahlige Division mit Rundung, und + verbindet Strings.",
      },
      { kind: "code", code: operators },
      { kind: "heading", text: "Auswertung nach Bedarf" },
      {
        kind: "text",
        text: "Tala wertet nach Bedarf aus: Einen Namen zu binden berechnet nichts, ein Wert wird berechnet, wenn er zum ersten Mal gebraucht wird, und höchstens einmal. Ein Wert, der nie gebraucht wird, wird nie berechnet.",
      },
      { kind: "code", code: evaluation },
      {
        kind: "note",
        title: "Die Spezifikation",
        text: `Die vollständigen Regeln mit allen gültigen und ungültigen Beispielen stehen unter ${specification}. Ein Beispiel der Spezifikation beweist nicht, dass der aktuelle Compiler es annimmt.`,
      },
    ],
  },
  "ru-RU": {
    nav: "Синтаксис",
    title: "Синтаксис · Tala",
    description:
      "Первое знакомство с синтаксисом Tala: программы, комментарии, объявления, операторы и вычисление по необходимости.",
    section: "ДОКУМЕНТАЦИЯ / СИНТАКСИС",
    heading: "Первое знакомство с синтаксисом",
    lead: "Примеры на этой странице взяты из публичной спецификации. Она — нормативное описание языка и показывает допустимые и недопустимые формы рядом.",
    blocks: [
      { kind: "heading", text: "Программа" },
      {
        kind: "text",
        text: "Программа начинается в методе public static void Main() без параметров какого-либо класса. Функций верхнего уровня нет. Файл объявляет своё пространство имён; оно не обязано совпадать с путём к файлу.",
      },
      { kind: "code", code: program },
      { kind: "heading", text: "Комментарии" },
      {
        kind: "text",
        text: "-- начинает комментарий в любом месте вне строки. Поэтому в языке есть ++ и нет оператора декремента: пишите value -= 1.",
      },
      { kind: "code", code: comments },
      { kind: "heading", text: "Объявления" },
      {
        kind: "text",
        text: "Имена чувствительны к регистру. Объявление без модификатора доступа — internal; ни в одном контексте по умолчанию нет private. Предварительных и частичных объявлений нет, а порядок объявлений не влияет на видимость.",
      },
      { kind: "code", code: declarations },
      { kind: "heading", text: "Операторы" },
      {
        kind: "text",
        text: "Приоритеты фиксированы; пользовательских групп приоритетов нет. Неравенство записывается как \\=, логическое НЕ — not, а && и || соединяют логические значения. // — целочисленное деление с округлением, + соединяет строки.",
      },
      { kind: "code", code: operators },
      { kind: "heading", text: "Вычисление по необходимости" },
      {
        kind: "text",
        text: "Tala вычисляет по необходимости: связывание имени ничего не вычисляет, значение вычисляется, когда оно впервые нужно, и не более одного раза. Значение, которое никогда не понадобится, никогда не вычисляется.",
      },
      { kind: "code", code: evaluation },
      {
        kind: "note",
        title: "Спецификация",
        text: `Полные правила со всеми допустимыми и недопустимыми примерами находятся по адресу ${specification}. Пример из спецификации не доказывает, что текущий компилятор его принимает.`,
      },
    ],
  },
  "he-IL": {
    nav: "תחביר",
    title: "תחביר · Tala",
    description: "מבט ראשון על התחביר של Tala: תוכניות, הערות, הצהרות, אופרטורים והערכה לפי צורך.",
    section: "תיעוד / תחביר",
    heading: "מבט ראשון על התחביר",
    lead: "הדוגמאות בעמוד הזה לקוחות מהמפרט הציבורי. הוא התיאור המחייב של השפה, ומציג צורות תקינות ולא תקינות זו לצד זו.",
    blocks: [
      { kind: "heading", text: "תוכנית" },
      {
        kind: "text",
        text: "תוכנית מתחילה ב-public static void Main() ללא פרמטרים של מחלקה. אין פונקציה ברמה העליונה. קובץ מצהיר על מרחב השמות שלו; מרחב השמות אינו חייב להתאים לנתיב הקובץ.",
      },
      { kind: "code", code: program },
      { kind: "heading", text: "הערות" },
      {
        kind: "text",
        text: "‎-- מתחיל הערה בכל מקום מחוץ למחרוזת. לכן יש בשפה ++ ואין אופרטור הפחתה: כותבים value -= 1.",
      },
      { kind: "code", code: comments },
      { kind: "heading", text: "הצהרות" },
      {
        kind: "text",
        text: "שמות רגישים לאותיות גדולות וקטנות. הצהרה בלי משנה גישה היא internal; אין הקשר שבו ברירת המחדל היא private. אין הצהרות מקדימות ואין הצהרות חלקיות, וסדר ההצהרות אינו משפיע על הנראות.",
      },
      { kind: "code", code: declarations },
      { kind: "heading", text: "אופרטורים" },
      {
        kind: "text",
        text: "סדר הקדימויות קבוע; אין קבוצות קדימות שהמשתמש מגדיר. אי-שוויון נכתב \\=, ‏NOT לוגי הוא not, ו-&& ו-|| מחברים ערכים בוליאניים. // הוא חילוק שלמים עם עיגול, ו-+ מחבר מחרוזות.",
      },
      { kind: "code", code: operators },
      { kind: "heading", text: "הערכה לפי צורך" },
      {
        kind: "text",
        text: "Tala מעריכה לפי צורך: קשירת שם אינה מחשבת דבר, ערך מחושב כשהוא נדרש בפעם הראשונה, ולכל היותר פעם אחת. ערך שלעולם אינו נדרש לעולם אינו מחושב.",
      },
      { kind: "code", code: evaluation },
      {
        kind: "note",
        title: "המפרט",
        text: `הכללים המלאים, עם כל הדוגמאות התקינות והלא תקינות, נמצאים ב-${specification}. דוגמה מהמפרט אינה הוכחה שהמהדר הנוכחי מקבל אותה.`,
      },
    ],
  },
};

export const syntaxRoutes: readonly DocRoute[] = [{ path: "/docs/syntax", topic: syntax }];
