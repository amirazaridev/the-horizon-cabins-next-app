import DashboardLayout from "@/components/layout/DashboardLayout";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "پنل ادمین",
    template: "پنل ادمین | %s",
  },
};

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return <DashboardLayout>{children}</DashboardLayout>;
}
