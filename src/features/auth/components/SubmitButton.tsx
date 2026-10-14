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
