import type { LucideIcon } from "lucide-react";


export type ShellNavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  group?: string;
};


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
  