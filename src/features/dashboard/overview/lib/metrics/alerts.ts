/**
 * ارزیابی قواعد نوار «نیازمند توجه» (Alerts).
 *
 * قواعد و آستانه‌ها از `config/alerts.config.ts` می‌آیند — این فایل فقط
 * **منطق** است. pure و strict.
 */

import type { DashboardBooking, DashboardCabin } from "../../types/dashboard.types";
import { type DateRange } from "./range";
import {
  cancellationRate,
  occupancy,
} from "./kpi";
import { ALERT_META, ALERT_RULES, IDLE_CABIN_HORIZON_DAYS, MAX_VISIBLE_ALERTS } from "../../config/alerts.config";
import type { AlertKind, AlertSeverity } from "../../config/alerts.config";
import { formatCountWithUnit, formatPercent } from "./format";

/** یک هشدار فعال — آماده‌ی رندر. */
export interface ActiveAlert {
  kind: AlertKind;
  severity: AlertSeverity;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  /** متن متریک — مثل «۱۴٪ افت» یا «۳ رزرو» */
  metric: string;
}

/** ورودی ارزیابی هشدارها. */
export interface AlertInput {
  bookings: readonly DashboardBooking[];
  compareBookings: readonly DashboardBooking[];
  cabins: readonly DashboardCabin[];
  range: DateRange;
  compareRange: DateRange | null;
  today: Date;
}

/**
 * ارزیابی همه‌ی قواعد فعال و بازگشت هشدارهای برانگیخته.
 *
 * ترتیب خروجی = ترتیب `ALERT_RULES` (کنترل اولویت در config).
 */
export function evaluateAlerts(input: AlertInput): ActiveAlert[] {
  const { bookings, compareBookings, cabins, range, compareRange, today } = input;
  const alerts: ActiveAlert[] = [];

  const cabinCount = cabins.length;

  for (const rule of ALERT_RULES) {
    if (!rule.enabled) continue;
    const meta = ALERT_META[rule.kind];

    switch (rule.kind) {
      /* ---------------------------------------------------------------
         ۱) افت اشغال بیش از X نسبت به دوره‌ی مقایسه
         --------------------------------------------------------------- */
      case "occupancy-drop": {
        if (!compareRange) break;

        const current = occupancy(bookings, cabinCount, range);
        const previous = occupancy(compareBookings, cabinCount, compareRange);
        if (current === null || previous === null || previous === 0) break;

        const dropRatio = (previous - current) / previous;
        if (dropRatio <= rule.threshold) break;

        alerts.push({
          kind: rule.kind,
          severity: rule.severity,
          ...meta,
          metric: `${formatPercent(dropRatio)} کاهش`,
        });
        break;
      }

      /* ---------------------------------------------------------------
         ۲) نرخ لغو بالای آستانه
         --------------------------------------------------------------- */
      case "high-cancellation": {
        const rate = cancellationRate(bookings, range);
        if (rate === null || rate <= rule.threshold) break;

        alerts.push({
          kind: rule.kind,
          severity: rule.severity,
          ...meta,
          metric: formatPercent(rate),
        });
        break;
      }

      /* ---------------------------------------------------------------
         ۳) اقامتگاه‌های بدون رزرو در افق پیش‌رو
         --------------------------------------------------------------- */
      case "idle-cabins": {
        const idle = findIdleCabins(bookings, cabins, today, IDLE_CABIN_HORIZON_DAYS);
        if (idle.length === 0) break;

        alerts.push({
          kind: rule.kind,
          severity: rule.severity,
          ...meta,
          metric: formatCountWithUnit(idle.length, "cabin"),
        });
        break;
      }

    }
  }

  return alerts.slice(0, MAX_VISIBLE_ALERTS);
}

/**
 * اقامتگاه‌هایی که در `horizonDays` روز آینده هیچ رزرو فعالی ندارند.
 * برای هشدار «اقامتگاه بی‌رزرو».
 */
export function findIdleCabins(
  bookings: readonly DashboardBooking[],
  cabins: readonly DashboardCabin[],
  today: Date,
  horizonDays: number,
): DashboardCabin[] {
  const windowEnd = new Date(today);
  windowEnd.setDate(windowEnd.getDate() + horizonDays);
  const active = new Set(["pending", "confirmed", "checkedIn"]);

  const bookedCabinIds = new Set(
    bookings
      .filter((b) => active.has(b.status))
      .filter((b) => b.startDate <= windowEnd && b.endDate >= today)
      .map((b) => b.cabinId),
  );

  return cabins.filter((cabin) => !bookedCabinIds.has(cabin.id));
}
