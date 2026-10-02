/**
 * سرویس احراز هویت — تنها لایه‌ای که با API حرف می‌زند.
 *
 * ⚠️ TODO(backend): تمام توابع این فایل فعلاً ماک‌اند. هیچ اندپوینت auth
 * در بک‌اند وجود ندارد. برای اتصال واقعی کافی است بدنه‌ی هر تابع را با
 * یک `fetch` به Route Handler داخلی عوض کنید — امضاها و تایپ‌ها ثابت
 * می‌مانند و هیچ کامپوننتی دست نمی‌خورد.
 *
 * ⚠️ نکته‌ی معماری: این ماژول «کلاینتی» است و بنابراین هرگز نباید
 * `apiFetch` / `authFetch` را import کند؛ آن‌ها `server-only` هستند.
 * تماس با بک‌اند باید از پشت Route Handler داخلی (`src/app/api/auth/*`)
 * انجام شود، مثل زنجیره‌ی جستجوی کابین.
 */

import {
  AUTH_MESSAGES,
  getPasswordStrength,
  normalizeDigits,
  normalizeText,
  AUTH_LIMITS,
} from "../schemas/auth.schema";
import type {
  AuthError,
  AuthErrorCode,
  AuthResult,
  LoginPayload,
  LoginResult,
  RegisterAccountPayload,
  RegisterAccountResult,
  RequestPasswordResetPayload,
  RequestPasswordResetResult,
  SendVerificationCodeResult,
  VerifyEmailPayload,
  VerifyEmailResult,
} from "../types/auth.types";

/** تأخیر مصنوعی شبکه در حالت ماک — تا حالت‌های loading واقعی دیده شوند. */
const MOCK_LATENCY_MS = 900;

/** کنترلی برای تست دستی خطاها در محیط توسعه. */
const MOCK_SCENARIO = {
  /** اگر ایمیل با این عبارت شروع شود، ارسال کد خطا می‌دهد. */
  existingEmailPrefix: "taken",
  /** اگر ایمیل با این عبارت شروع شود، ورود ناموفق است. */
  unknownEmailPrefix: "unknown",
  /** کد تایید درست در حالت ماک. */
  validCode: "123456",
} as const;

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

function fail(
  code: AuthErrorCode,
  message: string,
  field?: AuthError["field"],
): AuthResult<never> {
  return { ok: false, error: { code, message, field } };
}

/* ------------------------------------------------------------------ */
/* API                                                                 */
/* ------------------------------------------------------------------ */

/**
 * مرحله‌ی ۱ — ارسال کد تایید به ایمیل.
 *
 * در حالت ماک همیشه موفق است (مگر سناریوی تستی) و کد را در کنسول چاپ
 * می‌کند تا بدون بک‌اند هم بتوان فرم را تا آخر برد.
 */
export async function sendVerificationCode(
  email: string,
  options?: { signal?: AbortSignal },
): Promise<AuthResult<SendVerificationCodeResult>> {
  const normalizedEmail = normalizeText(email).toLowerCase();

  await delay(MOCK_LATENCY_MS, options?.signal);

  if (normalizedEmail.startsWith(MOCK_SCENARIO.existingEmailPrefix)) {
    return fail(
      "EMAIL_ALREADY_EXISTS",
      "این ایمیل قبلاً ثبت شده است. وارد شوید یا رمز عبور را بازیابی کنید.",
      "email",
    );
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(
      `[auth:mock] کد تایید برای ${normalizedEmail}: ${MOCK_SCENARIO.validCode}`,
    );
  }

  return {
    ok: true,
    data: {
      expiresInSeconds: AUTH_LIMITS.codeTtlSeconds,
      resendAfterSeconds: AUTH_LIMITS.resendSeconds,
      devCode: MOCK_SCENARIO.validCode,
    },
  };
}

/** مرحله‌ی ۲ — بررسی کد تایید. */
export async function verifyEmailCode(
  payload: VerifyEmailPayload,
  options?: { signal?: AbortSignal },
): Promise<AuthResult<VerifyEmailResult>> {
  const code = normalizeDigits(payload.code).trim();

  await delay(MOCK_LATENCY_MS, options?.signal);

  if (code !== MOCK_SCENARIO.validCode) {
    return fail("INVALID_CODE", "کد تایید نادرست است. دوباره تلاش کنید.", "code");
  }

  return {
    ok: true,
    data: { verificationToken: `mock-token-${Date.now()}` },
  };
}

/** مرحله‌ی ۳ — ساخت حساب با رمز عبور. */
export async function registerAccount(
  payload: RegisterAccountPayload,
  options?: { signal?: AbortSignal },
): Promise<AuthResult<RegisterAccountResult>> {
  const strength = getPasswordStrength(payload.password);

  await delay(MOCK_LATENCY_MS, options?.signal);

  if (strength.score < AUTH_LIMITS.passwordMinScore) {
    return fail(
      "WEAK_PASSWORD",
      AUTH_MESSAGES.passwordNeedsSpecial,
      "password",
    );
  }

  return {
    ok: true,
    data: {
      user: {
        id: `mock-${Date.now()}`,
        firstName: normalizeText(payload.firstName),
        lastName: normalizeText(payload.lastName),
        email: normalizeText(payload.email).toLowerCase(),
        createdAt: new Date().toISOString(),
      },
      accessToken: `mock-access-${Date.now()}`,
      expiresIn: 3600,
    },
  };
}

/** ورود با ایمیل و رمز عبور. */
export async function login(
  payload: LoginPayload,
  options?: { signal?: AbortSignal },
): Promise<AuthResult<LoginResult>> {
  const email = normalizeText(payload.email).toLowerCase();

  await delay(MOCK_LATENCY_MS, options?.signal);

  if (email.startsWith(MOCK_SCENARIO.unknownEmailPrefix) || !payload.password) {
    return fail(
      "INVALID_CREDENTIALS",
      "ایمیل یا رمز عبور نادرست است.",
      "password",
    );
  }

  const [localPart] = email.split("@");

  return {
    ok: true,
    data: {
      user: {
        id: `mock-${Date.now()}`,
        firstName: localPart,
        lastName: "",
        email,
      },
      accessToken: `mock-access-${Date.now()}`,
      expiresIn: payload.rememberMe ? 60 * 60 * 24 * 30 : 3600,
    },
  };
}

/** درخواست بازیابی رمز عبور. */
export async function requestPasswordReset(
  payload: RequestPasswordResetPayload,
  options?: { signal?: AbortSignal },
): Promise<AuthResult<RequestPasswordResetResult>> {
  await delay(MOCK_LATENCY_MS, options?.signal);
  void payload;
  return { ok: true, data: { sent: true } };
}
