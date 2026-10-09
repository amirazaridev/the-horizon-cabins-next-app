/**
 * شیء `pricing` که اندپوینت **لیست** کابین‌ها کنار هر کابین برمی‌گرداند.
 *
 * دو حالت دارد و دقیقاً به وجود تاریخ در کوئری بستگی دارد:
 *   - `stay`          → با تاریخ؛ `totalPrice` = جمع قیمت شب‌های اقامت.
 *   - `startingFrom`  → بدون تاریخ؛ `startingPrice` = کمینه‌ی قیمت پنجره.
 */
export type CabinPricing =
  | {
      mode: "stay";
      nights: number;
      totalPrice: number;
      avgNightlyPrice: number;
    }
  | {
      mode: "startingFrom";
      startingPrice: number | null;
      windowDays: number;
    };

export type Cabin = {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  images?: string[];
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  /** شیء قیمت‌گذاری لیست — فقط از اندپوینت لیست می‌آید. */
  pricing?: CabinPricing;
  /**
   * شهر اقامتگاه.
   *
   * ⚠️ ناهم‌خوانی بک‌اند: اندپوینت **لیست** کابین‌ها آبجکت `city`
   * (`{id, name}`) را برمی‌گرداند، ولی اندپوینت **جزئیات** فقط
   * `cityId` عددی می‌دهد. هر دو فیلد اختیاری‌اند تا هر دو شکل پاسخ
   * بدون خطا تایپ شود؛ صفحه‌ی جزئیات نام شهر را از `cityId` حل می‌کند.
   */
  city?: { id: number; name: string; regionId?: number };
  /** شناسه‌ی شهر — همان چیزی که اندپوینت جزئیات برمی‌گرداند */
  cityId?: number;
  createdAt: Date;
  updatedAt: Date;
};
export type CabinDto = Omit<Cabin, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};


export interface CabinsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  guests?: number;
  bedrooms?: number;
  amenities?: string;
  /** بازه‌ی بودجه‌ی **هر شب** (`lo-hi`) — بدون تاریخ. */
  price?: string;
  /**
   * بازه‌ی بودجه‌ی **کل سفر** (`lo-hi`) — فقط همراه با تاریخ معتبر است و
   * با `price` هم‌زمان فرستاده نمی‌شود.
   */
  totalPrice?: string;
  /** `yyyy-MM-dd` (میلادی) — تاریخ ورود؛ همراه با `endDate` اجباری است. */
  startDate?: string;
  /** `yyyy-MM-dd` (میلادی) — تاریخ خروج. */
  endDate?: string;
  city?: number;
  /**
   * شناسه‌ی عددی منطقه (`1`..`8`).
   *
   * بک‌اند پارامتر `regionId` را می‌پذیرد، نه `region`. مقدار اسلاگِ منطقه
   * (`north`, `south`, …) در URL می‌ماند و در لحظه‌ی ساخت کوئری به این
   * شناسه‌ی عددی ترجمه می‌شود.
   */
  regionId?: number;
}