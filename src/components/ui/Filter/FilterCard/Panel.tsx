/* ==================================================================
   PANEL — پنل پاپاوِر دسکتاپ
   ================================================================== */

"use client";

import {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import {
  FilterPanelConfig,
  FilterPanelSize,
  FilterCardPlacement,
} from "./types";

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
  anchorRect: React.RefObject<DOMRect | null>;
  triggerEl: React.RefObject<HTMLButtonElement | null>;
};

type PanelProps = PanelSharedProps & {
  id: string;
  panel: FilterPanelConfig;
  isOpen: boolean;
  /** شناسه‌ی دیالوگ (برای aria-controls تریگر) */
  domId?: string;
};

function Panel({ id, panel, isOpen, domId, ...rest }: PanelProps) {
  if (!isOpen) return null;
  return <PanelPopover id={id} panel={panel} domId={domId} {...rest} />;
}

type PanelPopoverProps = PanelSharedProps & {
  id: string;
  panel: FilterPanelConfig;
  domId?: string;
};

function PanelPopover({
  id,
  panel,
  domId,
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

    let top = rect.bottom + GAP;
    let caretAtTop = true;
    if (
      top + panelH > window.innerHeight - VIEWPORT_MARGIN &&
      rect.top - panelH - GAP > VIEWPORT_MARGIN
    ) {
      top = rect.top - panelH - GAP;
      caretAtTop = false;
    }

    let left: number;
    if (panelPlacement === "center") {
      left = rect.left + rect.width / 2 - panelW / 2;
    } else {
      const alignToStart = panelPlacement === "start" ? rtl : !rtl;
      left = alignToStart ? rect.right - panelW : rect.left;
    }
    left = Math.min(
      Math.max(left, VIEWPORT_MARGIN),
      window.innerWidth - panelW - VIEWPORT_MARGIN,
    );

    node.style.top = `${Math.max(top, VIEWPORT_MARGIN)}px`;
    node.style.left = `${left}px`;

    if (showArrow && caretRef.current) {
      const buttonCenter = rect.left + rect.width / 2;
      const caretX = Math.min(Math.max(buttonCenter - left, 14), panelW - 14);
      caretRef.current.style.left = `${caretX}px`;
      caretRef.current.style.top = caretAtTop ? "0px" : "auto";
      caretRef.current.style.bottom = caretAtTop ? "auto" : "0px";
      caretRef.current.style.transform = `translate(-50%, ${
        caretAtTop ? "-50%" : "50%"
      }) rotate(45deg)`;
      caretRef.current.style.borderStyle = "solid";
      caretRef.current.style.borderColor = getComputedStyle(node).borderColor;
      caretRef.current.style.borderTopWidth = caretAtTop ? "1px" : "0px";
      caretRef.current.style.borderBottomWidth = caretAtTop ? "0px" : "1px";
      caretRef.current.style.borderLeftWidth = "1px";
      caretRef.current.style.borderRightWidth = "0px";
    }

    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [anchorRect, panelPlacement, showArrow]);

  useEffect(() => {
    const node = ref.current;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (node?.contains(target)) return;
      if (target?.closest?.("[data-fc-trigger]")) return;
      close();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    /** اسکرولِ هر جای صفحه پنل را می‌بندد — به جز اسکرول خودِ پنل */
    const handleScroll = (e: Event) => {
      if (node?.contains(e.target as Node | null)) return;
      close();
    };
    const handleResize = () => close();

    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKey);
    document.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [close]);

  useEffect(() => {
    const node = ref.current;
    const trigger = triggerEl.current;
    node?.focus();
    return () => {
      if (node?.contains(document.activeElement)) trigger?.focus();
    };
  }, [triggerEl]);

  const value = getValue(id);

  /**
   * اعمال مقدار؛ اگر closeOnSelect یا advanceTo داشته باشد پنل بسته می‌شود
   * و در حالت advanceTo، پنل مقصد بعد از یک فریم باز می‌شود.
   */
  const commit = (next: unknown) => {
    setValue(id, next, closeOnSelect || advanceTo !== undefined);
    if (advanceTo) {
      window.requestAnimationFrame(() => openById(advanceTo));
    }
  };

  const content: ReactNode =
    typeof render === "function"
      ? render({
          id,
          value,
          getValue,
          setValue: commit,
          setFieldValue: (targetId, next) => setValue(targetId, next, false),
          openPanel: openById,
          close,
        })
      : children;

  return createPortal(
    <div
      ref={ref}
      id={domId}
      role="dialog"
      tabIndex={-1}
      aria-label={title ?? id}
      className={`bg-surface border-border dark:border-border-strong fixed z-[60] flex max-h-[min(440px,62dvh)] flex-col rounded-3xl border shadow-2xl transition-[opacity,transform] duration-200 ease-out outline-none ${PANEL_SIZE[size]} ${
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
        <div className="bg-surface border-foreground/5 flex shrink-0 items-center justify-between gap-3 rounded-t-3xl border-b px-5 py-3.5">
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
        className={`min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 md:p-5 ${
          title ? "rounded-b-3xl" : "rounded-3xl"
        } ${contentClassName}`}
      >
        {content}
      </div>
    </div>,
    document.body,
  );
}

export default Panel;
