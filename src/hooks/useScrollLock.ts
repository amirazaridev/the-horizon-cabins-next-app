"use client";

import { useEffect } from "react";


let lockCount = 0;
let previousHtmlOverflow = "";
let previousBodyOverflow = "";
let previousBodyPaddingInlineEnd = "";

export default function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      const root = document.documentElement;
      const body = document.body;

      const scrollbarWidth = window.innerWidth - root.clientWidth;

      previousHtmlOverflow = root.style.overflow;
      previousBodyOverflow = body.style.overflow;
      previousBodyPaddingInlineEnd = body.style.paddingInlineEnd;

      root.style.overflow = "hidden";
      body.style.overflow = "hidden";

      if (scrollbarWidth > 0) {
        body.style.paddingInlineEnd = `${scrollbarWidth}px`;
      }
    }

    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount > 0) return;

      const root = document.documentElement;
      const body = document.body;

      root.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.paddingInlineEnd = previousBodyPaddingInlineEnd;
    };
  }, [active]);
}
