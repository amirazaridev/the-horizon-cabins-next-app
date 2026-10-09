import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import AccountForm from "@/features/guest/account/components/AccountForm";
import AccountProfileHeader from "@/features/guest/account/components/AccountProfileHeader";
import BookingProfileToast from "@/features/guest/account/components/BookingProfileToast";
import BookingRequiredFieldsNotice from "@/features/guest/account/components/BookingRequiredFieldsNotice";
import {
  formatMissingFields,
  getMissingBookingFields,
} from "@/features/guest/account/lib/profile-completeness";
import { getGuestAccountProfile } from "@/features/guest/account/services/account.service";
import GuestPageHeader from "@/features/guest/shared/components/GuestPageHeader";

export const metadata: Metadata = { title: "تنظیمات حساب کاربری" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** اولین مقدار یک پارامتر (پارامترهای URL می‌توانند آرایه باشند). */
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * صفحه‌ی «تنظیمات حساب کاربری» — یک Server Component.
 *
 * مشخصات واقعی کاربر از `GET /user/me` خوانده و به دو کامپوننت نمایشی
 * تزریق می‌شود؛ خودِ فرم کلاینتی است چون `react-hook-form` می‌خواهد.
 *
 * ⚠️ **جریان رزرو (فاز ۲):** اگر کاربر با `?reason=booking` آمده باشد یعنی
 * از دکمه‌ی «رزرو» به اینجا هدایت شده تا پروفایلش را کامل کند. در آن حالت:
 *   ۱) یک توست نشان داده می‌شود که چرا اینجاست،
 *   ۲) بنر راهنما فیلدهای ناقص را فهرست می‌کند،
 *   ۳) `returnTo` (مسیر صفحه‌ی ویلا) به فرم پاس داده می‌شود تا بعد از ذخیره‌ی
 *      موفق، خودکار به همان صفحه برگردد و پیش‌نویس تاریخ‌ها/نفرات برگردد.
 */
export default async function GuestAccountSettingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ReactNode> {
  const sp = await searchParams;

  /**
   * ⚠️ مسیر بازگشت فقط اگر یک **مسیر داخلی** باشد پذیرفته می‌شود
   * (`/...` و نه `//host`)، وگرنه به open redirect تبدیل می‌شود.
   */
  const rawFrom = first(sp.from);
  const returnTo =
    rawFrom && rawFrom.startsWith("/") && !rawFrom.startsWith("//")
      ? rawFrom
      : null;
  const fromBooking = first(sp.reason) === "booking";

  const profile = await getGuestAccountProfile();

  // نشست نامعتبر/بک‌اند در دسترس ⇒ بازگشت به ورود با مسیر برگشت.
  if (!profile) redirect("/login?from=/account/settings");

  const missing = getMissingBookingFields(profile);

  return (
    /* عرض محدود و وسط‌چین: فرم تنظیمات نباید تمام عرض پنل را بگیرد وگرنه
       طول خطوط و فیلدها غیرخوانا می‌شود. */
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      {fromBooking && missing.length > 0 && (
        <BookingProfileToast
          message={`برای ثبت رزرو، این اطلاعات لازم است: ${formatMissingFields(missing)}`}
        />
      )}

      <GuestPageHeader
        title="تنظیمات حساب کاربری"
        description="مشخصات پروفایل خود را ببینید و ویرایش کنید."
      />

      {fromBooking && <BookingRequiredFieldsNotice missing={missing} />}

      <AccountProfileHeader profile={profile} />
      <AccountForm profile={profile} returnTo={returnTo} />
    </div>
  );
}
