"use client";

import { Loader2, SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

import Accordion from "../../Accordion";
import FilterMobileSheet from "../FilterMobileSheet";
import { FOCUS_RING } from "../focus-ring";
import { ACTION_BUTTON_CLASS } from "./Trigger";
import { isFilterValueActive } from "./value";
import type { FilterCardItem } from "./types";

export type MobileFilterBranchProps = {
  /** کلاس دکمه‌ی تریگر (پیش‌فرض یا سفارشی). */
  triggerClass: string;
  /** تریگر سفارشی مصرف‌کننده — اگر ندهد، تریگر پیش‌فرض رندر می‌شود. */
  customTrigger: ReactNode;
  triggerLabel: string;
  activeCount: number;
  /** آیتم‌های بدون پنل (اکشن) — هم ردیف تریگر، هم پایین شیت. */
  actionItems: FilterCardItem[];
  sheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  sheetTitle: string;
  onClearFilters?: () => void;
  onApply: () => void;
  applyDisabled: boolean;
  applyPending: boolean;
  applyLabel: string;
  resultCount?: number;
  /** آیتم‌هایی که پنل دارند (آکاردئون شیت). */
  panelItems: FilterCardItem[];
  openPanelId: string | null;
  setOpenPanelId: (id: string | null) => void;
  getValue: (id: string) => unknown;
  /** ثبت مقدار در شیت — با پرش خودکار به پنل بعدی (`advanceTo`). */
  commitValue: (
    id: string,
    next: unknown,
    panel?: FilterCardItem["panel"],
  ) => void;
  /** ثبت مقدار بدون پرش پنل (برای فیلدهای «همراه»، مثل تاریخ خروج). */
  setFieldValue: (id: string, next: unknown) => void;
};

export default function MobileFilterBranch({
  triggerClass,
  customTrigger,
  triggerLabel,
  activeCount,
  actionItems,
  sheetOpen,
  openSheet,
  closeSheet,
  sheetTitle,
  onClearFilters,
  onApply,
  applyDisabled,
  applyPending,
  applyLabel,
  resultCount,
  panelItems,
  openPanelId,
  setOpenPanelId,
  getValue,
  commitValue,
  setFieldValue,
}: MobileFilterBranchProps) {
  return (
    <>
      {/* تریگر تکی موبایل + اکشن‌های بدون پنل */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <button
          type="button"
          onClick={openSheet}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          className={triggerClass}
        >
          {customTrigger ?? (
            <>
              <span className="text-primary-400 flex shrink-0 items-center">
                <SlidersHorizontal className="size-4" />
              </span>
              <span className="max-w-40 truncate">{triggerLabel}</span>
              {activeCount > 0 && (
                <span className="bg-primary-400 grid min-w-5 shrink-0 place-items-center rounded-full px-1.5 py-0.5 text-xs leading-4 font-extrabold text-black tabular-nums">
                  {activeCount.toLocaleString("fa-IR")}
                </span>
              )}
            </>
          )}
        </button>

        {actionItems.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={item.disabled}
            onClick={() => item.onClick?.()}
            className={`${ACTION_BUTTON_CLASS} ${FOCUS_RING} ${item.className ?? ""}`}
          >
            {item.icon && (
              <span className="text-primary-400 flex shrink-0 items-center">
                {item.icon}
              </span>
            )}
            <span className="max-w-40 truncate">{item.label ?? item.id}</span>
          </button>
        ))}
      </div>

      <FilterMobileSheet
        open={sheetOpen}
        title={sheetTitle}
        onClose={closeSheet}
        footer={
          <div className="flex items-center gap-2">
            {onClearFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                disabled={activeCount === 0}
                className={`text-text-gray border-foreground/10 hover:text-text flex-1 rounded-xl border py-3 text-sm font-bold transition-colors disabled:opacity-40 ${FOCUS_RING}`}
              >
                حذف فیلترها
              </button>
            )}
            <button
              type="button"
              onClick={onApply}
              disabled={applyDisabled || applyPending}
              aria-busy={applyPending}
              className={`bg-primary-400 flex flex-2 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-black transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
            >
              {applyPending ? (
                <>
                  <Loader2
                    aria-hidden="true"
                    className="size-5 animate-spin motion-reduce:animate-none"
                  />
                  <span className="sr-only">در حال جستجو…</span>
                </>
              ) : (
                <>
                  {applyLabel}
                  {typeof resultCount === "number" && (
                    <span className="rounded-full bg-black/15 px-2 py-0.5 text-xs font-bold tabular-nums">
                      {resultCount.toLocaleString("fa-IR")}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        }
      >
        <Accordion
          openId={openPanelId}
          onOpenChange={setOpenPanelId}
          items={panelItems.map((item) => {
            const panel = item.panel!;
            const itemValue = getValue(item.id);

            return {
              id: item.id,
              title: panel.title ?? item.label ?? item.id,
              summary: getSummary(item, getValue),
              icon: item.icon,
              badge: getBadge(itemValue),
              active: isFilterValueActive(itemValue),
              content:
                typeof panel.render === "function" ? (
                  panel.render({
                    id: item.id,
                    value: itemValue,
                    getValue,
                    setValue: (next: unknown) =>
                      commitValue(item.id, next, panel),
                    setFieldValue: (targetId: string, next: unknown) =>
                      setFieldValue(targetId, next),
                    openPanel: setOpenPanelId,
                    close: () => setOpenPanelId(null),
                  })
                ) : (
                  <>{panel.children}</>
                ),
            };
          })}
        />

        {actionItems.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {actionItems.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  closeSheet();
                  item.onClick?.();
                }}
                className={`border-foreground/10 bg-surface flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold disabled:pointer-events-none disabled:opacity-50 ${item.className ?? ""}`}
              >
                {item.icon}
                {item.label ?? item.id}
              </button>
            ))}
          </div>
        )}
      </FilterMobileSheet>
    </>
  );
}

/** خلاصه‌ی یک فیلتر برای عنوان آکاردئون — خطای `formatLabel` نباید UI را بشکند. */
function getSummary(
  item: FilterCardItem,
  getValue: (id: string) => unknown,
): string | undefined {
  if (!item.formatLabel) return undefined;

  try {
    return item.formatLabel(getValue(item.id)) ?? undefined;
  } catch {
    return undefined;
  }
}

/** نشان تعداد روی فیلترهای چندگزینه‌ای. */
function getBadge(value: unknown): number | undefined {
  return Array.isArray(value) && value.length > 0 ? value.length : undefined;
}
