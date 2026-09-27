import { apiFetch } from "@/libs/api/apiFetch";
import { ApiResponse } from "@/types/api-response";

export async function getAmenities(): Promise<string[]> {
  const res = await apiFetch("cabins/amenities");
  const json: ApiResponse<"amenities", string[]> = await res.json();

  if (json.status !== "success") {
    throw new Error(json.message ?? "Failed to fetch amenities");
  }

  return json.data.amenities;
}