// SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

export {};

interface RegistryToken {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  createdAt: string;
  lastUsedAt: string | null;
}

const root = document.querySelector<HTMLElement>("[data-dashboard]");
const alert = root?.querySelector<HTMLElement>("[data-dashboard-alert]");
const tokenList = root?.querySelector<HTMLElement>("[data-token-list]");
const tokenCount = root?.querySelector<HTMLElement>("[data-token-count]");
const dialog = document.querySelector<HTMLDialogElement>("[data-token-dialog]");
const tokenForm = dialog?.querySelector<HTMLFormElement>("[data-token-form]");
const tokenSecret = dialog?.querySelector<HTMLElement>("[data-token-secret]");
const tokenValue = dialog?.querySelector<HTMLElement>("[data-token-value]");

function showAlert(message: string, error = false): void {
  if (!alert) return;
  alert.textContent = message;
  alert.dataset.kind = error ? "error" : "info";
  alert.hidden = false;
}

function renderTokens(tokens: RegistryToken[]): void {
  if (!tokenList) return;
  if (tokenCount) tokenCount.textContent = String(tokens.length);
  if (tokens.length === 0) {
    tokenList.innerHTML = '<p class="token-list-empty">No API tokens have been created.</p>';
    return;
  }
  tokenList.replaceChildren(
    ...tokens.map((token) => {
      const row = document.createElement("article");
      row.className = "token-row";
      const details = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = token.name;
      const metadata = document.createElement("span");
      metadata.textContent = `${token.prefix}… · ${token.scopes.join(", ")} · created ${new Date(token.createdAt).toLocaleDateString()}`;
      details.append(name, metadata);
      const revoke = document.createElement("button");
      revoke.type = "button";
      revoke.textContent = "Revoke";
      revoke.addEventListener("click", () => revokeToken(token.id));
      row.append(details, revoke);
      return row;
    }),
  );
}

async function loadTokens(): Promise<void> {
  const response = await fetch("/api/v1/tokens/", { credentials: "include" });
  if (!response.ok) {
    showAlert("API tokens could not be loaded.", true);
    return;
  }
  renderTokens((await response.json()) as RegistryToken[]);
}

async function revokeToken(id: string): Promise<void> {
  if (!window.confirm("Revoke this token? Existing CLI sessions using it will stop working.")) return;
  const response = await fetch(`/api/v1/tokens/${id}`, { method: "DELETE", credentials: "include" });
  if (!response.ok) return showAlert("The token could not be revoked.", true);
  await loadTokens();
}

async function initialize(): Promise<void> {
  const response = await fetch("/api/v1/auth/me", { credentials: "include" });
  if (response.status === 401) {
    window.location.replace("https://repo.xsharp-lang.xyz/login/");
    return;
  }
  if (!response.ok) return showAlert("Account information could not be loaded.", true);
  const account = (await response.json()) as {
    email: string;
    displayName: string;
    emailVerified: boolean;
  };
  const email = account.email ?? "";
  const displayName = account.displayName || email.split("@")[0] || "Account";
  const avatar = root?.querySelector<HTMLElement>("[data-account-avatar]");
  const name = root?.querySelector<HTMLElement>("[data-account-name]");
  const emailElement = root?.querySelector<HTMLElement>("[data-account-email]");
  const status = root?.querySelector<HTMLElement>("[data-email-status]");
  if (avatar) avatar.textContent = displayName.slice(0, 1).toUpperCase();
  if (name) name.textContent = displayName;
  if (emailElement) emailElement.textContent = email;
  if (status) status.textContent = account.emailVerified ? "Verified" : "Pending";
  await loadTokens();
}

root?.querySelector("[data-signout]")?.addEventListener("click", async () => {
  await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" });
  window.location.assign("https://repo.xsharp-lang.xyz/login/");
});
root?.querySelector("[data-token-open]")?.addEventListener("click", () => dialog?.showModal());
dialog?.querySelector("[data-token-close]")?.addEventListener("click", () => dialog?.close());
dialog?.querySelector("[data-token-copy]")?.addEventListener("click", async () => {
  if (tokenValue?.textContent) await navigator.clipboard.writeText(tokenValue.textContent);
});

tokenForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(tokenForm);
  const name = String(formData.get("name") ?? "").trim();
  const scopes = formData.getAll("scope").map(String);
  const response = await fetch("/api/v1/tokens/", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, scopes }),
  });
  if (!response.ok) return showAlert("The token could not be created.", true);
  const created = (await response.json()) as { token: string };
  if (tokenValue) tokenValue.textContent = created.token;
  if (tokenSecret) tokenSecret.hidden = false;
  await loadTokens();
});

void initialize();
