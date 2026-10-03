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
    languageLabel: "Language",
    themeLabel: "Switch color theme",
  },
  de: {
    eyebrow: "Community / später",
    title: "Das Forum ist noch nicht geöffnet.",
    message:
      "Wir eröffnen das Visual X# Forum, wenn die Community dafür bereit ist. Derzeit gibt es hier keine Konten, Beiträge oder Diskussionen. Folgen Sie bis dahin der Sprache und dem Compiler im öffentlichen Repository.",
    home: "Visual X# Startseite →",
    source: "Quellcode-Repository ↗",
    languageLabel: "Sprache",
    themeLabel: "Farbschema wechseln",
  },
  ru: {
    eyebrow: "Сообщество / позже",
    title: "Форум пока не открыт.",
    message:
      "Мы откроем форум Visual X#, когда сообщество будет к этому готово. Сейчас здесь нет ни аккаунтов, ни сообщений, ни сервиса обсуждений. Пока следите за языком и компилятором в публичном репозитории.",
    home: "На главную Visual X# →",
    source: "Репозиторий с исходным кодом ↗",
    languageLabel: "Язык",
    themeLabel: "Сменить цветовую тему",
  },
};

const languageSelect = document.getElementById("language");
const themeButton = document.getElementById("theme");
const storedLanguage = localStorage.getItem("vxs-forum-language");
let language = Object.hasOwn(copy, storedLanguage ?? "") ? storedLanguage : "en";

function renderLanguage() {
  const selected = copy[language];
  document.documentElement.lang = language;
  document.title = `${selected.title} · Visual X#`;
  for (const key of ["eyebrow", "title", "message", "home", "source"]) {
    document.getElementById(key).textContent = selected[key];
  }
  languageSelect.value = language;
  languageSelect.setAttribute("aria-label", selected.languageLabel);
  themeButton.setAttribute("aria-label", selected.themeLabel);
}

languageSelect.addEventListener("change", () => {
  // The menu only offers known languages; anything else keeps the current one.
  if (Object.hasOwn(copy, languageSelect.value)) {
    language = languageSelect.value;
    localStorage.setItem("vxs-forum-language", language);
  }
  renderLanguage();
});

document.documentElement.dataset.theme =
  localStorage.getItem("vxs-forum-theme") === "light" ? "light" : "dark";
themeButton.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("vxs-forum-theme", next);
});
renderLanguage();
