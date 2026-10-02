import "server-only";

const API_URL = process.env.API_URL;

/**
 * fetch پایه به بک‌اند (بدون احراز هویت).
 *
 * ⚠️ نکته: بک‌اند پاسخ را با `{ status: "success", data }` می‌دهد و خروجی
 * توابع Server Action نباید کل `Response` را به کلاینت بفرستد (فقط بخش
 * دادگانِ لازم). این تابع خودِ `Response` را برمی‌گرداند تا فراخوان تصمیم
 * بگیرد.
 */
export async function apiFetch(endpoint: string, options?: RequestInit) {
  return fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
}
