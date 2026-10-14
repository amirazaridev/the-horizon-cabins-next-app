import type { UserRole } from "@/features/auth/constants/auth-cookie";

/** جنسیت — آینه‌ی enum بک‌اند (`gender`). */
export type UserGender = "male" | "female";

/** پروفایل مهمان یک کاربر (اگر داشته باشد). */
export interface UserGuestProfile {
  id: number;
  fullName: string;
  phoneNumber: string | null;
  nationalId: string | null;
  /** تاریخ تولد (`YYYY-MM-DD`) یا `null`. */
  dateOfBirth: string | null;
  gender: UserGender | null;
}

export interface AdminUser {
  id: number;
  email: string;
  role: UserRole;
  /** وضعیت حساب — `false` یعنی کاربر نمی‌تواند وارد شود. */
  active: boolean;
  lastLoginAttempt: string | null;
  lockedUntil: string | null;
  createdAt: string;
  guest: UserGuestProfile | null;
}

/** نتیجه‌ی یک عملیات مدیریتی — برای بنر بازخورد. */
export interface UserActionFeedback {
  success: boolean;
  message: string;
}

/** برچسب فارسی نقش‌ها. */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  guest: "مهمان",
  admin: "مدیر",
  owner: "مالک",
};

/** برچسب فارسی جنسیت. */
export const USER_GENDER_LABELS: Record<UserGender, string> = {
  male: "مرد",
  female: "زن",
};
