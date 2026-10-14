import { apiFetch } from "@/libs/api/apiFetch";
import { type ApiResponse } from "@/types/api-response";
import { type Region } from "../types/city.types";

export async function getRegions(): Promise<Region[]> {
  const res = await apiFetch("locations/regions");
  const json: ApiResponse<"regions", Region[]> = await res.json();

  if (json.status !== "success") {
    throw new Error(json.message ?? "Failed to fetch regions");
  }

  return json.data.regions ?? [];
}
