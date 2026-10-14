"use client";

import { useEffect, useRef, useState } from "react";

import {
  isValidDeadline,
  secondsUntil,
  splitSeconds,
} from "@/features/landing/utils/countdown";

export type CountdownProps = {
  expiresAt?: string;
  /** وقتی شمارش به صفر رسید، **یک‌بار** صدا زده می‌شود (مثلاً برای revalidate). */
  onExpire?: () => void;
};

export default function Countdown({ expiresAt, onExpire }: CountdownProps) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;

    const update = () => {
      const next = secondsUntil(expiresAt);
      setRemaining(next);

      if (next === 0 && !firedRef.current) {
        firedRef.current = true;
        onExpire?.();
      }
    };

    const initialTick = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);

    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(interval);
    };
  }, [expiresAt, onExpire]);

  // بدون مهلت معتبر، تایمری وجود ندارد (نه عدد ساختگی، نه `--`)
  if (!isValidDeadline(expiresAt)) return null;

  if (remaining === 0) {
    return (
      <p className="text-text-gray text-sm">زمان این پیشنهاد به پایان رسید</p>
    );
  }

  const units = remaining === null ? null : splitSeconds(remaining);

  const cells = [
    { label: "ساعت", value: units?.hours },
    { label: "دقیقه", value: units?.minutes },
    { label: "ثانیه", value: units?.seconds },
  ];

  return (
    <div
      role="timer"
      aria-label="زمان باقی‌مانده پیشنهاد"
      aria-live="off"
      dir="ltr"
      className="flex shrink-0 gap-2"
    >
      {cells.map(({ label, value }) => (
        <div
          key={label}
          className="border-primary-400/20 bg-background/70 min-w-16 rounded-2xl border px-3 py-3 text-center"
        >
          <span className="text-primary-400 block text-2xl font-bold tabular-nums">
            {value === undefined
              ? "--"
              : value.toLocaleString("fa-IR", {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
          </span>
          <span className="text-text-gray mt-1 block text-[10px]">{label}</span>
        </div>
      ))}
    </div>
  );
}
