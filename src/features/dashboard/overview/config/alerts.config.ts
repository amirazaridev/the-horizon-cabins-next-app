/**
 * قواعد نوار «نیازمند توجه» (Alerts) — **تنظیم‌پذیر در یک فایل**.
 *
 * هیچ آستانه‌ای در کامپوننت hardcode نشود؛ همه از اینجا می‌آید.
 * منطق ارزیابی در `lib/metrics/alerts.ts` است.
 *
 * // TODO(supabase): خواندن آستانه‌ها از جدول تنظیمات
 */

/** انواع هشدار — هر کدام یک قاعده‌ی مستقل. */
export type AlertKind =
  | "occupancy-drop"
  | "high-cancellation"
  | "idle-cabins";

/** شدت هشدار — رنگ کارت را تعیین می‌کند. */
export type AlertSeverity = "critical" | "warning" | "info";

/** قاعده‌ی یک هشدار. */
export interface AlertRule {
  kind: AlertKind;
  /** آستانه — معنی آن بسته به نوع قاعده متفاوت است */
  threshold: number;
  severity: AlertSeverity;
  /** فعال/غیرفعال — برای خاموش‌کردن سریع یک قاعده */
  enabled: boolean;
}

/**
 * قواعد پیش‌فرض نوار Alerts.
 *
 * معنی هر آستانه:
 * - `occupancy-drop`: افت اشغال بیش از X **درصد** نسبت به دوره‌ی مقایسه
 * - `high-cancellation`: نرخ لغو بالای X (نسبت ۰..۱)
 * - `idle-cabins`: اقامتگاه بدون رزرو در X روز آینده
 */
export const ALERT_RULES: readonly AlertRule[] = [
  {
    kind: "occupancy-drop",
    // افت بیش از ۱۵٪ نسبت به دوره‌ی مقایسه
    threshold: 0.15,
    severity: "warning",
    enabled: true,
  },
  {
    kind: "high-cancellation",
    // نرخ لغو بالای ۲۵٪
    threshold: 0.25,
    severity: "critical",
    enabled: true,
  },
  {
    kind: "idle-cabins",
    // اقامتگاه بدون رزرو در ۳۰ روز آینده
    threshold: 30,
    severity: "info",
    enabled: true,
  },
];

/** یافتن قاعده با نوع مشخص. */
export function findAlertRule(kind: AlertKind): AlertRule | undefined {
  return ALERT_RULES.find((rule) => rule.kind === kind);
}

/** برچسب و توضیح هر هشدار — برای UI. */
export const ALERT_META: Record<
  AlertKind,
  { title: string; description: string; actionLabel: string; actionHref: string }
> = {
  "occupancy-drop": {
    title: "افت نرخ اشغال",
    description: "نرخ اشغال نسبت به دوره‌ی مقایسه به‌طور معناداری کاهش یافته است.",
    actionLabel: "مشاهده رزروها",
    actionHref: "/dashboard/bookings",
  },
  "high-cancellation": {
    title: "نرخ لغو بالا",
    description: "نسبت رزروهای لغوشده از آستانه‌ی مجاز عبور کرده است.",
    actionLabel: "بررسی لغوها",
    actionHref: "/dashboard/bookings?status=cancelled",
  },
  "idle-cabins": {
    title: "اقامتگاه‌های بدون رزرو",
    description: "اقامتگاه‌هایی هستند که در افق پیش‌رو هیچ رزروی ندارند.",
    actionLabel: "مشاهده اقامتگاه‌ها",
    actionHref: "/dashboard/cabins",
  },
};

/** افق بررسی «اقامتگاه‌های بدون رزرو» — روز. */
export const IDLE_CABIN_HORIZON_DAYS = 30;

/** حداکثر تعداد هشدار نمایش‌داده‌شده در نوار. */
export const MAX_VISIBLE_ALERTS = 4;
