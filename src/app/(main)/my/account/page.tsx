import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import AccountForm from "@/features/guest/account/components/AccountForm";
import AccountProfileHeader from "@/features/guest/account/components/AccountProfileHeader";
import { getGuestAccountProfile } from "@/features/guest/account/services/account.service";
import GuestPageHeader from "@/features/guest/shared/components/GuestPageHeader";

export const metadata: Metadata = { title: "تنظیمات حساب کاربری" };

/**
 * صفحه‌ی «تنظیمات حساب کاربری» — یک Server Component.
 *
 * مشخصات واقعی کاربر از `GET /user/me` خوانده و به دو کامپوننت نمایشی
 * تزریق می‌شود؛ خودِ فرم کلاینتی است چون `react-hook-form` می‌خواهد.
 */
export default async function GuestAccountPage(): Promise<ReactNode> {
  const profile = await getGuestAccountProfile();

  // نشست نامعتبر/بک‌اند در دسترس ⇒ بازگشت به ورود با مسیر برگشت.
  if (!profile) redirect("/login?from=/my/account");

  return (
    <div className="flex flex-col gap-5">
      <GuestPageHeader
        title="تنظیمات حساب کاربری"
        description="مشخصات پروفایل خود را ببینید و ویرایش کنید."
      />
      <AccountProfileHeader profile={profile} />
      <AccountForm profile={profile} />
    </div>
  );
}
