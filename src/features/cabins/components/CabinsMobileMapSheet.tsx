"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, List, MapPin, X } from "lucide-react";
import CabinsMapPanel from "./CabinsMapPanel";

const PREVIEW_HEIGHT = 148;
const OPEN_THRESHOLD = 72;
const CLOSE_THRESHOLD = 96;
const TRANSITION_MS = 260;

type Props = {
  resultCount: number;
};

/**
 * پنل کشویی نقشه — فقط موبایل (`lg:hidden`).
 * حالت جمع: پیش‌نمایش کوچک زیر فیلتر (بازشو با کلیک یا کشیدن به پایین).
 * حالت باز: اورلی تمام‌صفحه با دکمه‌ی «مشاهده نتایج» برای بازگشت به لیست.
 */
export default function CabinsMobileMapSheet({ resultCount }: Props) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  const previewRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartY = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const open = () => {
    if (mounted) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  };

  const close = () => {
    setShown(false);
    closeTimer.current = setTimeout(() => setMounted(false), TRANSITION_MS);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // قفل اسکرول بدنه + بستن با Escape + فوکوس دکمه بستن
  useEffect(() => {
    if (!mounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    if (shown) closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, shown]);

  // کشیدن پیش‌نمایش به پایین → باز شدن نقشه
  const handlePreviewMove = (clientY: number) => {
    if (dragStartY.current === null || !previewRef.current) return;
    const dy = clientY - dragStartY.current;
    if (dy > 0) {
      previewRef.current.style.height = `${Math.min(PREVIEW_HEIGHT + dy, 420)}px`;
    }
  };

  const handlePreviewUp = (clientY: number) => {
    if (dragStartY.current === null) return;
    const dy = clientY - dragStartY.current;
    dragStartY.current = null;
    if (previewRef.current) previewRef.current.style.height = "";
    if (dy > OPEN_THRESHOLD) open();
  };

  // کشیدن دستگیره‌ی اورلی به پایین → بستن نقشه
  const handleSheetMove = (clientY: number) => {
    if (dragStartY.current === null || !sheetRef.current) return;
    const dy = clientY - dragStartY.current;
    if (dy > 0) sheetRef.current.style.transform = `translateY(${dy}px)`;
  };

  const handleSheetUp = (clientY: number) => {
    if (dragStartY.current === null) return;
    const dy = clientY - dragStartY.current;
    dragStartY.current = null;
    if (sheetRef.current) sheetRef.current.style.transform = "";
    if (dy > CLOSE_THRESHOLD) close();
  };

  return (
    <>
      {/* پیش‌نمایش جمع‌شده زیر فیلتر */}
      <button
        ref={previewRef}
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        style={{ height: PREVIEW_HEIGHT }}
        className="bg-background-2 relative block w-full overflow-hidden rounded-3xl border border-foreground/10 transition-[height] duration-200 lg:hidden"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-border-strong)_1px,transparent_1px)] bg-[size:22px_22px]"
        />
        <span
          aria-hidden="true"
          className="absolute top-[30%] -right-10 left-0 h-9 rotate-[-8deg] rounded-full bg-foreground/5"
        />
        <span
          aria-hidden="true"
          className="absolute top-[62%] -right-10 left-0 h-6 rotate-[5deg] rounded-full bg-foreground/5"
        />
        <span
          aria-hidden="true"
          className="bg-primary-400/70 absolute top-[34%] right-[20%] size-3 rounded-full"
        />
        <span
          aria-hidden="true"
          className="bg-primary-400/60 absolute top-[60%] right-[66%] size-2.5 rounded-full"
        />

        {/* دستگیره‌ی کشیدن */}
        <span
          aria-hidden="true"
          onPointerDown={(e) => {
            dragStartY.current = e.clientY;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (e.pressure > 0) handlePreviewMove(e.clientY);
          }}
          onPointerUp={(e) => handlePreviewUp(e.clientY)}
          onPointerCancel={() => {
            dragStartY.current = null;
            if (previewRef.current) previewRef.current.style.height = "";
          }}
          className="absolute top-2 right-0 left-0 flex cursor-grab touch-none justify-center py-1 active:cursor-grabbing"
        >
          <span className="bg-surface h-1.5 w-12 rounded-full shadow" />
        </span>

        <span className="absolute inset-0 flex items-center justify-center">
          <span className="bg-surface/90 flex items-center gap-2 rounded-full border border-foreground/10 px-4 py-2 text-sm font-bold text-text shadow-lg backdrop-blur-md">
            <MapPin className="size-4 text-primary-400" />
            مشاهده نقشه
            <ChevronDown className="size-4 animate-bounce text-text-gray" />
          </span>
        </span>
      </button>

      {/* اورلی تمام‌صفحه‌ی نقشه */}
      {mounted && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="نقشه اقامتگاه‌ها"
          className="fixed inset-0 z-70 flex flex-col bg-background lg:hidden"
        >
          <div
            ref={sheetRef}
            className={`flex min-h-0 flex-1 flex-col transition-transform duration-300 ease-out ${
              shown ? "translate-y-0" : "translate-y-full"
            } motion-reduce:transition-none`}
          >
            <div className="flex items-center gap-3 border-b border-foreground/10 bg-surface px-4 py-3">
              <span
                aria-hidden="true"
                onPointerDown={(e) => {
                  dragStartY.current = e.clientY;
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (e.pressure > 0) handleSheetMove(e.clientY);
                }}
                onPointerUp={(e) => handleSheetUp(e.clientY)}
                onPointerCancel={() => {
                  dragStartY.current = null;
                  if (sheetRef.current) sheetRef.current.style.transform = "";
                }}
                className="flex flex-1 cursor-grab touch-none justify-center py-2 active:cursor-grabbing"
              >
                <span className="h-1.5 w-12 rounded-full bg-foreground/15" />
              </span>
              <p className="text-text text-sm font-bold whitespace-nowrap">
                نقشه اقامتگاه‌ها
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                aria-label="بستن نقشه"
                className="flex size-10 items-center justify-center rounded-full text-text transition-colors hover:bg-foreground/5"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <CabinsMapPanel
                slotId="cabins-map-slot-mobile"
                framed={false}
                className="absolute inset-0"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-4">
                <button
                  type="button"
                  onClick={close}
                  className="bg-text text-background pointer-events-auto flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold shadow-2xl transition-transform duration-200 active:scale-95"
                >
                  <List className="size-4" />
                  مشاهده نتایج
                  <span className="bg-background/20 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums">
                    {resultCount.toLocaleString("fa-IR")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
