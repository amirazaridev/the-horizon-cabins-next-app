import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";

export default function FieldContent({
  icon,
  label,
  value,
  placeholder,
  caret = false,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
  placeholder?: string;
  caret?: boolean;
}) {
  const filled = Boolean(value);

  return (
    <>
      <span className="text-primary-400 bg-primary-400/10 flex size-9 shrink-0 items-center justify-center rounded-full">
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col text-right">
        <span className="text-[11px] font-medium text-text-gray/95">{label}</span>
        <span
          className={`truncate text-sm font-semibold ${
            filled ? "text-text" : "text-text/60"
          }`}
        >
          {value || placeholder}
        </span>
      </span>
      {caret && (
        <ChevronDown className="size-4 shrink-0 text-white/40 transition-transform duration-200 group-aria-expanded:rotate-180" />
      )}
    </>
  );
}