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
