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

/**
 * یک شهر را از روی شناسه‌اش پیدا می‌کند.
 *
 * چرا لازم است؟ اندپوینت جزئیات کابین (`GET /cabins/:id`) برخلاف اندپوینت
 * لیست، به‌جای آبجکت `city` فقط `cityId` عددی برمی‌گرداند. صفحه‌ی جزئیات
 * با این تابع نام شهر را روی سرور حل می‌کند تا بج مقصد روی گالری نمایش
 * داده شود.
 *
 * ⚠️ اندپوینت `GET /locations/cities/:id` وجود ندارد؛ پس کل فهرست
 * (کوچک و کش‌شدنی) خوانده و فیلتر می‌شود. با اضافه‌شدن آن اندپوینت،
 * فقط بدنه‌ی همین تابع عوض می‌شود.
 */
export async function getCityById(cityId: number): Promise<City | undefined> {
  const cities = await getCities();
  return cities.find((city) => city.id === cityId);
}
