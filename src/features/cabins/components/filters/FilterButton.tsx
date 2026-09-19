import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  label: string;
  /** خلاصه مقدار انتخاب‌شده (مثل «۲ نفر») */
  summary?: string;
  active?: boolean;
  open?: boolean;
  onClick: () => void;
  icon?: ReactNode;
  badge?: number;
  className?: string;
};

/** دکمه‌ی گرد فیلتر به سبک جاجیگا */
export default function FilterButton({
  label,
  summary,
  active = false,
  open = false,
  onClick,
  icon,
  badge,
  className = "",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 active:scale-95 ${
        active
          ? "border-primary-400 bg-primary-400/10 text-text shadow-sm"
          : "border-foreground/10 bg-surface text-text-gray hover:border-foreground/20 hover:text-text"
      } ${className}`}
    >
      {icon}
      <span>{label}</span>
      {summary && (
        <span className="text-primary-600 dark:text-primary-400 text-xs font-bold">
          {summary}
        </span>
      )}
      {badge !== undefined && badge > 0 && (
        <span className="bg-primary-400 flex size-5 items-center justify-center rounded-full text-[11px] font-bold text-black tabular-nums">
          {badge.toLocaleString("fa-IR")}
        </span>
      )}
      <ChevronDown
        className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}
