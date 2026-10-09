import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

import Skeleton from "@/components/ui/Skeleton";
import CardDashContainer from "@/components/ui/CardDashContainer";

/**
 * حالت خالی استاندارد ویجت‌های داشبورد.
 *
 * ⭐ تک‌منبع برای «داده‌ای برای این فیلتر نیست» — تا هر ویجت پیام و
 * آیکون خودش را جدا نسازد. رنگ/چیدمان همه‌جا یکی می‌ماند.
 */
export function WidgetEmpty({
  label,
  description,
  icon,
  className = "",
}: {
  label: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <div
      role="status"
      className={`text-text-gray flex h-full min-h-40 flex-col items-center justify-center gap-3 px-4 py-8 text-center ${className}`}
    >
      <span className="bg-foreground/6 grid size-11 place-items-center rounded-full">
        {icon ?? <Inbox className="size-5" strokeWidth={1.6} />}
      </span>
      <div className="flex flex-col gap-1">
        <span className="text-text text-sm font-medium">{label}</span>
        {description && (
          <span className="text-text-gray max-w-64 text-xs leading-5">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * اسکلتون ساختارمند کارت‌های ویجت — برای حالت بارگذاری هر ویجت.
 *
 * ⚠️ چیدمان عمداً آینه‌ی `CardDashContainer` است (پدینگ، شعاع، فاصله) تا
 * سوئیچ از لودینگ به محتوا بدون جهش انجام شود.
 */
export function WidgetSkeleton({
  rows = 3,
  chart = false,
  kpi = false,
  className = "",
}: {
  /** تعداد ردیف‌های متن (برای کارت‌های لیستی). */
  rows?: number;
  /** آیا بدنه‌ی نمودار (بلوک بلند) نمایش داده شود؟ */
  chart?: boolean;
  /** آیا اسکلتون کارت KPI (عنوان+مقدار+آیکون+نوار هدف) باشد؟ */
  kpi?: boolean;
  className?: string;
}): ReactNode {
  if (kpi) {
    return (
      <CardDashContainer className={`relative overflow-hidden p-5 ${className}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3.5 w-24 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-3.5 w-32 rounded-full" />
          </div>
          <Skeleton className="size-11.5 shrink-0 rounded-xl" />
        </div>
        <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
      </CardDashContainer>
    );
  }

  return (
    <CardDashContainer
      className={`flex h-full w-full flex-col gap-4 p-5 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-3 w-40 rounded-full" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {chart ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <div className="flex flex-col gap-3">
          {Array.from({ length: rows }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      )}
    </CardDashContainer>
  );
}
