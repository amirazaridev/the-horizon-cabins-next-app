"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import useFocusTrap from "@/hooks/useFocusTrap";
import useScrollLock from "@/hooks/useScrollLock";

/** مدت انیمیشن ورود/خروج — باید با `duration-300` کلاس‌ها یکی بماند */
const EXIT_MS = 300;
/** جابه‌جایی لازم برای بستن شیت با کشیدن به پایین */
const CLOSE_THRESHOLD = 96;

type Props = {
  open: boolean;
  onClose: () => void;
  /** عنوان شیت — هم برای نمایش و هم برای `aria-label` */
  title?: string;
  /** توضیح کوتاه زیر عنوان */
  description?: string;
  children: ReactNode;
  /** ناحیه‌ی ثابت پایین شیت (دکمه‌ی نهایی رزرو) */
  footer?: ReactNode;
  className?: string;
};

/**
 * باتم‌شیت عمومی پروژه.
 *
 * همه‌ی موارد لازم یک لایه‌ی مودال را دارد و هیچ کتابخانه‌ای لازم نیست:
 * Portal، Backdrop، بستن با Esc و کلیک بیرون، Drag-to-dismiss، قفل اسکرول
 * body، تله‌ی فوکوس، بازگرداندن فوکوس به عنصر بازکننده، `role="dialog"` و
 * `aria-modal`، و انیمیشن ورود/خروج با Tailwind.
 *
 * تفاوتش با `FilterMobileSheet` (که مخصوص فیلترهاست): این کامپوننت
 * عمومی است، در هر breakpoint کار می‌کند و درگ‌کردن دارد. شیت فیلترها
 * عمداً دست‌نخورده مانده تا این تغییر دامنه‌اش به فیلترها سرایت نکند.
 */
export default function BottomSheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className = "",
}: Props) {
  /** visible = «نمایش داده شود» (یک فریم بعد از mount تا انیمیشن ورود اجرا شود) */
  const [visible, setVisible] = useState(false);
  const panelRef = useFocusTrap<HTMLDivElement>(open);

  /** تا پایان انیمیشن خروج در DOM می‌ماند */
  const mounted = open || visible;
  /** شکل نهایی: ورود فقط بعد از paint، خروج همان لحظه‌ی بسته شدن */
  const shown = open && visible;

  useScrollLock(open);

  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true)),
      );
      return () => cancelAnimationFrame(frame);
    }
    if (!visible) return;
    const timer = window.setTimeout(() => setVisible(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open, visible]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  /* ---------------- کشیدن به پایین برای بستن ---------------- */
  const dragStartY = useRef<number | null>(null);

  const resetDrag = () => {
    if (panelRef.current) panelRef.current.style.transform = "";
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null || !panelRef.current) return;
    const delta = event.clientY - dragStartY.current;
    if (delta > 0) panelRef.current.style.transform = `translateY(${delta}px)`;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return;
    const delta = event.clientY - dragStartY.current;
    dragStartY.current = null;
    resetDrag();
    if (delta > CLOSE_THRESHOLD) onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-70"
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`bg-surface border-foreground/10 absolute inset-x-0 bottom-0 flex max-h-[90dvh] flex-col rounded-t-3xl border-t shadow-2xl transition-transform duration-300 ease-out outline-none motion-reduce:transition-none ${
          shown ? "translate-y-0" : "translate-y-full"
        } ${className}`}
      >
        {/* دسته‌ی کشیدن — ناحیه‌ی لمسی برای بستن شیت */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            dragStartY.current = null;
            resetDrag();
          }}
          className="flex cursor-grab touch-none justify-center pt-3 pb-1 active:cursor-grabbing"
        >
          <span aria-hidden="true" className="bg-foreground/15 h-1.5 w-12 rounded-full" />
        </div>

        <div className="flex items-start justify-between gap-4 px-5 pb-3">
          <div className="min-w-0">
            {title && (
              <h2 className="text-text text-base font-extrabold">{title}</h2>
            )}
            {description && (
              <p className="text-text-gray mt-1 text-xs leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="text-text-gray hover:text-text hover:bg-foreground/5 grid size-11 shrink-0 place-items-center rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
          {children}
        </div>

        {footer && (
          <div className="hz-safe-b border-foreground/10 bg-surface border-t px-5 pt-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
