// ? منطق خالص تایمر شمارش معکوس — بدون React.

export type CountdownUnits = {
  hours: number;
  minutes: number;
  seconds: number;
};

//* آیا رشته‌ی مهلت یک تاریخ معتبر است؟
export function isValidDeadline(
  deadline: string | undefined,
): deadline is string {
  return Boolean(deadline) && Number.isFinite(Date.parse(deadline as string));
}

//* ثانیه‌های باقی‌مانده را به ساعت/دقیقه/ثانیه می‌شکند.
export function splitSeconds(totalSeconds: number): CountdownUnits {
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

//* فاصله‌ی ثانیه‌ای تا یک مهلت.
export function secondsUntil(
  deadline: string | undefined,
  now: number = Date.now(),
): number | null {
  if (!isValidDeadline(deadline)) return null;

  return Math.max(0, Math.ceil((Date.parse(deadline) - now) / 1000));
}
