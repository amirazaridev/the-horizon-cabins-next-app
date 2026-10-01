"use client";

import { useEffect, useRef, type RefObject } from "react";

/** همه‌ی عناصر قابل فوکوس داخل یک ظرف */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "audio[controls]",
  "video[controls]",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/**
 * تله‌ی فوکوس برای لایه‌های مودال‌مانند (Modal و BottomSheet).
 *
 * سه کار انجام می‌دهد:
 *  ۱) با باز شدن، فوکوس را به اولین عنصر قابل فوکوس داخل لایه می‌برد
 *     (اگر چیزی نبود، به خود ظرف — پس ظرف باید `tabIndex={-1}` داشته باشد).
 *  ۲) با Tab و Shift+Tab فوکوس را داخل لایه نگه می‌دارد.
 *  ۳) با بسته شدن، فوکوس را به همان عنصری برمی‌گرداند که لایه را باز کرد.
 *
 * `active` را به «باز بودن» لایه وصل کنید؛ ref برگشتی باید روی ظرف پنل
 * قرار بگیرد، نه روی بک‌دراپ.
 */
export default function useFocusTrap<T extends HTMLElement = HTMLElement>(
  active: boolean,
): RefObject<T | null> {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    // `getClientRects()` روی عناصر `display:none` خالی است؛ پس برخلاف
    // `offsetParent` برای عناصر position:fixed هم درست کار می‌کند.
    const getFocusable = (): HTMLElement[] =>
      Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter(
        (element) =>
          element.getAttribute("aria-hidden") !== "true" &&
          element.getClientRects().length > 0,
      );

    const initial = getFocusable()[0];
    (initial ?? container).focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusable = getFocusable();

      if (focusable.length === 0) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (event.shiftKey) {
        if (current === first || !container.contains(current)) {
          event.preventDefault();
          last.focus();
        }
      } else if (current === last || !container.contains(current)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      // عنصر بازکننده ممکن است در همین فاصله unmount شده باشد
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [active]);

  return containerRef;
}
