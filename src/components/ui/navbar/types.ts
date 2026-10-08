import type { UserRole } from "@/features/auth/constants/auth-cookie";

/**
 * کاربر جاری که از لایه‌ی سروری به نوار بالا تزریق می‌شود.
 *
 * ⚠️ عمداً «کمینه» است: نوار بالا فقط به چیزی نیاز دارد که در UI نشان دهد
 * (ایمیل و نقش). بقیه‌ی اطلاعات پروفایل در صفحه‌ی «تنظیمات حساب» از API
 * خوانده می‌شود تا نوار بالا به داده‌ی اضافه وابسته نشود.
 */
export type NavbarUser = {
  email: string;
  role: UserRole;
};
