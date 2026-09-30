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
  /** اطلاعات منطقه؛ در پاسخ `locations/cities` موجود است */
  region?: CityRegionRef;
  createdAt?: string;
  updatedAt?: string;
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
