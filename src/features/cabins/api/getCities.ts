import { apiFetch } from "@/libs/api/apiFetch";
import { ApiResponse } from "@/types/api-response";
import { City } from "../types/city.types";

/**
 * لیست همه‌ی شهرها همراه با اطلاعات منطقه‌ی هر شهر.
 *
 * قبلاً از `cabins/cities` خوانده می‌شد که با ری‌فکتور ماژول موقعیت مکانی
 * حذف شد. اندپوینت جدید: `GET /api/v1/locations/cities`
 */
export async function getCities(): Promise<City[]> {
  const res = await apiFetch("locations/cities");
  const json: ApiResponse<"cities", City[]> = await res.json();

  if (json.status !== "success") {
    throw new Error(json.message ?? "Failed to fetch cities");
  }

  return json.data.cities ?? [];
}
