import DashboardLayout from "@/components/layout/DashboardLayout";
import type { ReactNode } from "react";

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return <DashboardLayout>{children}</DashboardLayout>;
}
