"use client";

import { useState, type ReactNode } from "react";
import { CalendarDays, CheckCircle2, TriangleAlert, X } from "lucide-react";

import CardDashContainer from "@/components/ui/CardDashContainer";
import Table, { type TableColumn } from "@/components/ui/Table";
import { formatCurrency } from "@/libs/utils/format";
import { formatJalaliFull } from "@/libs/utils/jalali";
import type { GuestBooking } from "@/features/guest/bookings/types/guest-booking.types";
import BookingDetailsModal from "./BookingDetailsModal";
import BookingRowMenu, { type BookingActionFeedback } from "./BookingRowMenu";
import BookingStatusBadge from "./BookingStatusBadge";

interface BookingsTableProps {
  bookings: GuestBooking[];
}

/** جدول رزروها — ستون آخر منوی عملیات است. */
export default function BookingsTable({ bookings }: BookingsTableProps): ReactNode {
  const [detailsBooking, setDetailsBooking] = useState<GuestBooking | null>(null);
  const [feedback, setFeedback] = useState<BookingActionFeedback | null>(null);

  const columns: TableColumn<GuestBooking>[] = [
    {
      key: "guest",
      header: "مهمان",
      className: "font-semibold",
      render: (booking) => booking.guest?.fullName ?? "—",
    },
    {
      key: "cabin",
      header: "اقامتگاه",
      hideOnMobile: true,
      render: (booking) => booking.cabin?.name ?? "—",
    },
    {
      key: "stay",
      header: "بازه‌ی اقامت",
      hideOnMobile: true,
      render: (booking) => (
        <span className="flex flex-col gap-0.5 text-xs">
          <span className="text-text">{formatJalaliFull(booking.startDate)}</span>
          <span className="text-text-gray">تا {formatJalaliFull(booking.endDate)}</span>
        </span>
      ),
    },
    {
      key: "nights",
      header: "شب",
      align: "center",
      hideOnMobile: true,
      render: (booking) => (
        <span className="tabular-nums">{booking.numNights.toLocaleString("fa-IR")}</span>
      ),
    },
    {
      key: "total",
      header: "مبلغ کل",
      align: "end",
      render: (booking) => (
        <span className="font-semibold tabular-nums">
          {formatCurrency(booking.totalPrice)}
        </span>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      align: "center",
      render: (booking) => <BookingStatusBadge status={booking.status} />,
    },
    {
      key: "createdAt",
      header: "تاریخ ثبت",
      align: "end",
      hideOnMobile: true,
      render: (booking) => (
        <span className="text-text-gray text-xs tabular-nums">
          {formatJalaliFull(booking.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: <span className="sr-only">عملیات</span>,
      align: "end",
      className: "w-14",
      render: (booking) => (
        <BookingRowMenu
          booking={booking}
          onShowDetails={setDetailsBooking}
          onFeedback={setFeedback}
        />
      ),
    },
  ];

  return (
    <CardDashContainer className="flex w-full flex-col gap-4 p-5">
      {feedback && (
        <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />
      )}

      <Table
        columns={columns}
        rows={bookings}
        rowKey={(booking) => booking.id}
        caption="فهرست رزروها"
        emptyState={<EmptyState />}
      />

      <BookingDetailsModal
        booking={detailsBooking}
        isOpen={detailsBooking !== null}
        onClose={() => setDetailsBooking(null)}
      />
    </CardDashContainer>
  );
}

/* ==========================================================================
   کمکی‌ها
   ========================================================================== */

function FeedbackBanner({
  feedback,
  onDismiss,
}: {
  feedback: BookingActionFeedback;
  onDismiss: () => void;
}): ReactNode {
  const isSuccess = feedback.success;

  return (
    <div
      role="status"
      className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm ${
        isSuccess
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-danger/40 bg-danger/10 text-danger"
      }`}
    >
      <span className="flex items-center gap-2">
        {isSuccess ? (
          <CheckCircle2 className="size-4 shrink-0" />
        ) : (
          <TriangleAlert className="size-4 shrink-0" />
        )}
        {feedback.message}
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="بستن پیام"
        className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function EmptyState(): ReactNode {
  return (
    <div className="text-text-gray flex flex-col items-center justify-center gap-3 py-12 text-center">
      <CalendarDays className="size-9" strokeWidth={1.5} />
      <span className="text-sm">رزروی با این فیلترها پیدا نشد.</span>
    </div>
  );
}
