/**
 * تایپ‌های دامنه‌ی احراز هویت.
 *
 * این فایل «قرارداد» بین لایه‌ی UI و لایه‌ی اکشن‌هاست. کامپوننت‌ها فقط
 * این تایپ‌ها را می‌شناسند و هیچ‌جا به شکل خام پاسخ API دست نمی‌زنند.
 *
 * ⚠️ پس از اتصال واقعی OTP، تایپ‌های مربوط به سرویس ماک (payload/result
 * سرویس کلاینت) حذف شدند و هر اکشن تایپ نتیجه‌ی خودش را کنار خودش
 * (`actions/*.actions.ts`) نگه می‌دارد. اینجا فقط قراردادهای مشترک می‌مانند.
 */

/** مراحل فرم ثبت‌نام — ترتیب نمایش استپر از همین می‌آید. */
export type RegisterStep = "identity" | "verification" | "password";

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
