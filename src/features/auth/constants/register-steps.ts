import { Building2, MailCheck, ShieldCheck } from "lucide-react";
import type { RegisterStep } from "../types/auth.types";

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
