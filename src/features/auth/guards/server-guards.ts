import "server-only";
import { redirect } from "next/navigation";

import { canAccessDashboard } from "../constants/auth-cookie";
import { getCurrentUser, type CurrentUser } from "../services/session.service";

export async function requireUser(from?: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    const target = from ? `/login?from=${encodeURIComponent(from)}` : "/login";
    redirect(target);
  }
  return user;
}

export async function requireDashboardAccess(from?: string): Promise<CurrentUser> {
  const user = await requireUser(from);
  if (!canAccessDashboard(user.role)) {
    redirect("/");
  }
  return user;
}

export async function requireGuestArea(from?: string): Promise<CurrentUser> {
  const user = await requireUser(from);
  if (canAccessDashboard(user.role)) {
    redirect("/dashboard");
  }
  return user;
}
