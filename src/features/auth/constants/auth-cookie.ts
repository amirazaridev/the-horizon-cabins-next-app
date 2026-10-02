/**
 * ثابت‌های کوکی احراز هویت.
 *
 * ⚠️ این فایل باید «edge-safe» بماند: هم `proxy.ts` (Edge Runtime) و هم
 * Server Actions/Components آن را import می‌کنند. پس هیچ وابستگی Node-only
 * (مثل `server-only` یا کتابخانه‌های crypto نودی) نباید اینجا بیاید.
 */

/** نام کوکی JWT — همان نامی که پروژه از ابتدا استفاده می‌کند. */
export const AUTH_COOKIE_NAME = "JWT";

/** عمر پیش‌فرض کوکی روی مرورگر: ۷ روز. */
export const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** نقش‌های کاربری — آینه‌ی enum بک‌اند (`user_role`). */
export type UserRole = "admin" | "owner" | "guest";

/** نقش‌هایی که اجازه‌ی ورود به پنل را دارند. */
export const DASHBOARD_ROLES: readonly UserRole[] = ["admin", "owner"];

/**
 * بررسی اینکه آیا نقش داده‌شده به پنل مدیریت دسترسی دارد.
 * تنها منبع حقیقت برای این تصمیم — هم در middleware و هم در Server Component.
 */
export function canAccessDashboard(role: UserRole | undefined | null): boolean {
  return !!role && DASHBOARD_ROLES.includes(role);
}
