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
  /**
   * عنوان دسته.
   *
   * آیتم‌های هم‌گروه زیر یک سرصفحه‌ی مشترک می‌آیند و **ترتیب دسته‌ها همان
   * ترتیب اولین ظهور در آرایه است**. اگر هیچ آیتمی `group` نداشته باشد،
   * ناوبری مثل قبل تخت (بدون سرصفحه) رندر می‌شود.
   */
  group?: string;
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

/** یک بخش از ناوبری — آیتم‌های یک دسته. */
export interface ShellNavSection<T extends ShellNavItem> {
  /** عنوان دسته؛ `null` یعنی بخش بدون سرصفحه (ناوبری تخت). */
  title: string | null;
  items: T[];
}

/**
 * گروه‌بندی آیتم‌ها بر اساس `group` — ترتیب دسته‌ها = ترتیب اولین ظهور.
 *
 * ⚠️ آرایه‌ی ورودی دست‌نخورده می‌ماند (بدون تغییر ترتیب)، پس هم‌زمان با
 * `findActiveNavItem` روی همان آرایه کار می‌کند.
 */
export function groupNavItems<T extends ShellNavItem>(
  items: readonly T[],
): ShellNavSection<T>[] {
  const sections: ShellNavSection<T>[] = [];
  const indexByTitle = new Map<string, number>();

  for (const item of items) {
    const title = item.group ?? null;
    const key = title ?? "\u0000flat";

    let index = indexByTitle.get(key);
    if (index === undefined) {
      index = sections.length;
      indexByTitle.set(key, index);
      sections.push({ title, items: [] });
    }

    sections[index].items.push(item);
  }

  return sections;
}
  