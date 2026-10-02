"use client";

import { useState, type ReactNode } from "react";

import { useRegisterForm } from "../hooks/useRegisterForm";
import ErrorBanner from "./ErrorBanner";
import FormContainer from "./FormContainer";
import Stepper from "./Stepper";
import IdentityStep from "./steps/IdentityStep";
import PasswordStep from "./steps/PasswordStep";
import VerificationStep from "./steps/VerificationStep";

//?  فرم ثبت‌نام سه‌مرحله‌ای 
export default function RegisterForm(): ReactNode {
  const [isDone, setIsDone] = useState(false);
  const form = useRegisterForm({ onSuccess: () => setIsDone(true) });
  const { step, stepMeta, direction, isTransitioning, formError } = form;

  return (
    <FormContainer for="register" title={stepMeta.title} description={stepMeta.description}>
      <div className="mb-6">
        <Stepper current={step} maxReached={form.maxReached} onStepClick={form.goToStep} />
      </div>

      <ErrorBanner message={formError?.message} className="mb-4" />

      
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
        {step === "identity" && <IdentityStep form={form} />}
        {step === "password" && <PasswordStep form={form} />}
        {step === "verification" && <VerificationStep form={form} isDone={isDone} />}
      </div>

      {step !== "identity" && (
        <p className="text-text/35 mt-4 text-center text-[11px] leading-relaxed">
          {step === "password"
            ? "پس از تعریف رمز، کد تایید به ایمیل شما ارسال می‌شود."
            : "با تایید کد، حساب شما ساخته و فعال می‌شود."}
        </p>
      )}
    </FormContainer>
  );
}
