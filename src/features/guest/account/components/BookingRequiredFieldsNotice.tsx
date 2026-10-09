import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import {
  formatMissingFields,
  type BookingRequiredField,
} from "../lib/profile-completeness";

type Props = {
  /** فیلدهایی که برای رزرو لازم‌اند و هنوز پر نشده‌اند. */
  missing: readonly BookingRequiredField[];
};

/**
 * بنر راهنمای «چه چیزی برای رزرو کم است».
 *
 * ⚠️ مکمل توست است، نه تکرارش: توست گذراست و ممکن است از دید خارج شود، ولی
 * کاربری که برای تکمیل پروفایل به این صفحه آمده باید **بداند کدام فیلدها**
 * مانع رزرو است. بنر تا وقتی فیلدی ناقص باشد بالای فرم می‌ماند.
 *
 * ⚠️ فقط در جریان رزرو نمایش داده می‌شود (`?reason=booking`)؛ بازدید عادی
 * تنظیمات نباید پیام مربوط به رزرو ببیند.
 */
export default function BookingRequiredFieldsNotice({
  missing,
}: Props): ReactNode {
  if (missing.length === 0) return null;

  return (
    <div
      role="status"
      className="border-primary-400/35 bg-primary-400/10 text-primary-600 dark:text-primary-300 flex items-start gap-3 rounded-2xl border px-4 py-3.5"
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 space-y-1 text-xs leading-relaxed">
        <p className="font-bold">
          برای ثبت رزرو، این اطلاعات را تکمیل کنید
        </p>
        <p className="opacity-90">
          {formatMissingFields(missing)} — تا وقتی این فیلدها خالی باشند، دکمه‌ی
          رزرو در صفحه‌ی اقامتگاه کار نمی‌کند.
        </p>
      </div>
    </div>
  );
}
