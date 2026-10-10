import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";

import { Pagination } from "@/components/ui/Pagination";
import type { UserRole } from "@/features/auth/constants/auth-cookie";
import { requireDashboardAccess } from "@/features/auth/guards/server-guards";
import UserListFilters from "@/features/dashboard/users/components/UserListFilters";
import UsersTable from "@/features/dashboard/users/components/UsersTable";
import {
  parseUsersFilters,
  toUsersApiQuery,
  type UsersSearchParams,
} from "@/features/dashboard/users/lib/user-filters";
import { fetchUsers } from "@/features/dashboard/users/services/users.api.server";

export const metadata = { title: "مدیریت مدیران" };

type SearchParams = Promise<UsersSearchParams>;

/** دامنه‌ی این صفحه: مدیران و مالکان. */
const LIST_ROLES: readonly UserRole[] = ["admin", "owner"];

/**
 * صفحه‌ی «مدیران» داشبورد — **فقط مالک**.
 *
 * ⚠️ کنترل دسترسی دو لایه است: آیتم سایدبار برای admin نمایش داده نمی‌شود و
 * اگر کسی مستقیم به مسیر بیاید، `notFound()` می‌گیرد (۴۰۴) — نه ریدایرکت،
 * چون وجود این صفحه نباید برای admin لو برود.
 */
export default async function AdminsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ReactNode> {
  const user = await requireDashboardAccess("/dashboard/admins");
  if (user.role !== "owner") notFound();

  const params = await searchParams;
  const filters = parseUsersFilters(params);

  const page = await fetchUsers(toUsersApiQuery(filters, LIST_ROLES));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-text text-2xl font-bold sm:text-3xl">مدیران</h2>
          <p className="text-text-gray mt-1 text-sm">
            مدیریت مدیران و مالکان — حداکثر دو مالک مجاز است
          </p>
        </div>

        <span className="border-border bg-background-2 text-text-gray inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium tabular-nums">
          {page.meta.totalItems.toLocaleString("fa-IR")} مدیر
        </span>
      </header>

      <Suspense fallback={null}>
        <UserListFilters mobileTitle="فیلتر مدیران" />
      </Suspense>

      <UsersTable
        users={page.users}
        actorRole={user.role}
        emptyMessage="مدیری با این فیلترها پیدا نشد."
      />

      <div className="flex justify-center">
        <Pagination
          currentPage={page.meta.currentPage}
          totalPages={page.meta.totalPages}
          basePath="/dashboard/admins"
          searchParams={params}
          dir="rtl"
          scroll={false}
        />
      </div>
    </div>
  );
}
