/**
 * سرویس احراز هویت سمت کلاینت — تنها لایه‌ای که کامپوننت‌های فرم با آن
 * حرف می‌زنند.
 *
 * ⚠️ نکته‌ی معماری (BFF):
 * این فایل «کلاینتی» است و هرگز مستقیم به Express وصل نمی‌شود. هر تابع
 * یک Server Action را صدا می‌زند؛ Server Action با API حرف می‌زند و کوکی
 * را روی مرورگر ست می‌کند. بنابراین منطق احراز هویت واقعی در
 * `actions/auth.actions.ts` (سمت سرور) زندگی می‌کند و این‌جا فقط
 * آماده‌سازی ورودی/خروجی و نگاشت خطا انجام می‌شود.
 *
 * ⚠️ OTP: مراحل ارسال/بررسی کد تایید در این مرحله ماک هستند (طبق تصمیم
 * پروژه) و در سمت کلاینت شبیه‌سازی می‌شوند؛ فقط ساخت حساب واقعی است.
 */

import {
  AUTH_LIMITS,
  getPasswordStrength,
  normalizeDigits,
  normalizeText,
} from "../schemas";
import { loginAction, registerAction } from "../actions/auth.actions";
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

/** تأخیر مصنوعی شبکه در حالت ماک OTP — تا حالت‌های loading دیده شوند. */
const MOCK_LATENCY_MS = 700;

/** کنترلی برای تست دستی خطاها در محیط توسعه. */
const MOCK_SCENARIO = {
  /** اگر ایمیل با این عبارت شروع شود، ارسال کد خطا می‌دهد. */
  existingEmailPrefix: "taken",
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

function fail(code: AuthErrorCode, message: string, field?: AuthError["field"]): AuthResult<never> {
  return { ok: false, error: { code, message, field } };
}

/* ------------------------------------------------------------------ */
/* OTP ماک                                                             */
/* ------------------------------------------------------------------ */

/** مرحله‌ی ۱ — ارسال کد تایید به ایمیل (ماک). */
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
    console.info(`[auth:mock] کد تایید برای ${normalizedEmail}: ${MOCK_SCENARIO.validCode}`);
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

/** مرحله‌ی ۲ — بررسی کد تایید (ماک). */
export async function verifyEmailCode(
  payload: VerifyEmailPayload,
  options?: { signal?: AbortSignal },
): Promise<AuthResult<VerifyEmailResult>> {
  const code = normalizeDigits(payload.code).trim();

  await delay(MOCK_LATENCY_MS, options?.signal);

  if (code !== MOCK_SCENARIO.validCode) {
    return fail("INVALID_CODE", "کد تایید نادرست است. دوباره تلاش کنید.", "code");
  }

  return { ok: true, data: { verificationToken: `mock-token-${Date.now()}` } };
}

/* ------------------------------------------------------------------ */
/* ورود و ثبت‌نام واقعی                                                */
/* ------------------------------------------------------------------ */

/** ورود با ایمیل و رمز عبور — از طریق Server Action. */
export async function login(
  payload: LoginPayload,
  options?: { signal?: AbortSignal },
): Promise<AuthResult<LoginResult>> {
  void options;
  const result = await loginAction({
    email: payload.email,
    password: payload.password,
  });

  if (!result.ok) return { ok: false, error: result.error };

  return {
    ok: true,
    data: {
      user: {
        id: result.user.id,
        firstName: result.user.email.split("@")[0] ?? "",
        lastName: "",
        email: result.user.email,
      },
      accessToken: "",
      expiresIn: payload.rememberMe ? 60 * 60 * 24 * 30 : 3600,
      role: result.user.role,
      redirectTo: result.redirectTo,
    },
  };
}

/** مرحله‌ی ۳ — ساخت حساب با رمز عبور (واقعی، از طریق Server Action). */
export async function registerAccount(
  payload: RegisterAccountPayload,
  options?: { signal?: AbortSignal },
): Promise<AuthResult<RegisterAccountResult>> {
  void options;
  const strength = getPasswordStrength(payload.password);
  if (strength.score < AUTH_LIMITS.passwordMinScore) {
    return fail("WEAK_PASSWORD", "رمز عبور باید حداقل یک کاراکتر ویژه (!@#$%) داشته باشد", "password");
  }

  const result = await registerAction({
    fullName: `${normalizeText(payload.firstName)} ${normalizeText(payload.lastName)}`.trim(),
    email: payload.email,
    password: payload.password,
  });

  if (!result.ok) return { ok: false, error: result.error };

  return {
    ok: true,
    data: {
      user: {
        id: result.user.id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: result.user.email,
        createdAt: new Date().toISOString(),
      },
      accessToken: "",
      expiresIn: 3600,
      role: result.user.role,
      redirectTo: result.redirectTo,
    },
  };
}

/** درخواست بازیابی رمز عبور (فعلاً ماک). */
export async function requestPasswordReset(
  payload: RequestPasswordResetPayload,
  options?: { signal?: AbortSignal },
): Promise<AuthResult<RequestPasswordResetResult>> {
  await delay(MOCK_LATENCY_MS, options?.signal);
  void payload;
  return { ok: true, data: { sent: true } };
}
