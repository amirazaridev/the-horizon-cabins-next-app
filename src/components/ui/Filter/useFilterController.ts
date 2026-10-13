"use client";

import { useCallback, useId, useRef, useState } from "react";

import type { FilterCardItem, FilterCardValues } from "./FilterCard/types";
import { isFilterValueActive } from "./FilterCard/value";

type Params = {
  items: FilterCardItem[];
  //* کنترل‌شده — با دادن `value`، مقدار از بیرون می‌آید و حالت داخلی غیرفعال می‌شود.
  value?: FilterCardValues;
  defaultValue?: FilterCardValues;
  onValueChange?: (id: string, value: unknown) => void;
  defaultOpenId?: string | null;
};

//* منطق مشترک کارت فیلتر و کارت سرچ: کدام پنل دسکتاپ باز است، شیت موبایل و آکاردئون آن،
export function useFilterController({
  items,
  value,
  defaultValue = {},
  onValueChange,
  defaultOpenId = null,
}: Params) {
  const controlled = value !== undefined;
  const uid = useId();

  //* پنل دسکتاپ
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);
  const [values, setValues] = useState<FilterCardValues>(defaultValue);

  //* شیت موبایل
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

  //* شناسه‌ی دیالوگ پنل (برای aria-controls)
  const panelDomId = useCallback((id: string) => `${uid}-${id}`, [uid]);

  //*شاخه‌ی موبایل
  const panelItems: FilterCardItem[] = [];
  const actionItems: FilterCardItem[] = [];
  const countedGroups = new Set<string>();
  let activeCount = 0;

  for (const item of items) {
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

  return {
    //* دسکتاپ
    openId,
    toggle,
    close,
    openById,
    registerTrigger,
    panelDomId,
    anchorRect,
    triggerEl,
    //* موبایل
    sheetOpen,
    openSheet,
    closeSheet,
    mobileOpenId,
    setMobileOpenId,
    commitMobile,
    //* مقدار و شمارش
    getValue,
    setValue,
    activeCount,
    panelItems,
    actionItems,
  };
}
