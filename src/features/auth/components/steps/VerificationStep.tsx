"use client";

import { Pencil, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { AUTH_LIMITS } from "../../schemas";
import type { UseRegisterFormReturn } from "../../hooks/useRegisterForm";
import OtpResendField from "../OtpResendField";
import StepActions from "../StepActions";

type Props = {
  form: UseRegisterFormReturn;
  /** `true` بعد از ساخت موفق حساب — دکمه به وضعیت تایید می‌رود. */
  isDone?: boolean;
};

/**
 * مرحله‌ی ۳ (پایانی) — تایید ایمیل با کد شش‌رقمی.
 *
 * ⭐ این مرحله در جریان جدید **دروازه‌ی نهایی** است: با تایید کد، هم
 * `verifyEmailCode` و هم `registerAccount` اجرا می‌شوند و حساب ساخته
 * می‌شود. به همین دلیل دکمه‌اش «تایید و ساخت حساب» است، نه فقط «تایید کد».
 *
 * شامل سه بخش: کارت ایمیل مقصد (با «ویرایش» که به مرحله‌ی ۱ برمی‌گردد)،
 * بلوک کد + تایمر ارسال مجدد، و ردیف دکمه‌ها.
 */
export default function VerificationStep({ form, isDone = false }: Props): ReactNode {
  const { identity, verificationForm, codeValue, action, resendTimer, isBusy } = form;
  const isVerifying = action.is("verifyingCode");
  const isRegistering = action.is("registering");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.submitVerification(codeValue);
      }}
      noValidate
      className="space-y-4"
    >
      <div className="bg-foreground/[0.03] border-foreground/8 flex items-start justify-between gap-3 rounded-xl border px-3.5 py-3">
        <div className="min-w-0">
          <p className="text-text/45 text-[11px]">کد ارسال‌شده به</p>
          <p className="text-text truncate text-sm font-semibold" dir="ltr">
            {identity.email}
          </p>
        </div>
        <button
          type="button"
          onClick={() => form.goToStep("identity")}
          disabled={isBusy}
          className="text-primary-400/80 hover:text-primary-400 flex shrink-0 items-center gap-1 text-xs font-medium transition-colors duration-300 disabled:opacity-50"
        >
          <Pencil className="size-3" />
          ویرایش
        </button>
      </div>

      <OtpResendField
        value={codeValue}
        onChange={(code) =>
          verificationForm.setValue("code", code, {
            shouldValidate: code.length === AUTH_LIMITS.otpLength,
            shouldDirty: true,
          })
        }
        onComplete={(code) => void form.submitVerification(code)}
        error={verificationForm.formState.errors.code?.message}
        disabled={isBusy}
        isPending={isVerifying || isRegistering}
        remaining={resendTimer.remaining}
        progress={resendTimer.progress}
        isResendLocked={resendTimer.isLocked}
        onResend={() => void form.resendCode()}
      />

      <StepActions
        label={isDone ? "حساب ساخته شد" : "تایید و ساخت حساب"}
        loadingLabel={isRegistering ? "در حال ساخت حساب..." : "در حال بررسی کد..."}
        isLoading={(isVerifying || isRegistering) && !isDone}
        onBack={form.goBack}
        disabled={isBusy}
        icon={isDone ? <ShieldCheck className="size-5" /> : undefined}
      />
    </form>
  );
}
