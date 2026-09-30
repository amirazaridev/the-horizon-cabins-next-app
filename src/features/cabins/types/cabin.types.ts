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
  /**
   * شهر اقامتگاه.
   * `regionId` اختیاری است چون پاسخ لیست کابین بک‌اند فعلاً فقط `id` و
   * `name` را برمی‌گرداند؛ دیتاست ماک برای فیلتر منطقه آن را پر می‌کند.
   */
  city?: { id: number; name: string; regionId?: number };
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
  price?: string;
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