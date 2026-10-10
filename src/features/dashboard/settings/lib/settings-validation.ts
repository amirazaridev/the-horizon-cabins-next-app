import {
  deriveMaxRegularPrice,
  INT4_MAX,
  SETTING_BOUNDS,
} from "../constants/settings-fields";
import type {
  AppSettings,
  EditableSettingKey,
  SettingKey,
  SettingsColumns,
} from "../types/settings.types";

/** پیش‌نویس فرم — همه‌ی مقادیر به‌شکل رشته (همان چیزی که در input است). */
export type SettingsDraft = Record<SettingKey, string>;

/** خطاهای فیلدی (نام فیلد → پیام فارسی). */
export type SettingsFieldErrors = Partial<Record<SettingKey, string>>;

export interface SettingsValidationResult {
  fieldErrors: SettingsFieldErrors;
  /** مقادیر معتبر — فقط وقتی خطایی نیست. */
  values: SettingsColumns | null;
}

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** ارقام فارسی/عربی و جداکننده‌ها را به شکل قابل‌پارس تبدیل می‌کند. */
export function normalizeNumericInput(raw: string): string {
  return raw
    .split("")
    .map((char) => {
      const fa = FA_DIGITS.indexOf(char);
      if (fa >= 0) return String(fa);
      const ar = AR_DIGITS.indexOf(char);
      if (ar >= 0) return String(ar);
      return char;
    })
    .join("")
    .replace(/[,\s٬،]/g, "");
}

/** رشته‌ی ورودی → عدد صحیح، یا `null` اگر نامعتبر باشد. */
export function parseSettingInput(raw: string): number | null {
  const normalized = normalizeNumericInput(raw);
  if (normalized === "") return null;
  if (!/^\d+$/.test(normalized)) return null;

  const value = Number(normalized);
  return Number.isSafeInteger(value) ? value : null;
}

function formatNumber(value: number): string {
  return value.toLocaleString("fa-IR");
}

/** تبدیل تنظیمات سرور به پیش‌نویس فرم. */
export function settingsToDraft(settings: AppSettings): SettingsDraft {
  const draft = {} as SettingsDraft;
  for (const key of Object.keys(settings) as SettingKey[]) {
    draft[key] = String(settings[key]);
  }
  return draft;
}

/**
 * اعتبارسنجی کامل پیش‌نویس: کران هر فیلد + قواعد بین‌فیلدی.
 *
 * ⚠️ آینه‌ی اعتبارسنجی بک‌اند است (`setting.validation.ts`). هدف این است که
 * کاربر **قبل از ارسال** خطا را ببیند؛ اما منبع نهایی صحت، سرور است.
 */
export function validateSettingsDraft(draft: SettingsDraft): SettingsValidationResult {
  const fieldErrors: SettingsFieldErrors = {};
  const values: Partial<SettingsColumns> = {};

  for (const [key, bounds] of Object.entries(SETTING_BOUNDS) as Array<
    [EditableSettingKey, { min: number; max: number }]
  >) {
    const value = parseSettingInput(draft[key]);

    if (value === null) {
      fieldErrors[key] = "یک عدد صحیح وارد کنید.";
      continue;
    }
    if (value < bounds.min || value > bounds.max) {
      fieldErrors[key] =
        `باید بین ${formatNumber(bounds.min)} و ${formatNumber(bounds.max)} باشد.`;
      continue;
    }

    values[key] = value;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: null };
  }

  const resolved = values as SettingsColumns;
  const crossErrors = crossFieldErrors(resolved);
  if (Object.keys(crossErrors).length > 0) {
    return { fieldErrors: crossErrors, values: null };
  }

  return { fieldErrors: {}, values: resolved };
}

/**
 * قواعد بین‌فیلدی — آینه‌ی `assertConsistent` بک‌اند.
 * هر خطا به مرتبط‌ترین فیلد می‌چسبد تا کاربر بداند کدام را اصلاح کند.
 */
function crossFieldErrors(values: SettingsColumns): SettingsFieldErrors {
  const errors: SettingsFieldErrors = {};

  if (values.maxBookingLength < values.minBookingLength) {
    errors.maxBookingLength =
      `باید بزرگ‌تر یا مساوی «حداقل طول اقامت» (${formatNumber(values.minBookingLength)}) باشد.`;
  }

  if (values.startingPriceWindowDays > values.maxAdvanceBookingDays) {
    errors.startingPriceWindowDays =
      `نباید از «حداکثر افق رزرو» (${formatNumber(values.maxAdvanceBookingDays)}) بیشتر باشد.`;
  }

  if (values.maxRegularPrice < values.minRegularPrice) {
    errors.maxRegularPrice =
      `باید بزرگ‌تر یا مساوی «حداقل قیمت پایه» (${formatNumber(values.minRegularPrice)}) باشد.`;
  }

  if (values.maxNightlyPrice < values.minRegularPrice) {
    errors.maxNightlyPrice =
      `نباید از «حداقل قیمت پایه» (${formatNumber(values.minRegularPrice)}) کمتر باشد.`;
  }

  const derivedMax = deriveMaxRegularPrice(
    values.maxNightlyPrice,
    values.maxTotalSurchargePercent,
  );
  if (values.maxRegularPrice > derivedMax) {
    errors.maxRegularPrice =
      `با توجه به سقف قیمت هر شب و حداکثر درصد افزایش، بیشترین مقدار مجاز ${formatNumber(derivedMax)} است.`;
  }

  if (values.maxBookingLength * values.maxNightlyPrice > INT4_MAX) {
    errors.maxNightlyPrice =
      `حاصل‌ضرب «حداکثر طول اقامت» در «سقف قیمت هر شب» از سقف مجاز جمع رزرو (${formatNumber(INT4_MAX)}) عبور می‌کند.`;
  }

  return errors;
}

/** فقط فیلدهای تغییرکرده را برای `PATCH /settings` جدا می‌کند. */
export function toUpdatePayload(
  draft: SettingsDraft,
  baseline: AppSettings,
): Partial<SettingsColumns> {
  const payload: Partial<SettingsColumns> = {};

  for (const key of Object.keys(SETTING_BOUNDS) as EditableSettingKey[]) {
    const value = parseSettingInput(draft[key]);
    if (value !== null && value !== baseline[key]) payload[key] = value;
  }

  return payload;
}
