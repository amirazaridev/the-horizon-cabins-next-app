import { X } from "lucide-react";
import type { ReactNode } from "react";

export type SelectedChipItem = {
  value: string;
  label: string;
  icon?: ReactNode;
};

type SelectedChipsProps = {
  items: SelectedChipItem[];
  onRemove: (value: string) => void;
  className?: string;
};

/** ردیف چیپ‌های آیتم‌های انتخاب‌شده در بالای لیست گزینه‌ها - هرکدام با دکمه‌ی حذف */
export default function SelectedChips({
  items,
  onRemove,
  className = "",
}: SelectedChipsProps) {
  if (items.length === 0) return null;

  return (
    <div
      role="list"
      aria-label="آیتم‌های انتخاب‌شده"
      className={`border-foreground/5 flex flex-wrap gap-1.5 border-b pb-3 ${className}`}
    >
      {items.map((item) => (
        <span
          key={item.value}
          role="listitem"
          className="border-primary-400 bg-primary-400/10 text-text flex items-center gap-1.5 rounded-full border py-1 ps-3 pe-1.5 text-xs font-bold"
        >
          {item.icon && (
            <span aria-hidden="true" className="shrink-0">
              {item.icon}
            </span>
          )}
          <span className="max-w-32 truncate">{item.label}</span>
          <button
            type="button"
            onClick={() => onRemove(item.value)}
            aria-label={`حذف ${item.label}`}
            className="hover:bg-primary-400/20 text-text-gray hover:text-text grid size-5 shrink-0 place-items-center rounded-full transition-colors"
          >
            <X className="size-3" strokeWidth={2.5} />
          </button>
        </span>
      ))}
    </div>
  );
}
