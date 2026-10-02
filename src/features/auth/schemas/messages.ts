import { faCount } from "../constants/auth-limits";

/**
 * نمایش عدد با ارقام فارسی — روان‌ترین نام برای مصرف در UI.
 *
 * alias رسمی `faCount` است (که خودش `formatCurrency` مشترک پروژه را
 * صدا می‌زند)؛ این نام برای خوانایی کامپوننت‌ها نگه داشته شده.
 */
export const faNumber = faCount;

/**
 * پیام‌های خطای فارسی — تک‌منبع.
 *
 * همه‌ی پیام‌ها اینجا متمرکزند تا اگر روزی کپی/لحن عوض شد فقط یک فایل
 * دست بخورد، و کامپوننت‌های UI هیچ متن اعتبارسنجی‌ای هاردکد نکنند.
 *
 * ⚠️ اعداد داخل پیام‌ها با ارقام فارسی نوشته می‌شوند (`faNumber`)، چون
 * بقیه‌ی پروژه هم همین کار را می‌کند.
 */
export const AUTH_MESSAGES = {
  required: (label: string) => `${label} الزامی است`,
  minLength: (label: string, count: number) =>
    `${label} باید حداقل ${faNumber(count)} کاراکتر باشد`,
  maxLength: (label: string, count: number) =>
    `${label} نباید بیشتر از ${faNumber(count)} کاراکتر باشد`,
  emailInvalid: "فرمت ایمیل صحیح نیست",
  emailSuggestionOnly: "ایمیل باید با حروف انگلیسی نوشته شود",
  nameLettersOnly: (label: string) => `${label} فقط می‌تواند حروف باشد`,
  passwordWeak: (count: number) =>
    `رمز عبور باید حداقل ${faNumber(count)} کاراکتر باشد`,
  passwordNeedsUpperAndLower:
    "رمز عبور باید حرف بزرگ و کوچک انگلیسی داشته باشد",
  passwordNeedsNumber: "رمز عبور باید حداقل یک عدد داشته باشد",
  passwordNeedsSpecial: "رمز عبور باید حداقل یک کاراکتر ویژه (!@#$%) داشته باشد",
  passwordMismatch: "تکرار رمز عبور با رمز عبور یکسان نیست",
  termsRequired: "پذیرش قوانین و مقررات الزامی است",
  otpLength: () => "کد تایید باید ۶ رقم باشد",
  otpDigitsOnly: "کد تایید فقط شامل رقم است",
  /** خطای عمومی وقتی مراحل قبلی بین راه نامعتبر شده‌اند. */
  previousStepsIncomplete:
    "اطلاعات مراحل قبلی ناقص است. لطفاً آن‌ها را کامل کنید.",
} as const;

/** برچسب‌های فارسی فیلدها — تا در چند اسکیما تکرار نشوند. */
export const FIELD_LABELS = {
  firstName: "نام",
  lastName: "نام خانوادگی",
  email: "ایمیل",
  code: "کد تایید",
  password: "رمز عبور",
  confirmPassword: "تکرار رمز عبور",
} as const;
