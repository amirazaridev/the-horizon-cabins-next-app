import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { requireDashboardAccess } from "@/features/auth/guards/server-guards";

//* گارد دسترسی بخش «مدیران» — **فقط مالک**.
export default async function AdminsLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactNode> {
  const user = await requireDashboardAccess("/dashboard/admins");
  if (user.role !== "owner") notFound();

  return children;
}
