import type { ReactNode } from "react";

import { requireDashboardAccess } from "@/features/auth/guards/server-guards";
import SettingsView from "@/features/dashboard/settings/components/SettingsView";
import { fetchSettings } from "@/features/dashboard/settings/services/settings.api.server";

export const metadata = { title: "تنظیمات" };

/**
 * صفحه‌ی «تنظیمات» داشبورد — نمایش فقط‌خواندنی تنظیمات سامانه.
 *
 * دسترسی: admin|owner (خواندن تنظیمات در بک‌اند برای همین دو نقش مجاز است)؛
 * ویرایش در فاز بعد و فقط برای owner.
 */
export default async function SettingsPage(): Promise<ReactNode> {
  await requireDashboardAccess("/dashboard/settings");
  const settings = await fetchSettings();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-text text-2xl font-bold sm:text-3xl">تنظیمات</h2>
        <p className="text-text-gray mt-1 text-sm">
          تنظیمات رزرو، قیمت‌گذاری و تقویم سامانه
        </p>
      </header>

      <SettingsView settings={settings} />
    </div>
  );
}
