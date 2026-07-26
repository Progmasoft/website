// SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

export {};

type Mode = "login" | "register" | "recover";
type Step = "email" | "password" | "code" | "new-password";

const root = document.querySelector<HTMLElement>("[data-auth-flow]");
const form = root?.querySelector<HTMLFormElement>("[data-auth-form]");
const emailInput = root?.querySelector<HTMLInputElement>("#auth-email");
const passwordInput = root?.querySelector<HTMLInputElement>("#auth-password");
const codeInput = root?.querySelector<HTMLInputElement>("#auth-code");
const newPasswordInput = root?.querySelector<HTMLInputElement>("#auth-new-password");
const alert = root?.querySelector<HTMLElement>("[data-auth-alert]");
const mode = root?.dataset.mode as Mode | undefined;
const googleButton = root?.querySelector<HTMLButtonElement>("[data-google]");
let step: Step = "email";
let email = "";
let recoveryCode = "";

interface ApiFailure {
  message?: string;
  errors?: string[];
}

function showAlert(message: string, error = false): void {
  if (!alert) return;
  alert.textContent = message;
  alert.dataset.kind = error ? "error" : "info";
  alert.hidden = false;
}

function showStep(next: Step): void {
  step = next;
  root?.querySelectorAll<HTMLElement>("[data-step]").forEach((element) => {
    element.hidden = element.dataset.step !== next;
  });
  root?.querySelectorAll<HTMLElement>("[data-email-value], [data-code-email]").forEach((element) => {
    element.textContent = email;
  });
  alert?.setAttribute("hidden", "");
  root?.querySelector<HTMLInputElement>(`[data-step="${next}"] input`)?.focus();
}

async function request(path: string, body?: object): Promise<Response> {
  return fetch(`/api/v1/auth/${path}`, {
    method: body ? "POST" : "GET",
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function explainFailure(response: Response): Promise<void> {
  let failure: ApiFailure = {};
  try {
    failure = (await response.json()) as ApiFailure;
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

async function initializeProviders(): Promise<void> {
  if (!googleButton) return;
  try {
    const response = await request("providers");
    const providers = (await response.json()) as { google: boolean };
    googleButton.disabled = !providers.google;
    if (!providers.google) googleButton.title = "Google sign-in is being configured.";
  } catch {
    googleButton.disabled = true;
  }
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

void initializeProviders();
