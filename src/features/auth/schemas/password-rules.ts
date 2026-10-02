import { AUTH_LIMITS, PASSWORD_STRENGTH_SEGMENTS } from "../constants/auth-limits";

/**
 * قواعدی که «قدرت رمز عبور» را می‌سازند.
 *
 * ⭐ این‌جا **تک‌منبع** است: هم اسکیمای zod همین قواعد را اجرا می‌کند، هم
 * نوار قدرت و چک‌لیست UI از همین آرایه ساخته می‌شوند. قبلاً برچسب‌ها در
 * `PasswordStrength.tsx` دوباره تعریف شده بودند و با کوچک‌ترین تغییر در
 * یکی، دیگری بی‌سروصدا از قافله جا می‌ماند.
 */
export const PASSWORD_RULES = [
  {
    id: "length",
    label: `حداقل ${AUTH_LIMITS.passwordMin} کاراکتر`,
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

/**
 * دسترسی به قاعده با شناسه — بدون اندیس عددی جادویی.
 *
 * قبلاً اسکیما با `PASSWORD_RULES[1]` و `[2]` و `[3]` کار می‌کرد؛ با
 * جابه‌جایی ترتیب آرایه، اعتبارسنجی بی‌سروصدا عوض می‌شد. `ruleOf("case")`
 * این ریسک را حذف می‌کند.
 */
export function ruleOf(id: PasswordRuleId): (typeof PASSWORD_RULES)[number] {
  const rule = PASSWORD_RULES.find((item) => item.id === id);
  if (!rule) throw new Error(`قاعده‌ی رمز ناشناخته: ${id}`);
  return rule;
}

export type PasswordStrength = {
  /** ۰ تا ۴ — برابر تعداد قواعد برقرارشده. */
  score: number;
  label: string;
  /** شناسه‌ی قواعدی که هنوز برقرار نشده‌اند. */
  unmet: PasswordRuleId[];
};

const STRENGTH_LABELS = ["خیلی ضعیف", "ضعیف", "متوسط", "خوب", "عالی"];

/** محاسبه‌ی امتیاز و برچسب قدرت رمز — تابع خالص و قابل تست. */
export function getPasswordStrength(password: string): PasswordStrength {
  const results = PASSWORD_RULES.map((rule) => ({
    id: rule.id,
    passed: rule.test(password),
  }));
  const score = results.filter((result) => result.passed).length;

  return {
    score,
    label: STRENGTH_LABELS[score] ?? STRENGTH_LABELS[0],
    unmet: results.filter((result) => !result.passed).map((result) => result.id),
  };
}

/** تعداد بخش‌های نوار قدرت — برای رندر یکنواخت در UI. */
export const STRENGTH_SEGMENTS = PASSWORD_STRENGTH_SEGMENTS;
