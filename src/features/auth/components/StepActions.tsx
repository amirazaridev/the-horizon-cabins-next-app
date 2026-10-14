"use client";

import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import Button from "@/components/ui/Button";
import SubmitButton from "./SubmitButton";

type Props = {
  /** برچسب دکمه‌ی اصلی. */
  label: string;
  /** متن دکمه‌ی اصلی در زمان loading. */
  loadingLabel?: string;
  isLoading?: boolean;
  /** نمایش دکمه‌ی «بازگشت» (مرحله‌ی اول ندارد). */
  onBack?: () => void;
  disabled?: boolean;
  /** آیکون کنار متن دکمه‌ی اصلی. */
  icon?: ReactNode;
};

export default function StepActions({
  label,
  loadingLabel,
  isLoading = false,
  onBack,
  disabled = false,
  icon = <ArrowRight className="size-5 rotate-180" />,
}: Props): ReactNode {
  return (
    <div className="flex gap-3 pt-1">
      {onBack && (
        <Button
          type="button"
          variant="outline"
          shape="xl"
          onClick={onBack}
          disabled={disabled || isLoading}
          className="flex-none px-5"
        >
          بازگشت
        </Button>
      )}

      <SubmitButton
        shape="xl"
        fullWidth
        label={label}
        loadingLabel={loadingLabel}
        isLoading={isLoading}
        disabled={disabled}
        icon={icon}
      />
    </div>
  );
}
