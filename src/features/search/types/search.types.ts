/**
 * مدل دامنه‌ی جستجوی یکپارچه.
 *
 * این ماژول کاملاً مستقل از UI است تا هم لندینگ و هم /cabins
 * بتوانند از یک قرارداد واحد استفاده کنند.
 */

import type { Cabin } from "@/features/cabins/types/cabin.types";

/* ------------------------------------------------------------------ */
/* مقصد                                                               */
/* ------------------------------------------------------------------ */

/** شناسه‌ی معنایی مناطق — در URL هم همین مقدار ذخیره می‌شود */
export type RegionId =
  | "north"
  | "south"
  | "northeast"
  | "northwest"
  | "center"
  | "east"
  | "west";

export type Region = {
  id: RegionId;
  name: string;
  /** توضیح کوتاه زیر عنوان منطقه */
  hint?: string;
};

export type CityDestination = {
  type: "city";
  id: number;
  name: string;
};

/**
 * انتخاب کل یک منطقه (مثل «همه شهرهای شمال»).
 * عمداً فقط شناسه‌ی معنایی منطقه را نگه می‌دارد، نه ده‌ها cityId.
 */
export type RegionDestination = {
  type: "region";
  id: RegionId;
  name: string;
};

export type Destination = CityDestination | RegionDestination;

/* ------------------------------------------------------------------ */
/* فیلترهای هسته‌ی جستجو (تنها چیزی که در استور گلوبال می‌نشیند)         */
/* ------------------------------------------------------------------ */

/**
 * بازه‌ی بودجه‌ی هر شب (تومان).
 * `null` یعنی «بدون محدودیت» — نه بازه‌ی کامل.
 */
export type BudgetRange = {
  min: number;
  max: number;
};

export type SearchFilters = {
  destination: Destination | null;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number | null;
  /**
   * بازه‌ی بودجه‌ی هر شب. مفهوم «سقف بودجه» قبلاً تک‌مقداری بود؛ حالا بازه است.
   * در URL با همان قرارداد موجود پروژه ذخیره می‌شود: `price=lo-hi`
   */
  budget: BudgetRange | null;
};

export const EMPTY_SEARCH_FILTERS: SearchFilters = {
  destination: null,
  checkIn: null,
  checkOut: null,
  guests: null,
  budget: null,
};

/* ------------------------------------------------------------------ */
/* قرارداد درخواست/پاسخ جستجو                                          */
/* ------------------------------------------------------------------ */

/** همان فیلترهای هسته، ولی با تاریخ‌های رشته‌ای (قابل انتقال به سرویس) */
export type CabinSearchQuery = {
  destination: Destination | null;
  /** yyyy-MM-dd */
  checkIn: string | null;
  checkOut: string | null;
  guests: number | null;
  budget: BudgetRange | null;
  /** حداکثر تعداد نتیجه */
  limit?: number;
};

export type CabinSearchResult = {
  cabins: Cabin[];
  /** تعداد کل نتایج (برای CTA) */
  total: number;
  /**
   * منبع داده — UI از این فیلد می‌فهمد آیا اجازه دارد تصاویر جایگزین
   * ماک را اعمال کند یا نه. بعد از اتصال API واقعی «api» می‌شود.
   */
  source: "mock" | "api";
};

/* ------------------------------------------------------------------ */
/* کنترلر مشترک سرچ (پیاده‌سازی‌ها: استور Zustand / URL)                 */
/* ------------------------------------------------------------------ */

export type SearchController = {
  /** مقداری که کاربر در حال ویرایش است (بدون fetch) */
  draft: SearchFilters;
  /** مقداری که اعمال شده و مبنای fetch/URL است */
  applied: SearchFilters;
  setField: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => void;
  setFilters: (patch: Partial<SearchFilters>) => void;
  apply: () => void;
  /** پاک‌کردن کامل: draft + applied + URL */
  reset: () => void;
  /**
   * فقط draft را خالی می‌کند و applied/URL را دست نمی‌زند.
   * برای دکمه‌ی «حذف فیلترها» داخل شیت موبایل لازم است تا نتایجِ پشت شیت
   * وسط کار عوض نشود.
   */
  resetDraft: () => void;
  /**
   * آیا «اعمال» در جریان است؟ (برای نمایش spinner)
   * فقط کنترلر URL مقدار می‌دهد؛ کنترلر لندینگ که ناوبری ندارد `undefined`.
   */
  isPending?: boolean;
};

/* ------------------------------------------------------------------ */
/* محدوده‌های مجاز                                                     */
/* ------------------------------------------------------------------ */

export const GUESTS_MIN = 1;
export const GUESTS_MAX = 10;

/** محدوده‌ی اسلایدر بودجه (هم‌محدوده با فیلتر قیمت قبلی) */
export const BUDGET_MIN = 1_000_000;
export const BUDGET_MAX = 30_000_000;
export const BUDGET_STEP = 100_000;

/** حداکثر تعداد کارت در پیش‌نمایش جستجو */
export const SEARCH_PREVIEW_LIMIT = 6;
