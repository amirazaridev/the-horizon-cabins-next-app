"use client";

import { Check } from "lucide-react";
import { forwardRef, useId, type ComponentProps, type ReactNode } from "react";

type Props = Omit<ComponentProps<"input">, "type" | "className"> & {
  /** محتوای برچسب — می‌تواند شامل لینک باشد. */
  children: ReactNode;
  error?: string;
  className?: string;
};

/**
 * چک‌باکس سفارشی با input بومی.
 *
 * ⚠️ عمداً از `<input type="checkbox">` واقعی استفاده می‌شود (نه div با
 * onClick): تا کیبورد، screen reader، `Space` و `form.reset` همه بی‌دردسر
 * کار کنند و `register()` در React Hook Form مستقیم به آن وصل شود.
 * خود چک‌باکس با `appearance-none` پنهان و نشانگر سفارشی جایش می‌نشیند.
 */
const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox(
  { children, error, className = "", id, ...otherProps },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="text-text-gray flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed select-none"
      >
        <span className="relative mt-0.5 flex size-4.5 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={`peer size-4.5 cursor-pointer appearance-none rounded-[5px] border transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40 ${
              error
                ? "border-danger-strong/60"
                : "border-foreground/25 hover:border-foreground/40"
            } checked:border-primary-400 checked:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-50`}
            {...otherProps}
          />
          <Check
            aria-hidden="true"
            strokeWidth={3}
            className="pointer-events-none absolute size-3 text-black opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
          />
        </span>
        <span>{children}</span>
      </label>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-danger mt-1.5 flex items-center gap-1.5 text-xs"
        >
          <span className="bg-danger inline-block size-1 rounded-full" />
          {error}
        </p>
      )}
    </div>
  );
});

export default Checkbox;
