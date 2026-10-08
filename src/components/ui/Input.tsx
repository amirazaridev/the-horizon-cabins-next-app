"use client";

import { Eye, EyeOff, X } from "lucide-react";
import {
  forwardRef,
  useId,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

type Props = Omit<ComponentProps<"input">, "className"> & {
  /** برچسب شناور روی فیلد. */
  label: string;
  /** آیکون سمت شروع فیلد. */
  icon?: ReactNode;
  /** پیام خطای فارسی — نمایش زیر فیلد + `aria-invalid`. */
  error?: string;
  /** راهنمای زیر فیلد وقتی خطایی نیست. */
  hint?: ReactNode;
  /** واحد سمت انتهای فیلد (مثلاً «تومان») — جای دکمه‌ی نمایش رمز نمی‌نشیند. */
  suffix?: ReactNode;
  className?: string;
  /** `ref` روی `<input>` — لازم برای RHF و مدیریت فوکوس OTP. */
  inputClassName?: string;
  /** دکمه‌ی پاک‌کردن مقدار وقتی فیلد پرشده و فوکوس دارد. */
  clearable?: boolean;
  onClear?: () => void;
};

/**
 * فیلد ورودی مشترک فرم‌های پروژه (احراز هویت، تنظیمات حساب کاربری، …).
 *
 * ⚠️ چرا `forwardRef`؟
 * `react-hook-form` با `register()` یک `ref` می‌فرستد. بدون forward، RHF
 * نمی‌تواند فوکوس/مقدار را مدیریت کند و validating لحظه‌ای از کار می‌افتد.
 *
 * الگوی label شناور: `value` + وضعیت فوکوس تعیین می‌کنند label بالا برود.
 * برای فیلدهای غیرمتنی (تاریخ/انتخاب) از `open` استفاده نکنید — این
 * کامپوننت فقط برای `<input>` است.
 */
const Input = forwardRef<HTMLInputElement, Props>(function Input(
  {
    label,
    icon,
    error,
    hint,
    suffix,
    id,
    className = "",
    inputClassName = "",
    type = "text",
    value,
    clearable = false,
    onClear,
    disabled,
    ...otherProps
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
  const hasValue = value !== undefined && value !== null && `${value}` !== "";
  const isFloating = focused || hasValue;
  const showClear = clearable && hasValue && focused && !disabled;

  const describedBy =
    [error ? errorId : null, !error && hint ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={className}>
      <div className="relative">
        {icon && (
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 inset-s-0 flex w-11 items-center justify-center transition-colors duration-300 ${
              error
                ? "text-danger"
                : focused
                  ? "text-primary-400"
                  : "text-text/30"
            }`}
          >
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={inputType}
          value={value}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=" "
          className={`text-text w-full rounded-xl border bg-transparent py-3.5 text-sm transition-all duration-300 outline-none placeholder:text-transparent disabled:cursor-not-allowed disabled:opacity-60 ${
            icon ? "ps-11" : "ps-4"
          } ${isPassword ? "pe-12" : suffix || showClear ? "pe-20" : "pe-4"} ${
            error
              ? "border-danger-strong/60 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
              : focused
                ? "border-primary-400/60 shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                : "border-foreground/10 hover:border-foreground/20"
          } ${inputClassName}`}
          {...otherProps}
        />

        <label
          htmlFor={inputId}
          className={`pointer-events-none absolute transition-all duration-300 ${
            icon ? "start-11" : "start-4"
          } ${
            isFloating
              ? "top-1 text-[10px] font-medium"
              : "top-1/2 -translate-y-1/2 text-sm"
          } ${
            error ? "text-danger/70" : focused ? "text-primary-400/70" : "text-text/30"
          }`}
        >
          {label}
        </label>

        <span className="absolute inset-y-0 inset-e-0 flex items-center gap-0.5 pe-2">
          {suffix && (
            <span className="text-text/40 select-none text-xs">{suffix}</span>
          )}

          {showClear && !isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => {
                onClear?.();
                setFocused(false);
              }}
              aria-label={`پاک کردن ${label}`}
              className="text-text/30 hover:text-text/60 flex size-9 items-center justify-center rounded-full transition-colors duration-300"
            >
              <X className="size-4" />
            </button>
          )}

          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
              className="text-text/30 hover:text-primary-400 flex size-9 items-center justify-center rounded-full transition-colors duration-300"
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          )}
        </span>
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-danger mt-2 flex items-start gap-1.5 text-xs leading-relaxed"
        >
          <span className="bg-danger mt-1.5 inline-block size-1 shrink-0 rounded-full" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-text/45 mt-2 text-xs leading-relaxed">
            {hint}
          </p>
        )
      )}
    </div>
  );
});

export default Input;
