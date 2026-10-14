/** ارجاع سبک منطقه که همراه هر شهر برمی‌گردد */
export type CityRegionRef = {
  id: number;
  name: string;
  slug: string;
};

export type City = {
  id: number;
  name: string;
  regionId: number;
  /** تصویر شاخص شهر — ممکن است نباشد (`null`)؛ فرانت به عکس داخلی fallback می‌کند. */
  imageUrl?: string | null;
  /** اطلاعات منطقه؛ در پاسخ `locations/cities` موجود است */
  region?: CityRegionRef;
  createdAt?: string;
  updatedAt?: string;
};

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
