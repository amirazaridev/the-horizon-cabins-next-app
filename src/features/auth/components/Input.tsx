"use client";

import { Eye, EyeOff } from "lucide-react";
import {
  useId,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

type Props = Omit<ComponentProps<"input">, "className"> & {
  label: string;
  icon?: ReactNode;
  error?: string;
  className?: string;
};

export default function Input({
  label,
  icon,
  error,
  id,
  className = "",
  type = "text",
  value,
  ...otherProps
}: Props): ReactNode {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
  const hasValue = Boolean(value);
  const isFloating = focused || hasValue;

  return (
    <div className={className}>
      <div className="relative">
        {icon && (
          <span
            className={`pointer-events-none absolute inset-y-0 start-0 flex w-11 items-center justify-center transition-colors duration-300 ${
              focused ? "text-primary-400" : "text-white/30"
            }`}
          >
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={inputType}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`peer w-full rounded-xl border bg-transparent py-3.5 text-sm text-white transition-all duration-300 placeholder:text-transparent focus:outline-none ${
            icon ? "ps-11" : "ps-4"
          } ${isPassword ? "pe-12" : "pe-4"} ${
            error
              ? "border-danger-strong/60 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
              : focused
                ? "border-primary-400/60 shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                : "border-white/10 hover:border-white/20"
          }`}
          placeholder=" "
          {...otherProps}
        />
        <label
          htmlFor={inputId}
          className={`pointer-events-none absolute transition-all duration-300 ${
            icon ? "start-11" : "start-4"
          } ${
            isFloating
              ? "top-1 text-[10px] font-medium text-white/40"
              : "top-1/2 -translate-y-1/2 text-sm text-white/30"
          } peer-focus: ${
            isFloating ? "" : ""
          } ${
            focused
              ? isFloating && focused
                ? "text-primary-400/70"
                : ""
              : ""
          }`}
          style={{
            top: isFloating ? "0.25rem" : undefined,
            transform: isFloating ? undefined : "translateY(-50%)",
            fontSize: isFloating ? "0.625rem" : undefined,
            color: error
              ? "rgba(248,113,113,0.7)"
              : focused
                ? "rgba(251,191,36,0.6)"
                : undefined,
          }}
        >
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
            className="absolute inset-y-0 end-0 flex w-12 items-center justify-center text-white/30 transition-colors duration-300 hover:text-primary-400"
          >
            {showPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-xs text-danger"
        >
          <span className="inline-block size-1 rounded-full bg-danger" />
          {error}
        </p>
      )}
    </div>
  );
}
