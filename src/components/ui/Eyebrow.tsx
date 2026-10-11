import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** کلاس ریشه (رنگ/فاصله). */
  className?: string;
  /** اگر بدهید، جای خط تزئینی این آیکن می‌نشیند. */
  icon?: ReactNode;
};

export default function Eyebrow({ children, className = "", icon }: Props) {
  return (
    <div
      className={`flex items-center gap-3 text-xs font-semibold ${className}`}
    >
      {icon ?? (
        <span className="bg-primary-400 h-px w-8" aria-hidden="true" />
      )}
      {children}
    </div>
  );
}
