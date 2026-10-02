"use client";

import { useCallback, useState } from "react";

/**
 * شناسه‌ی عملیات‌های async در فرم‌های احراز هویت.
 *
 * ⭐ چرا یک union و نه چند boolean؟
 * `RegisterForm` قبلاً یک `isSendingCode` داشت که برای سه معنای مختلف
 * استفاده می‌شد: «ارسال کد»، «بررسی کد» و «ساخت حساب». نتیجه‌اش بوی کد
 * بود: دکمه‌ی مرحله‌ی رمز با وجود `isSendingCode` تصمیم می‌گرفت متن
 * «در حال ساخت حساب...» را بگذارد، و اگر فردا عملیات چهارمی اضافه می‌شد
 * کسی نمی‌فهمید کدام boolean به کدام قسمت مربوط است.
 *
 * با این union، هر مصرف‌کننده دقیقاً می‌پرسد «آیا عملیات X در جریان است؟»
 * و کامپایلر هم چک می‌کند نام عملیات درست است.
 */
export type AuthAction =
  | "sendingCode"
  | "verifyingCode"
  | "registering"
  | "loggingIn";

type UseAsyncActionResult<TAction extends string> = {
  /** عملیات در جریان، یا `null` وقتی همه چیز بیکار است. */
  pending: TAction | null;
  /** آیا عملیات مشخصی در جریان است؟ */
  is: (action: TAction) => boolean;
  /** آیا هیچ عملیاتی در جریان است؟ — برای disable کردن کل فرم. */
  isAnyPending: boolean;
  /**
   * اجرای یک عملیات async با مدیریت خودکار وضعیت.
   * خطاها عمداً این‌جا گرفته نمی‌شوند: لایه‌ی سرویس `AuthResult` برمی‌گرداند
   * و فرم باید بتواند نتیجه‌ی ناموفق را روی فیلد بنشاند. هر خطای غیرمنتظره
   * هم به `finally` می‌رسد و وضعیت loading را پاک می‌کند.
   */
  run: <T>(action: TAction, task: () => Promise<T>) => Promise<T>;
};

/**
 * مدیریت وضعیت چند عملیات async در یک فرم.
 *
 * ⚠️ چرا `run` با `try/finally` و نه دو `setPending` جدا؟
 * اگر درخواست throw کند (قطع شبکه، لغو با AbortSignal)، بدون `finally`
 * وضعیت روی «در جریان» گیر می‌کرد و دکمه‌ها تا رفرش صفحه قفل می‌ماندند.
 */
export function useAsyncAction<TAction extends string = AuthAction>(): UseAsyncActionResult<TAction> {
  const [pending, setPending] = useState<TAction | null>(null);

  const run = useCallback(
    async <T,>(action: TAction, task: () => Promise<T>): Promise<T> => {
      setPending(action);
      try {
        return await task();
      } finally {
        setPending(null);
      }
    },
    [],
  );

  const is = useCallback((action: TAction) => pending === action, [pending]);

  return { pending, is, isAnyPending: pending !== null, run };
}
