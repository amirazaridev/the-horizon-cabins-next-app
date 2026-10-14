import "server-only";

import { authFetch } from "@/libs/api/authFetch";
import type { PaginationMeta } from "@/types/api-response";
import type { AdminUser } from "../types/user.types";

export interface UsersPage {
  users: AdminUser[];
  meta: PaginationMeta;
}

/** یک صفحه از کاربران با فیلترهای اعمال‌شده روی بک‌اند. */
export async function fetchUsers(apiQuery: string): Promise<UsersPage> {
  const res = await authFetch(`user?${apiQuery}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`دریافت کاربران ناموفق بود (HTTP ${res.status}).`);
  }

  const json = (await res.json()) as {
    data?: { users?: AdminUser[]; meta?: PaginationMeta };
  };

  if (!json.data?.meta) {
    throw new Error("پاسخ کاربران نامعتبر بود.");
  }

  return { users: json.data.users ?? [], meta: json.data.meta };
}
