"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type FilterMobileSheetProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  /** فوتر (دکمه‌های حذف/اعمال) — اگر داده نشود فقط محتوا نمایش داده می‌شود */
  footer?: ReactNode;
};

/**
 * باتم‌شیت موبایل — انیمیشن خالص CSS (بدون درگ).
 * ورود/خروج ۴۰۰ms با ease-out؛ موقع بسته شدن اول fade/slide بعد unmount.
 */
export default function FilterMobileSheet({
  open,
  title = "فیلترها",
  onClose,
  children,
  footer,
}: FilterMobileSheetProps) {
  /** mounted برای انیمیشن خروج: اول visible=false بعد unmount */
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true)),
      );
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const t = window.setTimeout(() => setMounted(false), 400);
    return () => window.clearTimeout(t);
  }, [open]);

  /* قفل اسکرول body + بستن با Escape */
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[70] md:hidden"
    >
      {/* Overlay — fade خالص */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-[400ms] ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel — slide-up خالص */}
      <div
        className={`bg-surface absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-3xl shadow-2xl transition-transform duration-[400ms] ease-out motion-reduce:transition-none ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* نشانگر بالای شیت (فقط بصری، بدون درگ) */}
        <div aria-hidden="true" className="flex justify-center py-3">
          <span className="bg-foreground/15 h-1.5 w-12 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <p className="text-text text-base font-extrabold">{title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن فیلترها"
            className="text-text hover:bg-foreground/5 flex size-9 items-center justify-center rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 sm:px-5">
          {children}
        </div>

        {footer && (
          <div className="border-foreground/10 border-t px-4 py-3 sm:px-5 sm:py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
