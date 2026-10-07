import type { ReactNode } from "react";

import GuestAreaLayout from "@/components/layout/GuestAreaLayout";
import { requireUser } from "@/features/auth/guards/server-guards";

/**
 * پوسته‌ی ناحیه‌ی مهمان (`/my/*`).
 *
 * ⚠️ گارد سروری «دفاع در عمق»: علاوه بر این‌که `(main)/layout.tsx` نقش
 * admin/owner را به پنل می‌فرستد، اینجا هم مطمئن می‌شویم کاربر وارد شده
 * است؛ در غیر این صورت به `/login` هدایت می‌شود.
 *
 * چیدمان: سایدبار (ناوبری + اطلاعات اکانت + خروج) در کنار ناحیه‌ی محتوا.
 */
export default async function MyLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactNode> {
  const user = await requireUser("/my");

  return (
    <GuestAreaLayout user={{ email: user.email }}>{children}</GuestAreaLayout>
  );
}
