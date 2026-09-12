"use client";

import { useState } from "react";
import { Bell, ChevronLeft, Menu, Search } from "lucide-react";
import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

import { SIDEBAR_ITEMS } from "../constants/sidebar-items";
import ThemeToggle from "@/components/ui/ThemeToggle";
import IconButton from "@/components/ui/IconButton";

const NOTIFICATIONS = [
  { id: 1, title: "رزرو جدید برای کلبه چوبی آرامش ثبت شد", time: "۱۰ دقیقه پیش", unread: true },
  { id: 2, title: "پرداخت رزرو #۴۲ با موفقیت انجام شد", time: "۱ ساعت پیش", unread: true },
  { id: 3, title: "میهمان رزرو #۳۸ درخواست تسویه دارد", time: "دیروز", unread: false },
];

interface HeaderProps {
  pathname: string;
  onMenuClick: () => void;
}

export default function Header({ pathname, onMenuClick }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const activeItem = SIDEBAR_ITEMS.find((item) => pathname === item.href);
  const title = activeItem?.name ?? "داشبورد";

  return (
    <header className="bg-surface/80 border-border inset-x-0 top-0 z-30 flex h-16 items-center justify-between gap-4 border-b px-4 backdrop-blur-md sm:px-6 sticky">
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
          <h1 className="text-foreground truncate text-base font-bold">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">

        <div className="border-border bg-background-2 focus-within:border-primary-400/60 hidden items-center gap-2 rounded-xl border px-3 py-2 transition-colors md:flex">
          <Search className="text-text-gray size-4" />
          <input
            type="search"
            placeholder="جستجوی سوییت، مهمان، رزرو…"
            className="bg-transparent text-text w-45 text-sm outline-none placeholder:text-text-gray/60"
          />
        </div>

        <span className="text-text-gray border-border bg-background-2 hidden rounded-xl border px-3 py-2 text-xs font-medium xl:block">
          {format(new Date(), "EEEE d MMMM yyyy", { locale: faIR })}
        </span>

        {/* <div className="relative">
          <IconButton
            className="relative"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="اعلان‌ها"
          >
            <Bell className="size-5" />
            <span className="bg-danger absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full text-[10px] font-bold text-white">
              {NOTIFICATIONS.filter((n) => n.unread).length}
            </span>
          </IconButton>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="border-border bg-surface shadow-shadow-soft absolute left-0 z-50 mt-2 w-80 max-w-[85vw] rounded-2xl border p-2">
                <p className="text-text px-3 pt-2 pb-1 text-sm font-semibold">اعلان‌ها</p>
                {NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className="hover:bg-background-2 flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors"
                  >
                    <span
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${
                        n.unread ? "bg-primary-400" : "bg-border-strong"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-text text-sm">{n.title}</p>
                      <p className="text-text-gray text-xs">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div> */}

        <ThemeToggle />

        {/* پروفایل ادمین */}
        <div className="border-border mr-1 flex items-center gap-2.5 border-r pr-3">
          <div className="from-primary-400 to-primary-600 grid size-9 place-items-center rounded-full bg-gradient-to-br text-sm font-bold text-white">
            س
          </div>
          <div className="hidden lg:block">
            <p className="text-text text-sm leading-none font-semibold">سارا محمدی</p>
            <p className="text-text-gray mt-1 text-xs">مدیر سایت</p>
          </div>
        </div>
      </div>
    </header>
  );
}