"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  CreditCard,
  Info,
  LoaderCircle,
  Mail,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import CardDashContainer from "@/components/ui/CardDashContainer";
import Input from "@/components/ui/Input";
import StateField from "@/components/ui/StateField";
import { toJalaliDateInput } from "@/features/guest/shared/lib/format";
import { updateGuestProfileAction } from "../actions/account.actions";
import { accountSchema, type AccountFormValues } from "../schemas/account.schema";
import type { GuestAccountProfile } from "../types/guest-account.types";

type Props = { profile: GuestAccountProfile };

/**
 * فرم تنظیمات حساب کاربری.
 *
 * ⚠️ مقادیر با اعتبارسنجی کامل (`accountSchema`) جمع می‌شوند و به Server
 * Action پاس داده می‌شوند؛ Action تاریخ تولد جلالی را به میلادی تبدیل و
 * `PATCH /user/me` را صدا می‌زند. بعد از موفقیت، فرم «پاک» (clean) و
 * سرصفحه‌ی پروفایل با `router.refresh()` تازه می‌شود.
 */
export default function AccountForm({ profile }: Props): ReactNode {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isDirty },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
      nationalId: profile.nationalId,
      dateOfBirth: toJalaliDateInput(profile.dateOfBirth),
    },
  });

  async function onSubmit(values: AccountFormValues): Promise<void> {
    setIsSaving(true);
    try {
      const result = await updateGuestProfileAction(values);

      if (!result.ok) {
        toast.error(result.message);
        // خطای فیلد زیر همان فیلد نمایش داده می‌شود (مثلاً کد ملی تکراری).
        if (result.field) {
          setError(result.field, { type: "server", message: result.message });
        }
        return;
      }

      toast.success(result.message);
      reset(values);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      {/* کارت مشترک پنل — همان `CardDashContainer` داشبورد مدیریت. */}
      <CardDashContainer noTransition className="p-5 sm:p-6">
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
            فیلدهای اختیاری (موبایل، کد ملی، تاریخ تولد) را می‌توانید خالی
            بگذارید تا از پروفایل حذف شوند.
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-text-gray text-xs">
            {isDirty ? "تغییرات ذخیره‌نشده دارید." : "همه‌ی تغییرات ذخیره شده است."}
          </p>
          <Button
            type="submit"
            shape="xl"
            disabled={isSaving || !isDirty}
            title={!isDirty ? "تغییری برای ذخیره وجود ندارد" : undefined}
          >
            {isSaving ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </div>
      </CardDashContainer>
    </form>
  );
}
