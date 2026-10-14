/** نام کوکی JWT — همان نامی که پروژه از ابتدا استفاده می‌کند. */
export const AUTH_COOKIE_NAME = "JWT";

/** عمر پیش‌فرض کوکی روی مرورگر: ۷ روز. */
export const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** نقش‌های کاربری — آینه‌ی enum بک‌اند (`user_role`). */
export type UserRole = "admin" | "owner" | "guest";

/** نقش‌هایی که اجازه‌ی ورود به پنل را دارند. */
export const DASHBOARD_ROLES: readonly UserRole[] = ["admin", "owner"];

export function canAccessDashboard(role: UserRole | undefined | null): boolean {
  return !!role && DASHBOARD_ROLES.includes(role);
}
