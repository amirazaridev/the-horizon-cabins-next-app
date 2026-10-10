import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { requireDashboardAccess } from "@/features/auth/guards/server-guards";

/**
 * گارد دسترسی بخش «مدیران» — **فقط مالک**.
 *
 * ⚠️ چرا در layout و نه در خود page؟
 * کنترل دسترسی در layout **قبل از** رندر صفحه اجرا می‌شود، پس Next می‌تواند
 * پاسخ را با کد وضعیت ۴۰۴ برگرداند. اگر چک داخل page باشد، پوسته‌ی داشبورد
 * (که خودش async است) زودتر flush می‌شود و پاسخ با ۲۰۰ برمی‌گردد.
 *
 * ⚠️ اگر کاربر admin باشد به صفحه‌ی «not found» می‌رود (نه ریدایرکت) تا
 * وجود این بخش برایش لو نرود.
 */
export default async function AdminsLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactNode> {
  const user = await requireDashboardAccess("/dashboard/admins");
  if (user.role !== "owner") notFound();

  return children;
}
