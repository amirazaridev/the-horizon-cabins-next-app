"use client";

import { useCallback, useMemo, type ComponentType } from "react";
import { Calendar as RangeCalendar } from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CalendarDays, ChevronLeft } from "lucide-react";

/**
 * ⚠️ import جانبی (side-effect) است و هیچ نامی از آن استفاده نمی‌شود.
 *
 * دلیلش: استایل‌های مخصوص همین کامپوننت با `:global()` نوشته شده‌اند (چون
 * کلاس‌های `rmdp-*` متعلق به کتابخانه‌اند و نباید hash شوند)، پس مقدار
 * export‌شده‌ای نداریم؛ ولی همچنان باید این فایل import شود تا CSS آن در
 * باندل بیاید و با خودِ کامپوننت کد-اسپلیت شود.
 */
import "./style.module.css";

/** تایپ آزاد برای حالت range — جنریک‌های پیش‌فرض کتابخانه حالت single هستند */
const RangeCalendarAny = RangeCalendar as unknown as ComponentType<{
  value?: unknown;
  onChange?: (dates: unknown) => void;
  range?: boolean;
  numberOfMonths?: number;
  calendar?: unknown;
  locale?: unknown;
  minDate?: unknown;
  format?: string;
  rangeHover?: boolean;
  shadow?: boolean;
  className?: string;
  mapDays?: (props: { date: DateObject }) => Record<string, unknown>;
}>;

export type DateRange = {
  from: Date | null;
  to: Date | null;
};

type Props = {
  value: DateRange;
  /** با هر انتخاب (نصفِ بازه یا کامل) صدا زده می‌شود */
  onChange: (next: DateRange) => void;
  /** بعد از انتخاب شدنِ تاریخ خروج، با بازه کامل صدا زده می‌شود */
  onComplete?: (range: { from: Date; to: Date }) => void;
  /** تعداد ماه‌های نمایش‌داده‌شده کنار هم (پیش‌فرض ۲) */
  numberOfMonths?: number;
  /** تاریخ‌های قبل از این غیرفعال می‌شوند (پیش‌فرض: امروز) */
  minDate?: Date;
  /**
   * روزهای رزروشده که کاربر نباید بتواند انتخاب کند.
   * مقایسه بر اساس «ابتدای روز» انجام می‌شود، پس ساعت ورودی مهم نیست.
   */
  disabledDates?: Date[];
  /**
   * برچسب اختیاری هر روز (مثل «پرتقاضا» یا قیمت).
   *
   * ⚠️ فعلاً فقط به‌شکل `title` (راهنمای hover) استفاده می‌شود و متن
   * داخل سلول روز را عوض نمی‌کند؛ چون ساختار داخلی سلول‌های
   * `react-multi-date-picker` با استایل `rounded-full` فعلی در تضاد است.
   * اگر بک‌اند نرخ روزانه داد، اینجا با `children` در `mapDays` و
   * CSS `.rmdp-has-label` قابل توسعه است (TODO).
   */
  dayTitle?: (date: Date) => string | null;
  className?: string;
};

/** ابتدای روز — برای مقایسه‌ی تاریخ‌ها بدون ساعت */
function startOfDay(date: Date): number {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy.getTime();
}

function toDateObject(date: Date): DateObject {
  return new DateObject({ date, calendar: persian, locale: persian_fa });
}

function toJsDate(value: unknown): Date | null {
  if (!value || typeof value !== "object" || !("toDate" in value)) return null;
  const date = (value as { toDate: () => Date }).toDate();
  return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
}

/** یک تاریخ را به متن جلالی تبدیل می‌کند؛ null یعنی جای‌خالی */
export function formatJalaliDate(
  date: Date | null,
  pattern = "DD MMMM",
): string | null {
  if (!date) return null;
  return toDateObject(date).format(pattern);
}

/**
 * کارت انتخاب بازه تاریخ — یک تقویم دوقلو (شمسی) برای ورود و خروج.
 *
 * استایل‌هایش در `./style.module.css` کنار همین فایل است؛ فقط
 * `.horizon-date-picker` (پایه‌ی مشترک هر سه تقویم پروژه) در
 * `globals.css` می‌ماند.
 */
export default function RangeDatePicker({
  value,
  onChange,
  onComplete,
  numberOfMonths = 2,
  minDate,
  disabledDates,
  dayTitle,
  className = "",
}: Props) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const min = minDate ?? today;

  const disabledSet = useMemo(
    () => new Set((disabledDates ?? []).map(startOfDay)),
    [disabledDates],
  );

  /**
   * روزهای رزروشده را غیرفعال می‌کند.
   *
   * ⚠️ اگر نه تاریخ غیرفعالی باشد و نه برچسبی، `mapDays` اصلاً پاس داده
   * نمی‌شود؛ چون `react-multi-date-picker` با دیدن `mapDays` کل روزها را
   * از مسیر رندر سفارشی عبور می‌دهد و ما نمی‌خواهیم مصرف‌کننده‌های فعلی
   * (سرچ لندینگ و فیلتر `/cabins`) هیچ تغییری نبینند.
   */
  const hasCustomDays = disabledSet.size > 0 || Boolean(dayTitle);

  const mapDays = useCallback(
    ({ date }: { date: DateObject }) => {
      const jsDate = date.toDate();
      const isBooked = disabledSet.has(startOfDay(jsDate));
      const title = dayTitle?.(jsDate) ?? null;

      if (!isBooked && !title) return {};

      return {
        disabled: isBooked,
        className: isBooked ? "rmdp-booked" : undefined,
        title: title ?? (isBooked ? "این روز قبلاً رزرو شده است" : undefined),
      };
    },
    [disabledSet, dayTitle],
  );

  const selected = useMemo(() => {
    const list: DateObject[] = [];
    if (value.from) list.push(toDateObject(value.from));
    if (value.to) list.push(toDateObject(value.to));
    return list;
  }, [value.from, value.to]);

  const activeStage: "from" | "to" | "done" = !value.from
    ? "from"
    : !value.to
      ? "to"
      : "done";

  function handleChange(dates: unknown): void {
    // حالت range آرایه می‌دهد: [ورود] یا [ورود، خروج]
    const list = (
      Array.isArray(dates) ? dates : dates ? [dates] : []
    ) as unknown[];
    const from = toJsDate(list[0]);
    const to = toJsDate(list[1]);

    onChange({ from, to });

    if (from && to) {
      onComplete?.({ from, to });
    }
  }

  const stages = [
    {
      key: "from" as const,
      label: "تاریخ ورود",
      value: value.from,
      active: activeStage === "from",
    },
    {
      key: "to" as const,
      label: "تاریخ خروج",
      value: value.to,
      active: activeStage === "to",
    },
  ];

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* دو فیلد بالای تقویم: ورود و خروج که هم‌زمان با تقویم به‌روز می‌شوند */}
      <div className="grid grid-cols-2 gap-3">
        {stages.map((stage) => (
          <div
            key={stage.key}
            data-active={stage.active}
            className={`rounded-2xl border px-4 py-3 transition-colors ${
              stage.active
                ? "border-primary-400 bg-primary-400/10"
                : "border-foreground/10 bg-background-2"
            }`}
          >
            <span className="text-text-gray flex items-center gap-1.5 text-xs font-medium">
              <CalendarDays className="size-3.5" />
              {stage.label}
            </span>
            <span
              className={`mt-1 block text-sm font-bold ${
                formatJalaliDate(stage.value)
                  ? "text-text"
                  : "text-text-gray/60"
              }`}
            >
              {formatJalaliDate(stage.value) ?? "انتخاب کنید"}
            </span>
          </div>
        ))}
      </div>

      {/* راهنمای کوتاه مرحله فعلی */}
      <p className="text-text-gray -mb-1 flex items-center gap-1.5 text-xs">
        <ChevronLeft className="text-primary-400 size-3.5" />
        {activeStage === "from"
          ? "روز ورود را از تقویم انتخاب کنید."
          : activeStage === "to"
            ? "حالا روز خروج را انتخاب کنید."
            : "بازه انتخاب شد؛ می‌توانید تغییرش دهید."}
      </p>

      <div className="horizon-range-picker border-border bg-surface overflow-hidden rounded-2xl border p-1">
        <RangeCalendarAny
          value={selected}
          onChange={handleChange}
          range
          numberOfMonths={numberOfMonths}
          calendar={persian}
          locale={persian_fa}
          minDate={min}
          format="YYYY/MM/DD"
          rangeHover
          shadow={false}
          className="horizon-date-picker"
          {...(hasCustomDays ? { mapDays } : {})}
        />
      </div>
    </div>
  );
}
