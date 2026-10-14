/** مراحل فرم ثبت‌نام — ترتیب نمایش استپر از همین می‌آید. */
export type RegisterStep = "identity" | "verification" | "password";

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
