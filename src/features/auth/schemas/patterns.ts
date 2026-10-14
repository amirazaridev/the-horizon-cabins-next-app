export const NAME_PATTERN = /^[\p{L}\u200c .'-]+$/u;

export const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/** کاراکترهای چاپ‌شدنی ASCII — برای رد کردن ارقام فارسی در ایمیل. */
export const ASCII_PRINTABLE_PATTERN = /^[\x20-\x7E]+$/;

/** فقط رقم لاتین — بعد از `normalizeDigits`. */
export const DIGITS_ONLY_PATTERN = /^\d+$/;
