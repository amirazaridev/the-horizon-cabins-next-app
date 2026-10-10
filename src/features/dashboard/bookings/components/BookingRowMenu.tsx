"use client";

import { useState, useTransition, type ReactNode } from "react";
import { Ban, ClipboardList, DoorOpen, LogIn, MoreVertical } from "lucide-react";

import Menus from "@/components/ui/Menus";
import ConfirmModal from "@/components/ui/ConfirmModal";
import type { GuestBooking } from "@/features/guest/bookings/types/guest-booking.types";
import {
  cancelBookingAction,
  checkInBookingAction,
  checkOutBookingAction,
} from "../actions/booking.actions";

export type BookingActionFeedback = { success: boolean; message: string };

interface BookingRowMenuProps {
  booking: GuestBooking;
  onShowDetails: (booking: GuestBooking) => void;
  onFeedback: (feedback: BookingActionFeedback) => void;
}

/**
 * منوی ردیف رزرو — «جزییات رزرو»، «تحویل یا تخلیه»، «کنسل کردن رزرو».
 *
 * گذارهای مجاز از قواعد بک‌اند پیروی می‌کنند:
 * - `confirmed → checkedIn` (تحویل)
 * - `checkedIn → checkedOut` (تخلیه)
 * - `pending | confirmed → cancelled` (کنسل)
 *
 * آیتم‌های غیرمجاز برای وضعیت فعلی **غیرفعال** می‌شوند (نه پنهان) تا کاربر
 * بفهمد عملیات وجود دارد ولی در این وضعیت مجاز نیست.
 */
export default function BookingRowMenu({
  booking,
  onShowDetails,
  onFeedback,
}: BookingRowMenuProps): ReactNode {
  const [isPending, startTransition] = useTransition();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const menuId = `booking-menu-${booking.id}`;

  const transition =
    booking.status === "confirmed"
      ? "checkIn"
      : booking.status === "checkedIn"
        ? "checkOut"
        : null;

  const canCancel = booking.status === "pending" || booking.status === "confirmed";

  const runTransition = () => {
    if (!transition) return;
    startTransition(async () => {
      const result =
        transition === "checkIn"
          ? await checkInBookingAction(booking.id)
          : await checkOutBookingAction(booking.id);
      onFeedback(result);
    });
  };

  const confirmCancel = async () => {
    const result = await cancelBookingAction(booking.id);
    onFeedback(result);
  };

  const transitionLabel =
    transition === "checkIn"
      ? "تحویل اتاق"
      : transition === "checkOut"
        ? "تخلیه اتاق"
        : "تحویل یا تخلیه";

  return (
    <>
      <Menus>
        <Menus.Toggle id={menuId} icon={<MoreVertical className="size-5" />} />
        <Menus.List id={menuId}>
          <Menus.Button
            icon={<ClipboardList />}
            onClick={() => onShowDetails(booking)}
          >
            جزییات رزرو
          </Menus.Button>

          <Menus.Button
            icon={transition === "checkOut" ? <DoorOpen /> : <LogIn />}
            disabled={!transition || isPending}
            onClick={runTransition}
          >
            {transitionLabel}
          </Menus.Button>

          <Menus.Divider />

          <Menus.Button
            icon={<Ban />}
            danger
            disabled={!canCancel || isPending}
            onClick={() => setIsCancelOpen(true)}
          >
            کنسل کردن رزرو
          </Menus.Button>
        </Menus.List>
      </Menus>

      <ConfirmModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={confirmCancel}
        title="لغو رزرو"
        description={`آیا از لغو رزرو «${booking.guest?.fullName ?? "این مهمان"}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.`}
        confirmText="بله، لغو کن"
        variant="danger"
      />
    </>
  );
}
