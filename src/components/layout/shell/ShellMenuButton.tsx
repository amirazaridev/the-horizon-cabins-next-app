"use client";

import { Menu } from "lucide-react";
import type { ReactNode } from "react";

import { useShellSidebar } from "./shell-context";

type Props = {
  className?: string;
};

/**
 * دکمه‌ی بازکردن سایدبار در موبایل — برای استفاده در هدرِ پوسته.
 *
 * ⚠️ از context پوسته می‌خواند تا هر هدری (داشبورد/مهمان) بدون پراپ‌درمانی
 * همان رفتار را داشته باشد.
 */
export default function ShellMenuButton({ className = "" }: Props): ReactNode {
  const { openSidebar } = useShellSidebar();

  return (
    <button
      type="button"
      onClick={openSidebar}
      className={`hover:bg-foreground/10 rounded-lg p-2 lg:hidden ${className}`}
      aria-label="باز کردن منو"
    >
      <Menu className="size-5" />
    </button>
  );
}
