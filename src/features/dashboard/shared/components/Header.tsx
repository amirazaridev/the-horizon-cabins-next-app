"use client";

import {
  ChevronDown,
  ChevronLeft,
  LogOut,
  Menu,
  Search,
  Settings,
  UserPen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

import { SIDEBAR_ITEMS } from "../constants/sidebar-items";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Menus from "@/components/ui/Menus"; // مسیر رو مطابق ساختار پروژه‌ی خودتون تنظیم کنید

interface HeaderProps {
  pathname: string;
  onMenuClick: () => void;
}

export default function Header({ pathname, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const activeItem = SIDEBAR_ITEMS.find((item) => pathname === item.href);
  const title = activeItem?.name ?? "داشبورد";

  return (
    <header className="bg-surface/80 border-border sticky inset-x-0 top-0 z-30 flex h-16 items-center justify-between gap-4 border-b px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="hover:bg-foreground/10 rounded-lg p-2 lg:hidden"
          aria-label="باز کردن منو"
        >
          <Menu className="size-5" />
        </button>
        <div className="flex items-center gap-1.5">
          <span className="text-text-gray text-sm">داشبورد</span>
          <ChevronLeft className="text-text-gray size-4" />
          <h1 className="text-foreground truncate text-base font-bold">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="border-border bg-background-2 focus-within:border-primary-400/60 hidden items-center gap-2 rounded-xl border px-3 py-2 transition-colors md:flex">
          <Search className="text-text-gray size-4" />
          <input
            type="search"
            placeholder="جستجوی سوییت، مهمان، رزرو…"
            className="text-text placeholder:text-text-gray/60 w-45 bg-transparent text-sm outline-none"
          />
        </div>

        <span className="text-text-gray border-border bg-background-2 hidden rounded-xl border px-3 py-2 text-xs font-medium xl:block">
          {format(new Date(), "EEEE d MMMM yyyy", { locale: faIR })}
        </span>

        <ThemeToggle />

        {/* پروفایل ادمین — تک محل ورودی به اطلاعات و اکشن‌های اکانت */}
        <div className="border-border mr-1 flex items-center border-r pr-1">
          <Menus>
            <Menus.Toggle
              id="account-menu"
              icon={
                <>
                  <span className="flex items-center gap-2.5 px-1.5">
                    <span className="from-primary-400 to-primary-600 grid size-9 shrink-0 place-items-center rounded-full bg-linear-to-br text-sm font-bold text-white">
                      ع
                    </span>
                    <span className="hidden text-right lg:block">
                      <p className="text-text text-sm leading-none font-semibold">
                        علی رضایی
                      </p>
                      <p className="text-text-gray mt-1 text-xs">مدیر سایت</p>
                    </span>
                  </span>
                  <ChevronDown className="ms-3 size-5" />
                </>
              }
            />
            <Menus.List id="account-menu">
              <Menus.Button
                icon={<UserPen className="size-4" />}
                onClick={() => router.push("/dashboard/account")}
              >
                ویرایش اکانت
              </Menus.Button>
              <Menus.Button
                icon={<Settings className="size-4" />}
                onClick={() => router.push("/dashboard/settings")}
              >
                تنظیمات
              </Menus.Button>
              <Menus.Divider />
              <Menus.Button
                icon={<LogOut className="size-4" />}
                danger
                onClick={() => {
                  router.push("/");
                }}
              >
                خروج
              </Menus.Button>
            </Menus.List>
          </Menus>
        </div>
      </div>
    </header>
  );
}
