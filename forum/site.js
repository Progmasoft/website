// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

const copy = {
  en: {
    eyebrow: "Community / coming later",
    title: "The forum isn't open yet.",
    message:
      "We will open the Visual X# forum when the community is ready for it. There are no accounts, posts, or discussion service here today. For now, follow the language and compiler in the public repository.",
    home: "Visual X# home →",
    source: "Source repository ↗",
    themeLabel: "Switch color theme",
  },
  de: {
    eyebrow: "Community / später",
    title: "Das Forum ist noch nicht geöffnet.",
    message:
      "Wir eröffnen das Visual X# Forum, wenn die Community dafür bereit ist. Derzeit gibt es hier keine Konten, Beiträge oder Diskussionen. Folgen Sie bis dahin der Sprache und dem Compiler im öffentlichen Repository.",
    home: "Visual X# Startseite →",
    source: "Quellcode-Repository ↗",
    themeLabel: "Farbschema wechseln",
  },
  ru: {
    eyebrow: "Сообщество / позже",
    title: "Форум пока не открыт.",
    message:
      "Мы откроем форум Visual X#, когда сообщество будет к этому готово. Сейчас здесь нет ни аккаунтов, ни сообщений, ни сервиса обсуждений. Пока следите за языком и компилятором в публичном репозитории.",
    home: "На главную Visual X# →",
    source: "Репозиторий с исходным кодом ↗",
    themeLabel: "Сменить цветовую тему",
  },
  he: {
    eyebrow: "קהילה / בהמשך",
    title: "הפורום עדיין לא נפתח.",
    message:
      "נפתח את הפורום של Visual X#‎ כשהקהילה תהיה מוכנה לכך. כרגע אין כאן חשבונות, הודעות או שירות דיונים. בינתיים אפשר לעקוב אחר השפה והמהדר במאגר הציבורי.",
    home: "לדף הבית של Visual X#‎ ←",
    source: "מאגר קוד המקור ↗",
    themeLabel: "החלפת ערכת הצבעים",
  },
};

const themeButton = document.getElementById("theme");

// The page has one notice and shows it in the language of the browser: the
// first preferred language that has a translation, and English otherwise.
// There is no language menu and nothing is stored. `iw` is the former code
// for Hebrew, which some browsers still report.
function browserLanguage() {
  for (const preferred of navigator.languages ?? [navigator.language]) {
    const primary = String(preferred ?? "")
      .split("-", 1)[0]
      .toLowerCase();
    const known = primary === "iw" ? "he" : primary;
    if (Object.hasOwn(copy, known)) return known;
  }
  return "en";
}

function renderLanguage() {
  const language = browserLanguage();
  const selected = copy[language];
  document.documentElement.lang = language;
  document.documentElement.dataset.textDirection = language === "he" ? "rtl" : "ltr";
  document.title = `${selected.title} · Visual X#`;
  for (const key of ["eyebrow", "title", "message", "home", "source"]) {
    document.getElementById(key).textContent = selected[key];
  }
  themeButton.setAttribute("aria-label", selected.themeLabel);
}

document.documentElement.dataset.theme =
  localStorage.getItem("vxs-forum-theme") === "light" ? "light" : "dark";
themeButton.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("vxs-forum-theme", next);
});
renderLanguage();
