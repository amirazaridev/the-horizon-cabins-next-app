import type { LucideIcon } from "lucide-react";

/**
 * آیتم ناوبری پوسته (سایدبار/هدر).
 *
 * ⚠️ `icon` یک کامپوننت است، پس این آیتم‌ها هرگز نباید از Server Component
 * به Client Component پاس داده شوند (توابع قابل‌سریال‌سازی نیستند)؛ تعریف
 * هر فهرست باید در ماژولی باشد که خودِ کامپوننت کلاینتی import می‌کند.
 */
export type ShellNavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

/**
 * آیتم فعال برای یک مسیر مشخص.
 *
 * ⚠️ قاعده: «طولانی‌ترین پیشوند برنده است». با تطبیق ساده‌ی prefix، آیتم
 * ریشه (مثل `/dashboard`) روی همه‌ی زیرصفحه‌ها فعال می‌ماند و هم‌زمان با
 * آیتم دقیق هم روشن می‌شد؛ با این قاعده روی `/dashboard/cabins/add` فقط
 * «سوییت ها» فعال می‌شود.
 */
export function findActiveNavItem<T extends ShellNavItem>(
  items: readonly T[],
  pathname: string,
): T | undefined {
  return items
    .filter(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
}
