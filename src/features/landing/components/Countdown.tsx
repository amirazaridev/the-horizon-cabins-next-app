"use client";

import { useEffect, useState } from "react";

export type CountdownProps = {
  expiresAt?: string;
  demoDurationSeconds?: number;
};

export default function Countdown({
  expiresAt,
  demoDurationSeconds = 7200,
}: CountdownProps) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const deadline = expiresAt
      ? Date.parse(expiresAt)
      : Date.now() + Math.max(0, demoDurationSeconds) * 1000;
    const update = () => {
      setRemaining(
        Number.isFinite(deadline)
          ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
          : 0,
      );
    };
    const initialTick = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);

    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(interval);
    };
  }, [expiresAt, demoDurationSeconds]);

  if (remaining === 0) {
    return <p className="text-sm text-text-gray">زمان این پیشنهاد به پایان رسید</p>;
  }

  const units = [
    { label: "ساعت", value: remaining === null ? null : Math.floor(remaining / 3600) },
    { label: "دقیقه", value: remaining === null ? null : Math.floor((remaining % 3600) / 60) },
    { label: "ثانیه", value: remaining === null ? null : remaining % 60 },
  ];

  return (
    <div role="timer" aria-label="زمان باقی‌مانده پیشنهاد" aria-live="off" dir="ltr" className="flex shrink-0 gap-2">
      {units.map(({ label, value }) => (
        <div key={label} className="min-w-16 rounded-2xl border border-primary-400/20 bg-background/70 px-3 py-3 text-center">
          <span className="block text-2xl font-bold tabular-nums text-primary-400">
            {value === null ? "--" : value.toLocaleString("fa-IR", { minimumIntegerDigits: 2, useGrouping: false })}
          </span>
          <span className="mt-1 block text-[10px] text-text-gray">{label}</span>
        </div>
      ))}
    </div>
  );
}
