"use client";

import { useCallback, useId, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import Accordion from "../../Accordion";
import FilterMobileSheet from "../FilterMobileSheet";
import useIsMobile from "../../../../hooks/useIsMobile";
import {
  FilterCardItem,
  FilterCardProps,
  MobileTriggerRenderProps,
} from "./types";
import { isFilterValueActive } from "./value";
import Trigger, { ACTION_BUTTON_CLASS, TRIGGER_VARIANTS } from "./Trigger";
import Panel from "./Panel";

/** کلاس‌های دکمه‌ی تریگرِ پیش‌فرض موبایل (وقتی renderMobileTrigger داده نشده) */
const CUSTOM_TRIGGER_FALLBACK =
  "flex w-full items-center gap-2 rounded-full border border-foreground/10 bg-surface px-4 py-2.5";

function FilterCard({
  items,
  value,
  defaultValue = {},
  onValueChange,
  placement = "start",
  defaultOpenId = null,
  className = "",
  mobileBreakpoint = "(max-width: 767.5px)",
  mobileTitle = "فیلترها",
  mobileTriggerLabel = "فیلترها",
  renderMobileTrigger,
  mobileTriggerClassName = "",
  mobileApplyLabel = "مشاهده نتایج",
  onMobileApply,
  mobileApplyDisabled = false,
  resultCount,
  onClearFilters,
}: FilterCardProps) {
  const controlled = value !== undefined;
  const uid = useId();

  const [openId, setOpenId] = useState<string | null>(defaultOpenId);
  const [values, setValues] = useState<Record<string, unknown>>(defaultValue);

  /* ---------- موبایل ---------- */
  const isMobile = useIsMobile(mobileBreakpoint);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(
    defaultOpenId,
  );

  const anchorRect = useRef<DOMRect | null>(null);
  const triggerEl = useRef<HTMLButtonElement | null>(null);
  /** نگاشت id → دکمه‌ی تریگر همین instance (به‌جای querySelector روی document) */
  const triggerEls = useRef(new Map<string, HTMLButtonElement>());

  if (process.env.NODE_ENV !== "production") {
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    for (const item of items) {
      if (seen.has(item.id)) duplicates.add(item.id);
      seen.add(item.id);
    }
    if (duplicates.size > 0) {
      console.warn(
        `[FilterCard] شناسه‌ی تکراری در items پیدا شد: ${[...duplicates].join(", ")}`,
      );
    }
  }

  const registerTrigger = useCallback(
    (id: string, el: HTMLButtonElement | null) => {
      if (el) triggerEls.current.set(id, el);
      else triggerEls.current.delete(id);
    },
    [],
  );

  const close = useCallback(() => setOpenId(null), []);

  const getValue = useCallback(
    (id: string) => (controlled ? value?.[id] : values[id]),
    [controlled, value, values],
  );

  const setValue = useCallback(
    (id: string, next: unknown, closePanel = false) => {
      if (!controlled) setValues((prev) => ({ ...prev, [id]: next }));
      onValueChange?.(id, next);
      if (closePanel) setOpenId(null);
    },
    [controlled, onValueChange],
  );

  const openById = useCallback((id: string) => {
    const el = triggerEls.current.get(id);
    if (!el) return;
    anchorRect.current = el.getBoundingClientRect();
    triggerEl.current = el;
    setOpenId(id);
  }, []);

  const toggle = useCallback(
    (id: string) => {
      if (openId === id) close();
      else openById(id);
    },
    [openId, close, openById],
  );

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setMobileOpenId(null);
  }, []);

  const commitMobile = useCallback(
    (id: string, next: unknown, panel?: FilterCardItem["panel"]) => {
      if (!controlled) setValues((prev) => ({ ...prev, [id]: next }));
      onValueChange?.(id, next);

      const targetId =
        panel?.advanceTo &&
        items.some(
          (item) =>
            item.id === panel.advanceTo && item.panel && !item.hideOnMobile,
        )
          ? panel.advanceTo
          : null;

      if (targetId) setMobileOpenId(targetId);
      else if (panel?.closeOnSelect) setMobileOpenId(null);
    },
    [controlled, onValueChange, items],
  );

  /** شناسه‌ی دیالوگ پنل (برای aria-controls) */
  const panelDomId = useCallback((id: string) => `${uid}-${id}`, [uid]);

  /* ==========================   موبایل   ========================== */
  if (isMobile) {
    const panelItems: FilterCardItem[] = [];
    const actionItems: FilterCardItem[] = [];
    let activeCount = 0;

    for (const item of items) {
      if (item.hideOnMobile) continue;
      if (item.panel) panelItems.push(item);
      else actionItems.push(item);
      if (isFilterValueActive(getValue(item.id))) activeCount += 1;
    }

    /* باز شدن شیت: مقدار اولیه‌ی آکاردئون همین‌جا در event handler محاسبه می‌شود، نه در افکت */
    const openSheet = () => {
      if (!mobileOpenId) {
        const firstActive = panelItems.find((item) =>
          isFilterValueActive(getValue(item.id)),
        );
        setMobileOpenId(firstActive?.id ?? panelItems[0]?.id ?? null);
      }
      setSheetOpen(true);
    };

    const mobileTriggerCtx: MobileTriggerRenderProps = {
      activeCount,
      getValue,
      open: openSheet,
    };

    const customTrigger =
      typeof renderMobileTrigger === "function"
        ? renderMobileTrigger(mobileTriggerCtx)
        : renderMobileTrigger;

    const handleApply = () => {
      if (mobileApplyDisabled) return;
      onMobileApply?.();
      closeSheet();
    };

    const pill = TRIGGER_VARIANTS.pill;
    const triggerClass = customTrigger
      ? mobileTriggerClassName || CUSTOM_TRIGGER_FALLBACK
      : `${pill.base} ${activeCount > 0 ? pill.active : pill.idle}`;

    return (
      <div className={className}>
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
                <span className="max-w-40 truncate">{mobileTriggerLabel}</span>
                {activeCount > 0 && (
                  <span className="bg-primary-400 grid min-w-5 shrink-0 place-items-center rounded-full px-1.5 py-0.5 text-[11px] leading-4 font-extrabold text-black tabular-nums">
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
              className={`${ACTION_BUTTON_CLASS} ${item.className ?? ""}`}
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
          title={mobileTitle}
          onClose={closeSheet}
          footer={
            <div className="flex items-center gap-2">
              {onClearFilters && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  disabled={activeCount === 0}
                  className="text-text-gray border-foreground/10 hover:text-text flex-1 rounded-xl border py-3 text-sm font-bold transition-colors disabled:opacity-40"
                >
                  حذف فیلترها
                </button>
              )}
              <button
                type="button"
                onClick={handleApply}
                disabled={mobileApplyDisabled}
                className="bg-primary-400 flex flex-[2] items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-black transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {mobileApplyLabel}
                {typeof resultCount === "number" && (
                  <span className="rounded-full bg-black/15 px-2 py-0.5 text-xs font-bold tabular-nums">
                    {resultCount.toLocaleString("fa-IR")}
                  </span>
                )}
              </button>
            </div>
          }
        >
          <Accordion
            openId={mobileOpenId}
            onOpenChange={setMobileOpenId}
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
                        commitMobile(item.id, next, panel),
                      setFieldValue: (targetId: string, next: unknown) =>
                        setValue(targetId, next, false),
                      openPanel: setMobileOpenId,
                      close: () => setMobileOpenId(null),
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
      </div>
    );
  }

  /* ==========================   دسکتاپ   ========================== */
  return (
    <div className={className}>
      {items.map((item) => (
        <Trigger
          key={item.id}
          item={item}
          value={getValue(item.id)}
          isOpen={openId === item.id}
          toggle={toggle}
          close={close}
          register={registerTrigger}
          panelId={item.panel ? panelDomId(item.id) : undefined}
        />
      ))}
      {items.map((item) =>
        item.panel ? (
          <Panel
            key={item.id}
            id={item.id}
            panel={item.panel}
            isOpen={openId === item.id}
            domId={panelDomId(item.id)}
            placement={placement}
            getValue={getValue}
            setValue={setValue}
            openById={openById}
            close={close}
            anchorRect={anchorRect}
            triggerEl={triggerEl}
          />
        ) : null,
      )}
    </div>
  );
}

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

function getBadge(value: unknown): number | undefined {
  return Array.isArray(value) && value.length > 0 ? value.length : undefined;
}

export default FilterCard;

export type {
  FilterCardValues,
  FilterCardPlacement,
  FilterTriggerVariant,
  FilterPanelSize,
  TriggerRenderProps,
  PanelRenderProps,
  FilterPanelConfig,
  FilterCardItem,
  MobileTriggerRenderProps,
  FilterCardProps,
} from "./types";
