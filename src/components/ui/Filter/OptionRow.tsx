import { Check } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  label: string;
  hint?: string;
  selected: boolean;
  onSelect: () => void;
  icon?: ReactNode;
  disabled?: boolean;
};

/** یک سطر انتخاب داخل پنل فیلتر (برای حالت تک‌انتخابی یا چندانتخابی) */
export default function OptionRow({
  label,
  hint,
  selected,
  onSelect,
  icon,
  disabled = false,
}: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-start transition-all duration-200 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 ${
        selected
          ? "border-primary-400 bg-primary-400/10"
          : "border-foreground/10 bg-surface hover:border-foreground/25"
      }`}
    >
      {icon && (
        <span aria-hidden="true" className="shrink-0">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="text-text block truncate text-sm font-bold">
          {label}
        </span>
        {hint && (
          <span className="text-text-gray block truncate text-xs">{hint}</span>
        )}
      </span>
      <span
        className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
          selected
            ? "border-primary-400 bg-primary-400 text-black"
            : "border-foreground/20 text-transparent"
        }`}
      >
        <Check className="size-4" strokeWidth={3} />
      </span>
    </button>
  );
}