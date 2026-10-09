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

/**
 * اسلاگ مناطق — همان `Region.slug` در بک‌اند.
 *
 * مقدار اسلاگ در URL ذخیره می‌شود (`region=north`) و در لحظه‌ی ساخت کوئری
 * به `regionId` عددی ترجمه می‌شود. این یونیون عیناً با داده‌ی seed بک‌اند
 * هم‌خوان است؛ اگر منطقه‌ای در بک‌اند اضافه شد، اینجا هم اضافه می‌شود.
 */
export type RegionId =
  | "north"
  | "northeast"
  | "northwest"
  | "central"
  | "west"
  | "east"
  | "south"
  | "southeast";

export type Region = {
  id: RegionId;
  name: string;
  /** توضیح کوتاه زیر عنوان منطقه */
  hint?: string;
  /** تعداد شهرهای منطقه (از `citiesCount` بک‌اند) */
  citiesCount?: number;
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
 * بازه‌ی بودجه (تومان).
 * `null` یعنی «بدون محدودیت» — نه بازه‌ی کامل.
 *
 * ⚠️ واحد این بازه به **حالت بودجه** بستگی دارد (نگاه کنید به
 * `utils/budget.ts`):
 *   - بدون تاریخ → بودجه‌ی «هر شب»  (به API به‌عنوان `price`)
 *   - با تاریخ   → بودجه‌ی «کل سفر» (به API به‌عنوان `totalPrice`)
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
   * بازه‌ی بودجه — در واحدِ حالت فعال (هر شب یا کل سفر؛ نگاه کنید به
   * `BudgetRange`). در URL با قرارداد پروژه ذخیره می‌شود: `price=lo-hi`
   * بدون تاریخ و `totalPrice=lo-hi` با تاریخ.
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
  /** حداکثر `limit` نتیجه (برای پیش‌نمایش، پیش‌فرض ۶ کارت) */
  cabins: Cabin[];
  /** تعداد کل نتایج پس از فیلتر — برای متن CTA (از `meta.totalItems`) */
  total: number;
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
  /**
   * تأیید draft و تبدیل آن به مبنای fetch پیش‌نمایش/URL.
   *
   * `patch` اختیاری برای «اعمال اتمیک» است: وقتی یک پنل هم مقدار را عوض
   * می‌کند و هم بلافاصله جستجو را اجرا می‌کند (مثل دکمه‌ی «اعمال» بودجه)،
   * نباید به state کهنه‌ی draft تکیه کنیم — کنترلر URL مقدار draft را در
   * `useState` نگه می‌دارد و به‌روزرسانی‌اش در همان تیک اعمال نمی‌شود.
   * با `patch` مقدار تازه در همان فراخوانی وارد draft و applied می‌شود.
   */
  apply: (patch?: Partial<SearchFilters>) => void;
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
