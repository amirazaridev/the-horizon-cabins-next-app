"use server";

import { redirect } from "next/navigation";

import { apiFetch } from "@/libs/api/apiFetch";
import { createSession, destroySession } from "../services/session.service";
import { normalizeText } from "../schemas";
import type { AuthError, AuthErrorCode } from "../types/auth.types";
import { canAccessDashboard, type UserRole } from "../constants/auth-cookie";

export type AuthActionResult =
  | {
      ok: true;
      user: { id: number; email: string; role: UserRole };
      redirectTo: string;
    }
  | { ok: false; error: AuthError };

type ApiAuthResponse = {
  status: "success" | "fail" | "error";
  message?: string;
  data?: {
    user: { id: number; email: string; role: UserRole; active: boolean };
    token: string;
  };
};

/** مسیر پیش‌فرض بعد از ورود بر اساس نقش. */
function destinationForRole(role: UserRole): string {
  return canAccessDashboard(role) ? "/dashboard" : "/";
}

/** نگاشت کد خطای بک‌اند به کد دامنه‌ی فرانت. */
function mapBackendError(status: number, message?: string): AuthError {
  let code: AuthErrorCode = "UNKNOWN";
  if (status === 401) code = "INVALID_CREDENTIALS";
  else if (status === 403) code = "TOO_MANY_ATTEMPTS";
  else if (status === 409) code = "EMAIL_ALREADY_EXISTS";
  else if (status === 422 || status === 400) code = "UNKNOWN";

  return {
    code,
    message: message ?? "خطای غیرمنتظره رخ داد. دوباره تلاش کنید.",
    field: code === "EMAIL_ALREADY_EXISTS" ? "email" : "password",
  };
}

export async function loginAction(input: {
  email: string;
  password: string;
}): Promise<AuthActionResult> {
  let res: Response;
  try {
    res = await apiFetch("auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: normalizeText(input.email).toLowerCase(),
        password: input.password,
      }),
      cache: "no-store",
    });
  } catch {
    return {
      ok: false,
      error: { code: "NETWORK", message: "ارتباط با سرور برقرار نشد." },
    };
  }

  const json = (await res.json().catch(() => null)) as ApiAuthResponse | null;

  if (!res.ok || !json || json.status !== "success" || !json.data) {
    return { ok: false, error: mapBackendError(res.status, json?.message) };
  }

  const { user, token } = json.data;

  // ✅ نقش BFF: توکن از API می‌آید و اینجا روی مرورگر کوکی می‌شود.
  await createSession(token);

  return {
    ok: true,
    user: { id: user.id, email: user.email, role: user.role },
    redirectTo: destinationForRole(user.role),
  };
}

export async function registerAction(input: {
  fullName: string;
  email: string;
  password: string;
  verificationToken: string;
}): Promise<AuthActionResult> {
  let res: Response;
  try {
    res = await apiFetch("auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: normalizeText(input.fullName),
        email: normalizeText(input.email).toLowerCase(),
        password: input.password,
        verificationToken: input.verificationToken,
      }),
      cache: "no-store",
    });
  } catch {
    return {
      ok: false,
      error: { code: "NETWORK", message: "ارتباط با سرور برقرار نشد." },
    };
  }

  const json = (await res.json().catch(() => null)) as ApiAuthResponse | null;

  if (!res.ok || !json || json.status !== "success" || !json.data) {
    return { ok: false, error: mapBackendError(res.status, json?.message) };
  }

  const { user, token } = json.data;
  await createSession(token);

  return {
    ok: true,
    user: { id: user.id, email: user.email, role: user.role },
    redirectTo: destinationForRole(user.role),
  };
}

/** خروج از حساب — حذف کوکی و هدایت به صفحه اصلی. */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
