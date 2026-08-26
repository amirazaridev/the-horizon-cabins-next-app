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
  ...otherProps
}: Props): ReactNode {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-medium text-white/80"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="text-white/40 pointer-events-none absolute inset-y-0 start-0 flex w-11 items-center justify-center">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={inputType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-xl border bg-white/5 py-3 text-sm text-white transition-colors duration-300 placeholder:text-white/30 focus:bg-slate-900/60 focus:outline-none ${
            icon ? "ps-11" : "ps-4"
          } ${isPassword ? "pe-12" : "pe-4"} ${
            error
              ? "border-red-500/50 focus:border-red-400"
              : "border-white/10 hover:border-white/20 focus:border-primary-400/60"
          }`}
          {...otherProps}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
            className="absolute inset-y-0 end-0 flex w-12 items-center justify-center text-white/40 transition-colors duration-300 hover:text-primary-400"
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
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
