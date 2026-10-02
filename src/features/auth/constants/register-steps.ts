import { Building2, MailCheck, ShieldCheck } from "lucide-react";
import type { RegisterStep } from "../types/auth.types";

/**
 * مراحل فرم ثبت‌نام — تک‌منبع برای استپر، نوار پیشرفت و متن دکمه‌ها.
 * افزودن یا جابه‌جایی مرحله فقط همین‌جا انجام می‌شود.
 *
 * ⚠️ ترتیب عمدی است: ابتدا هویت و رمز عبور، و **در پایان** تایید ایمیل.
 * منطق این جریان این است که کاربر اول یک حساب «ساخته‌شده» می‌سازد و
 * تایید ایمیل آخرین دروازه‌ی فعال‌سازی است؛ پس اگر از صفحه خارج شد،
 * حساب نیمه‌کاره با رمز مشخص باقی می‌ماند و با ارسال مجدد کد قابل
 * تکمیل است — نه اینکه دوباره از صفر شروع کند.
 *
 * ⭐ جابه‌جایی مراحل روی هیچ‌جای دیگری اثر نمی‌گذارد، چون همه‌ی منطق ویزارد
 * با **شناسه‌ی مرحله** (`step.id`) تصمیم می‌گیرد نه با اندیس عددی. تنها
 * استثناء عمدی `maxReached` است که ذاتاً عددی است و با `getRegisterStepIndex`
 * از شناسه ساخته می‌شود.
 */
export const REGISTER_STEPS = [
  {
    id: "identity",
    title: "اطلاعات شخصی",
    description: "نام، نام خانوادگی و ایمیل خود را وارد کنید",
    icon: Building2,
  },
  {
    id: "password",
    title: "تعریف رمز عبور",
    description: "یک رمز قوی برای حساب خود انتخاب کنید",
    icon: ShieldCheck,
  },
  {
    id: "verification",
    title: "تایید ایمیل",
    description: "کد ۶ رقمی ارسال‌شده به ایمیل را وارد کنید",
    icon: MailCheck,
  },
] as const satisfies ReadonlyArray<{
  id: RegisterStep;
  title: string;
  description: string;
  icon: typeof Building2;
}>;

export const DEFAULT_REGISTER_STEP: RegisterStep = REGISTER_STEPS[0].id;

export function getRegisterStepIndex(step: RegisterStep): number {
  return REGISTER_STEPS.findIndex((item) => item.id === step);
}

/** آخرین مرحله‌ی ویزارد — همان مرحله‌ای که حساب را نهایی می‌کند. */
export const FINAL_REGISTER_STEP: RegisterStep =
  REGISTER_STEPS[REGISTER_STEPS.length - 1].id;
