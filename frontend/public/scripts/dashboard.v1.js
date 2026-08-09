// SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

const root = document.querySelector("[data-dashboard]");
const alert = root?.querySelector("[data-dashboard-alert]");
const tokenList = root?.querySelector("[data-token-list]");
const tokenCount = root?.querySelector("[data-token-count]");
const dialog = document.querySelector("[data-token-dialog]");
const tokenForm = dialog?.querySelector("[data-token-form]");
const tokenSecret = dialog?.querySelector("[data-token-secret]");
const tokenValue = dialog?.querySelector("[data-token-value]");
const deleteDialog = document.querySelector("[data-delete-dialog]");
const deleteForm = deleteDialog?.querySelector("[data-delete-form]");
const deleteConfirmation = deleteDialog?.querySelector("[data-delete-confirmation]");
let accountEmail = "";

function showAlert(message, error = false) {
  if (!alert) return;
  alert.textContent = message;
  alert.dataset.kind = error ? "error" : "info";
  alert.hidden = false;
}

function renderTokens(tokens) {
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

async function loadTokens() {
  const response = await fetch("/api/v1/tokens/", { credentials: "include" });
  if (!response.ok) {
    showAlert("API tokens could not be loaded.", true);
    return;
  }
  renderTokens(await response.json());
}

async function revokeToken(id) {
  if (!window.confirm("Revoke this token? Existing CLI sessions using it will stop working.")) return;
  const response = await fetch(`/api/v1/tokens/${id}`, { method: "DELETE", credentials: "include" });
  if (!response.ok) return showAlert("The token could not be revoked.", true);
  await loadTokens();
}

async function initialize() {
  const response = await fetch("/api/v1/auth/me", { credentials: "include" });
  if (response.status === 401) {
    window.location.replace("https://viget.xsharp-lang.xyz/login/");
    return;
  }
  if (!response.ok) return showAlert("Account information could not be loaded.", true);
  const account = await response.json();
  const email = account.email ?? "";
  accountEmail = email;
  const displayName = account.displayName || email.split("@")[0] || "Account";
  const avatar = root?.querySelector("[data-account-avatar]");
  const name = root?.querySelector("[data-account-name]");
  const emailElement = root?.querySelector("[data-account-email]");
  const status = root?.querySelector("[data-email-status]");
  const deleteEmail = deleteDialog?.querySelector("[data-delete-email]");
  if (avatar) avatar.textContent = displayName.slice(0, 1).toUpperCase();
  if (name) name.textContent = displayName;
  if (emailElement) emailElement.textContent = email;
  if (status) status.textContent = account.emailVerified ? "Verified" : "Pending";
  if (deleteEmail) deleteEmail.textContent = email;
  await loadTokens();
}

root?.querySelector("[data-signout]")?.addEventListener("click", async () => {
  await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" });
  window.location.assign("https://viget.xsharp-lang.xyz/login/");
});
root?.querySelector("[data-token-open]")?.addEventListener("click", () => dialog?.showModal());
dialog?.querySelector("[data-token-close]")?.addEventListener("click", () => dialog?.close());
dialog?.querySelector("[data-token-copy]")?.addEventListener("click", async () => {
  if (tokenValue?.textContent) await navigator.clipboard.writeText(tokenValue.textContent);
});

root?.querySelector("[data-delete-open]")?.addEventListener("click", () => {
  if (deleteConfirmation) deleteConfirmation.value = "";
  deleteDialog?.showModal();
  deleteConfirmation?.focus();
});
deleteDialog?.querySelector("[data-delete-close]")?.addEventListener("click", () => deleteDialog?.close());
deleteForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const confirmation = deleteConfirmation?.value.trim() ?? "";
  if (!confirmation || confirmation.toLowerCase() !== accountEmail.toLowerCase()) {
    showAlert("Enter the account email address exactly to confirm deletion.", true);
    return;
  }
  if (!window.confirm("Permanently delete this registry account? This cannot be undone.")) return;
  const response = await fetch("/api/v1/auth/account", {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ confirmation }),
  });
  if (!response.ok) {
    showAlert("The account could not be deleted.", true);
    return;
  }
  window.location.replace("https://viget.xsharp-lang.xyz/?account=deleted");
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
  const created = await response.json();
  if (tokenValue) tokenValue.textContent = created.token;
  if (tokenSecret) tokenSecret.hidden = false;
  await loadTokens();
});

void initialize();
