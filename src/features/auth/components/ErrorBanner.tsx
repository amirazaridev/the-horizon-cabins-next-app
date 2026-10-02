"use client";

import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  /** پیام خطای آماده‌ی نمایش. اگر خالی/`undefined` باشد چیزی رندر نمی‌شود. */
  message?: string;
  className?: string;
};


export default function ErrorBanner({ message, className = "" }: Props): ReactNode {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`border-danger-strong/30 bg-danger/8 text-danger flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed ${className}`}
    >
      <AlertCircle className="mt-px size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
