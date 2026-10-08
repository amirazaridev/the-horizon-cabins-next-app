"use client";

import { createContext, useContext } from "react";

export type ShellContextValue = {
  /** باز کردن دراور سایدبار (موبایل). */
  openSidebar: () => void;
  closeSidebar: () => void;
};

export const ShellContext = createContext<ShellContextValue | undefined>(
  undefined,
);

/**
 * دسترسی به وضعیت سایدبار پوسته از داخل هدر/محتوای آن.
 *
 * ⚠️ چرا context و نه پراپ تابعی؟ هدرها از Server Component به‌شکل عنصر
 * پاس داده می‌شوند و توابع قابل‌سریال‌سازی نیستند؛ context اجازه می‌دهد
 * دکمه‌ی منو در هر هدری بدون پراپ‌درمانی کار کند.
 */
export function useShellSidebar(): ShellContextValue {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error("useShellSidebar باید داخل <AppShell> استفاده شود");
  }
  return context;
}
