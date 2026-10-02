"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { faNumber, normalizeDigits } from "../schemas";

type Props = {
  /** طول کد — پیش‌فرض از `AUTH_LIMITS.otpLength`. */
  length?: number;
  /** مقدار کامل کد (رشته‌ی لاتین). */
  value: string;
  /** فراخوانی با مقدار کامل بعد از هر تغییر. */
  onChange: (value: string) => void;
  /** بعد از پر شدن همه‌ی خانه‌ها — معمولاً برای ارسال خودکار. */
  onComplete?: (value: string) => void;
  /** پاک‌ شدن محتوا (فیلد را به مقدار اولیه برمی‌گرداند). */
  error?: string;
  disabled?: boolean;
  /** `true` وقتی ارسال خودکار کد در جریان است — خانه‌ها را غیرفعال می‌کند. */
  autoSubmitPending?: boolean;
  className?: string;
};

/**
 * ورودی کد تایید ۶ خانه‌ای.
 *
 * رفتارهای لازم برای UX درست:
 *  - تایپ عدد → رفتن خودکار به خانه‌ی بعد.
 *  - Backspace روی خانه‌ی خالی → برگشت به خانه‌ی قبل و پاک‌کردن آن.
 *  - چسباندن کل کد (Ctrl+V) یا AutoFill عددی مرورگر → پخش در همه‌ی خانه‌ها.
 *  - کلیدهای جهتنما (Arrow) برای جابه‌جایی دستی.
 *  - ارقام فارسی/عربی پذیرفته و به لاتین تبدیل می‌شوند.
 *
 * ⚠️ چرا یک state واحد (`value`) و نه یک آرایه در هر خانه؟
 * با آرایه، چسباندن و پاک‌کردن نیاز به همگام‌سازی دستی دارد و `onChange`
 * برای والد بی‌معنا می‌شود. اینجا مقدار حقیقت یکی است و هر خانه فقط
 * یک کاراکتر از آن را نمایش می‌دهد.
 */
export default function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  error,
  disabled = false,
  autoSubmitPending = false,
  className = "",
}: Props) {
  const baseId = useId();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const isDisabled = disabled || autoSubmitPending;

  // فوکوس روی خانه‌ی اول در mount — کاربر بلافاصله می‌تواند تایپ کند.
  useEffect(() => {
    if (isDisabled) return;
    inputsRef.current[0]?.focus();
  }, [isDisabled]);

  const digits = value.padEnd(length, " ").slice(0, length).split("");

  function commit(nextValue: string, focusIndex?: number) {
    onChange(nextValue);
    if (focusIndex !== undefined) {
      const target = Math.min(focusIndex, length - 1);
      inputsRef.current[target]?.focus();
      inputsRef.current[target]?.select();
    }
    if (nextValue.length === length && nextValue !== value) {
      onComplete?.(nextValue);
    }
  }

  function handleChange(index: number, rawValue: string) {
    const incoming = normalizeDigits(rawValue).replace(/\D/g, "");
    if (!incoming) return;

    // کاربر روی یک خانه‌ی پرشده چند کاراکتر تایپ/پیست کرده: پخش کن.
    if (incoming.length > 1) {
      const next = (
        value.slice(0, index) + incoming + value.slice(index + incoming.length)
      ).slice(0, length);
      commit(next, index + incoming.length);
      return;
    }

    const chars = value.padEnd(length, " ").split("");
    chars[index] = incoming;
    const next = chars.join("").replace(/\s/g, "").slice(0, length);
    commit(next, index + 1);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      event.preventDefault();
      const chars = value.split("");

      // اگر خانه‌ی جاری پر است، فقط همان را پاک کن.
      if (chars[index]) {
        const next = chars.filter((_, i) => i !== index).join("");
        commit(next, index);
        return;
      }

      // خانه خالی است: خانه‌ی قبل را پاک کن و فوکوس را ببر عقب.
      if (index > 0) {
        const previous = chars.filter((_, i) => i !== index - 1).join("");
        commit(previous, index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputsRef.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }

    // Enter در فرم نهایی را submit می‌کند — اینجا جلوی ارسال ناقص را می‌گیریم.
    if (event.key === "Enter" && value.length < length) {
      event.preventDefault();
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = normalizeDigits(event.clipboardData.getData("text")).replace(
      /\D/g,
      "",
    );
    if (!pasted) return;

    const next = (
      value.slice(0, index) + pasted + value.slice(index + pasted.length)
    ).slice(0, length);
    commit(next, index + pasted.length);
  }

  return (
    <div className={className}>
      <div
        className="flex items-center justify-between gap-2 sm:gap-3"
        role="group"
        aria-label="کد تایید"
        dir="ltr"
      >
        {Array.from({ length }).map((_, index) => {
          const char = digits[index].trim();
          const isFocused = focusedIndex === index;
          return (
            <input
              key={index}
              ref={(element) => {
                inputsRef.current[index] = element;
              }}
              id={`${baseId}-${index}`}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={char}
              disabled={isDisabled}
              aria-label={`رقم ${faNumber(index + 1)} کد تایید`}
              aria-invalid={Boolean(error)}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={(event) => handlePaste(index, event)}
              onFocus={(event) => {
                setFocusedIndex(index);
                event.target.select();
              }}
              onBlur={() => setFocusedIndex(null)}
              className={`text-text h-14 w-full min-w-0 rounded-xl border text-center text-xl font-bold tabular-nums transition-all duration-300 outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
                error
                  ? "border-danger-strong/60 bg-danger/5 text-danger"
                  : isFocused
                    ? "border-primary-400/70 bg-primary-400/5 shadow-[0_0_20px_rgba(251,191,36,0.12)]"
                    : char
                      ? "border-foreground/20 bg-foreground/[0.03]"
                      : "border-foreground/10 hover:border-foreground/20"
              }`}
            />
          );
        })}
      </div>

      {error && (
        <p role="alert" className="text-danger mt-2.5 flex items-center gap-1.5 text-xs">
          <span className="bg-danger inline-block size-1 rounded-full" />
          {error}
        </p>
      )}
    </div>
  );
}
