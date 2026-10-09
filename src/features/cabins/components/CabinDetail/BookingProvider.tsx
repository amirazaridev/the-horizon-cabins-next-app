"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";

import type { DateRange, DayOccupancy } from "@/components/ui/RangeDatePicker";
import type { Cabin } from "@/features/cabins/types/cabin.types";
import type { PublicSettings } from "@/features/settings/types/public-settings.types";
import { smoothScrollToId } from "@/libs/utils/scroll";
import { SECTION_IDS } from "../../constants/cabin-detail";
import { useBookingDraftStore } from "../../store/booking-draft.store";
import type {
  CabinCalendarDay,
  BookedRange,
} from "../../types/cabin-booking.types";
import { parseDateParam } from "../../utils/cabin-date";
import {
  buildOccupancyMaps,
  buildPriceMap,
  cheapestNight,
  countNights,
  EMPTY_DATE_RANGE,
  expandBookedRanges,
  isCompleteRange,
  isRangeAvailable,
  occupancyOf,
  priceStay,
  toDateKey,
  type StayPrice,
} from "../../utils/booking";

export type BookingContextValue = {
  cabin: Cabin;
  settings: PublicSettings;
  /** بازه‌ی انتخاب‌شده — ممکن است ناقص باشد (فقط ورود) */
  range: DateRange;
  /** تعداد شب؛ صفر یعنی بازه کامل نیست */
  nights: number;
  /** بازه کامل است (ورود + خروج) */
  isComplete: boolean;
  /** همه‌ی شب‌های بازه آزادند (هیچ شبی رزرو‌شده نیست) */
  isAvailable: boolean;
  guests: number;
  maxCapacity: number;
  /** مبلغ اقامت — از قیمت **واقعی** شب‌های تقویم بک‌اند */
  price: StayPrice;
  /** کمترین نرخ شب پنجره — کارت نرخِ حالت «بازه ناقص» («شروع از ...») */
  startingNight: CabinCalendarDay | null;
  /** قیمت یک روز مشخص — برای رندر داخل سلول‌های تقویم */
  priceForDate: (date: Date) => CabinCalendarDay | null;
  /** روزهای اشغال‌شده — به تقویم داده می‌شود تا غیرفعال شوند */
  dayOccupancy: (date: Date) => DayOccupancy;
  /** اولین روز قابل‌انتخاب (امروز به وقت مقصد) */
  minDate: Date;
  /** آخرین روز قابل‌انتخاب (سقف افق رزرو) */
  maxDate: Date;
  setRange: (range: DateRange) => void;
  setGuests: (guests: number) => void;
  clearRange: () => void;
  /** اسکرول نرم به سکشن «نرخ و رزرو» */
  scrollToRateSection: () => void;
  isSheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  isSummaryOpen: boolean;
  closeSummary: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

/** دسترسی به state مشترک رزرو — فقط داخل `<BookingProvider>` */
export function useBooking(): BookingContextValue {
  const value = useContext(BookingContext);
  if (!value) {
    throw new Error("useBooking باید داخل <BookingProvider> استفاده شود.");
  }
  return value;
}

type Props = {
  cabin: Cabin;
  /** تنظیمات عمومی مؤثر (افق رزرو، سقف نفرات، ...). */
  settings: PublicSettings;
  /** قیمت شب‌های پنجره‌ی تقویم (از بک‌اند). */
  calendarDays: CabinCalendarDay[];
  /** بازه‌های رزرو‌شده‌ی کابین (نیمه‌باز). */
  bookedRanges: BookedRange[];
  children: ReactNode;
};

/** امروز در نیمه‌شب محلی. */
function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** n روز جلوتر، همیشه در نیمه‌شب محلی (DST-safe). */
function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/**
 * نگه‌دارنده‌ی state رزرو صفحه‌ی جزئیات.
 *
 * چرا Context و نه state محلی؟ چون یک بازه‌ی تاریخ روی چهار جای مختلف
 * اثر دارد: تقویم داخل صفحه، aside چسبان دسکتاپ، نوار ثابت موبایل و
 * باتم‌شیت/مودال خلاصه. اگر state در هر کدام جدا نگه داشته شود، باید
 * بین‌شان prop-drill و همگام‌سازی دستی انجام شود.
 *
 * ⚠️ داده‌ی رزرو (تنظیمات، قیمت شب‌ها و روزهای رزرو‌شده) در **سرور** واکشی
 * می‌شود و به‌عنوان prop به این Provider می‌رسد؛ پس هیچ درخواستی از سمت
 * کلاینت زده نمی‌شود و تقویم در همان رندر اول پر است.
 *
 * ⚠️ این Provider فقط state **درون‌صفحه‌ای** (باز/بسته بودن لایه‌ها) را نگه
 * می‌دارد. خودِ **بازه‌ی تاریخ و تعداد نفرات** در استور `booking-draft`
 * (zustand + `sessionStorage`) زندگی می‌کنند، چون باید از یک ناوبری کامل
 * (ورود / تکمیل پروفایل) جان سالم به در ببرند و Context با unmount از بین
 * می‌رود.
 */
export default function BookingProvider({
  cabin,
  settings,
  calendarDays,
  bookedRanges,
  children,
}: Props): ReactNode {
  //* سقف نفرات = همان قاعده‌ی سرور: کمینه‌ی ظرفیت کابین و سقف عمومی تنظیمات.
  const maxCapacity = Math.max(
    1,
    Math.min(cabin.maxCapacity, settings.maxGuests),
  );

  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isSummaryOpen, setSummaryOpen] = useState(false);

  /**
   * پیش‌نویس رزرو — **منبع حقیقتِ** تاریخ‌ها و تعداد نفرات.
   *
   * ⚠️ چرا بازه در state محلی نیست؟ چون این مقدار باید از یک ناوبری کامل
   * (رفتن به `/login` یا `/account/settings` و برگشتن) جان سالم به در ببرد؛
   * state محلی و Context با unmount شدن صفحه از بین می‌روند. استور zustand
   * روی `sessionStorage` می‌نشیند و همان مقدار را برمی‌گرداند.
   *
   * ⚠️ چرا برای «بازگرداندن» پیش‌نویس `useEffect` نداریم؟ استور خودش یک
   * external store است و zustand آن را با `useSyncExternalStore` می‌خواند؛
   * React هنگام هیدریشن از snapshot سرور (تهی) استفاده می‌کند و بلافاصله بعد
   * از آن مقدار واقعی می‌نشیند. نتیجه: نه hydration mismatch داریم و نه
   * `setState` داخل effect (که رندر آبشاری می‌سازد و لینتر هم آن را رد
   * می‌کند).
   */
  const draft = useBookingDraftStore((state) => state.draft);
  const saveDraft = useBookingDraftStore((state) => state.saveDraft);

  /** پیش‌نویس فقط وقتی معتبر است که مربوط به **همین** کابین باشد. */
  const cabinDraft = draft && draft.cabinId === cabin.id ? draft : null;

  /**
   * بازه‌ی انتخاب‌شده — از پیش‌نویس خوانده می‌شود.
   *
   * ⚠️ وابستگی `useMemo` عمداً خودِ `cabinDraft` است (نه فیلدهایش): React
   * Compiler به فیلدهای تودرتو ایراد می‌گیرد و چون `cabinDraft` یا همان
   * آبجکت پایدارِ استور است یا `null`، این وابستگی درست و ارزان است.
   */
  const range = useMemo<DateRange>(
    () => ({
      from: cabinDraft?.checkIn ? parseDateParam(cabinDraft.checkIn) : null,
      to: cabinDraft?.checkOut ? parseDateParam(cabinDraft.checkOut) : null,
    }),
    [cabinDraft],
  );

  const guests = cabinDraft?.guests
    ? Math.min(maxCapacity, Math.max(1, cabinDraft.guests))
    : Math.min(2, maxCapacity);

  /**
   * نوشتن پیش‌نویس — تنها مسیر تغییر بازه و نفرات.
   *
   * ⚠️ تاریخ‌ها عمداً به‌شکل **میلادی** `YYYY-MM-DD` ذخیره می‌شوند: هم
   * JSON-safe است، هم همان قالبی است که API می‌پذیرد، و هم با
   * `parseDateParam` دوباره به `Date` محلی برمی‌گردد.
   */
  const persist = useCallback(
    (next: DateRange, nextGuests: number) => {
      saveDraft({
        cabinId: cabin.id,
        checkIn: next.from ? toDateKey(next.from) : null,
        checkOut: next.to ? toDateKey(next.to) : null,
        guests: nextGuests,
      });
    },
    [cabin.id, saveDraft],
  );

  //* نقشه‌ی قیمت و مجموعه‌ی روزهای اشغال‌شده — یک‌بار از propها ساخته می‌شوند.
  const priceMap = useMemo(() => buildPriceMap(calendarDays), [calendarDays]);
  const bookedSet = useMemo(
    () => new Set(expandBookedRanges(bookedRanges)),
    [bookedRanges],
  );

  //* پنجره‌ی مجاز انتخاب: از «امروزِ مقصد» (اولین روز تقویم) تا سقف افق رزرو.
  //* ⚠️ از داده‌ی تقویم استفاده می‌کنیم نه ساعت مرورگر، تا با افق بک‌اند
  //* (که به وقت تهران حساب می‌شود) یکی بماند.
  const minDate = useMemo(() => {
    const first = calendarDays[0]?.date;
    return (first ? parseDateParam(first) : null) ?? startOfToday();
  }, [calendarDays]);

  const maxDate = useMemo(
    () => addDays(minDate, settings.maxAdvanceBookingDays),
    [minDate, settings.maxAdvanceBookingDays],
  );

  /**
   * وضعیت اشغال نیمه‌های هر روز (ورود ۱۴:۰۰ / خروج ۱۲:۰۰).
   *
   * ⚠️ `bookedSet` (شب‌های اشغال) برای اعتبارسنجی «آیا بازه آزاد است» می‌ماند،
   * ولی برای **نمایش** از نقشه‌ی نیمه‌روزی استفاده می‌کنیم تا روزِ ورود/خروجِ
   * یک رزرو هاشور نصفه بگیرد و همچنان قابل انتخاب بماند.
   */
  const occupancyMaps = useMemo(
    () => buildOccupancyMaps(bookedRanges),
    [bookedRanges],
  );

  const dayOccupancy = useCallback(
    (date: Date): DayOccupancy => occupancyOf(occupancyMaps, date),
    [occupancyMaps],
  );

  /**
   * امضای آخرین بازه‌ی کاملی که مودال خلاصه برایش باز شده.
   * بدون این، هر رندر مجدد یا هر تغییر ناکامل بعدی دوباره مودال را
   * باز می‌کرد.
   */
  const completedRangeRef = useRef<string | null>(null);

  const setRange = useCallback(
    (next: DateRange) => {
      //* روزِ ورود باید نیمه‌ی بعدازظهرش آزاد باشد. روزِ شروعِ یک رزرو دیگر
      //* فقط به‌عنوان «تاریخ خروج» معنا دارد (نیمه‌ی صبحش آزاد است) و نمی‌تواند
      //* تاریخ ورود باشد، چون ساعت ورود ۱۴:۰۰ است.
      if (next.from && occupancyMaps.afternoon.has(toDateKey(next.from))) {
        toast.error(
          "این روز به‌عنوان تاریخ ورود در دسترس نیست؛ می‌توانید آن را به‌عنوان تاریخ خروج انتخاب کنید.",
        );
        completedRangeRef.current = null;
        persist(EMPTY_DATE_RANGE, guests);
        return;
      }

      if (!next.from || !next.to) {
        completedRangeRef.current = null;
        persist(next, guests);
        return;
      }

      const signature = `${next.from.getTime()}-${next.to.getTime()}`;
      if (completedRangeRef.current === signature) return;
      completedRangeRef.current = signature;

      //* بازه‌ای که از روی یک شب رزرو‌شده می‌گذرد معتبر نیست: انتخاب را به
      //* «تاریخ ورود» برمی‌گردانیم تا کاربر تاریخ خروج دیگری انتخاب کند.
      if (!isRangeAvailable(next, bookedSet)) {
        toast.error("بازه‌ی انتخاب‌شده شامل روزهای رزرو‌شده است.");
        completedRangeRef.current = null;
        persist({ from: next.from, to: null }, guests);
        return;
      }

      //* طول اقامت: همان قاعده‌ی سرور (`validateStayRange`) را همان‌جا به
      //* کاربر نشان می‌دهیم تا انتخاب غیرمجاز به خطای انتهای مسیر تبدیل نشود.
      const selectedNights = countNights(next);
      if (selectedNights < settings.minBookingLength) {
        toast.error(`حداقل طول اقامت ${settings.minBookingLength} شب است.`);
        completedRangeRef.current = null;
        persist({ from: next.from, to: null }, guests);
        return;
      }
      if (selectedNights > settings.maxBookingLength) {
        toast.error(
          `حداکثر طول اقامت ${settings.maxBookingLength} شب است. بازه‌ی کوتاه‌تری انتخاب کنید.`,
        );
        completedRangeRef.current = null;
        persist({ from: next.from, to: null }, guests);
        return;
      }

      persist(next, guests);

      // ⚠️ باتم‌شیت رزرو هم‌زمان با خلاصه باز نمی‌ماند: دو لایه‌ی شناور
      // هم‌زمان یعنی دو تله‌ی فوکوس روی هم و ناوبری کیبورد شکسته.
      setSheetOpen(false);
      setSummaryOpen(true);
    },
    [
      bookedSet,
      guests,
      occupancyMaps,
      persist,
      settings.minBookingLength,
      settings.maxBookingLength,
    ],
  );

  const setGuests = useCallback(
    (next: number) => {
      persist(range, Math.min(maxCapacity, Math.max(1, next)));
    },
    [maxCapacity, persist, range],
  );

  const clearRange = useCallback(() => {
    completedRangeRef.current = null;
    persist(EMPTY_DATE_RANGE, guests);
  }, [guests, persist]);

  const scrollToRateSection = useCallback(() => {
    smoothScrollToId(SECTION_IDS.rate, { block: "start" });
  }, []);

  const openSheet = useCallback(() => setSheetOpen(true), []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  const closeSummary = useCallback(() => setSummaryOpen(false), []);

  const priceForDate = useCallback(
    (date: Date) => priceMap.get(toDateKey(date)) ?? null,
    [priceMap],
  );

  const nights = useMemo(() => countNights(range), [range]);
  const isComplete = useMemo(() => isCompleteRange(range), [range]);
  const isAvailable = useMemo(
    () => isRangeAvailable(range, bookedSet),
    [range, bookedSet],
  );
  const price = useMemo(() => priceStay(range, priceMap), [range, priceMap]);
  const startingNight = useMemo(
    () => cheapestNight(calendarDays),
    [calendarDays],
  );

  const value = useMemo<BookingContextValue>(
    () => ({
      cabin,
      settings,
      range,
      nights,
      isComplete,
      isAvailable,
      guests,
      maxCapacity,
      price,
      startingNight,
      priceForDate,
      dayOccupancy,
      minDate,
      maxDate,
      setRange,
      setGuests,
      clearRange,
      scrollToRateSection,
      isSheetOpen,
      openSheet,
      closeSheet,
      isSummaryOpen,
      closeSummary,
    }),
    [
      cabin,
      settings,
      range,
      nights,
      isComplete,
      isAvailable,
      guests,
      maxCapacity,
      price,
      startingNight,
      priceForDate,
      dayOccupancy,
      minDate,
      maxDate,
      setRange,
      setGuests,
      clearRange,
      scrollToRateSection,
      isSheetOpen,
      openSheet,
      closeSheet,
      isSummaryOpen,
      closeSummary,
    ],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}
