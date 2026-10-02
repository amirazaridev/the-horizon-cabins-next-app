"use client";

import { Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import Button from "@/components/ui/Button";

type Props = Omit<ComponentProps<typeof Button>, "children" | "type"> & {
  /** متن حالت عادی (بیکار). */
  label: string;
  /** `true` وقتی درخواست همین دکمه در جریان است. */
  isLoading?: boolean;
  /** متن جایگزین در زمان loading — پیش‌فرض: همان `label`. */
  loadingLabel?: string;
  /** آیکون کنار متن در حالت عادی. */
  icon?: ReactNode;
  /** آیکون کنار متن در حالت loading — پیش‌فرض چرخ‌دنده‌ی در حال چرخش. */
  loadingIcon?: ReactNode;
  type?: "button" | "submit";
};

/**
 * دکمه‌ی ارسال فرم که حالت loading را خودش مدیریت می‌کند.
 *
 * ⭐ چرا؟ الگوی `<Loader2 className="animate-spin" /> + متن` قبلاً پنج بار
 * در `RegisterForm` و `LoginForm` تکرار شده بود و هر بار متن و آیکون کمی
 * متفاوت بود. حالا یک نقطه‌ی واحد برای این رفتار وجود دارد و UI مرحله‌ها
 * فقط می‌گوید «در حال ارسال کد...».
 */
export default function SubmitButton({
  label,
  loadingLabel,
  isLoading = false,
  icon,
  loadingIcon,
  type = "submit",
  disabled,
  ...otherProps
}: Props): ReactNode {
  return (
    <Button type={type} disabled={disabled || isLoading} {...otherProps}>
      {isLoading ? (
        <>
          {loadingIcon ?? <Loader2 className="size-5 animate-spin" />}
          {loadingLabel ?? label}
        </>
      ) : (
        <>
          {label}
          {icon}
        </>
      )}
    </Button>
  );
}
