import type { Metadata } from "next";
import type { ReactNode } from "react";

import FavoritesEmptyState from "@/features/guest/favorites/components/FavoritesEmptyState";
import GuestPageHeader from "@/features/guest/shared/components/GuestPageHeader";

export const metadata: Metadata = { title: "علاقه‌مندی‌ها" };

/**
 * صفحه‌ی «علاقه‌مندی‌ها» — یک Server Component.
 *
 * ⚠️ در این فاز فقط UI است: ذخیره‌سازی واقعی (دیتابیس/API) در فاز بعد
 * وصل می‌شود. ساختار صفحه از قبل آماده است تا با اضافه‌شدن سرویس، فقط
 * همین‌جا یک لیست/`repository` تزریق شود و بقیه‌ی صفحه دست نخورد.
 */
export default function GuestFavoritesPage(): ReactNode {
  return (
    <div className="flex flex-col gap-6">
      <GuestPageHeader
        title="علاقه‌مندی‌ها"
        description="اقامتگاه‌هایی که لایک کرده‌اید اینجا نگه‌داری می‌شوند."
      />

      <FavoritesEmptyState />
    </div>
  );
}
