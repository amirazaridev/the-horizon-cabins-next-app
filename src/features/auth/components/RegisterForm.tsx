"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import Button from "@/components/ui/Button";
import { REGISTER_STEPS } from "../constants/register-steps";
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
} from "../schemas/auth.schema";
import {
  registerAccount,
  sendVerificationCode,
  verifyEmailCode,
} from "../services/auth.service";
import { formatDuration, useResendTimer } from "../hooks/useResendTimer";
import { useStepTransition } from "../hooks/useStepTransition";
import type { AuthError, RegisterStep } from "../types/auth.types";
import Checkbox from "./Checkbox";
import FormContainer from "./FormContainer";
import Input from "./Input";
import OtpInput from "./OtpInput";
import PasswordStrength from "./PasswordStrength";
import Stepper from "./Stepper";

/**
 * فرم ثبت‌نام سه‌مرحله‌ای.
 *
 * معماری: برای هر مرحله یک `useForm` جدا با اسکیمای همان مرحله.
 *
 * ⚠️ چرا یک فرم واحد با شرط‌های مرحله‌ای نه؟
 * چون هر مرحله قرارداد اعتبارسنجی خودش را دارد و یک فرم واحد مجبور می‌شد
 * در هر «بعدی» فیلدهای مراحل دیگر را هم چک کند. اما برای عبور از مرحله
 * باید فیلدهای مراحل قبلی هم *معتبر بمانند* (کاربر می‌تواند برگردد و
 * ایمیل را خراب کند) ⇒ درست همین‌جاست که `goNext` اعتبارسنجی مراحل
 * قبلی را هم دوباره اجرا می‌کند.
 *
 * داده در `useState` والد نگه داشته می‌شود، نه در فرم‌ها؛ پس برگشت به
 * مرحله‌ی قبل مقادیر را از دست نمی‌دهد.
 */
export default function RegisterForm(): ReactNode {
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
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSentAt, setCodeSentAt] = useState<number | null>(null);
  const [isDone, setIsDone] = useState(false);

  const [identity, setIdentity] = useState<RegisterStepOneValues>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [verification, setVerification] = useState<RegisterVerificationValues>({
    code: "",
  });
  const [credentials, setCredentials] = useState<RegisterPasswordValues>({
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  /* ---------------------------------------------------------------- */
  /* فرم‌ها                                                             */
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
    defaultValues: verification,
  });

  const passwordForm = useForm<RegisterPasswordValues>({
    resolver: zodResolver(registerPasswordSchema) as Resolver<RegisterPasswordValues>,
    mode: "onTouched",
    defaultValues: credentials,
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
      setIsSendingCode(true);
      setFormError(null);

      const result = await sendVerificationCode(email);
      setIsSendingCode(false);

      if (!result.ok) {
        if (result.error.field === "email") {
          identityForm.setError("email", { message: result.error.message });
        }
        setFormError(result.error);
        return false;
      }

      setCodeSentAt(Date.now());
      verificationForm.reset({ code: "" });
      setVerification({ code: "" });

      if (!isResend && process.env.NODE_ENV !== "production") {
        // فقط برای تست محلی — در بک‌اند واقعی هرگز کد را به کلاینت نفرستید.
        console.info(`[auth:mock] کد تایید: ${result.data.devCode}`);
      }

      return true;
    },
    [identityForm, verificationForm],
  );

  /* ---------------------------------------------------------------- */
  /* جابه‌جایی مراحل                                                     */
  /* ---------------------------------------------------------------- */

  /** اعتبارسنجی مراحل قبلی قبل از هر عبور به جلو. */
  const previousStepsAreValid = useCallback(async () => {
    const checks: Array<Promise<boolean>> = [
      identityForm.trigger(),
    ];

    if (step === "verification" || step === "password") {
      checks.push(verificationForm.trigger());
    }

    const results = await Promise.all(checks);
    return results.every(Boolean);
  }, [identityForm, step, verificationForm]);

  /** مرحله ۱ → ۲ */
  const handleIdentitySubmit = identityForm.handleSubmit(async (values) => {
    const normalized = {
      firstName: normalizeText(values.firstName),
      lastName: normalizeText(values.lastName),
      email: normalizeText(values.email).toLowerCase(),
    };

    setIdentity(normalized);

    const emailChanged = normalized.email !== identity.email;
    const alreadySent = codeSentAt !== null && !emailChanged;

    if (!alreadySent) {
      const sent = await sendCode(normalized.email, false);
      if (!sent) return;
    }

    setMaxReached((current) => Math.max(current, 1));
    next();
  });

  /** مرحله ۳ → پایان */
  const handlePasswordSubmit = passwordForm.handleSubmit(async (values) => {
    setFormError(null);

    const previousValid = await previousStepsAreValid();
    if (!previousValid) {
      setFormError({
        code: "UNKNOWN",
        message: "اطلاعات مراحل قبلی ناقص است. لطفاً آن‌ها را کامل کنید.",
      });
      return;
    }

    const result = await registerAccount({
      ...identity,
      password: values.password,
    });

    if (!result.ok) {
      if (result.error.field === "password") {
        passwordForm.setError("password", { message: result.error.message });
      }
      setFormError(result.error);
      return;
    }

    setCredentials(values);
    // ⚠️ TODO(backend): ذخیره‌ی نشست و هدایت به مقصد.
    setIsDone(true);
  });

  /* ---------------------------------------------------------------- */
  /* ویزارد دکمه‌ها                                                     */
  /* ---------------------------------------------------------------- */

  const handleNext = useCallback(async () => {
    if (isTransitioning) return;

    if (step === "identity") {
      await handleIdentitySubmit();
      return;
    }

    if (step === "verification") {
      const valid = await verificationForm.trigger();
      if (!valid) return;

      const code = normalizeText(verificationForm.getValues("code") ?? "");
      setIsSendingCode(true);
      const result = await verifyEmailCode({ email: identity.email, code });
      setIsSendingCode(false);

      if (!result.ok) {
        verificationForm.setError("code", { message: result.error.message });
        return;
      }

      setMaxReached((current) => Math.max(current, 2));
      next();
    }
  }, [handleIdentitySubmit, identity.email, isTransitioning, next, step, verificationForm]);

  const handleBack = useCallback(() => {
    if (isTransitioning) return;
    setFormError(null);
    back();
  }, [back, isTransitioning]);

  const handleResend = useCallback(async () => {
    if (resendTimer.isLocked || isSendingCode) return;
    setFormError(null);
    await sendCode(identity.email, true);
  }, [identity.email, isSendingCode, resendTimer.isLocked, sendCode]);

  const handleStepClick = useCallback(
    (target: RegisterStep) => {
      if (isTransitioning) return;
      const targetIndex = REGISTER_STEPS.findIndex((item) => item.id === target);
      if (targetIndex < 0 || targetIndex > maxReached || targetIndex === stepIndex)
        return;

      // وقتی به مرحله‌ی ۱ برمی‌گردیم، کد مرحله‌ی ۲ را نگه می‌داریم تا
      // اگر کاربر فقط ایمیل را نگاه کند، مجبور به ارسال مجدد نشود.
      setFormError(null);
      goTo(targetIndex);
    },
    [goTo, isTransitioning, maxReached, stepIndex],
  );

  const stepMeta = useMemo(() => REGISTER_STEPS[stepIndex], [stepIndex]);

  const isBusy = isSendingCode || isTransitioning || isDone;
  const currentError = formError?.message;

  return (
    <FormContainer
      for="register"
      title={stepMeta.title}
      description={stepMeta.description}
    >
      <div className="mb-6">
        <Stepper current={step} maxReached={maxReached} onStepClick={handleStepClick} />
      </div>

      {currentError && (
        <div
          role="alert"
          className="border-danger-strong/30 bg-danger/8 text-danger mb-4 flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed"
        >
          <AlertCircle className="mt-px size-4 shrink-0" />
          {currentError}
        </div>
      )}

      <div
        key={step}
        data-direction={direction === 1 ? "forward" : "backward"}
        className={`transition-all duration-300 ${
          isTransitioning
            ? direction === 1
              ? "-translate-x-3 opacity-0"
              : "translate-x-3 opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        {step === "identity" && (
          <form onSubmit={handleIdentitySubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="نام"
                autoComplete="given-name"
                placeholder="مثلاً علی"
                icon={<User className="size-5" />}
                error={identityForm.formState.errors.firstName?.message}
                disabled={isBusy}
                clearable
                onClear={() => identityForm.setValue("firstName", "", { shouldDirty: true })}
                {...identityForm.register("firstName")}
              />
              <Input
                label="نام خانوادگی"
                autoComplete="family-name"
                placeholder="مثلاً رضایی"
                icon={<User className="size-5" />}
                error={identityForm.formState.errors.lastName?.message}
                disabled={isBusy}
                clearable
                onClear={() => identityForm.setValue("lastName", "", { shouldDirty: true })}
                {...identityForm.register("lastName")}
              />
            </div>

            <Input
              label="ایمیل"
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder="you@example.com"
              icon={<Mail className="size-5" />}
              error={identityForm.formState.errors.email?.message}
              hint="کد تایید به این ایمیل ارسال می‌شود."
              disabled={isBusy}
              {...identityForm.register("email")}
            />

            <Button
              type="submit"
              shape="xl"
              fullWidth
              disabled={isBusy}
              className="mt-2"
            >
              {isSendingCode ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  در حال ارسال کد...
                </>
              ) : (
                <>
                  ارسال کد تایید
                  <ArrowRight className="size-5 rotate-180" />
                </>
              )}
            </Button>
          </form>
        )}

        {step === "verification" && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleNext();
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
                onClick={() => handleStepClick("identity")}
                disabled={isBusy}
                className="text-primary-400/80 hover:text-primary-400 shrink-0 text-xs font-medium transition-colors duration-300 disabled:opacity-50"
              >
                ویرایش
              </button>
            </div>

            <OtpInput
              length={AUTH_LIMITS.otpLength}
              value={codeValue}
              onChange={(code) =>
                verificationForm.setValue("code", code, {
                  shouldValidate: code.length === AUTH_LIMITS.otpLength,
                  shouldDirty: true,
                })
              }
              onComplete={() => void verificationForm.trigger()}
              error={verificationForm.formState.errors.code?.message}
              disabled={isBusy}
              autoSubmitPending={isSendingCode}
            />

            {/* تایمر ارسال مجدد */}
            <div className="flex items-center justify-between gap-3 pt-1">
              {resendTimer.isLocked ? (
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="text-text/45 text-xs whitespace-nowrap">
                    ارسال مجدد تا{" "}
                    <span className="text-text/70 font-semibold tabular-nums">
                      {formatDuration(resendTimer.remaining)}
                    </span>
                  </span>
                  {/* نوار پیشرفت تایمر — بصری و بدون متن اضافه */}
                  <span
                    className="bg-foreground/8 relative h-1 min-w-8 flex-1 overflow-hidden rounded-full"
                    role="presentation"
                  >
                    <span
                      className="bg-primary-400/60 absolute inset-y-0 inset-s-0 rounded-full transition-[width] duration-500 ease-linear"
                      style={{ width: `${resendTimer.progress * 100}%` }}
                    />
                  </span>
                </div>
              ) : (
                <span className="text-text/45 text-xs">کد را دریافت نکردید؟</span>
              )}

              <button
                type="button"
                onClick={() => void handleResend()}
                disabled={resendTimer.isLocked || isSendingCode}
                className="text-primary-400 hover:text-primary-300 flex shrink-0 items-center gap-1.5 text-xs font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSendingCode ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="size-3.5" />
                )}
                ارسال مجدد کد
              </button>
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                shape="xl"
                onClick={handleBack}
                disabled={isBusy}
                className="flex-none px-5"
              >
                بازگشت
              </Button>
              <Button type="submit" shape="xl" fullWidth disabled={isBusy}>
                {isSendingCode ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    در حال بررسی...
                  </>
                ) : (
                  "تایید کد"
                )}
              </Button>
            </div>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} noValidate className="space-y-4">
            <div>
              <Input
                label="رمز عبور"
                type="password"
                dir="ltr"
                autoComplete="new-password"
                placeholder="••••••••"
                icon={<Lock className="size-5" />}
                error={passwordForm.formState.errors.password?.message}
                disabled={isBusy}
                {...passwordForm.register("password")}
              />
              <PasswordStrength password={passwordValue} className="mt-3" />
            </div>

            <Input
              label="تکرار رمز عبور"
              type="password"
              dir="ltr"
              autoComplete="new-password"
              placeholder="••••••••"
              icon={<Shield className="size-5" />}
              error={passwordForm.formState.errors.confirmPassword?.message}
              disabled={isBusy}
              {...passwordForm.register("confirmPassword")}
            />

            <Checkbox
              {...passwordForm.register("acceptedTerms")}
              disabled={isBusy}
              error={passwordForm.formState.errors.acceptedTerms?.message}
            >
              قوانین و مقررات{" "}
              <a
                href="#"
                className="text-primary-400/80 hover:text-primary-400 font-medium"
              >
                هورایزن کابینز
              </a>{" "}
              را می‌پذیرم
            </Checkbox>

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                shape="xl"
                onClick={handleBack}
                disabled={isBusy}
                className="flex-none px-5"
              >
                بازگشت
              </Button>
              <Button type="submit" shape="xl" fullWidth disabled={isBusy}>
                {isDone ? (
                  <>
                    <ShieldCheck className="size-5" />
                    حساب ساخته شد
                  </>
                ) : isSendingCode ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    در حال ساخت حساب...
                  </>
                ) : (
                  "ایجاد حساب کاربری"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>

      {step !== "identity" && (
        <p className="text-text/35 mt-4 text-center text-[11px] leading-relaxed">
          {step === "verification"
            ? AUTH_MESSAGES.otpLength()
            : "با ساخت حساب، امنیت رزروهای شما تضمین می‌شود."}
        </p>
      )}
    </FormContainer>
  );
}
