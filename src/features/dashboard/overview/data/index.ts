/**
 * نقطه‌ی ورود لایه‌ی داده‌ی داشبورد.
 *
 * ⭐ مصرف‌کننده‌ها (hookها/کامپوننت‌ها) **همیشه از این‌جا** import می‌کنند.
 * `getDashboardRepository()` تنها نقطه‌ی تعویض پیاده‌سازی است.
 */

import { ApiDashboardRepository } from "./dashboard.repository.api";
import type { DashboardRepository } from "./dashboard.repository";

let repository: DashboardRepository | null = null;

/** repository فعال پروژه. */
export function getDashboardRepository(): DashboardRepository {
  if (!repository) {
    repository = new ApiDashboardRepository();
  }
  return repository;
}

/** تزریق repository جایگزین (تست / Storybook). */
export function setDashboardRepository(next: DashboardRepository): void {
  repository = next;
}

export { pickTodayActivity, toTodayActivityItem } from "./dashboard.repository";

export type {
  DashboardSnapshot,
  DashboardRepository,
  DashboardMutations,
  DashboardFilterOptions,
} from "./dashboard.repository";
