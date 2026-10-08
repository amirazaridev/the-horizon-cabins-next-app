import {
  Ban,
  CalendarCheck,
  CircleCheckBig,
  DoorOpen,
  Hourglass,
  type LucideIcon,
} from "lucide-react";

import type {
  CancellationReason,
  GuestBookingStatus,
  GuestBookingsTabId,
} from "../types/guest-booking.types";

export type BookingStatusMeta = {
  /** برچسب فارسی وضعیت. */
  label: string;
  icon: LucideIcon;
  /**
   * کلاس کامل چیپ وضعیت.
   *
   * ⚠️ **رشته‌ی کامل و صریح** — Tailwind کلاس‌هایی که با `replace`/الحاق
   * ساخته شوند را در JIT تولید نمی‌کند، پس هر ترکیب رنگ باید اینجا
   * حرف‌به‌حرف نوشته شود.
   */
  badgeClass: string;
  /** رنگ نوار/نقطه‌ی نشانگر وضعیت. */
  dotClass: string;
};

export const BOOKING_STATUS_META: Record<
  GuestBookingStatus,
  BookingStatusMeta
> = {
  pending: {
    label: "در انتظار پرداخت",
    icon: Hourglass,
    badgeClass:
      "border-primary-400/40 bg-primary-400/15 text-primary-600 dark:text-primary-300",
    dotClass: "bg-primary-400",
  },
  confirmed: {
    label: "تأییدشده",
    icon: CalendarCheck,
    badgeClass:
      "border-emerald-400/40 bg-emerald-400/15 text-emerald-700 dark:text-emerald-300",
    dotClass: "bg-emerald-400",
  },
  checkedIn: {
    label: "در حال اقامت",
    icon: DoorOpen,
    badgeClass:
      "border-sky-400/40 bg-sky-400/15 text-sky-700 dark:text-sky-300",
    dotClass: "bg-sky-400",
  },
  checkedOut: {
    label: "تکمیل‌شده",
    icon: CircleCheckBig,
    badgeClass: "border-border-strong bg-foreground/5 text-text-gray",
    dotClass: "bg-text-gray",
  },
  cancelled: {
    label: "لغوشده",
    icon: Ban,
    badgeClass: "border-danger/40 bg-danger/10 text-danger-strong dark:text-red-300",
    dotClass: "bg-danger",
  },
};

/** تب‌های وضعیت — هر تب یک گروه از وضعیت‌ها را نشان می‌دهد. */
export const BOOKING_TABS: readonly {
  id: GuestBookingsTabId;
  label: string;
  statuses: readonly GuestBookingStatus[];
}[] = [
  {
    id: "all",
    label: "همه",
    statuses: ["pending", "confirmed", "checkedIn", "checkedOut", "cancelled"],
  },
  { id: "pending", label: "در انتظار پرداخت", statuses: ["pending"] },
  { id: "active", label: "جاری", statuses: ["confirmed", "checkedIn"] },
  { id: "completed", label: "تکمیل‌شده", statuses: ["checkedOut"] },
  { id: "cancelled", label: "لغوشده", statuses: ["cancelled"] },
];

const BOOKING_TAB_IDS = BOOKING_TABS.map((tab) => tab.id);

/**
 * مقدار `status` را از URL می‌خواند و اعتبارسنجی می‌کند.
 * هر مقدار ناشناخته/غایب ⇒ «همه».
 */
export function parseBookingTab(value: unknown): GuestBookingsTabId {
  const raw = Array.isArray(value) ? value[0] : value;
  return BOOKING_TAB_IDS.includes(raw as GuestBookingsTabId)
    ? (raw as GuestBookingsTabId)
    : "all";
}

/** وضعیت‌های موجود در یک تب. */
export function statusesForTab(
  tab: GuestBookingsTabId,
): readonly GuestBookingStatus[] {
  return BOOKING_TABS.find((item) => item.id === tab)?.statuses ?? [];
}

/** برچسب فارسی دلیل لغو. */
export const CANCELLATION_REASON_LABELS: Record<CancellationReason, string> = {
  paymentExpired: "مهلت پرداخت به پایان رسید",
  userCancelled: "لغو توسط شما",
  adminCancelled: "لغو توسط پشتیبانی",
};
