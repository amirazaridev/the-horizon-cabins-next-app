"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BellRing,
  Info,
  OctagonAlert,
} from "lucide-react";

import { evaluateAlerts, type AlertInput } from "../../lib/metrics/alerts";
import { formatCount } from "../../lib/metrics/format";
import type { AlertSeverity } from "../../config/alerts.config";

type AlertsBarProps = AlertInput;

/**
 * نوار «نیازمند توجه» — هشدارهای فعال داشبورد.
 *
 * ⭐ همه‌ی قواعد و آستانه‌ها از `config/alerts.config.ts` می‌آیند؛ این
 * کامپوننت فقط خروجی `evaluateAlerts()` را رندر می‌کند.
 *
 * اگر هیچ هشداری فعال نباشد، **هیچ چیزی رندر نمی‌شود** (نه کارت خالی) تا
 * داشبورد شلوغ نشود.
 */
export default function AlertsBar({
  bookings,
  compareBookings,
  cabins,
  range,
  compareRange,
  today,
}: AlertsBarProps) {
  const alerts = useMemo(
    () =>
      evaluateAlerts({
        bookings,
        compareBookings,
        cabins,
        range,
        compareRange,
        today,
      }),
    [bookings, compareBookings, cabins, range, compareRange, today],
  );

  if (alerts.length === 0) return null;

  return (
    <section
      aria-label="نیازمند توجه"
      className="border-border bg-background-2 flex flex-col gap-3 rounded-2xl border p-4"
    >
      <div className="flex items-center gap-2">
        <BellRing className="text-primary-500 size-4.5" />
        <h2 className="text-text text-sm font-semibold">نیازمند توجه</h2>
        <span className="bg-primary-400/15 text-primary-600 dark:text-primary-400 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums">
          {formatCount(alerts.length)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {alerts.map((alert) => (
          <article
            key={alert.kind}
            className={`flex flex-col gap-2 rounded-xl border p-3.5 ${SEVERITY_CONTAINER[alert.severity]}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <SeverityIcon severity={alert.severity} />
                <h3 className="text-text text-sm font-semibold">
                  {alert.title}
                </h3>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${SEVERITY_BADGE[alert.severity]}`}
              >
                {alert.metric}
              </span>
            </div>

            <p className="text-text-gray text-xs leading-5">
              {alert.description}
            </p>

            <Link
              href={alert.actionHref}
              className="text-text focus-visible:ring-primary-400/60 mt-auto inline-flex items-center gap-1 rounded-sm text-xs font-medium hover:underline focus-visible:ring-2 focus-visible:outline-none"
            >
              {alert.actionLabel}
              <span className="sr-only"> — {alert.title}</span>
              <ArrowLeft className="size-3.5" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
   نقشه‌ی رنگ/آیکون بر اساس شدت — تک‌منبع
   ========================================================================== */

const SEVERITY_CONTAINER: Record<AlertSeverity, string> = {
  critical: "border-danger/40 bg-danger/5",
  warning: "border-amber-500/40 bg-amber-500/5",
  info: "border-border bg-background",
};

const SEVERITY_BADGE: Record<AlertSeverity, string> = {
  critical: "bg-danger/15 text-danger-strong dark:text-danger",
  warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  info: "bg-foreground/8 text-text-gray",
};

function SeverityIcon({ severity }: { severity: AlertSeverity }) {
  if (severity === "critical") {
    return <OctagonAlert className="text-danger size-4 shrink-0" />;
  }
  if (severity === "warning") {
    return <AlertTriangle className="size-4 shrink-0 text-amber-500" />;
  }
  return <Info className="text-text-gray size-4 shrink-0" />;
}
