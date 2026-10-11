"use client";

import { useCallback, useId, useRef, useState } from "react";

import { FOCUS_RING } from "../focus-ring";
import MobileFilterBranch from "./MobileFilterBranch";
import {
  type FilterCardItem,
  type FilterCardProps,
  type MobileTriggerRenderProps,
} from "./types";
import { isFilterValueActive } from "./value";
import Trigger, { TRIGGER_VARIANTS } from "./Trigger";
import Panel from "./Panel";

//* کلاس‌های دکمه‌ی تریگرِ پیش‌فرض موبایل (وقتی renderMobileTrigger داده نشده)
const CUSTOM_TRIGGER_FALLBACK = `flex w-full items-center gap-2 rounded-full border border-foreground/10 bg-surface px-4 py-2.5 ${FOCUS_RING}`;

function FilterCard({
  items,
  value,
  defaultValue = {},
  onValueChange,
  placement = "start",
  defaultOpenId = null,
  className = "",
  mobileTitle = "فیلترها",
  mobileTriggerLabel = "فیلترها",
  renderMobileTrigger,
  mobileTriggerClassName = "",
  mobileApplyLabel = "مشاهده نتایج",
  onMobileApply,
  mobileApplyDisabled = false,
  mobileApplyPending = false,
  resultCount,
  onClearFilters,
}: FilterCardProps) {
  const controlled = value !== undefined;
  const uid = useId();

  const [openId, setOpenId] = useState<string | null>(defaultOpenId);
  const [values, setValues] = useState<Record<string, unknown>>(defaultValue);

  //* موبایل
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(
    defaultOpenId,
  );

  const anchorRect = useRef<DOMRect | null>(null);
  const triggerEl = useRef<HTMLButtonElement | null>(null);

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

  /* ==========================   شاخه‌ی موبایل   ========================== */
  const panelItems: FilterCardItem[] = [];
  const actionItems: FilterCardItem[] = [];
  const countedGroups = new Set<string>();
  let activeCount = 0;

  for (const item of items) {
    /*
     * شمارش فیلترهای فعال:
     *  - آیتم‌های hideOnMobile هم بررسی می‌شوند (مثل تاریخ خروج)؛
     *  - آیتم‌های هم‌گروه فقط یک‌بار شمرده می‌شوند تا «تاریخ ورود و خروج»
     *    یک فیلتر حساب شود، نه دو تا.
     */
    if (isFilterValueActive(getValue(item.id))) {
      if (item.group) {
        if (!countedGroups.has(item.group)) {
          countedGroups.add(item.group);
          activeCount += 1;
        }
      } else {
        activeCount += 1;
      }
    }

    if (item.hideOnMobile) continue;
    if (item.panel) panelItems.push(item);
    else actionItems.push(item);
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
      <div className="md:hidden flex min-w-0 flex-1">
        <MobileFilterBranch
          triggerClass={triggerClass}
          customTrigger={customTrigger}
          triggerLabel={mobileTriggerLabel}
          activeCount={activeCount}
          actionItems={actionItems}
          sheetOpen={sheetOpen}
          openSheet={openSheet}
          closeSheet={closeSheet}
          sheetTitle={mobileTitle}
          onClearFilters={onClearFilters}
          onApply={handleApply}
          applyDisabled={mobileApplyDisabled}
          applyPending={mobileApplyPending}
          applyLabel={mobileApplyLabel}
          resultCount={resultCount}
          panelItems={panelItems}
          openPanelId={mobileOpenId}
          setOpenPanelId={setMobileOpenId}
          getValue={getValue}
          commitValue={commitMobile}
          setFieldValue={(id, next) => setValue(id, next, false)}
        />
      </div>

      <div className="hidden md:contents">
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
      </div>

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
