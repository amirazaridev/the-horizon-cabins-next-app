//* مدل دامنه‌ی جستجوی یکپارچه — مستقل از UI تا لندینگ و /cabins یک قرارداد داشته باشند.

import type { Cabin } from "@/features/cabins/types/cabin.types";

//* مقصد

//* اسلاگ مناطق (همان `Region.slug` بک‌اند)؛ در URL می‌ماند و لحظه‌ی ساخت کوئری به `regionId` ترجمه می‌شود.
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
  //* توضیح کوتاه زیر عنوان منطقه
  hint?: string;
  //* تعداد شهرها (از `citiesCount` بک‌اند)
  citiesCount?: number;
};

export type CityDestination = {
  type: "city";
  id: number;
  name: string;
};

//* انتخاب کل یک منطقه — عمداً فقط شناسه‌ی معنایی، نه ده‌ها `cityId`.
export type RegionDestination = {
  type: "region";
  id: RegionId;
  name: string;
};

export type Destination = CityDestination | RegionDestination;

//* فیلترهای هسته (تنها چیزی که در استور گلوبال می‌نشیند)

export type BudgetRange = {
  min: number;
  max: number;
};

export type SearchFilters = {
  destination: Destination | null;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number | null;
  //* در واحدِ حالت فعال؛ در URL با `price=lo-hi` یا `totalPrice=lo-hi` ذخیره می‌شود.
  budget: BudgetRange | null;
};

//* قرارداد درخواست/پاسخ

//* همان فیلترها با تاریخ رشته‌ای (قابل انتقال به سرویس).
export type CabinSearchQuery = {
  destination: Destination | null;
  //* yyyy-MM-dd
  checkIn: string | null;
  checkOut: string | null;
  guests: number | null;
  budget: BudgetRange | null;
  //* حداکثر تعداد نتیجه
  limit?: number;
};

export type CabinSearchResult = {
  //* حداکثر `limit` نتیجه (پیش‌نمایش: ۶ کارت)
  cabins: Cabin[];
  //* تعداد کل پس از فیلتر — برای متن CTA (از `meta.totalItems`)
  total: number;
};

//* کنترلر مشترک سرچ (پیاده‌سازی‌ها: استور Zustand / URL)

export type SearchController = {
  //* مقدار در حال ویرایش (بدون fetch)
  draft: SearchFilters;
  //* مقدار اعمال‌شده — مبنای fetch/URL
  applied: SearchFilters;
  setField: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => void;
  setFilters: (patch: Partial<SearchFilters>) => void;
  //* تأیید draft. `patch` برای «اعمال اتمیک» است: کنترلر URL مقدار draft را در `useState` نگه می‌دارد و در همان تیک به‌روز نمی‌شود، پس مقدار تازه باید در همین فراخوانی برود.
  apply: (patch?: Partial<SearchFilters>) => void;
  //* پاک‌کردن کامل: draft + applied + URL
  reset: () => void;
  //* فقط draft را خالی می‌کند
  resetDraft: () => void;
  //* فقط کنترلر URL مقدار می‌دهد (کنترلر لندینگ ناوبری ندارد).
  isPending?: boolean;
};
