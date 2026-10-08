"use client";

import type { ComponentProps, ReactNode } from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import Input from "./Input";

/**
 * فیلد فرم متصل به React Hook Form.
 *
 * ⭐ چرا یک کامپوننت و نه یک تابع کمکی؟
 * الگوی تکراری فعلی در همه‌ی فرم‌ها این است:
 *
 *   <Input
 *     label="ایمیل"
 *     error={form.formState.errors.email?.message}
 *     {...form.register("email")}
 *   />
 *
 * که سه ایراد دارد: (۱) نام فیلد دو بار نوشته می‌شود و امکان غلط‌نویسی
 * دارد، (۲) تایپ‌اسکریپت نمی‌تواند ثابت کند `"email"` روی فرم وجود دارد،
 * (۳) دکمه‌ی پاک‌کردن باید `setValue` را دستی صدا بزند.
 *
 * با `useController` نام فیلد **یک بار** می‌آید و `<FieldPath<T>>` تضمین
 * می‌کند فقط فیلدهای واقعی همان فرم پذیرفته شوند؛ غلط‌نویسی حالا خطای
 * کامپایل است نه باگ زمان اجرا.
 */

type Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<
  ComponentProps<typeof Input>,
  "error" | "name" | "value" | "onChange" | "onBlur" | "ref" | "clearable" | "onClear"
> & {
  /** کنترل فرم — خروجی `useForm`. */
  control: Control<TFieldValues>;
  /** نام فیلد — فقط فیلدهای موجود در همان فرم پذیرفته می‌شوند. */
  name: TName;
  /** افزودن دکمه‌ی پاک‌کردن مقدار. */
  clearable?: boolean;
};

function StateField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  clearable = false,
  ...inputProps
}: Props<TFieldValues, TName>): ReactNode {
  const {
    field: { value, onChange, onBlur, ref, disabled },
    fieldState: { error },
  } = useController<TFieldValues, TName>({ control, name });

  const stringValue = value === undefined || value === null ? "" : `${value}`;

  return (
    <Input
      {...inputProps}
      ref={ref}
      name={name}
      value={stringValue}
      disabled={disabled || inputProps.disabled}
      onChange={onChange}
      onBlur={onBlur}
      error={error?.message}
      clearable={clearable}
      onClear={() => onChange("")}
    />
  );
}

export default StateField;
