"use client";

import { ChevronDown, LogOut, Settings, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";

import Menus from "@/components/ui/Menus";
import { logoutAction } from "@/features/auth/actions/auth.actions";
import { ROLE_LABELS } from "./constants";
import type { NavbarUser } from "./types";

/**
 * حالت پروفایل نوار بالا — جایگزین دکمه‌ی «ورود | ثبت‌نام» برای کاربر
 * وارد‌شده. با کلیک، منوی بازشویی شامل رزروها، تنظیمات حساب و خروج باز
 * می‌شود.
 *
 * ⚠️ از `Menus` مشترک استفاده می‌کند (Portal + بستن با کلیک بیرون + تنظیم
 * موقعیت نسبت به viewport) تا نسخه‌ی دومی از دراپ‌داون ساخته نشود.
 */
export default function ProfileMenu({ email, role }: NavbarUser): ReactNode {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initial = email.trim().charAt(0).toUpperCase() || "؟";

  return (
    <Menus>
      <Menus.Toggle
        id="profile-menu"
        /* رنگ متن از نوار بالا ارث می‌برد (سفید روی هیرو / تیره روی جامد). */
        className="text-inherit!"
        icon={
          <>
            <span className="flex items-center gap-2.5">
              <span className="from-primary-400 to-primary-600 grid size-9 shrink-0 place-items-center rounded-full bg-linear-to-br text-sm font-bold text-white">
                {initial}
              </span>
              <span className="hidden max-w-40 text-right lg:block">
                <span className="block truncate text-xs font-semibold">
                  {email}
                </span>
                <span className="block text-[10px] opacity-70">
                  {ROLE_LABELS[role]}
                </span>
              </span>
            </span>
            <ChevronDown className="ms-2 size-4 opacity-70" />
          </>
        }
      />

      <Menus.List id="profile-menu" className="w-64">
        <Menus.Header>
          <span className="flex items-center gap-2.5">
            <span className="from-primary-400 to-primary-600 grid size-9 shrink-0 place-items-center rounded-full bg-linear-to-br text-sm font-bold text-white">
              {initial}
            </span>
            <span className="min-w-0">
              <span className="text-text block truncate text-xs font-semibold">
                {email}
              </span>
              <span className="text-text-gray mt-0.5 block text-[10px]">
                {ROLE_LABELS[role]}
              </span>
            </span>
          </span>
        </Menus.Header>

        <Menus.Button
          icon={<Ticket className="size-4" />}
          onClick={() => router.push("/my/bookings")}
        >
          رزروهای من
        </Menus.Button>

        <Menus.Button
          icon={<Settings className="size-4" />}
          onClick={() => router.push("/my/account")}
        >
          تنظیمات حساب کاربری
        </Menus.Button>

        <Menus.Divider />

        <Menus.Button
          icon={<LogOut className="size-4" />}
          danger
          onClick={() => startTransition(() => void logoutAction())}
        >
          {isPending ? "در حال خروج…" : "خروج"}
        </Menus.Button>
      </Menus.List>
    </Menus>
  );
}
