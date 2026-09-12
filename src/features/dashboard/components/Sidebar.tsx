"use client";

import { LogOut, Mountain, X } from "lucide-react";
import Link from "next/link";
import { SIDEBAR_ITEMS } from "../constants/sidebar-items";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface SidebarProps {
  pathname: string;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ pathname, open, onClose }: SidebarProps) {
  return (
    <>
      <aside
        className={`bg-surface border-border flex-col fixed inset-y-0 ${open ? "translate-x-0" : "translate-x-full lg:translate-x-0"} z-50 flex w-64 transform border-l transition-transform duration-300 ease-in-out`}
        aria-label="Sidebar navigation"
      >
        <div className="border-border flex h-16 items-center justify-between border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary-400 flex size-8 items-center justify-center rounded-lg">
              <Mountain className="size-5 text-black" />
            </div>
            <span className="text-foreground text-lg font-bold">هورایزن</span>
          </Link>
          <button
            onClick={onClose}
            className="hover:bg-foreground/10 rounded-lg p-2 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav
          className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
          role="navigation"
        >
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`${isActive ? "bg-primary-400/10 text-primary-600 dark:text-primary-400" : "text-text-gray hover:bg-foreground/5 hover:text-foreground"} flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200`}
              >
                <item.icon
                  className={`shrink-0 ${isActive && "text-primary-500 dark:text-primary-400"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="mb-4 flex items-center justify-between px-6 md:hidden">
          <span className="text-foreground/70 text-sm">تم</span>
          <ThemeToggle forMobile />
        </div>
        <div className="border-border space-y-5 border-t p-3">
          <div className="flex items-center justify-between px-3 gap-3">
            <div className="flex flex-col items-end">
              <span className="text-foreground text-sm font-semibold">
                علی رضایی
              </span>
              <span className="text-text-gray text-xs">مدیر سیستم</span>
            </div>
            <div className="bg-primary-400 flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-black">
              ع
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="size-5" />
            خروج
          </Link>
        </div>
      </aside>
    </>
  );
}
