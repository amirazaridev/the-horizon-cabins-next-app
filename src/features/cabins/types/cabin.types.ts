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

/** DTO خام یک پیشنهاد «تخفیف لحظه‌آخری» — همان شکل پاسخ API. */
export type LastMinuteCabinDto = CabinDto & {
  finalPrice: number;
  originalPrice: number;
  discountPercent: number;
  expiresAt: string;
};

/** پیشنهاد «تخفیف لحظه‌آخری» پس از map (تاریخ‌ها Date شده‌اند). */
export type LastMinuteCabin = Cabin & {
  /** قیمت نهایی شب تخفیف‌خورده (پس از تخفیف). */
  finalPrice: number;
  /** قیمت پیش از تخفیف (خط‌خورده). */
  originalPrice: number;
  /** درصد تخفیف اعمال‌شده. */
  discountPercent: number;
  /** لحظه‌ی انقضای تخفیف (ISO) — مبنای تایمر. */
  expiresAt: string;
};

export type CabinSort =
  | "price_asc"
  | "price_desc"
  | "newest"
  | "most_booked"
  | "rating_desc";

export interface CabinsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  guests?: number;
  bedrooms?: number;
  amenities?: string;
  /** بازه‌ی بودجه‌ی **هر شب** (`lo-hi`) — بدون تاریخ. */
  price?: string;
  totalPrice?: string;
  /** `yyyy-MM-dd` (میلادی) — تاریخ ورود؛ همراه با `endDate` اجباری است. */
  startDate?: string;
  /** `yyyy-MM-dd` (میلادی) — تاریخ خروج. */
  endDate?: string;
  city?: number;
  regionId?: number;
  /** مرتب‌سازی لیست (پیش‌فرض بک‌اند: `id ASC`). */
  sort?: CabinSort;
}