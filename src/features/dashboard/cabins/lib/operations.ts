import { type Cabin } from "@/features/cabins/types/cabin.types";

export type CabinsSearchParams = Record<string, string | string[] | undefined>;

/** مقدار تکرشده یک پارامتر کوئری را به‌صورت رشته برمی‌گرداند */
export function getParam(params: CabinsSearchParams, key: string): string {
  const value = params[key];
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

const faCollator = new Intl.Collator("fa");

function toInt(value: string, min: number, max: number): number | undefined {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) return undefined;
  return n;
}

/** اعمال فیلترهای داشبورد (مثل صفحه اصلی) + مرتب‌سازی روی لیست سوییت‌ها */
export function applyCabinsOperations(
  cabins: Cabin[],
  params: CabinsSearchParams,
): Cabin[] {
  const discount = getParam(params, "discount") || "all";
  const guests = toInt(getParam(params, "guests"), 1, 30);
  const bedrooms = toInt(getParam(params, "bedrooms"), 1, 20);
  const cityRaw = getParam(params, "city");
  const priceRaw = getParam(params, "price");
  const amenitiesRaw = getParam(params, "amenities");
  const sortBy = getParam(params, "sortBy");

  let result = cabins;

  // سازگاری با URLهای قدیمی (discount=all/with-discount/no-discount)
  if (discount === "no-discount")
    result = result.filter((c) => c.discount === 0);
  if (discount === "with-discount")
    result = result.filter((c) => c.discount > 0);

  if (guests !== undefined)
    result = result.filter((c) => c.maxCapacity >= guests);
  if (bedrooms !== undefined)
    result = result.filter((c) => c.bedrooms >= bedrooms);

  if (amenitiesRaw) {
    const selected = amenitiesRaw
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    if (selected.length > 0)
      result = result.filter((c) =>
        selected.every((a) => c.amenities.includes(a)),
      );
  }

  if (priceRaw) {
    const [lo, hi] = priceRaw.split("-").map(Number);
    if (
      Number.isFinite(lo) &&
      Number.isFinite(hi) &&
      lo >= 0 &&
      hi >= lo &&
      hi > 0
    ) {
      result = result.filter((c) => {
        const finalPrice = c.regularPrice - c.discount;
        return finalPrice >= lo && finalPrice <= hi;
      });
    }
  }

  if (cityRaw && cityRaw !== "all") {
    // حالت جدید: شناسه شهر (مثل صفحه اصلی) + fallback به نام شهر (URL قدیمی)
    const cityId = Number(cityRaw);
    if (Number.isInteger(cityId)) {
      result = result.filter((c) => c.city?.id === cityId);
    } else {
      result = result.filter((c) => c.city?.name === cityRaw);
    }
  }

  return sortCabins(result, sortBy);
}

function sortCabins(cabins: Cabin[], sortBy: string): Cabin[] {
  const sorted = [...cabins];

  switch (sortBy) {
    case "name-asc":
      return sorted.sort((a, b) => faCollator.compare(a.name, b.name));
    case "name-desc":
      return sorted.sort((a, b) => faCollator.compare(b.name, a.name));
    case "regularPrice-asc":
      return sorted.sort((a, b) => a.regularPrice - b.regularPrice);
    case "regularPrice-desc":
      return sorted.sort((a, b) => b.regularPrice - a.regularPrice);
    case "maxCapacity-asc":
      return sorted.sort((a, b) => a.maxCapacity - b.maxCapacity);
    case "maxCapacity-desc":
      return sorted.sort((a, b) => b.maxCapacity - a.maxCapacity);
    default:
      return sorted;
  }
}
