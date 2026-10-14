import type { Region, RegionId } from "@/features/search/types/search.types";
import type { Region as ApiRegion } from "@/features/cabins/types/city.types";

//* توضیح کوتاه هر منطقه — فقط نمایشی
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

//* نام مناطق بر پایه‌ی اسلاگ — fallback برای جایی که لیست API در دست نیست (پارس URL، چیپ «آخرین جستجو»). باید با seed بک‌اند هم‌خوان بماند.
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

//* شناسه‌ی عددی مناطق — آینه‌ی seed بک‌اند. بک‌اند شناسه‌ها را صریح seed می‌کند، پس این نگاشت پایدار است.
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

//* نام منطقه از اسلاگ؛ اگر ناشناخته باشد خودِ اسلاگ برمی‌گردد
export function regionName(slug: string): string {
  return isRegionId(slug) ? REGION_NAMES[slug] : slug;
}

export function regionHint(slug: string): string | undefined {
  return isRegionId(slug) ? REGION_HINTS[slug] : undefined;
}

//* شناسه‌ی عددی منطقه از اسلاگ — برای پارامتر `regionId` بک‌اند
export function regionIdFromSlug(
  slug: string | null | undefined,
): number | undefined {
  return slug && isRegionId(slug) ? REGION_IDS[slug] : undefined;
}

//* اسلاگ منطقه از شناسه‌ی عددی — برای گروه‌بندی شهرها
export function regionSlugFromId(id: number): RegionId | undefined {
  return (Object.keys(REGION_IDS) as RegionId[]).find(
    (slug) => REGION_IDS[slug] === id,
  );
}

//* برچسب «همه شهرهای …» — مثال: «شمال» ⇒ «همه شهرهای شمال»
export function regionAllCitiesLabel(regionName: string): string {
  return `همه شهرهای ${regionName.replace(" ایران", "").trim()}`;
}

//* نگاشت API ↔ دامنه‌ی جستجو

//* مناطق بک‌اند ⇒ مدل نمایشی جستجو. ترتیب ورودی حفظ می‌شود و منطقه‌ی با اسلاگ ناشناخته حذف می‌شود تا UI با شناسه‌ی نامعتبر رندر نشود.
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
