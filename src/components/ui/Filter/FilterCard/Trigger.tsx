/* ==================================================================
   TRIGGER — دکمه‌ی فعال‌سازی پنل
   ================================================================== */

"use client";

import { useCallback, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { FilterCardItem, FilterTriggerVariant } from "./types";
import { isFilterValueActive } from "./value";

export const TRIGGER_VARIANTS: Record<
  FilterTriggerVariant,
  { base: string; active: string; idle: string }
> = {
  pill: {
    base: "flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
    active: "border-primary-400 bg-primary-400/10 text-text shadow-sm",
    idle: "border-foreground/10 bg-surface text-text-gray hover:border-foreground/20 hover:text-text",
  },
  outline: {
    base: "flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
    active: "border-primary-400 bg-primary-400/10 text-text shadow-sm",
    idle: "border-foreground/20 bg-transparent text-text-gray hover:border-primary-400/40 hover:text-text",
  },
  ghost: {
    base: "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
    active: "bg-primary-400/10 text-primary-600 dark:text-primary-400",
    idle: "text-text-gray hover:bg-foreground/5 hover:text-text",
  },
  field: {
    base: "group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-start transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
    active: "bg-foreground/[0.06]",
    idle: "hover:bg-foreground/[0.04]",
  },
};

/** کلاس‌های دکمه‌ی اکشنِ بدون پنل (فقط موبایل) */
export const ACTION_BUTTON_CLASS =
  "flex items-center gap-1.5 rounded-full border border-foreground/10 bg-surface px-4 py-2.5 text-sm font-medium whitespace-nowrap text-text-gray transition-all duration-200 hover:border-foreground/20 hover:text-text active:scale-95 disabled:pointer-events-none disabled:opacity-50";

type Props = {
  item: FilterCardItem;
  value: unknown;
  isOpen: boolean;
  toggle: (id: string) => void;
  close: () => void;
  /** ثبت/آزادسازی المان تریگر تا openById بدون querySelector روی کل document کار کند */
  register: (id: string, el: HTMLButtonElement | null) => void;
  /** شناسه‌ی دیالوگ برای aria-controls */
  panelId?: string;
};

export default function Trigger({
  item,
  value,
  isOpen: open,
  toggle,
  close,
  register,
  panelId,
}: Props) {
  const {
    id,
    label = "انتخاب کنید",
    formatLabel,
    icon,
    variant = "pill",
    showCaret = true,
    disabled = false,
    className = "",
    onClick,
    renderTrigger,
  } = item;

  const filled = isFilterValueActive(value);
  const styles = TRIGGER_VARIANTS[variant];
  const displayLabel =
    value != null && formatLabel ? (formatLabel(value) ?? label) : label;

  const ref = useCallback(
    (el: HTMLButtonElement | null) => {
      register(id, el);
    },
    [register, id],
  );

  const content: ReactNode =
    typeof renderTrigger === "function"
      ? renderTrigger({ id, value, isOpen: open, close })
      : renderTrigger;

  const handleClick = () => {
    toggle(id);
    onClick?.();
  };

  return (
    <button
      ref={ref}
      type="button"
      data-fc-trigger={id}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={panelId}
      disabled={disabled}
      onClick={handleClick}
      className={`${styles.base} ${open || filled ? styles.active : styles.idle} ${className}`}
    >
      {content ?? (
        <>
          {icon && (
            <span className="text-primary-400 flex shrink-0 items-center">
              {icon}
            </span>
          )}
          <span className="max-w-40 truncate">{displayLabel}</span>
          {showCaret && (
            <ChevronDown
              className={`size-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          )}
        </>
      )}
    </button>
  );
}
