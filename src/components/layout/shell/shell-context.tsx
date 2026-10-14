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

export function useShellSidebar(): ShellContextValue {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error("useShellSidebar باید داخل <AppShell> استفاده شود");
  }
  return context;
}
