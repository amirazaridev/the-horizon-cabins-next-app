"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";

/** `useLayoutEffect` روی سرور هشدار می‌دهد — همان الگوی Navbar */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** کلاس‌های ثابت Tailwind (کلاس داینامیک ساخته نمی‌شود) */
const CLAMP_CLASS: Record<number, string> = {
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

type Props = {
  children: string;
  /** تعداد خطوط در حالت جمع‌شده (۲ تا ۶) */
  lines?: number;
  className?: string;
  expandLabel?: string;
  collapseLabel?: string;
};

export default function ExpandableText({
  children,
  lines = 4,
  className = "",
  expandLabel = "مشاهده‌ی همه",
  collapseLabel = "بستن",
}: Props): ReactNode {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const panelId = useId();

  const measure = useCallback(() => {
    const element = textRef.current;
    if (!element || expanded) return;
    setOverflowing(element.scrollHeight > element.clientHeight + 1);
  }, [expanded]);

  useIsomorphicLayoutEffect(() => {
    measure();

    const element = textRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [measure]);

  const clampClass = CLAMP_CLASS[Math.min(6, Math.max(2, lines))];

  return (
    <div className={className}>
      <p
        ref={textRef}
        id={panelId}
        className={`text-text-gray leading-loose whitespace-pre-line ${
          expanded ? "" : clampClass
        }`}
      >
        {children}
      </p>

      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="text-primary-600 hover:text-primary-500 dark:text-primary-400 mt-3 inline-flex items-center gap-1.5 text-sm font-bold transition-colors"
        >
          {expanded ? collapseLabel : expandLabel}
          <ChevronDown
            className={`size-4 transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      )}
    </div>
  );
}
