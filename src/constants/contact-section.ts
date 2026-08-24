import type { LucideIcon } from "lucide-react";
import { CalendarRange, KeyRound, TreePine } from "lucide-react";

export type BookingStep = {
  title: string;
  desc: string;
  icon: LucideIcon;
};

export const BOOKING_STEPS: BookingStep[] = [
  {
    icon: TreePine,
    title: "کابین خود را انتخاب کنید",
    desc: "بین کابین‌های چوبی، یخچالی و جنگلی یکی را برگزینید",
  },
  {
    icon: CalendarRange,
    title: "تاریخ ورود و خروج را مشخص کنید",
    desc: "تقویم موجودی هر کابین را زنده می‌بینید",
  },
  {
    icon: KeyRound,
    title: "رزرو را نهایی کنید",
    desc: "تأیید آنی دریافت می‌کنید؛ ما منتظرتان هستیم",
  },
];

export type WorkingHour = { name: string; time: string };

export const WORKING_HOURS: WorkingHour[] = [
  { name: "پذیرش", time: "۲۴ ساعته" },
  { name: "اسپا", time: "۹ صبح تا ۱۰ شب" },
  { name: "رستوران", time: "۷ صبح تا ۱۱ شب" },
];
