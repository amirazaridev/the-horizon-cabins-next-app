import type { ReactNode } from "react";

import GuestAreaTabs from "@/features/guest/shared/components/GuestAreaTabs";
import { requireUser } from "@/features/auth/guards/server-guards";

/**
 * پوسته‌ی ناحیه‌ی مهمان (`/my/*`).
 *
 * ⚠️ گارد سروری «دفاع در عمق»: علاوه بر این‌که `(main)/layout.tsx` نقش
 * admin/owner را به پنل می‌فرستد، اینجا هم مطمئن می‌شویم کاربر وارد شده
 * است؛ در غیر این صورت به `/login` هدایت می‌شود.
 */
export default async function MyLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactNode> {
  await requireUser();

  return (
    <section className="bg-background min-h-screen">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6 md:py-14">
        <header className="mb-6">
          <h1 className="text-text text-2xl font-extrabold md:text-3xl">
            حساب کاربری من
          </h1>
          <p className="text-text-gray mt-2 text-sm">
            رزروها و اطلاعات حساب خود را اینجا مدیریت کنید.
          </p>
        </header>

        <GuestAreaTabs />

        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
