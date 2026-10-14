"use client";

import { useEffect, useRef, type RefObject } from "react";

/** رویدادهایی که می‌توان به‌عنوان «کلیک» شنید. */
type EventName = "click" | "pointerdown" | "mousedown" | "touchstart";

type Options = {
  ignore?: readonly RefObject<HTMLElement | null>[];
  /** نوع رویداد — پیش‌فرض `click`. برای منوها `pointerdown` واکنش سریع‌تری می‌دهد. */
  event?: EventName | readonly EventName[];
  /** ثبت در فاز capture — پیش‌فرض `true`. */
  capture?: boolean;
  /** اگر `false` باشد شنونده اصلاً ثبت نمی‌شود (مثلاً وقتی منو بسته است). */
  enabled?: boolean;
};

export default function useOutsideClick<T extends HTMLElement = HTMLElement>(
  handler: () => void,
  {
    ignore = [],
    event = "click",
    capture = true,
    enabled = true,
  }: Options = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const handlerRef = useRef(handler);
  const ignoreRef = useRef(ignore);

  useEffect(() => {
    handlerRef.current = handler;
    ignoreRef.current = ignore;
  });

  useEffect(() => {
    if (!enabled) return;

    function handleEvent(e: Event) {
      const target = e.target as Node | null;
      if (!target) return;

      // کلیک روی خود المان یا روی المان‌های نادیده‌گرفتنی ⇒ «بیرون» نیست.
      if (ref.current?.contains(target)) return;
      if (ignoreRef.current.some((item) => item.current?.contains(target))) {
        return;
      }

      handlerRef.current();
    }

    const events = Array.isArray(event) ? event : [event];
    events.forEach((name) =>
      document.addEventListener(name, handleEvent, capture),
    );

    return () =>
      events.forEach((name) =>
        document.removeEventListener(name, handleEvent, capture),
      );
  }, [event, capture, enabled]);

  return ref;
}
