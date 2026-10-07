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
  /**
   * اگر بدهید، بعد از لغو موفق به این مسیر منتقل می‌شوید.
   * (صفحه‌ی پرداخت بعد از لغو دیگر معنایی ندارد.)
   */
  redirectTo?: string;
  className?: string;
  fullWidth?: boolean;
};

/**
 * دکمه‌ی «لغو رزرو» برای رزروهای «در انتظار پرداخت».
 *
 * ⚠️ چون لغو یک کنش **مخرب و بازگشت‌ناپذیر** است، همیشه از یک مودال
 * تأیید می‌گذرد؛ و دکمه با واریانت `danger` از کنش اصلی («پرداخت») به‌وضوح
 * جدا می‌شود تا کاربر اشتباهی آن را نزند.
 */
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
      // ConfirmModal خطا را می‌گیرد و مودال را باز نگه می‌دارد تا کاربر
      // بتواند دوباره تلاش کند.
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
