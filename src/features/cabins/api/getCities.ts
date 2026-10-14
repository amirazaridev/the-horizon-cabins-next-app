import { apiFetch } from "@/libs/api/apiFetch";
import { type ApiResponse } from "@/types/api-response";
import { type City, type PopularCity } from "../types/city.types";

export async function getCities(): Promise<City[]> {
  const res = await apiFetch("locations/cities");
  const json: ApiResponse<"cities", City[]> = await res.json();

  if (json.status !== "success") {
    throw new Error(json.message ?? "Failed to fetch cities");
  }

  return json.data.cities ?? [];
}

export async function getCityById(cityId: number): Promise<City | undefined> {
  const cities = await getCities();
  return cities.find((city) => city.id === cityId);
}

export async function getPopularCities(limit = 8): Promise<PopularCity[]> {
  const res = await apiFetch(`locations/cities/popular?limit=${limit}`, {
    cache: "force-cache",
    next: { revalidate: 300, tags: ["locations-data"] },
  });

  const json: ApiResponse<"cities", PopularCity[]> = await res.json();

  if (json.status !== "success") {
    throw new Error(json.message ?? "Failed to fetch popular cities");
  }

  return json.data.cities ?? [];
}
