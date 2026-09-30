import { apiFetch } from "@/libs/api/apiFetch";
import { ApiResponse } from "@/types/api-response";
import { Region } from "../types/city.types";

/**
 * لیست مناطق ثابت ایران همراه با تعداد شهرهای هر منطقه.
 *
 * `GET /api/v1/locations/regions` — پاسخ با `displayOrder` مرتب برمی‌گردد
 * و `citiesCount` شمارش داینامیک شهرهای همان منطقه است.
 *
 * توجه: منطقه فقط خواندنی است (CRUD ندارد).
 */
export async function getRegions(): Promise<Region[]> {
  const res = await apiFetch("locations/regions");
  const json: ApiResponse<"regions", Region[]> = await res.json();

  if (json.status !== "success") {
    throw new Error(json.message ?? "Failed to fetch regions");
  }

  return json.data.regions ?? [];
}
