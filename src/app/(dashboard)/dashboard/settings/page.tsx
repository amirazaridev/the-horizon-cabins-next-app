import type { ReactNode } from "react";

import { requireDashboardAccess } from "@/features/auth/guards/server-guards";
import SettingsForm from "@/features/dashboard/settings/components/SettingsForm";
import SettingsView from "@/features/dashboard/settings/components/SettingsView";
import { fetchSettings } from "@/features/dashboard/settings/services/settings.api.server";

export const metadata = { title: "تنظیمات" };

/**
 * صفحه‌ی «تنظیمات» داشبورد.
 *
 * - **owner**: فرم ویرایش (Server Action → `PATCH /settings`).
 * - **admin**: نمایش فقط‌خواندنی (خواندن تنظیمات برای admin مجاز است، ویرایش نه).
 */
export default async function SettingsPage(): Promise<ReactNode> {
  const user = await requireDashboardAccess("/dashboard/settings");
  const settings = await fetchSettings();

  const canEdit = user.role === "owner";

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-text text-2xl font-bold sm:text-3xl">تنظیمات</h2>
          <p className="text-text-gray mt-1 text-sm">
            تنظیمات رزرو، قیمت‌گذاری و تقویم سامانه
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium ${
            canEdit
              ? "border-primary-400/40 bg-primary-400/10 text-primary-600 dark:text-primary-300"
              : "border-border bg-background-2 text-text-gray"
          }`}
        >
          {canEdit ? "قابل ویرایش" : "فقط‌خواندنی"}
        </span>
      </header>

      {canEdit ? (
        <SettingsForm settings={settings} />
      ) : (
        <SettingsView settings={settings} />
      )}
    </div>
  );
}
