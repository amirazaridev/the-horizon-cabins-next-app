"use client";

import { ChevronLeft, LogOut, Settings, Ticket } from "lucide-react";
import Link from "next/link";
import { useTransition, type ReactNode } from "react";

import { logoutAction } from "@/features/auth/actions/auth.actions";
import { ROLE_LABELS } from "./constants";
import type { NavbarUser } from "./types";

type Props = {
  user: NavbarUser;
  /** بستن پنل موبایل (با انیمیشن خروج). */
  closeMenu: () => void;
};

const ITEMS = [
  { label: "رزروهای من", href: "/my/bookings", icon: Ticket },
  { label: "تنظیمات حساب کاربری", href: "/my/account", icon: Settings },
] as const;

/**
 * بلوک پروفایل منوی موبایل — جایگزین دکمه‌ی «ورود | ثبت‌نام» برای کاربر
 * وارد‌شده. همان سه گزینه‌ی منوی دسکتاپ را به‌شکل ردیف‌های تمام‌عرض
 * نشان می‌دهد (مناسب لمس).
 */
export default function MobileProfile({ user, closeMenu }: Props): ReactNode {
  const [isPending, startTransition] = useTransition();
  const initial = user.email.trim().charAt(0).toUpperCase() || "؟";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="bg-foreground/5 border-foreground/10 mb-1 flex items-center gap-3 rounded-2xl border p-3">
        <span className="from-primary-400 to-primary-600 grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br text-sm font-bold text-white">
          {initial}
        </span>
        <span className="min-w-0">
          <span className="text-text block truncate text-sm font-semibold">
            {user.email}
          </span>
          <span className="text-text-gray mt-0.5 block text-xs">
            {ROLE_LABELS[user.role]}
          </span>
        </span>
      </div>

      {ITEMS.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={closeMenu}
          className="text-text hover:bg-foreground/5 hover:text-primary-400 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors"
        >
          <Icon className="size-4.5 shrink-0" />
          {label}
          <ChevronLeft className="text-text-gray/60 ms-auto size-4" />
        </Link>
      ))}

      <button
        type="button"
        onClick={() => startTransition(() => void logoutAction())}
        className="text-danger hover:bg-danger/10 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors"
      >
        <LogOut className="size-4.5 shrink-0" />
        {isPending ? "در حال خروج…" : "خروج"}
      </button>
    </div>
  );
}
