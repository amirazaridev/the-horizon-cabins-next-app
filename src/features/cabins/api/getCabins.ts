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
}: CabinsQueryParams): string {
  const searchParams = new URLSearchParams();

  if (page) searchParams.set("page", String(page));
  if (limit) searchParams.set("limit", String(limit));
  if (category) searchParams.set("category", category);
  if (guests) searchParams.set("guests", String(guests));
  if (bedrooms) searchParams.set("bedrooms", String(bedrooms));
  if (amenities) searchParams.set("amenities", amenities);
  if (price) searchParams.set("price", price);
  if (city) searchParams.set("city", String(city));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function queryCabins(
  params?: CabinsQueryParams,
): Promise<PaginatedCabins> {
  const queryString = buildQueryString(params ?? {});
  const res = await apiFetch(`cabins${queryString}`, {
    cache: "force-cache",
    next: { revalidate: 300, tags: ["cabins-data"] },
  });

  const json: ApiPaginatedResponse<"cabins", CabinDto> = await res.json();

  if (json.status !== "success") throw new Error(json.message);

  return {
    cabins: (json.data.cabins ?? []).map(mapCabin),
    meta: json.data.meta,
  };
}
