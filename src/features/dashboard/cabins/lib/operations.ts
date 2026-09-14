import { filterCabins, type Cabin } from "@/features/cabins/lib/data-service";

export type CabinsSearchParams = Record<string, string | string[] | undefined>;

/** مقدار تکرشده یک پارامتر کوئری را به‌صورت رشته برمی‌گرداند */
export function getParam(params: CabinsSearchParams, key: string): string {
  const value = params[key];
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

const faCollator = new Intl.Collator("fa");

/** اعمال فیلتر (تخفیف/ظرفیت) + مرتب‌سازی روی لیست سوییت‌ها */
export function applyCabinsOperations(
  cabins: Cabin[],
  params: CabinsSearchParams,
): Cabin[] {
  const discount = getParam(params, "discount") || "all";
  const capacity = getParam(params, "capacity") || "all";
  const city = getParam(params, "city") || "all";
  const sortBy = getParam(params, "sortBy");

  let result = cabins;

  if (discount === "no-discount")
    result = result.filter((c) => c.discount === 0);
  if (discount === "with-discount")
    result = result.filter((c) => c.discount > 0);

  // ظرفیت: از تابع موجود data-service استفاده می‌کنیم (small/medium/large)
  if (capacity !== "all") result = filterCabins(result, capacity);
  if (city !== "all") result = result.filter((res) => res.city?.name === city);

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
