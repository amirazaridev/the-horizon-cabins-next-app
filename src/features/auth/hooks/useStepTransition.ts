"use client";

import { useCallback, useRef, useState } from "react";

type UseStepTransitionOptions = {
  /** تعداد کل مراحل. */
  total: number;
  /** مرحله‌ی اولیه (اندیس). */
  initialStep?: number;
  /** مدت انیمیشن (ms) — باید با `duration-*` کلاس‌های Tailwind یکی بماند. */
  duration?: number;
};

type UseStepTransitionResult = {
  /** اندیس مرحله‌ی فعال. */
  step: number;
  /** جهت آخرین حرکت: `1` جلو، `-1` عقب — برای انیمیشن اسلاید. */
  direction: 1 | -1;
  /** `true` در حین انیمیشن خروج — دکمه‌ها disable می‌شوند. */
  isTransitioning: boolean;
  /** رفتن به مرحله‌ی بعد. */
  next: () => void;
  /** برگشت به مرحله‌ی قبل. */
  back: () => void;
  /** پرش مستقیم (بدون انیمیشن) — برای ریست یا بازگشت به مرحله‌ی اول. */
  goTo: (index: number) => void;
};

/**
 * جابه‌جایی بین مراحل با انیمیشن خروج/ورود.
 *
 * الگو: ابتدا محتوای فعلی با کلاس خروج محو می‌شود، بعد از پایان انیمیشن
 * اندیس مرحله عوض می‌شود و کلاس ورود می‌خورد. اگر مستقیم اندیس را عوض
 * کنیم هر دو مرحله هم‌زمان در DOM می‌مانند و ارتفاع ظرف می‌جهد.
 */
export function useStepTransition({
  total,
  initialStep = 0,
  duration = 260,
}: UseStepTransitionOptions): UseStepTransitionResult {
  const [step, setStep] = useState(initialStep);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const runTransition = useCallback(
    (targetIndex: number, nextDirection: 1 | -1) => {
      if (targetIndex < 0 || targetIndex >= total) return;
      if (timeoutRef.current !== null) return;

      setDirection(nextDirection);
      setIsTransitioning(true);

      timeoutRef.current = window.setTimeout(() => {
        setStep(targetIndex);
        setIsTransitioning(false);
        timeoutRef.current = null;
      }, duration);
    },
    [duration, total],
  );

  const next = useCallback(() => {
    runTransition(step + 1, 1);
  }, [runTransition, step]);

  const back = useCallback(() => {
    runTransition(step - 1, -1);
  }, [runTransition, step]);

  const goTo = useCallback((index: number) => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsTransitioning(false);
    setDirection(index >= 0 ? 1 : -1);
    setStep(index);
  }, []);

  return { step, direction, isTransitioning, next, back, goTo };
}
