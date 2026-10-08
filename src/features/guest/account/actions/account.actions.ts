"use server";

import { revalidatePath } from "next/cache";

import { authFetch } from "@/libs/api/authFetch";
import { jalaliToIsoDate } from "@/features/guest/shared/lib/jalali";
import { accountSchema, type AccountFormValues } from "../schemas/account.schema";

/**
 * Server Action ویرایش پروفایل مهمان.
 *
 * جریان: فرم کلاینت → این Action (BFF) → `PATCH /user/me` روی Express.
 * مرورگر هرگز مستقیم با بک‌اند حرف نمی‌زند و توکن هم از کوکی httpOnly
 * خوانده می‌شود (`authFetch`).
 */

/** خروجی قابل serialize برای کلاینت. */
export type AccountActionResult =
  | { ok: true; message: string }
  | {
      ok: false;
      message: string;
      /** اگر خطا مربوط به یک فیلد بود، تا فرم آن را زیر همان فیلد نشان دهد. */
      field?: keyof AccountFormValues;
    };

/** شکل خطای بک‌اند (فقط چیزی که لازم داریم). */
type ApiErrorResponse = {
  status?: "fail" | "error";
  code?: string;
  message?: string;
};

export async function updateGuestProfileAction(input: unknown): Promise<AccountActionResult> {
  // ⚠️ اعتبارسنجی دوباره در سرور؛ به اعتبارسنجی فرم کلاینت اعتماد نمی‌کنیم.
  const parsed = accountSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      message: issue?.message ?? "اطلاعات واردشده معتبر نیست.",
      field: issue?.path[0] as keyof AccountFormValues | undefined,
    };
  }

  const { fullName, phoneNumber, nationalId, dateOfBirth } = parsed.data;

  // تاریخ تولد در فرم جلالی است؛ بک‌اند میلادی (`YYYY-MM-DD`) می‌خواهد.
  // خالی یعنی «پاک کن» → null.
  let isoDateOfBirth: string | null = null;
  if (dateOfBirth !== "") {
    isoDateOfBirth = jalaliToIsoDate(dateOfBirth);
    if (!isoDateOfBirth) {
      return { ok: false, message: "تاریخ تولد معتبر نیست.", field: "dateOfBirth" };
    }
  }

  let res: Response;
  try {
    res = await authFetch("user/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        // رشته‌ی خالی یعنی پاک‌کردن مقدار (قرارداد PATCH بک‌اند).
        phoneNumber: phoneNumber === "" ? null : phoneNumber,
        nationalId: nationalId === "" ? null : nationalId,
        dateOfBirth: isoDateOfBirth,
      }),
      cache: "no-store",
    });
  } catch {
    return { ok: false, message: "ارتباط با سرور برقرار نشد." };
  }

  if (!res.ok) {
    const json = (await res.json().catch(() => null)) as ApiErrorResponse | null;

    if (res.status === 409) {
      return {
        ok: false,
        message: "این کد ملی قبلاً برای حساب دیگری ثبت شده است.",
        field: "nationalId",
      };
    }
    if (res.status === 401) {
      return { ok: false, message: "نشست شما منقضی شده است؛ دوباره وارد شوید." };
    }
    return { ok: false, message: json?.message ?? "ذخیره تغییرات ناموفق بود. دوباره تلاش کنید." };
  }

  revalidatePath("/account/settings");
  return { ok: true, message: "تغییرات با موفقیت ذخیره شد." };
}
