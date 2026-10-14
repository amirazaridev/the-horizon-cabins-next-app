"use client";

import { ArrowRight, Mail, User } from "lucide-react";
import type { ReactNode } from "react";

import { FIELD_LABELS } from "../../schemas";
import type { UseRegisterFormReturn } from "../../hooks/useRegisterForm";
import StateField from "@/components/ui/StateField";
import SubmitButton from "../SubmitButton";

type Props = {
  form: UseRegisterFormReturn;
};

export default function IdentityStep({ form }: Props): ReactNode {
  const { identityForm, isBusy } = form;

  return (
    <form onSubmit={form.submitIdentity} noValidate className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StateField
          control={identityForm.control}
          name="firstName"
          label={FIELD_LABELS.firstName}
          autoComplete="given-name"
          placeholder="مثلاً علی"
          icon={<User className="size-5" />}
          disabled={isBusy}
          clearable
        />
        <StateField
          control={identityForm.control}
          name="lastName"
          label={FIELD_LABELS.lastName}
          autoComplete="family-name"
          placeholder="مثلاً رضایی"
          icon={<User className="size-5" />}
          disabled={isBusy}
          clearable
        />
      </div>

      <StateField
        control={identityForm.control}
        name="email"
        label={FIELD_LABELS.email}
        type="email"
        dir="ltr"
        autoComplete="email"
        placeholder="you@example.com"
        icon={<Mail className="size-5" />}
        hint="کد تایید در پایان ثبت‌نام به این ایمیل ارسال می‌شود."
        disabled={isBusy}
      />

      <SubmitButton
        shape="xl"
        fullWidth
        className="mt-2"
        label="ادامه"
        isLoading={false}
        disabled={isBusy}
        icon={<ArrowRight className="size-5 rotate-180" />}
      />
    </form>
  );
}
