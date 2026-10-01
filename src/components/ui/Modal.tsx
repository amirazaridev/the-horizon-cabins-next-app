"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import useFocusTrap from "@/hooks/useFocusTrap";
import useScrollLock from "@/hooks/useScrollLock";

/** مدت انیمیشن ورود/خروج — باید با `duration-200` کلاس‌ها یکی بماند */
const EXIT_MS = 200;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  /** کلاس تکمیلی روی پنل — مثل کم‌کردن padding یا تمام‌عرض‌کردن */
  className?: string;
}

const sizeClass: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

/**
 * مودال عمومی پروژه.
 *
 * ساختار سه‌تکه‌ی ثابت:
 *  ۱) **هدر** (`title`/`description`) — `shrink-0` با جداکننده‌ی پایین،
 *     پس هنگام اسکرول سر جای خودش می‌ماند.
 *  ۲) **بدنه** — تنها ناحیه‌ی اسکرولی؛ `overscroll-contain` می‌گذارد
 *     اسکرول به صفحه‌ی پشت سرایت نکند.
 *  ۳) **دکمه‌ی بستن** — `absolute` روی پنل (نه داخل بدنه)، پس هرگز با
 *     اسکرول جابه‌جا نمی‌شود.
 *
 * نسبت به نسخه‌ی اولیه: تله‌ی فوکوس، بازگرداندن فوکوس به عنصر بازکننده،
 * `aria-labelledby`/`aria-describedby`، انیمیشن خروج و هدر ثابت اضافه شد.
 *
 * ⚠️ API عمومی دست‌نخورده مانده (`isOpen`/`onClose`/`title`/`description`/
 * `size`/`children`) تا مصرف‌کننده‌های فعلی — `ConfirmModal` و صفحات
 * داشبورد — بدون تغییر کار کنند. فقط `size="xl"` و `className` اضافه شده‌اند.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "sm",
  className = "",
}: ModalProps) {
  /** تا پایان انیمیشن خروج در DOM می‌ماند */
  const [visible, setVisible] = useState(false);
  const panelRef = useFocusTrap<HTMLDivElement>(isOpen);
  const titleId = useId();
  const descriptionId = useId();

  const mounted = isOpen || visible;
  const shown = isOpen && visible;
  const hasHeader = Boolean(title || description);

  useScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true)),
      );
      return () => cancelAnimationFrame(frame);
    }
    if (!visible) return;
    const timer = window.setTimeout(() => setVisible(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen, visible]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={`bg-surface border-border relative flex max-h-[90dvh] w-full flex-col overflow-hidden outline-none ${sizeClass[size]} rounded-3xl border shadow-2xl transition-all duration-200 ${
          shown
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-95 opacity-0"
        } ${className}`}
      >
        {/* دکمه‌ی بستن — روی پنل، بیرون از ناحیه‌ی اسکرولی */}
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن"
          className="text-text-gray hover:text-text hover:bg-foreground/5 absolute end-3 top-3 z-10 grid size-11 place-items-center rounded-full transition-colors"
        >
          <X className="size-4" />
        </button>

        {hasHeader && (
          <header className="border-foreground/10 bg-surface/95 shrink-0 border-b px-6 pt-6 pb-4 backdrop-blur-sm">
            {title && (
              <h2 id={titleId} className="text-text pe-12 text-lg font-bold">
                {title}
              </h2>
            )}
            {description && (
              <p
                id={descriptionId}
                className="text-text-gray mt-1.5 pe-12 text-sm leading-relaxed"
              >
                {description}
              </p>
            )}
          </header>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
