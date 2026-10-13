import type { ReactNode } from "react";

interface DetailRowProps {
  icon?: ReactNode;
  label: string;
  children: ReactNode;
}

/**
 * یک ردیف «برچسب / مقدار» در مودال‌های جزئیات داشبورد.
 *
 * ⭐ پیش‌تر در `BookingDetailsModal` و `UserDetailsModal` دوبار کپی شده بود.
 */
export default function DetailRow({
  icon,
  label,
  children,
}: DetailRowProps): ReactNode {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-text-gray flex items-center gap-1.5 text-xs">
        {icon}
        {label}
      </dt>
      <dd className="text-text truncate text-sm font-semibold">{children}</dd>
    </div>
  );
}
