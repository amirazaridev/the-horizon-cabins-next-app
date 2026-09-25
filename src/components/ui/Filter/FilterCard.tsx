"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import Accordion from "../Accordion";
import FilterMobileSheet from "./FilterMobileSheet";
import useIsMobile from "./useIsMobile";

/* ==================================================================
   TYPES
   ================================================================== */

export type FilterCardValues = Record<string, unknown>;
export type FilterCardPlacement = "start" | "center" | "end";
export type FilterTriggerVariant = "pill" | "outline" | "ghost" | "field";
export type FilterPanelSize = "sm" | "md" | "lg" | "xl" | "auto";

export type TriggerRenderProps = {
  id: string;
  value: unknown;
  isOpen: boolean;
  close: () => void;
};

export type PanelRenderProps = {
  id: string;
  value: unknown;
  /** خواندن مقدار هر فیلد دیگر (مثلاً ورود/خروج که یک بازه مشترک دارند) */
  getValue: (id: string) => unknown;
  setValue: (value: unknown) => void;
  /** نوشتن مقدار یک فیلد دیگر بدون وابستگی به id همین کارت */
  setFieldValue: (id: string, value: unknown) => void;
  /** باز کردن کارتِ فیلد دیگر (برای رفتن خودکار به فیلد بعدی) */
  openPanel: (id: string) => void;
  close: () => void;
};

export type FilterPanelConfig = {
  /** عنوان کارت + دکمه بستن */
  title?: string;
  /** سایز کارت (عرض) - پیشفرض md */
  size?: FilterPanelSize;
  /** چینش کارت نسبت به دکمه - پیشفرض از خود FilterCard */
  placement?: FilterCardPlacement;
  /** نمایش پیکان اشارهگر به سمت دکمه */
  showArrow?: boolean;
  /** بعد از انتخاب، کارت خودکار بسته شود */
  closeOnSelect?: boolean;
  /** بعد از بستنِ خودکار، کارتِ فیلد با این id باز شود (انتخاب مرحله‌ای) */
  advanceTo?: string;
  className?: string;
  contentClassName?: string;
  /** محتوای کارت - میتونه تابع (render-prop) هم باشه */
  render?: (ctx: PanelRenderProps) => ReactNode;
  children?: ReactNode;
};

export type FilterCardItem = {
  /** شناسه یکتا - مقدار این فیلتر با همین کلید ذخیره میشود */
  id: string;
  /** متن پیشفرض دکمه مثل «تعیین شهر» */
  label?: string;
  /** تبدیل مقدار انتخابی به اسم روی دکمه - مثل (v) => v.name. undefined یعنی label پیشفرض */
  formatLabel?: (value: unknown) => string | undefined;
  icon?: ReactNode;
  variant?: FilterTriggerVariant;
  showCaret?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  /** جایگزینی کامل محتوای دکمه - میتونه تابع (render-prop) هم باشه */
  renderTrigger?: ReactNode | ((ctx: TriggerRenderProps) => ReactNode);
  /** تنظیمات کارت فیلتر - اگر نباشد دکمه بدون کارت است */
  panel?: FilterPanelConfig;
  /** در موبایل (تریگر + آکاردئون شیت) نمایش داده نشود - مثلاً تاریخ خروج */
  hideOnMobile?: boolean;
};

type AnchorRect = DOMRect;

/* ==================================================================
   ROOT
   ================================================================== */

export type MobileTriggerRenderProps = {
  /** تعداد فیلترهای فعال */
  activeCount: number;
  /** خواندن مقدار هر فیلتر */
  getValue: (id: string) => unknown;
  /** باز کردن شیت */
  open: () => void;
};

export type FilterCardProps = {
  /** آرایه‌ای از فیلترها (دکمه + کارت) */
  items: FilterCardItem[];
  /** مقدارها در حالت controlled - آبجکت با کلیدِ id هر فیلتر */
  value?: FilterCardValues;
  /** مقدارهای اولیه در حالت uncontrolled */
  defaultValue?: FilterCardValues;
  /** هروقت مقداری تغییر کند صدا زده میشود (id و value) */
  onValueChange?: (id: string, value: unknown) => void;
  /** چینش کارت نسبت به دکمه - پیشفرض start (در RTL یعنی راستچین) */
  placement?: FilterCardPlacement;
  /** اولین کارتِ باز در شروع */
  defaultOpenId?: string | null;
  className?: string;
  /* ---------- موبایل (bottom-sheet + accordion) ---------- */
  /** کوئری تشخیص موبایل — پیش‌فرض زیر md */
  mobileBreakpoint?: string;
  /** عنوان شیت موبایل */
  mobileTitle?: string;
  /** لیبل دکمه تکی موبایل */
  mobileTriggerLabel?: string;
  /** سفارشی‌سازی کامل دکمه تریگر موبایل (محتوای داخل دکمه) */
  renderMobileTrigger?: ReactNode | ((ctx: MobileTriggerRenderProps) => ReactNode);
  /** کلاس دکمه تریگر موبایل */
  mobileTriggerClassName?: string;
  /** لیبل دکمه اعمال در فوتر شیت */
  mobileApplyLabel?: string;
  /** رفتار دکمه اعمال — اگر داده نشود فقط شیت بسته می‌شود */
  onMobileApply?: () => void;
  /** غیرفعال کردن دکمه اعمال (مثلاً هنگام ناقص بودن فرم جستجو) */
  mobileApplyDisabled?: boolean;
  /** تعداد نتیجه (اختیاری) — داخل دکمه اعمال نمایش داده می‌شود */
  resultCount?: number;
  /** پاک کردن همه فیلترها — اگر داده نشود دکمه حذف نمایش داده نمی‌شود */
  onClearFilters?: () => void;
};

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

  const [openId, setOpenId] = useState<string | null>(defaultOpenId);
  const [values, setValues] = useState<Record<string, unknown>>(defaultValue);

  /* ---------- state موبایل ---------- */
  const isMobile = useIsMobile(mobileBreakpoint);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(
    defaultOpenId,
  );

  const anchorRect = useRef<AnchorRect | null>(null);
  const triggerEl = useRef<HTMLButtonElement | null>(null);

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

  const open = useCallback(
    (id: string, rect: AnchorRect, el: HTMLButtonElement) => {
      anchorRect.current = rect;
      triggerEl.current = el;
      setOpenId(id);
    },
    [],
  );

  const openById = useCallback((id: string) => {
    const el = document.querySelector<HTMLButtonElement>(
      `[data-fc-trigger="${id}"]`,
    );
    if (!el) return;
    anchorRect.current = el.getBoundingClientRect();
    triggerEl.current = el;
    setOpenId(id);
  }, []);

  const toggle = useCallback(
    (id: string, rect: AnchorRect, el: HTMLButtonElement) => {
      if (openId === id) close();
      else open(id, rect, el);
    },
    [openId, close, open],
  );

  /* ---------- مشتقات موبایل (حذف آیتم‌های hideOnMobile) ---------- */
  const mobileItems = items.filter((item) => !item.hideOnMobile);
  const panelItems = mobileItems.filter((item) => item.panel);
  const actionItems = mobileItems.filter((item) => !item.panel);

  const getSummary = (id: string): string | undefined => {
    const item = items.find((entry) => entry.id === id);
    if (!item?.formatLabel) return undefined;
    try {
      return item.formatLabel(getValue(id)) ?? undefined;
    } catch {
      return undefined;
    }
  };

  const getBadge = (id: string): number | undefined => {
    const v = getValue(id);
    if (Array.isArray(v) && v.length > 0) return v.length;
    return undefined;
  };

  const activeCount = mobileItems.filter((item) =>
    isFilterValueActive(getValue(item.id)),
  ).length;

  /* باز کردن شیت: اگر چیزی باز نیست، اولین فیلترِ فعال (یا اولین فیلتر) باز باشد */
  useEffect(() => {
    if (!sheetOpen) return;
    if (mobileOpenId) return;
    const firstActive = panelItems.find((item) =>
      isFilterValueActive(getValue(item.id)),
    );
    setMobileOpenId(firstActive?.id ?? panelItems[0]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetOpen]);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setMobileOpenId(null);
  }, []);

  const commitMobile = useCallback(
    (id: string, next: unknown, panel?: FilterPanelConfig) => {
      const shouldClose = panel?.closeOnSelect ?? false;
      if (!controlled) setValues((prev) => ({ ...prev, [id]: next }));
      onValueChange?.(id, next);
      if (panel?.advanceTo) {
        setMobileOpenId(panel.advanceTo);
      } else if (shouldClose) {
        setMobileOpenId(null);
      }
    },
    [controlled, onValueChange],
  );

  if (isMobile) {
    const openSheet = () => setSheetOpen(true);

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
      if (onMobileApply) {
        onMobileApply();
        closeSheet();
      } else {
        closeSheet();
      }
    };

    return (
      <div className={className}>
        {/* تریگر تکی موبایل + اکشن‌های بدون پنل */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={openSheet}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            className={`${
              customTrigger
                ? mobileTriggerClassName ||
                  "flex w-full items-center gap-2 rounded-full border px-4 py-2.5"
                : `flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 active:scale-95 ${
                    activeCount > 0
                      ? "border-primary-400 bg-primary-400/10 text-text shadow-sm"
                      : "border-foreground/10 bg-surface text-text-gray hover:border-foreground/20 hover:text-text"
                  }`
            }`}
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
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 border-foreground/10 bg-surface text-text-gray hover:border-foreground/20 hover:text-text ${item.className ?? ""}`}
            >
              {item.icon && (
                <span className="text-primary-400 flex shrink-0 items-center">
                  {item.icon}
                </span>
              )}
              <span className="max-w-40 truncate">
                {item.label ?? item.id}
              </span>
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
            onOpenChange={(next) => setMobileOpenId(next)}
            items={panelItems.map((item) => {
              const panel = item.panel!;
              const itemValue = getValue(item.id);
              return {
                id: item.id,
                title: panel.title ?? item.label ?? item.id,
                summary: getSummary(item.id),
                icon: item.icon,
                badge: getBadge(item.id),
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
                      openPanel: (targetId: string) =>
                        setMobileOpenId(targetId),
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
                  onClick={() => {
                    closeSheet();
                    item.onClick?.();
                  }}
                  className="border-foreground/10 bg-surface flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold"
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
        />
      ))}
      {items
        .filter((item) => item.panel)
        .map((item) => (
          <Panel
            key={item.id}
            id={item.id}
            panel={item.panel!}
            isOpen={openId === item.id}
            placement={placement}
            getValue={getValue}
            setValue={setValue}
            openById={openById}
            close={close}
            anchorRect={anchorRect}
            triggerEl={triggerEl}
          />
        ))}
    </div>
  );
}

/* ==================================================================
   TRIGGER
   ================================================================== */

const TRIGGER_VARIANTS: Record<
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

/** آیا مقدار فیلتر «واقعاً» پر شده؟ آرایه/رشته خالی یعنی خالی */
function isFilterValueActive(value: unknown): boolean {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

type TriggerProps = {
  item: FilterCardItem;
  value: unknown;
  isOpen: boolean;
  toggle: (id: string, rect: AnchorRect, el: HTMLButtonElement) => void;
  close: () => void;
};

function Trigger({ item, value, isOpen: open, toggle, close }: TriggerProps) {
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

  const content: ReactNode =
    typeof renderTrigger === "function"
      ? (renderTrigger as (ctx: TriggerRenderProps) => ReactNode)({
          id,
          value,
          isOpen: open,
          close,
        })
      : renderTrigger;

  const handleClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    toggle(id, e.currentTarget.getBoundingClientRect(), e.currentTarget);
    onClick?.();
  };

  return (
    <button
      type="button"
      data-fc-trigger={id}
      aria-haspopup="dialog"
      aria-expanded={open}
      disabled={disabled}
      onClick={handleClick}
      className={`${styles.base} ${
        open || filled ? styles.active : styles.idle
      } ${className}`}
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
              className={`size-4 shrink-0 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          )}
        </>
      )}
    </button>
  );
}

/* ==================================================================
   PANEL (wrapped + Popover)
   ================================================================== */

const PANEL_SIZE: Record<FilterPanelSize, string> = {
  sm: "w-64",
  md: "w-80",
  lg: "w-[26rem]",
  xl: "w-[min(38rem,calc(100vw-1.5rem))]",
  auto: "w-max min-w-52",
};

const GAP = 10;
const VIEWPORT_MARGIN = 10;

type PanelSharedProps = {
  placement: FilterCardPlacement;
  getValue: (id: string) => unknown;
  setValue: (id: string, value: unknown, closePanel?: boolean) => void;
  openById: (id: string) => void;
  close: () => void;
  anchorRect: RefObject<AnchorRect | null>;
  triggerEl: RefObject<HTMLButtonElement | null>;
};

type PanelProps = PanelSharedProps & {
  id: string;
  panel: FilterPanelConfig;
  isOpen: boolean;
};

function Panel({ id, panel, isOpen, ...rest }: PanelProps) {
  if (!isOpen) return null;
  return <PanelPopover id={id} panel={panel} {...rest} />;
}

type PanelPopoverProps = PanelSharedProps & {
  id: string;
  panel: FilterPanelConfig;
};

function PanelPopover({
  id,
  panel,
  placement: rootPlacement,
  getValue,
  setValue,
  openById,
  close,
  anchorRect,
  triggerEl,
}: PanelPopoverProps) {
  const {
    title,
    size = "md",
    placement,
    showArrow = true,
    closeOnSelect = false,
    advanceTo,
    className = "",
    contentClassName = "",
    render,
    children,
  } = panel;

  const panelPlacement = placement ?? rootPlacement;

  const ref = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    const rect = anchorRect.current;
    if (!node || !rect) return;

    const panelW = node.offsetWidth;
    const panelH = node.offsetHeight;
    const rtl = getComputedStyle(document.documentElement).direction === "rtl";

    /* عمودی: پایین دکمه، و اگر جا نبود بالا */
    let top = rect.bottom + GAP;
    let caretAtTop = true;
    if (
      top + panelH > window.innerHeight - VIEWPORT_MARGIN &&
      rect.top - panelH - GAP > VIEWPORT_MARGIN
    ) {
      top = rect.top - panelH - GAP;
      caretAtTop = false;
    }

    /* افقی: با توجه به placement و جهت متن */
    let left: number;
    if (panelPlacement === "center") {
      left = rect.left + rect.width / 2 - panelW / 2;
    } else {
      const alignToStart = panelPlacement === "start" ? rtl : !rtl;
      left = alignToStart ? rect.right - panelW : rect.left;
    }
    // اگر عرض کارت از عرض ویوپورت بیشتر باشد، اولویت با نماندن بیرون از سمت راست/چپ است
    left = Math.min(
      Math.max(left, VIEWPORT_MARGIN),
      window.innerWidth - panelW - VIEWPORT_MARGIN,
    );

    node.style.top = `${Math.max(top, VIEWPORT_MARGIN)}px`;
    node.style.left = `${left}px`;

    /* پیکان: وسط دکمه، محدود به کارت */
    if (showArrow) {
      const caret = caretRef.current;
      if (caret) {
        const buttonCenter = rect.left + rect.width / 2;
        const caretX = Math.min(
          Math.max(buttonCenter - left, 14),
          panelW - 14,
        );
        caret.style.left = `${caretX}px`;
        caret.style.top = caretAtTop ? "0px" : "auto";
        caret.style.bottom = caretAtTop ? "auto" : "0px";
        caret.style.transform = `translate(-50%, ${
          caretAtTop ? "-50%" : "50%"
        }) rotate(45deg)`;
        caret.style.borderStyle = "solid";
        caret.style.borderColor = getComputedStyle(node).borderColor;
        caret.style.borderTopWidth = caretAtTop ? "1px" : "0px";
        caret.style.borderBottomWidth = caretAtTop ? "0px" : "1px";
        caret.style.borderLeftWidth = "1px";
        caret.style.borderRightWidth = "0px";
      }
    }

    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [anchorRect, panelPlacement, showArrow]);

  /** بستن با کلیک بیرون، Escape یا اسکرول صفحه */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (ref.current?.contains(target)) return;
      if (target?.closest?.("[data-fc-trigger]")) return;
      close();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const handleScroll = () => close();

    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKey);
    document.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [close]);

  /**
   * مدیریت فوکوس مطابق الگوی a11y دیالوگ:
   * موقع باز شدن، فوکوس می‌رود روی خود کارت؛ موقع بسته شدن، فقط اگر فوکوس
   * واقعاً داخل کارت بوده (نه مثلاً روی چیزی که کاربر با کلیک بیرون به آن رفته)
   * به دکمه‌ی trigger برمی‌گردد.
   */
  useEffect(() => {
    ref.current?.focus();
    return () => {
      if (ref.current?.contains(document.activeElement)) {
        triggerEl.current?.focus();
      }
    };
  }, [triggerEl]);

  const value = getValue(id);

  /**
   * بعد از انتخاب، کارت یا بسته می‌شود و/یا فیلد بعدی باز می‌شود.
   * اگر advanceTo ست شده باشد، بلافاصله (بعد از بسته‌شدن) کارت بعدی باز می‌شود.
   */
  const commit = (next: unknown, shouldClose: boolean) => {
    if (!shouldClose) {
      setValue(id, next, false);
      return;
    }

    setValue(id, next, true);
    if (advanceTo) {
      window.requestAnimationFrame(() => openById(advanceTo));
    }
  };

  const setLocal = (next: unknown) => commit(next, closeOnSelect);

  const content: ReactNode =
    typeof render === "function"
      ? (render as (ctx: PanelRenderProps) => ReactNode)({
          id,
          value,
          getValue,
          setValue: setLocal,
          setFieldValue: (targetId, next) => setValue(targetId, next, false),
          openPanel: openById,
          close,
        })
      : children;

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      tabIndex={-1}
      aria-label={title ?? id}
      className={`bg-surface border-border dark:border-border-strong fixed z-[60] flex max-h-[min(440px,62dvh)] flex-col rounded-3xl border shadow-2xl outline-none transition-[opacity,transform] duration-200 ease-out ${PANEL_SIZE[size]} ${
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-1.5 scale-[0.98] opacity-0"
      } ${className}`}
    >
      {showArrow && (
        <span
          ref={caretRef}
          aria-hidden="true"
          className={`bg-surface absolute z-10 size-2.5 transition-opacity duration-200 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {title && (
        <div className="bg-surface flex shrink-0 items-center justify-between gap-3 rounded-t-3xl border-b border-foreground/5 px-5 py-3.5">
          <p className="text-text text-sm font-extrabold">{title}</p>
          <button
            type="button"
            onClick={close}
            aria-label="بستن"
            className="text-text-gray hover:bg-background-2 hover:text-text -my-1 rounded-full p-1.5 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <div
        className={`min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-b-3xl p-4 md:p-5 ${contentClassName}`}
      >
        {content}
      </div>
    </div>,
    document.body,
  );
}

export default FilterCard;