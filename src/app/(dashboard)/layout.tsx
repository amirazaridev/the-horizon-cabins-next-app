import DashboardLayout from "@/components/layout/DashboardLayout";
import Layout from "@/components/layout/Layout";
import type { ReactNode } from "react";

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return <DashboardLayout>{children}</DashboardLayout>;
}
