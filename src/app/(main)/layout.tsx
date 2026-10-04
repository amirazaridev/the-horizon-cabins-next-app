import Layout from "@/components/layout/Layout";
import { canAccessDashboard } from "@/features/auth/constants/auth-cookie";
import { getCurrentUser } from "@/features/auth/services/session.service";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  // admin/owner جایی در سایت عمومی ندارند؛ مستقیم به پنل می‌روند.
  if (user && canAccessDashboard(user.role)) {
    redirect("/dashboard");
  }

  // فقط کاربران عادی (مهمان) به نوار بالا تزریق می‌شوند تا حالت پروفایل
  // جای دکمه‌ی «ورود | ثبت‌نام» را بگیرد.
  return (
    <Layout user={user ? { email: user.email, role: user.role } : null}>
      {children}
    </Layout>
  );
}
