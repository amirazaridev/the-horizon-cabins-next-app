import { apiFetch } from "@/libs/api/apiFetch";
import { ApiResponse } from "@/types/api-response";
import { Cabin, CabinDto } from "../types/cabin.types";
import { mapCabin } from "../utils/mapCabin";

export async function getCabin(id: number): Promise<Cabin> {
  const res = await apiFetch(`cabins/${id}`);
  const json: ApiResponse<"cabin", CabinDto> = await res.json();

  if (json.status !== "success") {
    throw new Error(json.message ?? "Failed to fetch cabin");
  }

  return mapCabin(json.data.cabin);
}
