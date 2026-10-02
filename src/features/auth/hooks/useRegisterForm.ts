"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";

import { getRegisterStepIndex, REGISTER_STEPS } from "../constants/register-steps";
import {
  AUTH_LIMITS,
  AUTH_MESSAGES,
  normalizeText,
  registerPasswordSchema,
  registerStepOneSchema,
  registerVerificationSchema,
  type RegisterPasswordValues,
  type RegisterStepOneValues,
  type RegisterVerificationValues,
} from "../schemas";
import {
  registerAccount,
  sendVerificationCode,
  verifyEmailCode,
} from "../services/auth.service";
import type { AuthError, RegisterStep } from "../types/auth.types";
import { useAsyncAction } from "./useAsyncAction";
import { useResendTimer } from "./useResendTimer";
import { useStepTransition } from "./useStepTransition";

/**
 * تمام منطق فرم ثبت‌نام سه‌مرحله‌ای.
 *
 * ⚠️ چرا برای هر مرحله یک `useForm` جدا؟
 * چون هر مرحله قرارداد اعتبارسنجی خودش را دارد (`react-hook-form` یک
 * resolver در سطح فرم می‌پذیرد) و یک فرم واحد مجبور می‌شد در هر «بعدی»
 * فیلدهای مراحل دیگر را هم چک کند. اما برای عبور از مرحله باید فیلدهای
 * مراحل قبلی هم *معتبر بمانند* (کاربر می‌تواند برگردد و ایمیل را خراب
 * کند) ⇒ درست همین‌جاست که `goNext` اعتبارسنجی مراحل قبلی را دوباره
 * اجرا می‌کند.
 *
 * ⚠️ چرا داده در `useState` این هوک است و نه در فرم‌ها؟
 * فرم‌ها هنگام unmount شدن با تغییر مرحله از DOM می‌روند؛ اگر داده فقط
 * در آن‌ها بود، برگشت به مرحله‌ی قبل مقدارها را از دست می‌داد.
 *
 * ⚠️ چرا `useWatch` و نه `form.watch()`؟
 * `form.watch()` در این پروژه هشدار `react-hooks/incompatible-library`
 * می‌گیرد (خواندن state حین رندر از یک کتابخانه‌ی خارجی) و هر تایپ
 * کاراکتر کل فرم را رندر می‌کند. `useWatch` اشتراک‌محور است.
 */

type Options = {
  /** فراخوانی بعد از ساخت موفق حساب. */
  onSuccess?: () => void;
};

export function useRegisterForm({ onSuccess }: Options = {}) {
  /* ---------------------------------------------------------------- */
  /* ویزارد مراحل                                                       */
  /* ---------------------------------------------------------------- */

  const {
    step: stepIndex,
    direction,
    isTransitioning,
    next,
    back,
    goTo,
  } = useStepTransition({ total: REGISTER_STEPS.length });

  const step = REGISTER_STEPS[stepIndex].id;

  const [maxReached, setMaxReached] = useState(0);
  const [formError, setFormError] = useState<AuthError | null>(null);
  const [codeSentAt, setCodeSentAt] = useState<number | null>(null);
  const [identity, setIdentity] = useState<RegisterStepOneValues>({
    firstName: "",
    lastName: "",
    email: "",
  });
  /**
   * رمز عبور مرحله‌ی ۲ تا لحظه‌ی ساخت حساب در پایان نگه داشته می‌شود.
   * عمداً فقط رمز است و نه کل مقادیر فرم: `confirmPassword` و
   * `acceptedTerms` بعد از اعتبارسنجی دیگر مصرفی ندارند.
   */
  const [credentials, setCredentials] = useState({ password: "" });

  const action = useAsyncAction();

  /* ---------------------------------------------------------------- */
  /* فرم‌های هر مرحله                                                   */
  /* ---------------------------------------------------------------- */

  const identityForm = useForm<RegisterStepOneValues>({
    resolver: zodResolver(registerStepOneSchema) as Resolver<RegisterStepOneValues>,
    mode: "onTouched",
    defaultValues: identity,
  });

  const verificationForm = useForm<RegisterVerificationValues>({
    resolver: zodResolver(
      registerVerificationSchema,
    ) as Resolver<RegisterVerificationValues>,
    mode: "onTouched",
    defaultValues: { code: "" },
  });

  const passwordForm = useForm<RegisterPasswordValues>({
    resolver: zodResolver(registerPasswordSchema) as Resolver<RegisterPasswordValues>,
    mode: "onTouched",
    defaultValues: { password: "", confirmPassword: "", acceptedTerms: false },
  });

  const passwordValue =
    useWatch({ control: passwordForm.control, name: "password" }) ?? "";
  const codeValue =
    useWatch({ control: verificationForm.control, name: "code" }) ?? "";

  const resendTimer = useResendTimer({
    seconds: AUTH_LIMITS.resendSeconds,
    startedAt: codeSentAt,
  });

  /* ---------------------------------------------------------------- */
  /* ارسال کد تایید                                                     */
  /* ---------------------------------------------------------------- */

  const sendCode = useCallback(
    async (email: string, isResend: boolean) => {
      setFormError(null);

      const result = await action.run("sendingCode", () =>
        sendVerificationCode(email),
      );

      if (!result.ok) {
        // خطای گره‌خورده به ایمیل → روی همان فیلد، نه بنر کلی.
        if (result.error.field === "email") {
          identityForm.setError("email", { message: result.error.message });
          setMaxReached(0);
          goTo(getRegisterStepIndex("identity"));
          return false;
        }
        setFormError(result.error);
        return false;
      }

      setCodeSentAt(Date.now());
      verificationForm.reset({ code: "" });

      if (!isResend && process.env.NODE_ENV !== "production") {
        // فقط برای تست محلی — در بک‌اند واقعی هرگز کد را به کلاینت نفرستید.
        console.info(`[auth:mock] کد تایید: ${result.data.devCode}`);
      }

      return true;
    },
    [action, identityForm, verificationForm],
  );

  /* ---------------------------------------------------------------- */
  /* جابه‌جایی مراحل                                                     */
  /* ---------------------------------------------------------------- */

  /**
   * اعتبارسنجی همه‌ی مراحل قبل از مرحله‌ی جاری.
   *
   * ⭐ عمداً بر اساس **ترتیب** کار می‌کند نه شناسه‌های هاردکدشده. قبلاً این
   * تابع می‌گفت «اگر در مرحله‌ی verification یا password هستیم، فرم تایید
   * را هم چک کن» که با جابه‌جایی مراحل بی‌سروصدا غلط می‌شد. حالا با
   * `getRegisterStepIndex` هر فرمی که اندیسش کمتر از مرحله‌ی جاری است
   * اعتبارسنجی می‌شود؛ پس ترتیب مراحل هر چه باشد درست می‌ماند.
   */
  const previousStepsAreValid = useCallback(async () => {
    const checks: Array<Promise<boolean>> = [];

    if (getRegisterStepIndex("identity") < stepIndex) {
      checks.push(identityForm.trigger());
    }
    if (getRegisterStepIndex("password") < stepIndex) {
      checks.push(passwordForm.trigger());
    }
    if (getRegisterStepIndex("verification") < stepIndex) {
      checks.push(verificationForm.trigger());
    }

    const results = await Promise.all(checks);
    return results.every(Boolean);
  }, [identityForm, passwordForm, stepIndex, verificationForm]);

  /**
   * مرحله‌ی ۱ (اطلاعات شخصی) → مرحله‌ی ۲ (رمز عبور).
   *
   * ⚠️ نکته‌ی مهم جریان جدید: این‌جا **کدی ارسال نمی‌شود**. ارسال کد حالا
   * وظیفه‌ی آخرین مرحله است، چون تا وقتی کاربر رمز عبورش را نساخته،
   * ارسال ایمیل تاییدیه بی‌معناست (حساب هنوز قابل فعال‌سازی نیست).
   * تنها کاری که می‌کنیم نگه‌داشتن هویت نرمال‌شده برای مرحله‌های بعد است.
   */
  const submitIdentity = identityForm.handleSubmit(async (values) => {
    const normalized = {
      firstName: normalizeText(values.firstName),
      lastName: normalizeText(values.lastName),
      email: normalizeText(values.email).toLowerCase(),
    };

    const emailChanged = normalized.email !== identity.email;
    setIdentity(normalized);

    // اگر ایمیل عوض شده، کد قبلی (اگر بود) دیگر معتبر نیست.
    if (emailChanged && codeSentAt !== null) {
      setCodeSentAt(null);
      verificationForm.reset({ code: "" });
    }

    setFormError(null);
    setMaxReached((current) => Math.max(current, 1));
    next();
  });

  /**
   * مرحله‌ی ۲ (رمز عبور) → مرحله‌ی ۳ (تایید ایمیل).
   *
   * این‌جا رمز فقط در state نگه داشته می‌شود و **حساب ساخته نمی‌شود**؛
   * ساخت حساب در پایان و بعد از تایید کد انجام می‌شود تا اگر کاربر کد
   * را وارد نکرد، هیچ حساب نیمه‌کاری در سرور ساخته نشود.
   */
  const submitPassword = passwordForm.handleSubmit(async (values) => {
    setFormError(null);
    setCredentials({ password: values.password });

    const sent = await sendCode(identity.email, false);
    if (!sent) return;

    setMaxReached((current) => Math.max(current, 2));
    next();
  });

  /**
   * مرحله‌ی ۳ (تایید ایمیل) → پایان.
   *
   * شاه‌کلید: کد تایید می‌شود و **در همان لحظه** حساب با هویت و رمزی که
   * در مراحل قبل جمع شده ساخته می‌شود. اگر کاربر بین راه برگردد و ایمیل
   * یا رمز را عوض کند، `previousStepsAreValid` جلوی ارسال با داده‌ی
   * نامعتبر را می‌گیرد.
   */
  const submitVerification = useCallback(
    async (code: string) => {
      setFormError(null);

      if (!(await previousStepsAreValid())) {
        setFormError({
          code: "UNKNOWN",
          message: AUTH_MESSAGES.previousStepsIncomplete,
        });
        return false;
      }

      const verified = await action.run("verifyingCode", () =>
        verifyEmailCode({ email: identity.email, code: normalizeText(code) }),
      );

      if (!verified.ok) {
        verificationForm.setError("code", { message: verified.error.message });
        return false;
      }

      const registered = await action.run("registering", () =>
        registerAccount({
          ...identity,
          password: credentials.password,
          verificationToken: verified.data.verificationToken,
        }),
      );

      if (!registered.ok) {
        if (registered.error.field === "code") {
          verificationForm.setError("code", { message: registered.error.message });
          return false;
        }
        if (registered.error.field === "password") {
          passwordForm.setError("password", { message: registered.error.message });
        }
        setFormError(registered.error);
        return false;
      }

      // ⚠️ TODO(backend): ذخیره‌ی نشست (کوکی/httpOnly) و هدایت به مقصد.
      onSuccess?.();
      return true;
    },
    [
      action,
      credentials.password,
      identity,
      onSuccess,
      passwordForm,
      previousStepsAreValid,
      verificationForm,
    ],
  );

  /* ---------------------------------------------------------------- */
  /* هندلرهای ناوبری                                                    */
  /* ---------------------------------------------------------------- */

  /**
   * «بعدی» — بسته به مرحله به یکی از تابع‌های ارسال می‌رسد.
   *
   * ⚠️ مرحله‌ی آخر (`verification`) عمداً این‌جا نیست: آن‌جا خودِ
   * `submitVerification` هم کد را چک می‌کند و هم حساب را می‌سازد، پس
   * با submit فرم صدا زده می‌شود، نه با دکمه‌ی «بعدی».
   */
  const goNext = useCallback(async () => {
    if (isTransitioning) return;
    if (step === "identity") return submitIdentity();
    if (step === "password") return submitPassword();
    return undefined;
  }, [isTransitioning, step, submitIdentity, submitPassword]);

  const goBack = useCallback(() => {
    if (isTransitioning) return;
    setFormError(null);
    back();
  }, [back, isTransitioning]);

  const resendCode = useCallback(async () => {
    if (resendTimer.isLocked) return;
    await sendCode(identity.email, true);
  }, [identity.email, resendTimer.isLocked, sendCode]);

  /** کلیک روی یک مرحله‌ی گذشته — فقط اگر قبلاً باز شده باشد. */
  const goToStep = useCallback(
    (target: RegisterStep) => {
      if (isTransitioning) return;

      const targetIndex = REGISTER_STEPS.findIndex((item) => item.id === target);
      if (targetIndex < 0 || targetIndex > maxReached || targetIndex === stepIndex) {
        return;
      }

      setFormError(null);
      goTo(targetIndex);
    },
    [goTo, isTransitioning, maxReached, stepIndex],
  );

  /* ---------------------------------------------------------------- */
  /* خروجی                                                              */
  /* ---------------------------------------------------------------- */

  const stepMeta = useMemo(() => REGISTER_STEPS[stepIndex], [stepIndex]);

  return {
    // ویزارد
    step,
    stepIndex,
    stepMeta,
    direction,
    isTransitioning,
    maxReached,
    goNext,
    goBack,
    goToStep,

    // فرم‌ها
    identityForm,
    verificationForm,
    passwordForm,
    identity,
    credentials,
    passwordValue,
    codeValue,

    // ارسال فرم‌ها — آماده‌ی وصل‌شدن مستقیم به `onSubmit`
    submitIdentity,
    submitVerification,
    submitPassword,

    // تایمر
    resendTimer,
    resendCode,

    // وضعیت درخواست
    action,
    isBusy: action.isAnyPending || isTransitioning,
    formError,
  };
}

export type UseRegisterFormReturn = ReturnType<typeof useRegisterForm>;
