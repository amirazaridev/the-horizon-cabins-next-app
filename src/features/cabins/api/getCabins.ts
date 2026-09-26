import { PaginationMeta } from "@/types/api-response";
import { Cabin, CabinDto } from "../types/cabin.types";
import { API_URL_CABINS } from ".";
import { mapCabin } from "../utils/mapCabin";

export interface CabinsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  guests?: number;
  bedrooms?: number;
  amenities?: string;
  price?: string;
  city?: number;
}

export interface PaginatedCabins {
  cabins: Cabin[];
  meta: PaginationMeta;
}

export async function getCabins(): Promise<Cabin[]> {
  const { cabins } = await queryCabins({ limit: 100 });
  return cabins;
}

function buildQueryString(params: CabinsQueryParams): string {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.category) searchParams.set("category", params.category);
  if (params.guests) searchParams.set("guests", String(params.guests));
  if (params.bedrooms) searchParams.set("bedrooms", String(params.bedrooms));
  if (params.amenities) searchParams.set("amenities", params.amenities);
  if (params.price) searchParams.set("price", params.price);
  if (params.city) searchParams.set("city", String(params.city));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function queryCabins(
  params: CabinsQueryParams
): Promise<PaginatedCabins> {
  const queryString = buildQueryString(params);
  const res = await fetch(`${API_URL_CABINS}${queryString}`, {
    cache: "force-cache",
    next: { revalidate: 1, tags: ["cabins-data"] },
  });

  const json = (await res.json()) as {
    status: "success";
    data: { data: CabinDto[]; meta: PaginationMeta };
  };

  if (json.status !== "success") {
    throw new Error("Failed to fetch cabins");
  }

  return {
    cabins: json.data.data.map(mapCabin),
    meta: json.data.meta,
  };
}
