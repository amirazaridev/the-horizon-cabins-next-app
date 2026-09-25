"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/* ==================================================================
   Accordion — generic, animated, RTL-friendly
   انیمیشن با ترفند grid-template-rows (۰fr → ۱fr) + opacity.
   بدون وابستگی خارجی، سازگار با Tailwind v4.
   ================================================================== */

export type AccordionItemData = {
  id: string;
  /** عنوان ردیف (مثل «تاریخ سفر») */
  title: string;
  /** خلاصه مقدار انتخاب‌شده زیر عنوان (مثل «۱۲ تا ۱۵ مرداد») */
  summary?: string;
  icon?: ReactNode;
  /** بج عددی — مثل تعداد آیتم‌های انتخاب‌شده */
  badge?: number;
  /** نقطه فعال بودن فیلتر */
  active?: boolean;
  content: ReactNode;
};

type AccordionProps = {
  items: AccordionItemData[];
  /** حالت تک‌باز (پیش‌فرض) — فقط یک آیتم باز می‌ماند */
  openId?: string | null;
  defaultOpenId?: string | null;
  onOpenChange?: (id: string | null) => void;
  className?: string;
};

export default function Accordion({
  items,
  openId,
  defaultOpenId = null,
  onOpenChange,
  className = "",
}: AccordionProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {items.map((item) => (
        <AccordionRow
          key={item.id}
          item={item}
          open={openId !== undefined ? openId === item.id : undefined}
          defaultOpen={defaultOpenId === item.id}
          onToggle={(next) => onOpenChange?.(next)}
        />
      ))}
    </div>
  );
}

/* Controlled-vs-uncontrolled per-row bridge:
   اگر open از بیرون داده شده بود همان ملاک است، وگرنه state داخلی. */
function AccordionRow({
  item,
  open,
  defaultOpen,
  onToggle,
}: {
  item: AccordionItemData;
  open?: boolean;
  defaultOpen?: boolean;
  onToggle: (next: string | null) => void;
}) {
  const [inner, setInner] = useState(!!defaultOpen);
  const isOpen = open ?? inner;
  const panelId = useId();

  const toggle = () => {
    const next = isOpen ? null : item.id;
    if (open === undefined) setInner(!isOpen);
    onToggle(next);
  };

  return (
    <div
      className={`border-foreground/10 overflow-hidden rounded-2xl border transition-colors duration-300 ${
        isOpen
          ? "border-primary-400/40 bg-primary-400/[0.04] shadow-sm"
          : item.active
            ? "border-primary-400/30 bg-surface"
            : "bg-surface"
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors active:scale-[0.99]"
      >
        {item.icon && (
          <span className="text-primary-400 grid size-9 shrink-0 place-items-center rounded-xl bg-primary-400/10">
            {item.icon}
          </span>
        )}

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-text truncate text-sm font-extrabold">
              {item.title}
            </span>
            {item.active && (
              <span
                aria-hidden="true"
                className="bg-primary-400 size-1.5 shrink-0 rounded-full"
              />
            )}
            {typeof item.badge === "number" && item.badge > 0 && (
              <span className="bg-primary-400 grid min-w-5 shrink-0 place-items-center rounded-full px-1.5 py-0.5 text-[11px] leading-4 font-extrabold text-black tabular-nums">
                {item.badge.toLocaleString("fa-IR")}
              </span>
            )}
          </span>
          {item.summary && (
            <span className="text-text-gray mt-0.5 block truncate text-xs font-medium">
              {item.summary}
            </span>
          )}
        </span>

        <span
          className={`grid size-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
            isOpen
              ? "bg-primary-400 text-black"
              : "bg-foreground/5 text-text-gray"
          }`}
        >
          <ChevronDown
            className={`size-4 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {/* پنل انیمیشنی */}
      <div
        id={panelId}
        role="region"
        aria-hidden={!isOpen}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`border-foreground/10 border-t px-4 py-4 transition-transform duration-300 ${
              isOpen ? "translate-y-0" : "-translate-y-1"
            }`}
          >
            {item.content}
          </div>
        </div>
      </div>
    </div>
  );
}
