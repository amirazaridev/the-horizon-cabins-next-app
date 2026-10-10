"use client";

import { LogOut, X } from "lucide-react";
import Link from "next/link";
import { useTransition, type ReactNode } from "react";

import ThemeToggle from "@/components/ui/ThemeToggle";
import { logoutAction } from "@/features/auth/actions/auth.actions";
import { findActiveNavItem, groupNavItems, type ShellNavItem } from "./shell-nav";

type Props = {
  items: readonly ShellNavItem[];
  /**
   * آیتم‌های کاربردی پایین سایدبار (مثل «تنظیمات») — بالای دکمه‌ی خروج
   * رندر می‌شوند تا از ناوبری اصلی جدا باشند.
   */
  footerItems?: readonly ShellNavItem[];
  /** مسیر جاری — از `usePathname` در `AppShell` تزریق می‌شود. */
  pathname: string;
  /** وضعیت بازبودن در موبایل (drawer). */
  open: boolean;
  onClose: () => void;
  /** محتوای برند — معمولاً یک `<Link>` به خانه‌ی همان ناحیه. */
  brand: ReactNode;
  /** محتوای اختیاری بالای دکمه‌ی خروج (مثلاً اطلاعات اکانت). */
  profile?: ReactNode;
};

/**
 * سایدبار عمومی پوسته — مشترک بین پنل مدیریت و ناحیه‌ی مهمان.
 *
 * چیدمان (بالا به پایین): برند ← ناوبری **دسته‌بندی‌شده** ← [موبایل: تم]
 * ← محتوای اختیاری (پروفایل) ← آیتم‌های کاربردی (تنظیمات) ← دکمه‌ی خروج.
 *
 * ⚠️ اگر هیچ آیتمی `group` نداشته باشد، ناوبری مثل قبل تخت رندر می‌شود؛ پس
 * ناحیه‌ی مهمان بدون تغییر باقی می‌ماند.
 */
export default function Sidebar({
  items,
  footerItems,
  pathname,
  open,
  onClose,
  brand,
  profile,
}: Props): ReactNode {
  const [isPending, startTransition] = useTransition();
  /**
   * ⚠️ آیتم فعال باید از **اجتماع** ناوبری اصلی و آیتم‌های کاربردی محاسبه شود؛
   * وگرنه آیتم‌هایی مثل «تنظیمات» که در `footerItems` هستند هرگز فعال نمی‌شوند.
   */
  const activeItem = findActiveNavItem([...items, ...(footerItems ?? [])], pathname);
  const sections = groupNavItems(items);

  const renderItem = (item: ShellNavItem): ReactNode => {
    const isActive = activeItem?.href === item.href;
    const Icon = item.icon;

    return (
      <li key={item.href}>
        <Link
          href={item.href}
          onClick={onClose}
          aria-current={isActive ? "page" : undefined}
          className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
            isActive
              ? "bg-primary-400/10 text-primary-600 dark:text-primary-400 font-semibold"
              : "text-text-gray hover:bg-foreground/5 hover:text-text font-medium"
          }`}
        >
          <span
            aria-hidden="true"
            className={`bg-primary-400 absolute inset-y-1.5 start-0 w-1 rounded-full transition-opacity duration-200 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          />
          <Icon
            className={`size-5 shrink-0 transition-colors ${
              isActive ? "text-primary-500 dark:text-primary-400" : "group-hover:text-text"
            }`}
          />
          <span className="truncate">{item.name}</span>
        </Link>
      </li>
    );
  };

  return (
    <aside
      aria-label="ناوبری"
      className={`bg-surface border-border fixed inset-y-0 z-50 flex w-75 flex-col border-l transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="border-border flex h-16 shrink-0 items-center justify-between border-b px-4">
        {brand}
        <button
          type="button"
          onClick={onClose}
          className="hover:bg-foreground/10 rounded-lg p-2 lg:hidden"
          aria-label="بستن منو"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" role="navigation">
        <div className="flex flex-col gap-5">
          {sections.map((section, index) => (
            <div key={section.title ?? `section-${index}`}>
              {section.title && (
                <p className="text-text-gray/70 px-3 pb-2 text-[11px] font-bold tracking-wide">
                  {section.title}
                </p>
              )}
              <ul className="flex flex-col gap-1">{section.items.map(renderItem)}</ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="mb-2 flex items-center justify-between px-6 lg:hidden">
        <span className="text-text/70 text-sm">تم</span>
        <ThemeToggle forMobile />
      </div>

      <div className="border-border border-t p-3">
        {profile && <div className="mb-2">{profile}</div>}

        {footerItems && footerItems.length > 0 && (
          <ul className="mb-1.5 flex flex-col gap-1">{footerItems.map(renderItem)}</ul>
        )}

        {/* خروج واقعی — از طریق Server Action که کوکی نشست را پاک می‌کند. */}
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => void logoutAction())}
          className="text-danger hover:bg-danger/10 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 disabled:opacity-50"
        >
          <LogOut className="size-5 shrink-0" />
          {isPending ? "در حال خروج…" : "خروج"}
        </button>
      </div>
    </aside>
  );
}
