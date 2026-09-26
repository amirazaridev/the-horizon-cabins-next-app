"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  /** حالت کنترل‌شده: تب فعال رو والد تعیین می‌کنه */
  value?: string;
  /** حالت غیرکنترل‌شده: تب اولیه (پیش‌فرض اولین تب فعال) */
  defaultValue?: string;
  onChange?: (id: string) => void;
  className?: string;
  listClassName?: string;
  panelClassName?: string;
}

function getFirstEnabledId(items: TabItem[]): string {
  return items.find((item) => !item.disabled)?.id ?? items[0]?.id ?? "";
}

export default function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  className = "",
  listClassName = "",
  panelClassName = "",
}: TabsProps) {
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(
    () => defaultValue ?? getFirstEnabledId(items),
  );

  const activeId = isControlled ? value : internalValue;

  const activeTab = useMemo(
    () => items.find((item) => item.id === activeId) ?? items[0],
    [items, activeId],
  );

  const selectTab = useCallback(
    (id: string, disabled?: boolean) => {
      if (disabled || id === activeId) return;
      if (!isControlled) setInternalValue(id);
      onChange?.(id);
    },
    [activeId, isControlled, onChange],
  );

  if (items.length === 0) return null;

  return (
    <div className={className}>
      {/* نوار تب‌ها */}
      <div
        role="tablist"
        className={`border-foreground/5 bg-surface/50 flex flex-wrap gap-2 rounded-2xl border p-1 backdrop-blur-sm ${listClassName}`}
      >
        {items.map((item) => {
          const isActive = item.id === activeTab?.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-disabled={item.disabled}
              disabled={item.disabled}
              onClick={() => selectTab(item.id, item.disabled)}
              className={`relative inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 ${
                isActive
                  ? "bg-primary-400 shadow-primary-400/25 text-black shadow-lg"
                  : "text-text-gray hover:bg-foreground/5 hover:text-text"
              }`}
            >
              {item.icon && (
                <span className="flex size-4 items-center justify-center">
                  {item.icon}
                </span>
              )}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* محتوای تب فعال — فقط همین یکی رندر می‌شه */}
      {activeTab && (
        <div key={activeTab.id} role="tabpanel" className={panelClassName}>
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
