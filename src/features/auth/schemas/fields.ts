import { z } from "zod";

import { AUTH_LIMITS } from "../constants/auth-limits";
import { AUTH_MESSAGES, FIELD_LABELS } from "./messages";
import {
  ASCII_PRINTABLE_PATTERN,
  DIGITS_ONLY_PATTERN,
  EMAIL_PATTERN,
  NAME_PATTERN,
} from "./patterns";
import { normalizeDigits } from "./normalize";

/**
 * سازنده‌های اسکیمای فیلد — تک‌منبع هر قاعده‌ی فیلد.
 *
 * چرا تابع و نه اسکیمای آماده؟ چون پیام خطا به برچسب فیلد وابسته است
 * («نام الزامی است» در مقابل «نام خانوادگی الزامی است») و ما می‌خواهیم
 * هر جای پروژه فقط با `nameField("نام خانوادگی")` یک فیلد بسازد.
 */

export const nameField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, AUTH_MESSAGES.required(label))
    .min(AUTH_LIMITS.nameMin, AUTH_MESSAGES.minLength(label, AUTH_LIMITS.nameMin))
    .max(AUTH_LIMITS.nameMax, AUTH_MESSAGES.maxLength(label, AUTH_LIMITS.nameMax))
    .regex(NAME_PATTERN, AUTH_MESSAGES.nameLettersOnly(label));

export const emailField = z
  .string()
  .trim()
  .min(1, AUTH_MESSAGES.required(FIELD_LABELS.email))
  .max(
    AUTH_LIMITS.emailMax,
    AUTH_MESSAGES.maxLength(FIELD_LABELS.email, AUTH_LIMITS.emailMax),
  )
  .regex(ASCII_PRINTABLE_PATTERN, AUTH_MESSAGES.emailSuggestionOnly)
  .regex(EMAIL_PATTERN, AUTH_MESSAGES.emailInvalid);

/** کد تایید: ابتدا ارقام فارسی نرمال می‌شوند، بعد طول و رقم‌بودن چک می‌شود. */
export const otpField = z
  .string()
  .trim()
  .transform(normalizeDigits)
  .refine((value) => value.length > 0, AUTH_MESSAGES.required("کد تایید"))
  .refine(
    (value) => value.length === AUTH_LIMITS.otpLength,
    AUTH_MESSAGES.otpLength(),
  )
  .refine((value) => DIGITS_ONLY_PATTERN.test(value), AUTH_MESSAGES.otpDigitsOnly);
