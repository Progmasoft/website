// SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

// Versioned because the registry serves this security-sensitive flow through a cache.
const root = document.querySelector("[data-auth-flow]");
const form = root?.querySelector("[data-auth-form]");
const emailInput = root?.querySelector("#auth-email");
const passwordInput = root?.querySelector("#auth-password");
const codeInput = root?.querySelector("#auth-code");
const newPasswordInput = root?.querySelector("#auth-new-password");
const alert = root?.querySelector("[data-auth-alert]");
const mode = root?.dataset.mode;
const googleButton = root?.querySelector("[data-google]");
let step = "email";
let email = "";
let recoveryCode = "";

function showAlert(message, error = false) {
  if (!alert) return;
  alert.textContent = message;
  alert.dataset.kind = error ? "error" : "info";
  alert.hidden = false;
}

function showStep(next) {
  step = next;
  root?.querySelectorAll("[data-step]").forEach((element) => {
    element.hidden = element.dataset.step !== next;
  });
  root?.querySelectorAll("[data-email-value], [data-code-email]").forEach((element) => {
    element.textContent = email;
  });
  alert?.setAttribute("hidden", "");
  root?.querySelector(`[data-step="${next}"] input`)?.focus();
}

async function request(path, body) {
  return fetch(`/api/v1/auth/${path}`, {
    method: body ? "POST" : "GET",
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function explainFailure(response) {
  let failure = {};
  try {
    failure = await response.json();
  } catch {
    // An upstream error page is intentionally replaced with a stable message.
  }
  showAlert(failure.message ?? failure.errors?.join(" ") ?? "The request could not be completed.", true);
}

root?.querySelector("[data-back]")?.addEventListener("click", () => showStep("email"));
root?.querySelector("[data-resend]")?.addEventListener("click", async () => {
  const path = mode === "recover" ? "recovery/start" : "verify-email/resend";
  const response = await request(path, { email });
  if (!response.ok) return explainFailure(response);
  showAlert("A new code has been requested. Check your email.");
});

googleButton?.addEventListener("click", async () => {
  window.location.assign("/api/v1/auth/google");
});

async function initializeProviders() {
  if (!googleButton) return;
  try {
    const response = await request("providers");
    const providers = await response.json();
    googleButton.disabled = !providers.google;
    if (!providers.google) googleButton.title = "Google sign-in is being configured.";
  } catch {
    googleButton.disabled = true;
  }
}

function initializeGoogleVerification() {
  const parameters = new URLSearchParams(window.location.search);
  const requestedEmail = parameters.get("email")?.trim().toLowerCase() ?? "";
  if (mode !== "register" || parameters.get("verify") !== "google" || !requestedEmail || !emailInput) {
    return;
  }
  emailInput.value = requestedEmail;
  if (!emailInput.checkValidity()) return;
  email = requestedEmail;
  showStep("code");
  showAlert("Google sign-in succeeded. Check your email for the X# verification code.");
  window.history.replaceState({}, "", window.location.pathname);
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!mode) return;

  if (step === "email") {
    email = emailInput?.value.trim().toLowerCase() ?? "";
    if (!emailInput?.checkValidity()) {
      emailInput?.reportValidity();
      return;
    }
    if (mode === "recover") {
      const response = await request("recovery/start", { email });
      if (!response.ok) return explainFailure(response);
      showStep("code");
      showAlert("Check your email for the recovery code.");
      return;
    }
    showStep("password");
    return;
  }

  if (step === "password") {
    const password = passwordInput?.value ?? "";
    if (!passwordInput?.checkValidity()) {
      passwordInput?.reportValidity();
      return;
    }
    if (mode === "register") {
      const response = await request("register", { email, password });
      if (!response.ok) return explainFailure(response);
      showStep("code");
      showAlert("Check your email to verify this account.");
      return;
    }
    const response = await request("login", { email, password });
    if (!response.ok) return explainFailure(response);
    window.location.assign("https://repo.xsharp-lang.xyz/dashboard/");
    return;
  }

  if (step === "code") {
    const code = codeInput?.value.trim().toUpperCase() ?? "";
    if (!codeInput?.checkValidity()) {
      codeInput?.reportValidity();
      return;
    }
    if (mode === "recover") {
      recoveryCode = code;
      showStep("new-password");
      return;
    }
    const response = await request("verify-email", { email, code });
    if (!response.ok) return explainFailure(response);
    window.location.assign("https://repo.xsharp-lang.xyz/dashboard/");
    return;
  }

  const password = newPasswordInput?.value ?? "";
  if (!newPasswordInput?.checkValidity()) {
    newPasswordInput?.reportValidity();
    return;
  }
  const response = await request("recovery/complete", { email, code: recoveryCode, password });
  if (!response.ok) return explainFailure(response);
  window.location.assign("https://repo.xsharp-lang.xyz/dashboard/");
});

initializeGoogleVerification();
void initializeProviders();
