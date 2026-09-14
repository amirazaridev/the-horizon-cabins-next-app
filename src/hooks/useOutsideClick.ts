"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * با کلیک خارج از المانِ ref شده، handler اجرا می‌شود.
 * (مورد استفاده: بستن دراپ‌داون‌ها و منوها)
 */
export default function useOutsideClick<T extends HTMLElement = HTMLElement>(
  handler: () => void,
  listenCapturing = true,
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    }

    document.addEventListener("click", handleClick, listenCapturing);
    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}
