/**
 * انواع موقعیت مکانی — هم‌خوان با ماژول `location` در بک‌اند.
 *
 * ساختار بک‌اند: `Region ──1:N──> City ──1:N──> Cabin`
 * اندپوینت‌ها: `GET /locations/regions` و `GET /locations/cities`
 */

/** ارجاع سبک منطقه که همراه هر شهر برمی‌گردد */
export type CityRegionRef = {
  id: number;
  name: string;
  slug: string;
};

export type City = {
  id: number;
  name: string;
  /**
   * شناسه‌ی عددی منطقه — منبع حقیقت برای دسته‌بندی شهرها.
   * (نام شهر دیگر مبنای تشخیص منطقه نیست.)
   */
  regionId: number;
  /** تصویر شاخص شهر — ممکن است نباشد (`null`)؛ فرانت به عکس داخلی fallback می‌کند. */
  imageUrl?: string | null;
  /** اطلاعات منطقه؛ در پاسخ `locations/cities` موجود است */
  region?: CityRegionRef;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * شهر پرطرفدار برای سکشن «مقاصد محبوب» لندینگ.
 *
 * از اندپوینت `GET /locations/cities/popular` می‌آید؛ مرتب بر اساس بیشترین
 * تعداد رزرو. `cabinsCount` برای متن کارت («N اقامتگاه») است.
 */
export type PopularCity = {
  id: number;
  name: string;
  imageUrl: string | null;
  regionId: number;
  region: CityRegionRef | null;
  cabinsCount: number;
  bookingsCount: number;
};

export type Region = {
  id: number;
  name: string;
  slug: string;
  /** ترتیب نمایش (نقشه/لیست فرانت‌اند) */
  displayOrder: number;
  /** تعداد شهرهای منطقه — شمارش داینامیک از بک‌اند */
  citiesCount: number;
};
