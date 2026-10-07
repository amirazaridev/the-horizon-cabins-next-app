import "server-only";
import { redirect } from "next/navigation";

import { canAccessDashboard } from "../constants/auth-cookie";
import { getCurrentUser, type CurrentUser } from "../services/session.service";

/**
 * گاردهای سمت سرور برای Server Components.
 *
 * ⚠️ چرا علاوه بر `proxy.ts` این‌ها لازم‌اند؟
 * proxy یک لایه‌ی زودهنگام است و فقط «وجود کوکی» را چک می‌کند؛ تشخیص
 * نقش واقعی همین‌جاست. این گاردها «دفاع در عمق» می‌سازند: هر Component
 * سروری که به نقش کاربر وابسته است، خودش با تماس به API مطمئن می‌شود.
 */

/**
 * کاربر جاری را برمی‌گرداند یا در صورت نبود/نامعتبر بودن نشست به صفحه‌ی
 * ورود هدایت می‌کند. برای استفاده در Layoutها و صفحه‌های محافظت‌شده.
 */
export async function requireUser(from?: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    const target = from ? `/login?from=${encodeURIComponent(from)}` : "/login";
    redirect(target);
  }
  return user;
}

/**
 * فقط admin/owner اجازه‌ی عبور دارند؛ مهمان به صفحه‌ی اصلی و
 * کاربر بدون نشست به صفحه‌ی ورود هدایت می‌شود.
 */
export async function requireDashboardAccess(from?: string): Promise<CurrentUser> {
  const user = await requireUser(from);
  if (!canAccessDashboard(user.role)) {
    redirect("/");
  }
  return user;
}

/**
 * گارد ناحیه‌ی مهمان (`/account/*`).
 *
 * ⚠️ آینه‌ی `requireDashboardAccess`: هر کاربری که به پنل دسترسی دارد
 * (admin/owner) در ناحیه‌ی مهمان جایی ندارد و به پنل برگردانده می‌شود؛
 * این همان رفتاری است که پیش‌تر `(main)/layout.tsx` انجام می‌داد و با
 * جدا‌شدن ناحیه‌ی مهمان باید حفظ شود.
 */
export async function requireGuestArea(from?: string): Promise<CurrentUser> {
  const user = await requireUser(from);
  if (canAccessDashboard(user.role)) {
    redirect("/dashboard");
  }
  return user;
}
