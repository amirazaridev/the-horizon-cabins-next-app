import { ApiResponse } from "@/types/api-response";
import { Cabin, CabinDto } from "../types/cabin.types";
import { API_URL_CABINS } from ".";
import { mapCabin } from "../utils/mapCabin";

export async function getCabins(): Promise<Cabin[]> {
  const res = await fetch(API_URL_CABINS, {
    cache: "force-cache",
    next: { revalidate: 1, tags: ["cabins-data"] },
  });
  const json: ApiResponse<"cabins", CabinDto[]> = await res.json();

  if (json.status !== "success") {
    throw new Error(json.message ?? "Failed to fetch cabins");
  }

  return json.data.cabins.map(mapCabin);
}
