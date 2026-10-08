"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";

import Menus from "@/components/ui/Menus";
import { logoutAction } from "@/features/auth/actions/auth.actions";
import { GUEST_NAV_ITEMS } from "@/features/guest/shared/constants/guest-nav-items";
import { ROLE_LABELS } from "./constants";
import type { NavbarUser } from "./types";

/**
 * حالت پروفایل نوار بالا — جایگزین دکمه‌ی «ورود | ثبت‌نام» برای کاربر
 * وارد‌شده.
 *
 * ⚠️ تریگر فقط «عکس پروفایل + فلش» است و ایمیل کامل در نوار بالا نمایش
 * داده نمی‌شود (جمع‌وجورتر و کم‌سروصداتر)؛ ایمیل داخل سرصفحه‌ی خودِ منو
 * می‌آید تا همچنان در دسترس باشد.
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
        className="text-inherit! gap-1 rounded-full p-1"
        icon={
          <>
            <span className="from-primary-400 to-primary-600 grid size-9 shrink-0 place-items-center rounded-full bg-linear-to-br text-sm font-bold text-white">
              {initial}
            </span>
            <ChevronDown className="size-4 opacity-70" />
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
              <span
                className="text-text block truncate text-xs font-semibold"
                dir="ltr"
              >
                {email}
              </span>
              <span className="text-text-gray mt-0.5 block text-[10px]">
                {ROLE_LABELS[role]}
              </span>
            </span>
          </span>
        </Menus.Header>

        {/* بخش‌های ناحیه‌ی مهمان — تک‌منبع با سایدبار (`GUEST_NAV_ITEMS`). */}
        {GUEST_NAV_ITEMS.map(({ name, href, icon: Icon }) => (
          <Menus.Button
            key={href}
            icon={<Icon className="size-4" />}
            onClick={() => router.push(href)}
          >
            {name}
          </Menus.Button>
        ))}

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
