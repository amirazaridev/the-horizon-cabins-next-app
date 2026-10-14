"use client";

import { Ban } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { cancelPendingBookingAction } from "../actions/booking.actions";

type Props = {
  bookingId: number;
  redirectTo?: string;
  className?: string;
  fullWidth?: boolean;
};

export default function CancelBookingButton({
  bookingId,
  redirectTo,
  className = "",
  fullWidth = false,
}: Props): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  async function handleConfirm() {
    const result = await cancelPendingBookingAction(bookingId);

    if (!result.success) {
      toast.error(result.message);
      throw new Error(result.message);
    }

    toast.success(result.message);
    if (redirectTo) router.push(redirectTo);
  }

  return (
    <>
      <Button
        type="button"
        variant="danger"
        size="md"
        shape="xl"
        fullWidth={fullWidth}
        className={className}
        onClick={() => setIsOpen(true)}
      >
        <Ban className="size-4" />
        لغو رزرو
      </Button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="لغو رزرو"
        description="با لغو این رزرو، جای شما آزاد می‌شود و دیگر امکان پرداخت آن وجود ندارد. این کار قابل بازگشت نیست."
        confirmText="بله، لغو کن"
        cancelText="انصراف"
        variant="danger"
      />
    </>
  );
}
