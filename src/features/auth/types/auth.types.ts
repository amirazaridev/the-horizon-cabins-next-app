/**
 * تایپ‌های دامنه‌ی احراز هویت.
 *
 * این فایل «قرارداد» بین لایه‌ی UI و لایه‌ی سرویس است. کامپوننت‌ها فقط
 * این تایپ‌ها را می‌شناسند و هیچ‌جا به شکل خام پاسخ API دست نمی‌زنند؛
 * پس اتصال به بک‌اند واقعی فقط با عوض‌کردن بدنه‌ی `auth.service.ts`
 * انجام می‌شود و به هیچ فایل UI دست نمی‌خورد.
 */

/** مراحل فرم ثبت‌نام — ترتیب نمایش استپر از همین می‌آید. */
export type RegisterStep = "identity" | "verification" | "password";

/** وضعیت چرخه‌ی یک درخواست — برای loading/disabled/error. */
export type RequestStatus = "idle" | "loading" | "success" | "error";

/** هر پاسخ سرویس یا موفق است یا خطای قابل‌نمایش به کاربر. */
export type AuthResult<TData = null> =
  | { ok: true; data: TData }
  | { ok: false; error: AuthError };

/**
 * خطای دامنه‌ای.
 *
 * `field` وقتی پر می‌شود که خطا به یک فیلد مشخص گره بخورد تا فرم بتواند
 * آن را با `setError` روی همان ورودی بنشاند، نه به‌شکل بنر کلی.
 */
export type AuthError = {
  /** کد ماشین‌خوان — UI می‌تواند بر اساس آن رفتار متفاوتی بگیرد. */
  code: AuthErrorCode;
  /** پیام فارسی آماده‌ی نمایش. */
  message: string;
  /** نام فیلد مرتبط (اختیاری). */
  field?: AuthFieldName;
};

export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "EMAIL_ALREADY_EXISTS"
  | "EMAIL_NOT_FOUND"
  | "INVALID_CODE"
  | "CODE_EXPIRED"
  | "TOO_MANY_ATTEMPTS"
  | "WEAK_PASSWORD"
  | "NETWORK"
  | "UNKNOWN";

/** نام فیلدهای فرم‌ها — برای `setError` و `AuthError.field`. */
export type AuthFieldName =
  | "firstName"
  | "lastName"
  | "email"
  | "code"
  | "password"
  | "confirmPassword"
  | "acceptedTerms"
  | "rememberMe";

/* ------------------------------------------------------------------ */
/* ورودی سرویس                                                         */
/* ------------------------------------------------------------------ */

export type RegisterIdentityPayload = {
  firstName: string;
  lastName: string;
  email: string;
};

export type VerifyEmailPayload = {
  email: string;
  code: string;
};

export type RegisterAccountPayload = RegisterIdentityPayload & {
  /** ایمیل پس از تایید شدن — همان `email` ورودی. */
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RequestPasswordResetPayload = {
  email: string;
};

/* ------------------------------------------------------------------ */
/* خروجی سرویس                                                         */
/* ------------------------------------------------------------------ */

/**
 * نتیجه‌ی ارسال کد تایید.
 *
 * ⚠️ `expiresInSeconds` منبع حقیقت تایمر ارسال مجدد است: وقتی بک‌اند
 * واقعی وصل شد، باید همین مقدار از پاسخ سرور بیاید (مثلاً `retryAfter`)
 * تا سیاست محدودیت نرخ سمت سرور و تایمر کلاینت هم‌داستان بمانند.
 */
export type SendVerificationCodeResult = {
  expiresInSeconds: number;
  resendAfterSeconds: number;
  /** در محیط توسعه/ماک: کد تولیدشده برای تست. هرگز از سرور واقعی نیاید. */
  devCode?: string;
};

export type VerifyEmailResult = {
  /** توکن یک‌بارمصرف برای مرحله‌ی ساخت رمز عبور. */
  verificationToken: string;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  /** ثانیه — برای زمان‌بندی تازه‌سازی توکن. */
  expiresIn: number;
};

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt?: string;
};

export type RegisterAccountResult = AuthSession;
export type LoginResult = AuthSession;
export type RequestPasswordResetResult = { sent: true };
