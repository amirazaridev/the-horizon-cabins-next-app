import { ApiResponse } from "@/types/api-response";
import { Cabin, CabinDto } from "../types/cabin.types";
import { API_URL_CABINS } from ".";
import { mapCabin } from "../lib/mapCabin";

export async function getCabin(id: number): Promise<Cabin> {
  const res = await fetch(`${API_URL_CABINS}/${id}`);
  const json: ApiResponse<"cabin", CabinDto> = await res.json();

  if (json.status !== "success") {
    throw new Error(json.message ?? "Failed to fetch cabins");
  }

  return mapCabin(json.data.cabin);
}
