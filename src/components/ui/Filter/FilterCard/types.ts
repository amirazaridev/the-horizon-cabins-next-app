import type React from "react";

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
  getValue: (id: string) => unknown;
  setValue: (value: unknown) => void;
  setFieldValue: (id: string, value: unknown) => void;
  openPanel: (id: string) => void;
  close: () => void;
};

export type FilterPanelConfig = {
  title?: string;
  size?: FilterPanelSize;
  placement?: FilterCardPlacement;
  showArrow?: boolean;
  closeOnSelect?: boolean;
  advanceTo?: string;
  className?: string;
  contentClassName?: string;
  render?: (ctx: PanelRenderProps) => React.ReactNode;
  children?: React.ReactNode;
};

export type FilterCardItem = {
  id: string;
  label?: string;
  formatLabel?: (value: unknown) => string | undefined;
  icon?: React.ReactNode;
  variant?: FilterTriggerVariant;
  showCaret?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  renderTrigger?:
    React.ReactNode | ((ctx: TriggerRenderProps) => React.ReactNode);
  panel?: FilterPanelConfig;
  /** در موبایل (تریگر + آکاردئون شیت) نمایش داده نشود — مثلاً تاریخ خروج */
  hideOnMobile?: boolean;
};

export type MobileTriggerRenderProps = {
  activeCount: number;
  getValue: (id: string) => unknown;
  open: () => void;
};

export type FilterCardProps = {
  items: FilterCardItem[];
  value?: FilterCardValues;
  defaultValue?: FilterCardValues;
  onValueChange?: (id: string, value: unknown) => void;
  placement?: FilterCardPlacement;
  defaultOpenId?: string | null;
  className?: string;
  /* ---------- موبایل ---------- */
  mobileBreakpoint?: string;
  mobileTitle?: string;
  mobileTriggerLabel?: string;
  renderMobileTrigger?:
    React.ReactNode | ((ctx: MobileTriggerRenderProps) => React.ReactNode);
  mobileTriggerClassName?: string;
  mobileApplyLabel?: string;
  onMobileApply?: () => void;
  mobileApplyDisabled?: boolean;
  resultCount?: number;
  onClearFilters?: () => void;
};
