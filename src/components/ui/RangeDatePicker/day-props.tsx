import type DateObject from "react-date-object";

import { formatCompactPrice, formatCurrency } from "@/libs/utils/format";
import { startOfDay } from "./dates";
import type { CalendarDayPrice, DayOccupancy } from "./types";

export type DayPropsOptions = {
  /** روزهای رزروشده (timestamp ابتدای روز) — غیرفعال می‌شوند. */
  disabledSet: Set<number>;
  dayTitle?: (date: Date) => string | null;
  dayPrice?: (date: Date) => CalendarDayPrice | null;
  dayOccupancy?: (date: Date) => DayOccupancy;
};

function pricedDayContent(dayNumber: number, price: CalendarDayPrice) {
  return (
    <>
      <b className="hz-day-num">{dayNumber.toLocaleString("fa-IR")}</b>
      {price.discounted && (
        <s className="hz-day-base">{formatCompactPrice(price.basePrice)}</s>
      )}
      <b className="hz-day-final">{formatCompactPrice(price.finalPrice)}</b>
    </>
  );
}

export function buildDayProps(
  date: DateObject,
  { disabledSet, dayTitle, dayPrice, dayOccupancy }: DayPropsOptions,
): Record<string, unknown> {
  const jsDate = date.toDate();
  const occupancy = dayOccupancy?.(jsDate) ?? null;
  const isBooked = disabledSet.has(startOfDay(jsDate));
  const price = dayPrice?.(jsDate) ?? null;
  const title = dayTitle?.(jsDate) ?? null;

  const props: Record<string, unknown> = {};

  //* کاملاً اشغال — هاشور کامل و غیرفعال.
  if (occupancy === "full") {
    props.disabled = true;
    props["data-occupied"] = "full";
    props.title = "این روز کاملاً رزرو شده است";
    return props;
  }

  if (occupancy === "afternoon") {
    props["data-occupied"] = "afternoon";
    props.title = "نیمه‌ی صبح آزاد است — می‌تواند تاریخ خروج شما باشد";
    return props;
  }

  if (occupancy === "morning") {
    props["data-occupied"] = "morning";
    props.title = "نیمه‌ی بعدازظهر آزاد است — می‌تواند تاریخ ورود شما باشد";
    return props;
  }

  if (isBooked) {
    props.disabled = true;
    props.title = "این روز قبلاً رزرو شده است";
    props["data-booked"] = "";
    return props;
  }

  if (price) {
    props.children = pricedDayContent(date.day, price);
    // داخل سلول قیمت خلاصه است؛ عدد کامل به‌عنوان راهنما می‌آید.
    props.title = `${formatCurrency(price.finalPrice)} تومان`;
    return props;
  }

  if (title) props.title = title;

  return props;
}
