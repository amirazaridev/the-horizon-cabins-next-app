import type { UserRole } from "@/features/auth/constants/auth-cookie";

/** برچسب فارسی نقش‌ها — تک‌منبع برای اجزای نوار بالا. */
export const ROLE_LABELS: Record<UserRole, string> = {
  owner: "مالک / مدیر ارشد",
  admin: "مدیر سایت",
  guest: "مهمان",
};
