"use client";

import { Lock, Shield } from "lucide-react";
import type { ReactNode } from "react";

import { FIELD_LABELS } from "../../schemas";
import type { UseRegisterFormReturn } from "../../hooks/useRegisterForm";
import Checkbox from "../Checkbox";
import PasswordStrength from "../PasswordStrength";
import StateField from "@/components/ui/StateField";
import StepActions from "../StepActions";

type Props = {
  form: UseRegisterFormReturn;
};

export default function PasswordStep({ form }: Props): ReactNode {
  const { passwordForm, passwordValue, action, isBusy } = form;
  const isSending = action.is("sendingCode");

  return (
    <form onSubmit={form.submitPassword} noValidate className="space-y-4">
      <div>
        <StateField
          control={passwordForm.control}
          name="password"
          label={FIELD_LABELS.password}
          type="password"
          dir="ltr"
          autoComplete="new-password"
          placeholder="••••••••"
          icon={<Lock className="size-5" />}
          disabled={isBusy}
        />
        <PasswordStrength password={passwordValue} className="mt-3" />
      </div>

      <StateField
        control={passwordForm.control}
        name="confirmPassword"
        label={FIELD_LABELS.confirmPassword}
        type="password"
        dir="ltr"
        autoComplete="new-password"
        placeholder="••••••••"
        icon={<Shield className="size-5" />}
        disabled={isBusy}
      />

      <Checkbox
        {...passwordForm.register("acceptedTerms")}
        disabled={isBusy}
        error={passwordForm.formState.errors.acceptedTerms?.message}
      >
        قوانین و مقررات{" "}
        <a href="#" className="text-primary-400/80 hover:text-primary-400 font-medium">
          هورایزن کابینز
        </a>{" "}
        را می‌پذیرم
      </Checkbox>

      <StepActions
        label="ارسال کد و ادامه"
        loadingLabel="در حال ارسال کد..."
        isLoading={isSending}
        onBack={form.goBack}
        disabled={isBusy}
      />
    </form>
  );
}
