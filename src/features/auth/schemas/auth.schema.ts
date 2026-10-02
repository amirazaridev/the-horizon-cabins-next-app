import { z } from "zod";

/**
 * پیام‌های خطای فارسی — تک‌منبع.
 *
 * همه‌ی پیام‌ها اینجا متمرکزند تا اگر روزی کپی/لحن عوض شد فقط یک فایل
 * دست بخورد، و کامپوننت‌های UI هیچ متن اعتبارسنجی‌ای هاردکد نکنند.
 *
 * ⚠️ اعداد داخل پیام‌ها با ارقام فارسی و کاما فارسی نوشته می‌شوند
 * (`۷farsi`)، چون بقیه‌ی پروژه هم همین کار را می‌کند
 * (`formatCurrency` با `Intl.NumberFormat("fa-IR")`).
 */
export function faNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

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
} as const;

/** حداقل/حداکثر طول‌ها — UI هم برای شمارنده‌ها از همین‌ها می‌خواند. */
export const AUTH_LIMITS = {
  nameMin: 3,
  nameMax: 30,
  emailMax: 254,
  /** کوتاه‌ترین رمز مجاز به‌عنوان بیس؛ سخت‌گیری واقعی با قدرت‌سنج سنجیده می‌شود. */
  passwordMin: 8,
  passwordMax: 64,
  otpLength: 6,
  /** حداقل امتیاز قدرت رمز (۰..۴) برای اجازه‌ی عبور از مرحله‌ی آخر. */
  passwordMinScore: 3,
  /** فاصله‌ی ارسال مجدد کد تایید (ثانیه) — باید با سیاست سرور یکی بماند. */
  resendSeconds: 60,
  /** مدت اعتبار کد تایید (ثانیه). */
  codeTtlSeconds: 120,
} as const;

/**
 * نرمال‌سازی ارقام فارسی/عربی به لاتین.
 *
 * کاربر ایرانی ممکن است با کیبورد فارسی عدد بزند؛ اگر تبدیل نکنیم،
 * `\d` در regex آن‌ها را نمی‌گیرد و «کد تایید نامعتبر» بی‌دلیل نشان داده می‌شود.
 */
export function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

/** حذف فاصله‌های ابتدا/انتها + تبدیل ارقام + یکسان‌سازی «ی/ك» عربی. */
export function normalizeText(value: string): string {
  return normalizeDigits(value)
    .replace(/\u200c/g, "\u200c")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .trim();
}

/** نام: فقط حروف (فارسی/لاتین)، فاصله، نقطه، خط تیره و زیرنویس ZWNJ. */
const NAME_PATTERN = /^[\p{L}\u200c .'-]+$/u;
/** ایمیل: عمداً فقط ASCII؛ کاراکترهای غیرلاتین در ایمیل کاربر را سردرگم می‌کند. */
const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/** قواعدی که قدرت رمز را می‌سازند — UI چک‌لیست را از همین می‌سازد. */
export const PASSWORD_RULES = [
  {
    id: "length",
    label: "حداقل ۸ کاراکتر",
    test: (value: string) => value.length >= AUTH_LIMITS.passwordMin,
  },
  {
    id: "case",
    label: "حرف بزرگ و کوچک انگلیسی",
    test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value),
  },
  {
    id: "digit",
    label: "حداقل یک عدد",
    test: (value: string) => /\d/.test(value),
  },
  {
    id: "special",
    label: "حداقل یک کاراکتر ویژه",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
] as const;

export type PasswordRuleId = (typeof PASSWORD_RULES)[number]["id"];

export type PasswordStrength = {
  /** ۰ تا ۴ — برابر تعداد قواعد برقرارشده. */
  score: number;
  label: string;
  /** شناسه‌ی قواعدی که هنوز برقرار نشده‌اند. */
  unmet: PasswordRuleId[];
};

const STRENGTH_LABELS = ["خیلی ضعیف", "ضعیف", "متوسط", "خوب", "عالی"];

export function getPasswordStrength(password: string): PasswordStrength {
  const results = PASSWORD_RULES.map((rule) => ({
    id: rule.id,
    passed: rule.test(password),
  }));
  const score = results.filter((result) => result.passed).length;

  return {
    score,
    label: STRENGTH_LABELS[score],
    unmet: results.filter((r) => !r.passed).map((r) => r.id),
  };
}

/* ------------------------------------------------------------------ */
/* اسکیماها                                                            */
/* ------------------------------------------------------------------ */

const nameField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, AUTH_MESSAGES.required(label))
    .min(AUTH_LIMITS.nameMin, AUTH_MESSAGES.minLength(label, AUTH_LIMITS.nameMin))
    .max(AUTH_LIMITS.nameMax, AUTH_MESSAGES.maxLength(label, AUTH_LIMITS.nameMax))
    .regex(NAME_PATTERN, AUTH_MESSAGES.nameLettersOnly(label));

const emailField = z
  .string()
  .trim()
  .min(1, AUTH_MESSAGES.required("ایمیل"))
  .max(AUTH_LIMITS.emailMax, AUTH_MESSAGES.maxLength("ایمیل", AUTH_LIMITS.emailMax))
  .regex(/^[\x20-\x7E]+$/, AUTH_MESSAGES.emailSuggestionOnly)
  .regex(EMAIL_PATTERN, AUTH_MESSAGES.emailInvalid);

/** مرحله‌ی ۱ ثبت‌نام — نام، نام خانوادگی، ایمیل. */
export const registerStepOneSchema = z.object({
  firstName: nameField("نام"),
  lastName: nameField("نام خانوادگی"),
  email: emailField,
});

/** مرحله‌ی ۲ — کد تایید ایمیل. */
export const registerVerificationSchema = z.object({
  code: z
    .string()
    .trim()
    .transform(normalizeDigits)
    .refine((value) => value.length > 0, AUTH_MESSAGES.required("کد تایید"))
    .refine(
      (value) => value.length === AUTH_LIMITS.otpLength,
      AUTH_MESSAGES.otpLength(),
    )
    .refine((value) => /^\d+$/.test(value), AUTH_MESSAGES.otpDigitsOnly),
});

/**
 * مرحله‌ی ۳ — رمز عبور.
 *
 * سخت‌گیری عمداً روی «قدرت» است نه فقط طول: سه قاعده‌ی اول باید برقرار
 * شوند تا کاربر بتواند حساب بسازد. `PASSWORD_RULES` و این اسکیما از یک
 * تعریف می‌خوانند تا پیام خطا و چک‌لیست UI هرگز از هم جدا نشوند.
 */
export const registerPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, AUTH_MESSAGES.required("رمز عبور"))
      .max(
        AUTH_LIMITS.passwordMax,
        AUTH_MESSAGES.maxLength("رمز عبور", AUTH_LIMITS.passwordMax),
      )
      .refine(
        (value) => value.length >= AUTH_LIMITS.passwordMin,
        AUTH_MESSAGES.passwordWeak(AUTH_LIMITS.passwordMin),
      )
      .refine(
        (value) => PASSWORD_RULES[1].test(value),
        AUTH_MESSAGES.passwordNeedsUpperAndLower,
      )
      .refine(
        (value) => PASSWORD_RULES[2].test(value),
        AUTH_MESSAGES.passwordNeedsNumber,
      )
      .refine(
        (value) => PASSWORD_RULES[3].test(value),
        AUTH_MESSAGES.passwordNeedsSpecial,
      ),
    confirmPassword: z.string().min(1, AUTH_MESSAGES.required("تکرار رمز عبور")),
    acceptedTerms: z
      .boolean()
      .refine((value) => value, AUTH_MESSAGES.termsRequired),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: AUTH_MESSAGES.passwordMismatch,
    path: ["confirmPassword"],
  });

/** اسکیمای کامل ثبت‌نام — برای اعتبارسنجی نهایی قبل از ارسال. */
export const registerSchema = registerStepOneSchema
  .merge(registerVerificationSchema)
  .merge(z.object({ password: z.string(), confirmPassword: z.string() }))
  .superRefine((values, ctx) => {
    const passwordResult = registerPasswordSchema.safeParse({
      password: values.password,
      confirmPassword: values.confirmPassword,
      acceptedTerms: true,
    });

    if (passwordResult.success) return;
    for (const issue of passwordResult.error.issues) {
      ctx.addIssue({ ...issue, path: issue.path });
    }
  });

/** ورود با ایمیل و رمز عبور. */
export const loginSchema = z.object({
  email: emailField,
  password: z
    .string()
    .min(1, AUTH_MESSAGES.required("رمز عبور"))
    .min(AUTH_LIMITS.passwordMin, AUTH_MESSAGES.passwordWeak(AUTH_LIMITS.passwordMin)),
  rememberMe: z.boolean().default(false),
});

/** فراموشی رمز عبور — فقط ایمیل. */
export const forgotPasswordSchema = z.object({
  email: emailField,
});

/* ------------------------------------------------------------------ */
/* تایپ‌ها                                                             */
/* ------------------------------------------------------------------ */

export type RegisterStepOneValues = z.input<typeof registerStepOneSchema>;
export type RegisterVerificationValues = z.input<typeof registerVerificationSchema>;
export type RegisterPasswordValues = z.input<typeof registerPasswordSchema>;
export type RegisterFormValues = RegisterStepOneValues &
  RegisterVerificationValues &
  RegisterPasswordValues;
export type LoginFormValues = z.input<typeof loginSchema>;
export type ForgotPasswordValues = z.input<typeof forgotPasswordSchema>;

/**
 * اعتبارسنجی سبک برای سرور (route handler) — بدون وابستگی به کامپوننت.
 * خروجی: پیام خطای فارسی یا `null` در صورت معتبر بودن.
 */
export function validateEmail(value: string): string | null {
  const result = emailField.safeParse(value);
  return result.success ? null : (result.error.issues[0]?.message ?? null);
}

export function validatePassword(value: string): string | null {
  const result = z
    .string()
    .min(1, AUTH_MESSAGES.required("رمز عبور"))
    .min(AUTH_LIMITS.passwordMin, AUTH_MESSAGES.passwordWeak(AUTH_LIMITS.passwordMin))
    .safeParse(value);
  return result.success ? null : (result.error.issues[0]?.message ?? null);
}
