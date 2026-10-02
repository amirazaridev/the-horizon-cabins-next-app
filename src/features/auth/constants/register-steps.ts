import { Building2, MailCheck, ShieldCheck } from "lucide-react";
import type { RegisterStep } from "../types/auth.types";

/**
 * مراحل فرم ثبت‌نام — تک‌منبع برای استپر، نوار پیشرفت و متن دکمه‌ها.
 * افزودن یا جابه‌جایی مرحله فقط همین‌جا انجام می‌شود.
 */
export const REGISTER_STEPS = [
  {
    id: "identity",
    title: "اطلاعات شخصی",
    description: "نام، نام خانوادگی و ایمیل خود را وارد کنید",
    icon: Building2,
  },
  {
    id: "verification",
    title: "تایید ایمیل",
    description: "کد ۶ رقمی ارسال‌شده را وارد کنید",
    icon: MailCheck,
  },
  {
    id: "password",
    title: "تعریف رمز عبور",
    description: "یک رمز قوی برای حساب خود انتخاب کنید",
    icon: ShieldCheck,
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
