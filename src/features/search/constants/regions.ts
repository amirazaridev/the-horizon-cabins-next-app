import type { Region, RegionId } from "../types/search.types";
import type { Region as ApiRegion } from "@/features/cabins/types/city.types";

/**
 * لایه‌ی نمایش مناطق.
 *
 * ⚠️ منبع حقیقتِ «لیست مناطق» و «دسته‌بندی شهرها» بک‌اند است
 * (`GET /locations/regions` + `city.regionId`). این فایل فقط چیزهایی را
 * نگه می‌دارد که بک‌اند ندارد:
 *
 *   1) متن `hint` فارسی برای هر منطقه (بک‌اند فیلد توصیفی ندارد)
 *   2) نام منطقه به‌عنوان fallback برای متن‌هایی که فقط اسلاگ در دست دارند
 *      (مثل پارس URL یا چیپ «آخرین جستجو» که لیست مناطق را همراه ندارد)
 */

/** توضیح کوتاه هر منطقه — فقط نمایشی */
export const REGION_HINTS: Record<RegionId, string> = {
  north: "جنگل، دریا و کوهستان",
  northeast: "خراسان و کویر شمالی",
  northwest: "آذربایجان و اردبیل",
  central: "تهران، اصفهان و کویر",
  west: "کردستان، لرستان و کرمانشاه",
  east: "سیستان، خراسان جنوبی و طبس",
  south: "ساحل، جزیره و خلیج",
  southeast: "کرمان، بم و سواحل مکران",
};

/**
 * نام مناطق بر پایه‌ی اسلاگ.
 *
 * این نقشه فقط «fallback» است تا هر جا لیست API در دست نبود، بتوانیم
 * متن خوانا بسازیم. مقادیرش باید با `prisma/seeds/data/region.ts` هم‌خوان
 * بمانند.
 */
export const REGION_NAMES: Record<RegionId, string> = {
  north: "شمال",
  northeast: "شمال شرقی",
  northwest: "شمال غربی",
  central: "مرکزی",
  west: "غرب",
  east: "شرق",
  south: "جنوب",
  southeast: "جنوب شرقی",
};

/**
 * شناسه‌ی عددی مناطق — آینه‌ی `prisma/seeds/data/region.ts` در بک‌اند.
 *
 * بک‌اند شناسه‌ها را «صریح» seed می‌کند («Ids are explicit so the city seed
 * can reference them deterministically»)، پس این نگاشت پایدار است و برای
 * ترجمه‌ی اسلاگِ داخل URL به پارامتر `regionId` استفاده می‌شود.
 */
export const REGION_IDS: Record<RegionId, number> = {
  north: 1,
  northeast: 2,
  northwest: 3,
  central: 4,
  west: 5,
  east: 6,
  south: 7,
  southeast: 8,
};

export function isRegionId(value: string | null | undefined): value is RegionId {
  if (!value) return false;
  return Object.prototype.hasOwnProperty.call(REGION_NAMES, value);
}

/** نام منطقه از اسلاگ؛ اگر ناشناخته باشد خودِ اسلاگ برگردانده می‌شود */
export function regionName(slug: string): string {
  return isRegionId(slug) ? REGION_NAMES[slug] : slug;
}

export function regionHint(slug: string): string | undefined {
  return isRegionId(slug) ? REGION_HINTS[slug] : undefined;
}

/** شناسه‌ی عددی منطقه از اسلاگ — برای پارامتر `regionId` بک‌اند */
export function regionIdFromSlug(
  slug: string | null | undefined,
): number | undefined {
  return slug && isRegionId(slug) ? REGION_IDS[slug] : undefined;
}

/** اسلاگ منطقه از شناسه‌ی عددی — برای گروه‌بندی شهرها */
export function regionSlugFromId(id: number): RegionId | undefined {
  return (Object.keys(REGION_IDS) as RegionId[]).find(
    (slug) => REGION_IDS[slug] === id,
  );
}


/**
 * برچسب «همه شهرهای …» برای یک منطقه.
 * مثال: «شمال» → «همه شهرهای شمال»
 */
export function regionAllCitiesLabel(regionName: string): string {
  return `همه شهرهای ${regionName.replace(" ایران", "").trim()}`;
}

/* ------------------------------------------------------------------ */
/* نگاشت API ↔ دامنه‌ی جستجو                                            */
/* ------------------------------------------------------------------ */

/**
 * تبدیل مناطق بک‌اند به مدل نمایشی جستجو.
 *
 * ترتیب ورودی حفظ می‌شود؛ بک‌اند از قبل با `displayOrder` مرتب برمی‌گرداند.
 * منطقه‌ای که اسلاگش برای فرانت‌اند ناشناخته باشد حذف می‌شود تا UI با
 * شناسه‌ی نامعتبر رندر نشود.
 */
export function toSearchRegions(apiRegions: ApiRegion[]): Region[] {
  return apiRegions
    .filter((region): region is ApiRegion & { slug: RegionId } =>
      isRegionId(region.slug),
    )
    .map((region) => ({
      id: region.slug,
      name: region.name,
      hint: REGION_HINTS[region.slug],
      citiesCount: region.citiesCount,
    }));
}
