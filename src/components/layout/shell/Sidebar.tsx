"use client";

import { LogOut, X } from "lucide-react";
import Link from "next/link";
import { useTransition, type ReactNode } from "react";

import ThemeToggle from "@/components/ui/ThemeToggle";
import { logoutAction } from "@/features/auth/actions/auth.actions";
import { findActiveNavItem, type ShellNavItem } from "./shell-nav";

type Props = {
  items: readonly ShellNavItem[];
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
 * چیدمان (بالا به پایین): برند ← ناوبری ← [موبایل: تم] ← محتوای اختیاری
 * (پروفایل) ← دکمه‌ی خروج.
 *
 * ⚠️ این کامپوننت از پنل مدیریت استخراج شد تا «ناحیه‌ی مهمان» هم همان
 * رفتار/ظاهر را بگیرد و دو نسخه‌ی موازی از سایدبار نداشته باشیم.
 */
export default function Sidebar({
  items,
  pathname,
  open,
  onClose,
  brand,
  profile,
}: Props): ReactNode {
  const [isPending, startTransition] = useTransition();
  const activeItem = findActiveNavItem(items, pathname);

  return (
    <aside
      aria-label="ناوبری"
      className={`bg-surface border-border fixed inset-y-0 z-50 flex w-75 flex-col border-l transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="border-border flex h-16 shrink-0 items-center justify-between border-b px-4 ">
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

      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
        role="navigation"
      >
        {items.map((item) => {
          const isActive = activeItem?.href === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary-400/10 text-primary-600 dark:text-primary-400"
                  : "text-text-gray hover:bg-foreground/5 hover:text-text"
              }`}
            >
              <item.icon
                className={`size-5 shrink-0 ${
                  isActive ? "text-primary-500 dark:text-primary-400" : ""
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mb-2 flex items-center justify-between px-6 lg:hidden">
        <span className="text-text/70 text-sm">تم</span>
        <ThemeToggle forMobile />
      </div>

      <div className="border-border border-t p-3">
        {profile && <div className="mb-2">{profile}</div>}

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
