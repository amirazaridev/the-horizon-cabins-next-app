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
import type { DateRange } from "@/components/ui/RangeDatePicker";
import type { Cabin } from "@/features/cabins/types/cabin.types";
import { SECTION_IDS } from "../../constants/cabin-detail";
import {
  countNights,
  EMPTY_DATE_RANGE,
  getPriceBreakdown,
  isCompleteRange,
  type PriceBreakdown,
} from "../../utils/booking";

export type BookingContextValue = {
  cabin: Cabin;
  /** بازه‌ی انتخاب‌شده — ممکن است ناقص باشد (فقط ورود) */
  range: DateRange;
  /** تعداد شب؛ صفر یعنی بازه کامل نیست */
  nights: number;
  /** بازه کامل است (ورود + خروج) */
  isComplete: boolean;
  guests: number;
  maxCapacity: number;
  price: PriceBreakdown;
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
  children: ReactNode;
};

/**
 * نگه‌دارنده‌ی state رزرو صفحه‌ی جزئیات.
 *
 * چرا Context و نه state محلی؟ چون یک بازه‌ی تاریخ روی چهار جای مختلف
 * اثر دارد: تقویم داخل صفحه، aside چسبان دسکتاپ، نوار ثابت موبایل و
 * باتم‌شیت/مودال خلاصه. اگر state در هر کدام جدا نگه داشته شود، باید
 * بین‌شان prop-drill و همگام‌سازی دستی انجام شود.
 *
 * ⚠️ این state عمداً به URL یا استور جهانی وصل **نشده**: بک‌اند پارامتر
 * تاریخ ندارد، پس تاریخ به API فرستاده نمی‌شود و دکمه‌ی رزرو هم هنوز به
 * صفحه‌ی پرداخت وصل نیست. این Provider همان نقطه‌ی اتصال تمیز برای آینده است.
 *
 * این کامپوننت کلاینت است، ولی `children` را از سرور می‌گیرد؛ پس سکشن‌های
 * ثابت (توضیحات، مشخصات، قوانین، نظرات) همچنان سروری و در HTML اولیه رندر
 * می‌شوند و این Provider فقط پوسته‌ی تعاملی آن‌هاست.
 */
export default function BookingProvider({ cabin, children }: Props): ReactNode {
  const maxCapacity = Math.max(1, cabin.maxCapacity);

  const [range, setRangeState] = useState<DateRange>(EMPTY_DATE_RANGE);
  const [guests, setGuestsState] = useState(() =>
    Math.min(2, maxCapacity),
  );
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isSummaryOpen, setSummaryOpen] = useState(false);

  /**
   * امضای آخرین بازه‌ی کاملی که مودال خلاصه برایش باز شده.
   * بدون این، هر رندر مجدد یا هر تغییر ناکامل بعدی دوباره مودال را
   * باز می‌کرد.
   */
  const completedRangeRef = useRef<string | null>(null);

  const setRange = useCallback((next: DateRange) => {
    setRangeState(next);

    if (!next.from || !next.to) {
      completedRangeRef.current = null;
      return;
    }

    const signature = `${next.from.getTime()}-${next.to.getTime()}`;
    if (completedRangeRef.current === signature) return;
    completedRangeRef.current = signature;
    setSummaryOpen(true);
  }, []);

  const setGuests = useCallback(
    (next: number) => {
      setGuestsState(Math.min(maxCapacity, Math.max(1, next)));
    },
    [maxCapacity],
  );

  const clearRange = useCallback(() => {
    completedRangeRef.current = null;
    setRangeState(EMPTY_DATE_RANGE);
  }, []);

  const scrollToRateSection = useCallback(() => {
    document
      .getElementById(SECTION_IDS.rate)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openSheet = useCallback(() => setSheetOpen(true), []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  const closeSummary = useCallback(() => setSummaryOpen(false), []);

  const nights = useMemo(() => countNights(range), [range]);
  const isComplete = useMemo(() => isCompleteRange(range), [range]);
  const price = useMemo(
    () => getPriceBreakdown(cabin, nights),
    [cabin, nights],
  );

  const value = useMemo<BookingContextValue>(
    () => ({
      cabin,
      range,
      nights,
      isComplete,
      guests,
      maxCapacity,
      price,
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
      range,
      nights,
      isComplete,
      guests,
      maxCapacity,
      price,
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
