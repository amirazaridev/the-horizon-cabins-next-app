"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  CreditCard,
  LoaderCircle,
  Lock,
  Mail,
  Phone,
  RotateCcw,
  Save,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
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
import GenderField from "./GenderField";

type Props = {
  profile: GuestAccountProfile;
  /**
   * مسیر بازگشت بعد از ذخیره‌ی موفق (جریان رزرو).
   *
   * ⚠️ وقتی ست باشد (کاربر از دکمه‌ی «رزرو» به تنظیمات آمده)، بعد از ذخیره
   * خودکار به همان صفحه‌ی اقامتگاه برمی‌گردد؛ تاریخ‌ها و نفرات از پیش‌نویس
   * `sessionStorage` دوباره نشانده می‌شوند. در بازدید عادی تنظیمات این مقدار
   * `null` است و رفتار قبلی (ماندن در صفحه + تازه‌سازی) حفظ می‌شود.
   */
  returnTo?: string | null;
};

/**
 * فرم تنظیمات حساب کاربری.
 *
 * ⚠️ مقادیر با اعتبارسنجی کامل (`accountSchema`) جمع می‌شوند و به Server
 * Action پاس داده می‌شوند؛ Action تاریخ تولد جلالی را به میلادی تبدیل و
 * `PATCH /user/me` را صدا می‌زند. بعد از موفقیت، فرم «پاک» (clean) و
 * سرصفحه‌ی پروفایل با `router.refresh()` تازه می‌شود.
 *
 * ⚠️ چیدمان: کارت به دو بخش («مشخصات فردی» و «اطلاعات حساب») تقسیم شده تا
 * چشم سریع‌تر فیلد مرتبط را پیدا کند؛ نوار کنش‌ها در پایین، وضعیت ذخیره‌شدن
 * را هم‌زمان نشان می‌دهد.
 */
export default function AccountForm({
  profile,
  returnTo = null,
}: Props): ReactNode {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    mode: "onTouched",
    // بعد از اولین خطا، با هر تغییر پاک/اصلاح شود تا پیام کهنه نماند.
    reValidateMode: "onChange",
    defaultValues: {
      fullName: profile.fullName,
      gender: profile.gender,
      phoneNumber: profile.phoneNumber,
      nationalId: profile.nationalId,
      dateOfBirth: toJalaliDateInput(profile.dateOfBirth),
    },
  });

  async function onSubmit(values: AccountFormValues): Promise<void> {
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

    //* جریان رزرو: به همان صفحه‌ی اقامتگاه برگرد؛ تاریخ‌ها و نفرات از
    //* پیش‌نویس `sessionStorage` دوباره نشانده می‌شوند. عمداً `reset` و
    //* `refresh` صدا زده نمی‌شوند چون صفحه در حال ترک‌شدن است.
    if (returnTo) {
      router.push(returnTo);
      return;
    }

    reset(values);
    router.refresh();
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <CardDashContainer noTransition className="p-5 sm:p-6">
        {/* ── سرصفحه ─────────────────────────────────────────────── */}
        <div className="flex items-start gap-3">
          <span className="bg-primary-400/15 text-primary-600 dark:text-primary-300 grid size-11 shrink-0 place-items-center rounded-2xl">
            <UserRound className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-text text-base font-bold">اطلاعات حساب</h2>
            <p className="text-text-gray mt-1 text-xs leading-relaxed">
              مشخصات پروفایل خود را به‌روز نگه دارید تا رزروها و اطلاع‌رسانی‌ها
              بدون مشکل انجام شود.
            </p>
          </div>
        </div>

        {/* ── مشخصات فردی ────────────────────────────────────────── */}
        <section className="border-border/70 mt-5 border-t pt-5">
          <SectionHeading icon={<UserRound className="size-4" />} title="مشخصات فردی" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StateField
              control={control}
              name="fullName"
              label="نام و نام خانوادگی"
              autoComplete="name"
              icon={<UserRound className="size-5" />}
              className="sm:col-span-2"
            />

            <GenderField control={control} name="gender" label="جنسیت" />

            <StateField
              control={control}
              name="dateOfBirth"
              label="تاریخ تولد"
              dir="ltr"
              inputMode="numeric"
              icon={<CalendarDays className="size-5" />}
              hint="به‌شکل ۱۳۷۰/۰۵/۱۲"
              clearable
            />

            <StateField
              control={control}
              name="nationalId"
              label="کد ملی"
              dir="ltr"
              inputMode="numeric"
              icon={<CreditCard className="size-5" />}
              hint="۱۰ رقم"
              clearable
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
              clearable
            />
          </div>
        </section>

        {/* ── اطلاعات ورود ───────────────────────────────────────── */}
        <section className="border-border/70 mt-6 border-t pt-5">
          <SectionHeading icon={<Mail className="size-4" />} title="اطلاعات ورود" />

          {/* ایمیل هویت حساب است: فقط‌خواندنی (نه disabled) تا هنوز قابل
              انتخاب/کپی باشد؛ آیکون قفل سیگنال «غیرقابل تغییر» می‌دهد. */}
          <Input
            label="ایمیل"
            value={profile.email}
            readOnly
            dir="ltr"
            icon={<Lock className="size-5" />}
            hint="ایمیل ورود شماست و قابل تغییر نیست"
            inputClassName="cursor-not-allowed opacity-70"
          />
        </section>

        {/* ── نوار کنش‌ها ─────────────────────────────────────────── */}
        <div className="border-border/70 mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-text-gray flex items-center gap-2 text-xs">
            <span
              aria-hidden="true"
              className={`size-1.5 shrink-0 rounded-full ${
                isDirty ? "bg-primary-400" : "bg-secondary-400"
              }`}
            />
            {isDirty ? "تغییرات ذخیره‌نشده دارید." : "همه‌ی تغییرات ذخیره شده است."}
          </p>

          {/* در RTL کنش اصلی («ذخیره») سمت راست می‌نشیند و «بازنشانی» کنارش؛
              در موبایل (ستونی معکوس) ذخیره پایین‌ترین و در دسترس‌ترین است. */}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <Button
              type="submit"
              size="md"
              shape="xl"
              disabled={isSubmitting || !isDirty}
              title={!isDirty ? "تغییری برای ذخیره وجود ندارد" : undefined}
            >
              {isSubmitting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="md"
              shape="xl"
              disabled={!isDirty || isSubmitting}
              onClick={() => reset()}
            >
              <RotateCcw className="size-4" />
              بازنشانی
            </Button>
          </div>
        </div>
      </CardDashContainer>
    </form>
  );
}

/** عنوان یک بخش فرم: آیکون + متن + خط جداکننده تا انتها. */
function SectionHeading({ icon, title }: { icon: ReactNode; title: string }): ReactNode {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-primary-500 grid size-6 shrink-0 place-items-center">{icon}</span>
      <h3 className="text-text text-sm font-bold whitespace-nowrap">{title}</h3>
      <span className="bg-border h-px flex-1" aria-hidden="true" />
    </div>
  );
}
