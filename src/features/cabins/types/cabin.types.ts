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
  city?: { id: number; name: string };
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
   * شناسه‌ی معنایی منطقه (`north`, `south`, …).
   * بک‌اند فعلی این پارامتر را نادیده می‌گیرد؛ اما از الان فرستاده می‌شود
   * تا وقتی endpoint از آن پشتیبانی کرد، هیچ تغییری سمت فرانت لازم نباشد.
   */
  region?: string;
}