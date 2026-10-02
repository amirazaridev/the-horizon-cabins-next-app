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
  if (user && canAccessDashboard(user.role)) {
    redirect("/dashboard");
  }

  return <Layout>{children}</Layout>;
}
