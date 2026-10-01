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
 * نسبت به نسخه‌ی قبلی، دسترس‌پذیری کامل شد: تله‌ی فوکوس، بازگرداندن
 * فوکوس به عنصر بازکننده، `aria-labelledby`/`aria-describedby` و
 * انیمیشن خروج (قبلاً مودال همان لحظه‌ی بسته‌شدن از DOM حذف می‌شد و
 * فقط انیمیشن ورود داشت).
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
        className={`bg-surface border-border relative max-h-[90dvh] w-full overflow-y-auto outline-none ${sizeClass[size]} rounded-2xl border p-6 shadow-xl transition-all duration-200 ${
          shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"
        } ${className}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن"
          className="text-text-gray hover:text-text hover:bg-background-2 absolute end-4 top-4 rounded-full p-1.5 transition"
        >
          <X className="size-4" />
        </button>

        {title && (
          <h3 id={titleId} className="text-text pe-8 text-lg font-bold">
            {title}
          </h3>
        )}
        {description && (
          <p
            id={descriptionId}
            className="text-text-gray mt-2 pe-8 text-sm leading-relaxed"
          >
            {description}
          </p>
        )}

        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
