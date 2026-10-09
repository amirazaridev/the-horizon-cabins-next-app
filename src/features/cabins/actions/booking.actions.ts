"use server";

import { authFetch } from "@/libs/api/authFetch";
import { getCurrentUser } from "@/features/auth/services/session.service";
import { getGuestAccountProfile } from "@/features/guest/account/services/account.service";
import {
  getMissingBookingFields,
  type BookingRequiredField,
} from "@/features/guest/account/lib/profile-completeness";

/**
 * Server Action ثبت رزرو — پل بین دکمه‌ی «رزرو» صفحه‌ی ویلا و
 * `POST /bookings` بک‌اند.
 *
 * ⚠️ چرا Server Action و نه fetch از مرورگر؟ چون مرورگر هرگز مستقیم با
 * Express حرف نمی‌زند (الگوی BFF) و توکن هم در کوکی httpOnly است؛
 * `authFetch` فقط سمت سرور آن را می‌خواند.
 *
 * ⚠️ **تبدیل تاریخ:** ورودی این اکشن باید تاریخ **میلادی** `YYYY-MM-DD`
 * باشد. تقویم صفحه شمسی است ولی مقدار زیرینش `Date` میلادی است و با
 * `toDateKey()` به همین قالب تبدیل می‌شود؛ پس اینجا هیچ تبدیل شمسی↔میلادی
 * لازم نیست (قالب ورودی دقیقاً همان چیزی است که `dateOnlySchema` بک‌اند
 * می‌پذیرد).
 */

export type CreateBookingInput = {
  cabinId: number;
  /** تاریخ ورود میلادی `YYYY-MM-DD`. */
  startDate: string;
  /** تاریخ خروج میلادی `YYYY-MM-DD`. */
  endDate: string;
  numGuests: number;
};

export type CreateBookingResult =
  /** رزرو ساخته شد — شناسه‌اش برمی‌گردد. */
  | { status: "created"; bookingId: number }
  /** کاربر وارد نشده است؛ کلاینت باید به صفحه‌ی ورود برود. */
  | { status: "needs-auth" }
  /** پروفایل کاربر برای رزرو کامل نیست؛ کلاینت باید به تنظیمات برود. */
  | { status: "needs-profile"; missing: BookingRequiredField[] }
  | { status: "error"; message: string; code?: string };

/**
 * ترجمه‌ی کدهای خطای بک‌اند به پیام فارسی قابل‌فهم.
 *
 * ⚠️ کلیدها آینه‌ی `ErrorCode` بک‌اند هستند (`constants/errorCodes.ts`).
 * هر کدی که اینجا نباشد، به پیام خود سرور برمی‌گردد.
 */
const ERROR_MESSAGES: Record<string, string> = {
  BOOKING_DATE_OVERLAP:
    "این بازه دیگر آزاد نیست؛ صفحه را تازه کنید و تاریخ دیگری انتخاب کنید.",
  BOOKING_PENDING_LIMIT_EXCEEDED:
    "تعداد رزروهای «در انتظار پرداخت» شما به سقف رسیده است. اول یکی از آن‌ها را پرداخت یا لغو کنید.",
  BOOKING_GUEST_CAPACITY_EXCEEDED:
    "تعداد نفرات از ظرفیت این اقامتگاه بیشتر است.",
  BOOKING_INVALID_DATE_RANGE:
    "بازه‌ی انتخاب‌شده برای رزرو معتبر نیست (طول اقامت یا افق رزرو).",
  BOOKING_TOTAL_OVERFLOW: "مبلغ این اقامت از محدوده‌ی پشتیبانی‌شده بیشتر است.",
  FORBIDDEN: "این حساب کاربری امکان ثبت رزرو ندارد.",
};

export async function createBookingAction(
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  const user = await getCurrentUser();
  if (!user) return { status: "needs-auth" };

  //* رزرو فقط با حساب مهمان معنا دارد (admin/owner پروفایل مهمان ندارند و
  //* بک‌اند هم با ۴۰۳ ردشان می‌کند).
  if (user.role !== "guest") {
    return {
      status: "error",
      message: "ثبت رزرو فقط با حساب کاربری مهمان امکان‌پذیر است.",
      code: "FORBIDDEN",
    };
  }

  //* پروفایل از همان سرویس صفحه‌ی تنظیمات خوانده می‌شود تا قاعده‌ی
  //* «کامل بودن» یک‌جا بماند.
  const profile = await getGuestAccountProfile();
  if (!profile) {
    return {
      status: "error",
      message: "اطلاعات حساب شما در دسترس نیست؛ دوباره تلاش کنید.",
    };
  }

  const missing = getMissingBookingFields(profile);
  if (missing.length > 0) return { status: "needs-profile", missing };

  let res: Response;
  try {
    res = await authFetch("bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      //* ⚠️ `expectedTotalPrice` عمداً فرستاده **نمی‌شود**: تقویم از read-model
      //* ذخیره‌شده (`CabinDailyPrice`) خوانده می‌شود و اگر آن جدول با قواعد
      //* زنده یک لحظه واگرا باشد، ارسال این مقدار رزرو کاربر را بی‌دلیل با
      //* ۴۰۹ PRICE_CHANGED رد می‌کند. جمع نهایی را خودِ سرور محاسبه و در
      //* صفحه‌ی پرداخت نمایش می‌دهد.
      body: JSON.stringify({
        cabinId: input.cabinId,
        startDate: input.startDate,
        endDate: input.endDate,
        numGuests: input.numGuests,
      }),
      cache: "no-store",
    });
  } catch {
    return { status: "error", message: "ارتباط با سرور برقرار نشد." };
  }

  const json = (await res.json().catch(() => null)) as {
    status?: "success" | "fail" | "error";
    code?: string;
    message?: string;
    data?: { booking?: { id: number } };
  } | null;

  const bookingId = json?.data?.booking?.id;
  if (res.ok && json?.status === "success" && typeof bookingId === "number") {
    return { status: "created", bookingId };
  }

  const code = json?.code;
  return {
    status: "error",
    code,
    message:
      (code && ERROR_MESSAGES[code]) ||
      json?.message ||
      "ثبت رزرو ناموفق بود. دوباره تلاش کنید.",
  };
}
