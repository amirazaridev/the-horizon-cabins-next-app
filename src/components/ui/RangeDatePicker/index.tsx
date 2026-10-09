"use client";

import { useCallback, useMemo, type ComponentType, type ReactNode } from "react";
import { Calendar as RangeCalendar } from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CalendarDays, ChevronLeft } from "lucide-react";

import { formatCompactPrice, formatCurrency } from "@/libs/utils/format";

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
  maxDate?: unknown;
  format?: string;
  rangeHover?: boolean;
  shadow?: boolean;
  className?: string;
  mapDays?: (props: {
    date: DateObject;
    /** شماره‌ی ماهِ ماهِ در حال نمایش — برای تشخیص روزهای همین ماه. */
    currentMonth?: unknown;
  }) => Record<string, unknown>;
}>;

export type DateRange = {
  from: Date | null;
  to: Date | null;
};

/**
 * قیمتی که داخل یک سلول روز نمایش داده می‌شود.
 *
 * ⚠️ عمداً تایپ عمومی است و به دامنه‌ی کابین وابسته نیست، تا `RangeDatePicker`
 * یک کامپوننت `components/ui` بماند. مصرف‌کننده داده‌ی دامنه‌اش را به این شکل
 * نگاشت می‌کند.
 */
export type CalendarDayPrice = {
  /** نرخ پایه — وقتی `discounted` است، خط‌خورده نمایش داده می‌شود. */
  basePrice: number;
  /** نرخ نهایی قابل پرداخت آن شب. */
  finalPrice: number;
  /** آیا تخفیف دارد (نرخ نهایی کمتر از نرخ پایه است). */
  discounted: boolean;
};

/**
 * وضعیت اشغال یک روز — به دو نیمه تقسیم می‌شود.
 *
 * ⚠️ مدل نیمه‌روزی: ورود از ساعت ۱۴ و خروج تا ساعت ۱۲ است. پس روزِ **ورود**
 * یک رزرو فقط نیمه‌ی بعدازظهرش اشغال است و روزِ **خروج** فقط نیمه‌ی صبحش؛
 * بقیه‌ی روز آزاد است و می‌تواند سرِ یک رزرو جدید باشد.
 */
export type DayOccupancy = "none" | "morning" | "afternoon" | "full";

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
  /** تاریخ‌های بعد از این غیرفعال می‌شوند (سقف افق رزرو). */
  maxDate?: Date;
  /**
   * روزهای رزروشده که کاربر نباید بتواند انتخاب کند.
   * مقایسه بر اساس «ابتدای روز» انجام می‌شود، پس ساعت ورودی مهم نیست.
   */
  disabledDates?: Date[];
  /**
   * برچسب اختیاری هر روز (مثل «پرتقاضا»).
   *
   * ⚠️ فقط به‌شکل `title` (راهنمای hover) استفاده می‌شود و متن داخل سلول را
   * عوض نمی‌کند.
   */
  dayTitle?: (date: Date) => string | null;
  /**
   * نرخ شب هر روز — وقتی بدهید، زیر شماره‌ی روز داخل همان سلول نمایش داده
   * می‌شود و روزهای دارای تخفیف، نرخ پایه‌ی خط‌خورده + نرخ نهایی می‌گیرند.
   *
   * ⚠️ با دادن این پراپ، ریشه‌ی تقویم کلاس `horizon-range-picker--priced`
   * می‌گیرد و سلول‌ها بلندتر و گوشه‌هایشان کم‌گرد می‌شود (چون سه خط محتوا
   * داخلشان می‌نشیند). تقویم‌های بدون قیمت هیچ تغییری نمی‌بینند.
   */
  dayPrice?: (date: Date) => CalendarDayPrice | null;
  /**
   * وضعیت اشغال هر روز — برای نشان دادن **هاشور کامل** (روز کاملاً اشغال) یا
   * **هاشور نصفه** (روزِ ورود/خروجِ یک رزرو که نیمه‌اش آزاد است).
   *
   * ⚠️ فقط روزهای `full` غیرفعال می‌شوند؛ روزهای نیمه‌آزاد (`morning` /
   * `afternoon`) قابل کلیک می‌مانند تا بتوانند یک سرِ بازه‌ی جدید باشند.
   */
  dayOccupancy?: (date: Date) => DayOccupancy;
  className?: string;
};

/** ابتدای روز به‌شکل `Date` (بدون ساعت) — برای نرمال‌سازی مقادیر بازه */
function atStartOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** ابتدای روز — برای مقایسه‌ی تاریخ‌ها بدون ساعت */
function startOfDay(date: Date): number {
  return atStartOfDay(date).getTime();
}

/**
 * نرمال‌سازی بازه‌ی انتخاب‌شده تا همیشه قرارداد «ورود < خروج» برقرار باشد.
 *
 * - ساعت هر دو تاریخ به ابتدای روز برده می‌شود (مقایسه‌ها مستقل از ساعت شوند)؛
 * - اگر ترتیب معکوس باشد (خروج قبل از ورود)، دو تاریخ جابه‌جا می‌شوند؛
 * - اگر ورود و خروج روی یک روز بیفتند، بازه معتبر نیست و خروج `null`
 *   می‌ماند تا کاربر روزِ خروج را دوباره و درست انتخاب کند.
 *
 * این گارد در تنها نقطه‌ای اعمال می‌شود که بازه تولید می‌شود، پس همه‌ی
 * مصرف‌کننده‌ها (سرچ لندینگ، فیلتر `/cabins` و تقویم جزئیات اقامتگاه)
 * همیشه بازه‌ی مرتب و معتبر می‌گیرند.
 */
function normalizeRange(
  from: Date | null,
  to: Date | null,
): [Date | null, Date | null] {
  const start = from ? atStartOfDay(from) : null;
  const end = to ? atStartOfDay(to) : null;

  if (start && end) {
    if (end.getTime() < start.getTime()) return [end, start];
    if (end.getTime() === start.getTime()) return [start, null];
  }

  return [start, end];
}

function toDateObject(date: Date): DateObject {
  return new DateObject({ date, calendar: persian, locale: persian_fa });
}

function toJsDate(value: unknown): Date | null {
  if (!value || typeof value !== "object" || !("toDate" in value)) return null;
  const date = (value as { toDate: () => Date }).toDate();
  return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
}

/**
 * محتوای سلول قیمت‌دار: شماره‌ی روز + نرخ شب (و نرخ پایه‌ی خط‌خورده اگر
 * تخفیف داشته باشد).
 *
 * ⚠️ عمداً از `<b>` و `<s>` استفاده می‌کنیم، نه `<span>`: کتابخانه قاعده‌ی
 * `.rmdp-day span { position:absolute; inset:3px }` را تزریق می‌کند و هر span
 * تودرتویی را روی هم می‌اندازد. این عناصر تحت تأثیر آن سلکتور نیستند و
 * به‌شکل flex-item داخل span بیرونی (که `display:flex; flex-direction:column`
 * دارد) زیر هم می‌نشینند.
 */
function pricedDayContent(dayNumber: number, price: CalendarDayPrice): ReactNode {
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
  maxDate,
  disabledDates,
  dayTitle,
  dayPrice,
  dayOccupancy,
  className = "",
}: Props) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const min = minDate ?? today;
  const isPriced = Boolean(dayPrice);

  /** کلاس‌های ریشه — `--priced` فقط وقتی نرخ شب می‌دهیم اضافه می‌شود. */
  const rootClassName = [
    "horizon-range-picker",
    isPriced && "horizon-range-picker--priced",
    "border-border bg-surface overflow-hidden rounded-2xl border p-1",
  ]
    .filter(Boolean)
    .join(" ");

  const disabledSet = useMemo(
    () => new Set((disabledDates ?? []).map(startOfDay)),
    [disabledDates],
  );

  /**
   * روزهای رزروشده را غیرفعال و نرخ شب را داخل سلول رندر می‌کند.
   *
   * ⚠️ اگر نه تاریخ غیرفعالی باشد و نه قیمتی، `mapDays` اصلاً پاس داده
   * نمی‌شود؛ چون `react-multi-date-picker` با دیدن `mapDays` کل روزها را
   * از مسیر رندر سفارشی عبور می‌دهد و ما نمی‌خواهیم مصرف‌کننده‌های فعلی
   * (سرچ لندینگ و فیلتر `/cabins`) هیچ تغییری نبینند.
   *
   * ⚠️ نکته‌ی کتابخانه: `className` که از `mapDays` برگردد روی روزهای
   * **غیرفعال** اعمال نمی‌شود (کتابخانه آن را فقط وقتی روز disabled نباشد
   * به span می‌چسباند). پس برای نشانه‌گذاری روز رزروشده از یک data-attribute
   * استفاده می‌کنیم که همیشه روی span می‌نشیند. در عوض `children` همیشه
   * رندر می‌شود، پس محتوای سلول قابل‌کنترل است.
   */
  const hasCustomDays =
    disabledSet.size > 0 ||
    Boolean(dayTitle) ||
    Boolean(dayPrice) ||
    Boolean(dayOccupancy);

  const mapDays = useCallback(
    ({ date }: { date: DateObject }): Record<string, unknown> => {
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

      //* روزِ ورودِ یک رزرو (نیمه‌ی بعدازظهر اشغال) — هاشور نیمه‌ی چپ.
      //* نیمه‌ی صبحش آزاد است، پس می‌تواند «تاریخ خروج» رزرو جدید باشد.
      if (occupancy === "afternoon") {
        props["data-occupied"] = "afternoon";
        props.title = "نیمه‌ی صبح آزاد است — می‌تواند تاریخ خروج شما باشد";
        return props;
      }

      //* روزِ خروجِ یک رزرو (نیمه‌ی صبح اشغال) — هاشور نیمه‌ی راست.
      //* نیمه‌ی بعدازظهرش آزاد است، پس می‌تواند «تاریخ ورود» رزرو جدید باشد.
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
        // ⚠️ عمداً از `<b>` و `<s>` استفاده می‌کنیم، نه `<span>`: کتابخانه
        // قاعده‌ی `.rmdp-day span { position:absolute; inset:3px }` را تزریق
        // می‌کند و هر span تودرتویی را روی هم می‌اندازد. این عناصر تحت تأثیر
        // آن سلکتور نیستند و به‌شکل flex-item داخل span بیرونی (که
        // `display:flex; flex-direction:column` دارد) زیر هم می‌نشینند.
        props.children = pricedDayContent(date.day, price);
        // داخل سلول قیمت خلاصه است؛ عدد کامل به‌عنوان راهنما می‌آید.
        props.title = `${formatCurrency(price.finalPrice)} تومان`;
        return props;
      }

      if (title) props.title = title;

      return props;
    },
    [disabledSet, dayTitle, dayPrice, dayOccupancy],
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
    // ⭐ گارد ترتیب: همیشه `from < to` (و هر دو در ابتدای روز).
    const [from, to] = normalizeRange(toJsDate(list[0]), toJsDate(list[1]));

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

      <div className={rootClassName}>
        <RangeCalendarAny
          value={selected}
          onChange={handleChange}
          range
          numberOfMonths={numberOfMonths}
          calendar={persian}
          locale={persian_fa}
          minDate={min}
          {...(maxDate ? { maxDate } : {})}
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
