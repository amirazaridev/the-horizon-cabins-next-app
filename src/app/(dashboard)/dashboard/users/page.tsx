import { Suspense, type ReactNode } from "react";

import { Pagination } from "@/components/ui/Pagination";
import { getCurrentRole } from "@/features/auth/services/session.service";
import UsersFilters from "@/features/dashboard/users/components/UsersFilters";
import UsersTable from "@/features/dashboard/users/components/UsersTable";
import {
  parseUsersFilters,
  toUsersApiQuery,
  type UsersSearchParams,
} from "@/features/dashboard/users/lib/user-filters";
import { fetchUsers } from "@/features/dashboard/users/services/users.api.server";

export const metadata = { title: "مدیریت کاربران" };

type SearchParams = Promise<UsersSearchParams>;

/**
 * صفحه‌ی «کاربران» داشبورد (افراد و مهمانان).
 *
 * ⚠️ فیلترها در URL می‌نشینند و سمت **سرور** به `GET /user` بک‌اند (با
 * `authFetch`) پاس می‌شوند؛ نتیجه به جدول کلاینت‌محور داده می‌شود.
 * صفحه‌بندی هم URL-محور است (مثل صفحه‌ی رزروها و سوییت‌ها).
 */
export default async function UsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ReactNode> {
  const params = await searchParams;
  const filters = parseUsersFilters(params);

  const [page, role] = await Promise.all([
    fetchUsers(toUsersApiQuery(filters)),
    getCurrentRole(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-text text-2xl font-bold sm:text-3xl">کاربران</h2>
          <p className="text-text-gray mt-1 text-sm">مدیریت افراد و مهمانان</p>
        </div>

        <span className="border-border bg-background-2 text-text-gray inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium tabular-nums">
          {page.meta.totalItems.toLocaleString("fa-IR")} کاربر
        </span>
      </header>

      <Suspense fallback={null}>
        <UsersFilters />
      </Suspense>

      <UsersTable users={page.users} canManageRoles={role === "owner"} />

      <div className="flex justify-center">
        <Pagination
          currentPage={page.meta.currentPage}
          totalPages={page.meta.totalPages}
          basePath="/dashboard/users"
          searchParams={params}
          dir="rtl"
          scroll={false}
        />
      </div>
    </div>
  );
}
