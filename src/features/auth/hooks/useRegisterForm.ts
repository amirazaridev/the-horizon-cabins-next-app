"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";

import { getRegisterStepIndex, REGISTER_STEPS } from "../constants/register-steps";
import {
  AUTH_LIMITS,
  AUTH_MESSAGES,
  normalizeDigits,
  normalizeText,
  registerPasswordSchema,
  registerStepOneSchema,
  registerVerificationSchema,
  type RegisterPasswordValues,
  type RegisterStepOneValues,
  type RegisterVerificationValues,
} from "../schemas";
import { registerAction } from "../actions/auth.actions";
import { requestOtpAction, verifyOtpAction } from "../actions/otp.actions";
import type { AuthError, RegisterStep } from "../types/auth.types";
import { useAsyncAction } from "./useAsyncAction";
import { useResendTimer } from "./useResendTimer";
import { useStepTransition } from "./useStepTransition";

type Options = {
  onSuccess?: (redirectTo: string) => void;
};

export function useRegisterForm({ onSuccess }: Options = {}) {

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
  const [resendSeconds, setResendSeconds] = useState<number>(AUTH_LIMITS.resendSeconds);
  const [identity, setIdentity] = useState<RegisterStepOneValues>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [credentials, setCredentials] = useState({ password: "" });

  const action = useAsyncAction();

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
    seconds: resendSeconds,
    startedAt: codeSentAt,
  });

  const sendCode = useCallback(
    async (email: string, isResend: boolean) => {
      void isResend;
      setFormError(null);

      const result = await action.run("sendingCode", () =>
        requestOtpAction(email, "signup"),
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
      setResendSeconds(result.data.resendAfterSeconds);
      verificationForm.reset({ code: "" });

      return true;
    },
    [action, goTo, identityForm, verificationForm],
  );

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

  const submitPassword = passwordForm.handleSubmit(async (values) => {
    setFormError(null);
    setCredentials({ password: values.password });

    const sent = await sendCode(identity.email, false);
    if (!sent) return;

    setMaxReached((current) => Math.max(current, 2));
    next();
  });

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

      // مرحله‌ی ۱: بررسی کد تایید و گرفتن توکن یک‌بارمصرف.
      const verified = await action.run("verifyingCode", () =>
        verifyOtpAction(identity.email, normalizeDigits(code), "signup"),
      );

      if (!verified.ok) {
        verificationForm.setError("code", { message: verified.error.message });
        return false;
      }

      // مرحله‌ی ۲: ساخت حساب با توکن تایید.
      const registered = await action.run("registering", () =>
        registerAction({
          fullName: `${normalizeText(identity.firstName)} ${normalizeText(identity.lastName)}`.trim(),
          email: identity.email,
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

      onSuccess?.(registered.redirectTo);
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
