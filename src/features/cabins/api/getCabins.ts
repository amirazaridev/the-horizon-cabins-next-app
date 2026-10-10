import { apiFetch } from "@/libs/api/apiFetch";
import { ApiPaginatedResponse, PaginationMeta } from "@/types/api-response";
import { Cabin, CabinDto, CabinsQueryParams } from "../types/cabin.types";
import { mapCabin } from "../utils/mapCabin";



export interface PaginatedCabins {
  cabins: Cabin[];
  meta: PaginationMeta;
}

export async function getCabins(): Promise<Cabin[]> {
  const { cabins } = await queryCabins();
  return cabins;
}

function buildQueryString({
  page,
  amenities,
  bedrooms,
  category,
  city,
  guests,
  limit,
  price,
  totalPrice,
  startDate,
  endDate,
  regionId,
}: CabinsQueryParams): string {
  const searchParams = new URLSearchParams();

  if (page) searchParams.set("page", String(page));
  if (limit) searchParams.set("limit", String(limit));
  if (category) searchParams.set("category", category);
  if (guests) searchParams.set("guests", String(guests));
  if (bedrooms) searchParams.set("bedrooms", String(bedrooms));
  if (amenities) searchParams.set("amenities", amenities);
  if (price) searchParams.set("price", price);
  //* بودجه‌ی «کل سفر» — فقط همراه با تاریخ معتبر است (اعتبارسنجی بک‌اند).
  if (totalPrice) searchParams.set("totalPrice", totalPrice);
  //* تاریخ‌ها همیشه با هم می‌روند؛ بک‌اند فقط یکی را رد می‌کند.
  if (startDate) searchParams.set("startDate", startDate);
  if (endDate) searchParams.set("endDate", endDate);
  if (city) searchParams.set("city", String(city));
  // نام پارامتر بک‌اند `regionId` است (عددی) — نه `region`
  if (regionId) searchParams.set("regionId", String(regionId));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

/**
 * آیا این درخواست به «موجودی/قیمت زنده» وابسته است؟
 *
 * کوئری‌های تاریخ‌دار (و بودجه‌ی کل) نباید کش شوند: نتیجه‌ی موجودی و
 * قیمت هر لحظه ممکن است عوض شود و `revalidate: 300` یعنی تا ۵ دقیقه
 * ویلاهای اشغال‌شده/آزادشده را اشتباه نشان دهیم.
 */
function needsFreshData(params?: CabinsQueryParams): boolean {
  return Boolean(params?.startDate || params?.endDate || params?.totalPrice);
}

export async function queryCabins(
  params?: CabinsQueryParams,
): Promise<PaginatedCabins> {
  const queryString = buildQueryString(params ?? {});
  const res = await apiFetch(
    `cabins${queryString}`,
    needsFreshData(params)
      ? { cache: "no-store" }
      : { cache: "force-cache", next: { revalidate: 300, tags: ["cabins-data"] } },
  );

  const json: ApiPaginatedResponse<"cabins", CabinDto> = await res.json();

  if (json.status !== "success") throw new Error(json.message);

  return {
    cabins: (json.data.cabins ?? []).map(mapCabin),
    meta: json.data.meta,
  };
}
