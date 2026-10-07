import DashboardShell from "@/features/dashboard/shared/components/DashboardShell";
import { requireDashboardAccess } from "@/features/auth/guards/server-guards";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "پنل ادمین",
    template: "پنل ادمین | %s",
  },
};

/**
 * Layout پنل مدیریت — یک Server Component.
 *
 * ⚠️ این‌جا «دفاع در عمق» انجام می‌شود: علاوه بر `proxy.ts`، خودِ این
 * Layout سروری هم با تماس به API نقش کاربر را می‌فهمد و مطمئن می‌شود
 * admin یا owner است. اگر مهمان باشد به «/» و اگر وارد نشده باشد به
 * «/login» می‌رود. سپس پوسته‌ی کلاینتی با اطلاعات کاربر تغذیه می‌شود.
 */
export default async function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactNode> {
  const user = await requireDashboardAccess("/dashboard");

  return (
    <DashboardShell role={user.role} userId={user.id}>
      {children}
    </DashboardShell>
  );
}
