import { apiFetch } from "@/libs/api/apiFetch";
import { ApiResponse } from "@/types/api-response";
import { City } from "../types/city.types";

export async function getCities() {
  const res = await apiFetch("cabins/cities");
  const json: ApiResponse<"cities", City[]> = await res.json();

  if (json.status !== "success") {
    throw new Error(json.message ?? "Failed to fetch cities");
  }

  return json.data.cities;
}
