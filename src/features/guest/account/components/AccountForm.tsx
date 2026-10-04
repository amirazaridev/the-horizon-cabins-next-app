"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  CreditCard,
  Info,
  Mail,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StateField from "@/components/ui/StateField";
import { toJalaliDateInput } from "@/features/guest/shared/lib/format";
import {
  accountSchema,
  type AccountFormValues,
} from "../schemas/account.schema";
import type { GuestAccountProfile } from "../types/guest-account.types";

type Props = { profile: GuestAccountProfile };

/**
 * فرم تنظیمات حساب کاربری.
 *
 * ⚠️ **دکمه‌ی ذخیره عمداً غیرفعال است** — بک‌اند اندپوینت ویرایش پروفایل
 * ندارد. فرم با اعتبارسنجی کامل آماده است تا به‌محض اضافه‌شدن
 * `PATCH /user/me`، فقط یک Server Action وصل شود و همین UI بدون تغییر
 * کار کند.
 */
export default function AccountForm({ profile }: Props): ReactNode {
  const { control } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
      nationalId: profile.nationalId,
      dateOfBirth: toJalaliDateInput(profile.dateOfBirth),
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => event.preventDefault()}
      className="border-foreground/10 bg-surface/70 rounded-3xl border p-5 shadow-sm backdrop-blur-sm sm:p-6"
    >
      <div className="mb-5">
        <h2 className="text-text text-base font-bold">اطلاعات حساب</h2>
        <p className="text-text-gray mt-1 text-xs">
          مشخصات پروفایل خود را ویرایش کنید.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StateField
          control={control}
          name="fullName"
          label="نام و نام خانوادگی"
          autoComplete="name"
          icon={<UserRound className="size-5" />}
          className="sm:col-span-2"
        />

        <StateField
          control={control}
          name="phoneNumber"
          label="شماره موبایل"
          dir="ltr"
          inputMode="tel"
          autoComplete="tel"
          icon={<Phone className="size-5" />}
          hint="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
        />

        <StateField
          control={control}
          name="nationalId"
          label="کد ملی"
          dir="ltr"
          inputMode="numeric"
          icon={<CreditCard className="size-5" />}
          hint="۱۰ رقم"
        />

        <StateField
          control={control}
          name="dateOfBirth"
          label="تاریخ تولد"
          dir="ltr"
          inputMode="numeric"
          icon={<CalendarDays className="size-5" />}
          hint="به‌شکل ۱۳۷۰/۰۵/۱۲"
        />

        <Input
          label="ایمیل"
          value={profile.email}
          readOnly
          disabled
          dir="ltr"
          icon={<Mail className="size-5" />}
          hint="ایمیل حساب قابل تغییر نیست"
          className="sm:col-span-2"
        />
      </div>

      <div className="border-primary-400/30 bg-primary-400/10 text-primary-600 dark:text-primary-300 mt-5 flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-xs leading-relaxed">
        <Info className="mt-px size-4 shrink-0" />
        <span>
          ویرایش اطلاعات حساب هنوز فعال نشده است؛ پس از آماده‌شدن سرویس
          ذخیره‌سازی، همین فرم بدون تغییر در رابط قابل استفاده می‌شود.
        </span>
      </div>

      {/*
        TODO(backend): اندپوینت ویرایش پروفایل وجود ندارد. با اضافه‌شدن
        `PATCH /user/me`، دکمه‌ی زیر فعال و یک Server Action به فرم وصل شود
        (تاریخ تولد جلالی هم باید به ISO تبدیل گردد).
      */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-text-gray text-xs">تغییرات فعلاً ذخیره نمی‌شوند.</p>
        <Button
          type="button"
          disabled
          shape="xl"
          title="این قابلیت به‌زودی فعال می‌شود"
        >
          <Save className="size-4" />
          ذخیره تغییرات
        </Button>
      </div>
    </form>
  );
}
