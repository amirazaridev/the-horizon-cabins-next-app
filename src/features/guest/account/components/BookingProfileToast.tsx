"use client";

import { useEffect, type ReactNode } from "react";
import toast from "react-hot-toast";

type Props = {
  /** متن آماده‌ی هشدار (شامل فهرست فیلدهای ناقص). */
  message: string;
};

export default function BookingProfileToast({ message }: Props): ReactNode {
  useEffect(() => {
    toast.error(message, { duration: 7000, id: "booking-profile-required" });
  }, [message]);

  return null;
}
