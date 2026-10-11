"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import GaugeHandle from "./GaugeHandle";
import GaugeNumberInput from "./GaugeNumberInput";
import GaugeTicks from "./GaugeTicks";
import {
  clamp,
  formatNumber,
  normalizeRange,
  parseDigits,
  valueFromClientX,
} from "./geometry";
import type { DragHandle, GaugeRange, RangeGaugeProps } from "./types";

export type {
  CommitMode,
  DragHandle,
  GaugeRange,
  GaugeTick,
  RangeGaugeApi,
  RangeGaugeProps,
} from "./types";

/**
 * اسلایدر دو-دستگیره‌ای بازه (قیمت، سال، …).
 *
 * ⚠️ تفکیک‌های انجام‌شده (پیش‌تر همه در یک فایل ۵۱۲ خطی بودند):
 *  - ریاضیات خالص (`clamp`, `parseDigits`, `normalizeRange`,
 *    `valueFromClientX`) ⇒ `geometry.ts`
 *  - دستگیره‌ها (دو نمونه‌ی عیناً یکسان) ⇒ `GaugeHandle.tsx`
 *  - ورودی‌های عددی (دو نمونه‌ی یکسان) ⇒ `GaugeNumberInput.tsx`
 *  - تیک‌ها ⇒ `GaugeTicks.tsx`
 *  - تایپ‌ها ⇒ `types.ts`
 *
 * ⚠️ `committedRef` حذف شد: در نسخه‌ی قبلی چند جا **نوشته** می‌شد ولی
 * هیچ‌جا **خوانده** نمی‌شد (state مرده).
 */
export default function RangeGauge({
  minValue,
  maxValue,
  value,
  step = 100_000,
  minGap,
  formatValue,
  startAriaLabel,
  endAriaLabel,
  onCommit,
  commitOn = "change",
  onReady,
  ticks,
  showInputs = true,
}: RangeGaugeProps) {
  const span = Math.max(maxValue - minValue, 0);
  const gap = minGap ?? step;

  const initial: GaugeRange = {
    start: value ? clamp(value.start, minValue, maxValue) : minValue,
    end: value ? clamp(value.end, minValue, maxValue) : maxValue,
  };

  const [range, setRange] = useState<GaugeRange>(initial);
  const [startInput, setStartInput] = useState(formatNumber(initial.start));
  const [endInput, setEndInput] = useState(formatNumber(initial.end));

  const rangeRef = useRef<GaugeRange>(initial);
  const activeHandleRef = useRef<DragHandle | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const syncInputs = (next: GaugeRange) => {
    setStartInput(formatNumber(next.start));
    setEndInput(formatNumber(next.end));
  };

  /** فقط state داخلی را عوض می‌کند (بدون onCommit) */
  function setRangeState(next: GaugeRange, sort = false): GaugeRange {
    const normalized = normalizeRange(next, {
      min: minValue,
      max: maxValue,
      gap,
      sort,
    });

    rangeRef.current = normalized;
    setRange(normalized);
    syncInputs(normalized);

    return normalized;
  }

  // در ref نگه داشته می‌شود تا APIـی که به مصرف‌کننده می‌دهیم همیشه
  // تازه‌ترین onCommit را صدا بزند (بدون وابستگی کهنیِ effect)
  const onCommitRef = useRef(onCommit);
  useEffect(() => {
    onCommitRef.current = onCommit;
  }, [onCommit]);

  function commitRange(): void {
    onCommitRef.current({ ...rangeRef.current });
  }

  /** حرکت یک دستگیره به مقدار جدید (فقط state؛ commit جای دیگر) */
  function moveHandle(handle: DragHandle, nextValue: number): void {
    setRangeState({
      start: handle === "start" ? nextValue : rangeRef.current.start,
      end: handle === "end" ? nextValue : rangeRef.current.end,
    });
  }

  function readValueFromClientX(clientX: number): number {
    return valueFromClientX(clientX, trackRef.current, {
      min: minValue,
      max: maxValue,
      step,
    });
  }

  /**
   * اگر کلیک مستقیماً روی خودِ دستگیره شروع شده باشد، همان قفل می‌شود.
   *
   * این مهم است چون هنگام گرفتن دستگیره با موس، نقطهٔ کلیک روی بدنهٔ همان
   * دستگیره است و در RTL (که start سمت راست است) ممکن است نقطهٔ محاسبه‌شده
   * به دستگیرهٔ مقابل نزدیک‌تر باشد و اشتباهاً همان را بکشد.
   */
  function getClickedHandle(target: EventTarget | null): DragHandle | undefined {
    const el = (target as HTMLElement | null)?.closest<HTMLElement>(
      "[data-gauge-handle]",
    );
    const handle = el?.dataset.gaugeHandle;

    return handle === "start" || handle === "end" ? handle : undefined;
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>): void {
    if (event.button !== 0 || !trackRef.current) return;

    const clicked = getClickedHandle(event.target);
    const nextValue = readValueFromClientX(event.clientX);

    let handle: DragHandle;

    if (clicked) {
      // کلیک روی خود دستگیره => همان قفل می‌شود و مقدارش جابه‌جا نمی‌شود
      handle = clicked;
    } else {
      // کلیک روی ترک => نزدیک‌ترین دستگیره و پرش به نقطهٔ کلیک
      const distanceToStart = Math.abs(nextValue - rangeRef.current.start);
      const distanceToEnd = Math.abs(nextValue - rangeRef.current.end);
      handle = distanceToStart <= distanceToEnd ? "start" : "end";
      moveHandle(handle, nextValue);
    }

    activeHandleRef.current = handle;
    event.currentTarget.setPointerCapture(event.pointerId);
    containerRef.current?.focus({ preventScroll: true });
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>): void {
    const handle = activeHandleRef.current;
    if (!handle) return;

    moveHandle(handle, readValueFromClientX(event.clientX));
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>): void {
    if (!activeHandleRef.current) return;

    activeHandleRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (commitOn === "change") commitRange();
  }

  function handleTrackKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    // ناوبری با کلید فقط وقتی که کاربر روی خود دستگیره فوکوس دارد
    if (event.target !== event.currentTarget) return;

    let nextValue: number | null = null;

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      nextValue = rangeRef.current.start - step;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      nextValue = rangeRef.current.start + step;
    }
    if (event.key === "Home") nextValue = minValue;
    if (event.key === "End") nextValue = maxValue;

    if (nextValue === null) return;

    event.preventDefault();
    moveHandle("start", nextValue);
  }

  function handleHandleKeyDown(
    handle: DragHandle,
    event: KeyboardEvent<HTMLDivElement>,
  ): void {
    let nextValue: number | null = null;

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      nextValue = rangeRef.current[handle] - step;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      nextValue = rangeRef.current[handle] + step;
    }
    if (event.key === "Home") nextValue = minValue;
    if (event.key === "End") nextValue = maxValue;

    if (nextValue === null) return;

    event.preventDefault();
    moveHandle(handle, nextValue);

    if (commitOn === "change") commitRange();
  }

  function handleInputChange(
    handle: DragHandle,
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const raw = event.target.value;

    if (handle === "start") setStartInput(raw);
    else setEndInput(raw);

    const numeric = parseDigits(raw);
    if (Number.isNaN(numeric)) return;

    moveHandle(handle, clamp(numeric, minValue, maxValue));
  }

  function handleInputCommit(handle: DragHandle): void {
    const raw = handle === "start" ? startInput : endInput;
    const numeric = parseDigits(raw);

    if (Number.isNaN(numeric)) {
      syncInputs(rangeRef.current);
      return;
    }

    const next = setRangeState(
      {
        start: handle === "start" ? numeric : rangeRef.current.start,
        end: handle === "end" ? numeric : rangeRef.current.end,
      },
      true,
    );

    if (commitOn === "change") {
      onCommitRef.current({ ...next });
    }
  }

  function handleInputKeyDown(
    handle: DragHandle,
    event: KeyboardEvent<HTMLInputElement>,
  ): void {
    if (event.key !== "Enter") return;
    event.preventDefault();
    handleInputCommit(handle);
  }

  // آخرین مقادیر مرزی در ref — تا API پایدار بماند و effect هر بار
  // به‌خاطر تغییر تابع‌های محلی دوباره ساخته نشود
  const boundsRef = useRef({ minValue, maxValue });
  useEffect(() => {
    boundsRef.current = { minValue, maxValue };
  }, [minValue, maxValue]);

  // مقدار تأییدشده را برای مصرف‌کننده (دکمهٔ «اعمال») در دسترس می‌گذارد
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    onReadyRef.current?.({
      getRange: () => ({ ...rangeRef.current }),
      submit: () => {
        onCommitRef.current({ ...rangeRef.current });
      },
      reset: () => {
        const { minValue: lo, maxValue: hi } = boundsRef.current;
        const full = { start: lo, end: hi };
        rangeRef.current = full;
        setRange(full);
        setStartInput(formatNumber(full.start));
        setEndInput(formatNumber(full.end));
      },
    });
  }, []);

  const startPercent = span > 0 ? ((range.start - minValue) / span) * 100 : 0;
  const endPercent = span > 0 ? ((range.end - minValue) / span) * 100 : 100;

  const isFullRange = range.start === minValue && range.end === maxValue;

  /**
   * ترک `dir="rtl"` است، پس مبدأ بصری سمت راست است.
   * موقعیت عناصر باید با `right` تنظیم شود تا مقدار min روی لبهٔ راست و
   * مقدار max روی لبهٔ چپ بنشیند — هم‌راستا با `valueFromClientX`.
   */
  const startOffset = { right: `${startPercent}%` } as const;
  const endOffset = { right: `${endPercent}%` } as const;

  // بازهٔ انتخاب‌شده از سمت راست (start) شروع می‌شود و تا end ادامه دارد
  const selectionStyle = {
    right: `${startPercent}%`,
    width: `${Math.max(endPercent - startPercent, 0)}%`,
  };

  return (
    <div
      ref={containerRef}
      dir="rtl"
      tabIndex={-1}
      className="border-border bg-surface w-full rounded-2xl border p-4 focus:outline-none sm:p-5"
    >
      {showInputs && (
        <div dir="rtl" className="mb-5 flex items-center gap-3">
          <GaugeNumberInput
            label="از"
            ariaLabel={startAriaLabel}
            value={startInput}
            onChange={(e) => handleInputChange("start", e)}
            onBlur={() => handleInputCommit("start")}
            onKeyDown={(e) => handleInputKeyDown("start", e)}
          />

          <span className="bg-border h-px w-4 shrink-0" />

          <GaugeNumberInput
            label="تا"
            ariaLabel={endAriaLabel}
            value={endInput}
            onChange={(e) => handleInputChange("end", e)}
            onBlur={() => handleInputCommit("end")}
            onKeyDown={(e) => handleInputKeyDown("end", e)}
          />
        </div>
      )}

      <div
        ref={trackRef}
        dir="rtl"
        className="relative h-12 cursor-ew-resize touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleTrackKeyDown}
      >
        <div className="border-border bg-surface-raised absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 overflow-hidden rounded-full border shadow-inner">
          <div
            className="from-primary-300 via-primary-400 to-primary-500 absolute inset-y-0 rounded-full bg-gradient-to-l"
            style={selectionStyle}
          />
        </div>

        <GaugeHandle
          handle="start"
          value={range.start}
          offset={startOffset}
          min={minValue}
          max={maxValue}
          ariaLabel={startAriaLabel}
          formatValue={formatValue}
          onKeyDown={(event) => handleHandleKeyDown("start", event)}
        />

        <GaugeHandle
          handle="end"
          value={range.end}
          offset={endOffset}
          min={minValue}
          max={maxValue}
          ariaLabel={endAriaLabel}
          formatValue={formatValue}
          onKeyDown={(event) => handleHandleKeyDown("end", event)}
        />
      </div>

      {ticks && <GaugeTicks ticks={ticks} span={span} />}

      {!isFullRange && commitOn === "apply" && (
        <p className="text-text-gray mt-3 text-center text-xs">
          {formatValue(range.start)} تا {formatValue(range.end)}
        </p>
      )}
    </div>
  );
}
