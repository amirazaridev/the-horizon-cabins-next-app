/**
 * داده‌ی فرضی (ماک) برای نگاشت شهر → منطقه و لیست مناطق.
 *
 * ⚠️ این فایل «منبع قابل‌جایگزین» است: امروز ماک است و فردا می‌تواند
 * از یک endpoint واقعی (`GET /regions`) پر شود، بدون تغییر در UI.
 *
 * توجه: لیست خودِ شهرها از API موجود (`getCities`) می‌آید؛ این فایل فقط
 * لایه‌ی معناییِ «منطقه» را روی آن می‌نشاند تا بک‌اند فعلی دست‌نخورده بماند.
 */

import type { City } from "@/features/cabins/types/city.types";
import type { Region, RegionId } from "../types/search.types";
import { REGIONS } from "../constants/regions";

/** نگاشت نام شهر (فارسی، همان‌طور که API برمی‌گرداند) به منطقه */
export const CITY_REGION_MAP: Record<string, RegionId> = {
  /* شمال ایران */
  رامسر: "north",
  نوشهر: "north",
  چالوس: "north",
  بابلسر: "north",
  نور: "north",
  محمودآباد: "north",
  ساری: "north",
  گرگان: "north",
  رشت: "north",
  انزلی: "north",
  لاهیجان: "north",
  ماسال: "north",
  آستارا: "north",
  کلاردشت: "north",

  /* جنوب ایران */
  کیش: "south",
  قشم: "south",
  بندرعباس: "south",
  چابهار: "south",
  بوشهر: "south",
  میناب: "south",

  /* شمال‌شرق ایران */
  مشهد: "northeast",
  نیشابور: "northeast",
  شاهرود: "northeast",
  بجنورد: "northeast",
  سبزوار: "northeast",
  طرقبه: "northeast",

  /* شمال‌غرب ایران */
  تبریز: "northwest",
  اردبیل: "northwest",
  سرعین: "northwest",
  ارومیه: "northwest",
  مراغه: "northwest",
  زنجان: "northwest",

  /* مرکز ایران */
  تهران: "center",
  اصفهان: "center",
  کاشان: "center",
  یزد: "center",
  شیراز: "center",
  قم: "center",
  کرج: "center",
  شهرکرد: "center",

  /* شرق ایران */
  زاهدان: "east",
  بیرجند: "east",
  طبس: "east",
  زابل: "east",
  نهبندان: "east",

  /* غرب ایران */
  همدان: "west",
  کرمانشاه: "west",
  سنندج: "west",
  خرم‌آباد: "west",
  ایلام: "west",
  مریوان: "west",
};

/** منطقه‌ی یک شهر بر اساس نام؛ ناشناخته یعنی null */
export function regionOfCityName(
  name: string | undefined | null,
): RegionId | null {
  if (!name) return null;
  return CITY_REGION_MAP[name.trim()] ?? null;
}

export type CityGroup = {
  region: Region;
  cities: City[];
};

/**
 * گروه‌بندی شهرهای برگشتی از API بر اساس منطقه.
 * شهرهای ناشناخته در انتها و زیر «سایر شهرها» می‌آیند.
 */
export function groupCitiesByRegion(cities: City[]): {
  groups: CityGroup[];
  others: City[];
} {
  const buckets = new Map<RegionId, City[]>();
  const others: City[] = [];

  for (const city of cities) {
    const regionId = regionOfCityName(city.name);
    if (!regionId) {
      others.push(city);
      continue;
    }
    const bucket = buckets.get(regionId);
    if (bucket) bucket.push(city);
    else buckets.set(regionId, [city]);
  }

  const groups: CityGroup[] = REGIONS.filter((region) =>
    buckets.has(region.id),
  ).map((region) => ({ region, cities: buckets.get(region.id)! }));

  return { groups, others };
}
