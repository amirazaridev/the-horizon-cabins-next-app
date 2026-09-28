"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

export interface GaugeRange {
  start: number;
  end: number;
}

export interface GaugeTick {
  key: string;
  label: string;
  position: number;
}

type CommitMode = "change" | "apply";

/** دستگیرهٔ در حال کشیدن: start = مقدار کمینه، end = مقدار بیشینه */
type DragHandle = "start" | "end";

interface RangeGaugeProps {
  /** حد پائین بازه (مقدار واقعی، نه آفست) */
  minValue: number;
  /** حد بالای بازه (مقدار واقعی، نه آفست) */
  maxValue: number;
  /** مقدار انتخاب‌شدهٔ فعلی؛ اگر ندهید، محدودهٔ کامل در نظر گرفته می‌شود */
  value?: GaugeRange | null;
  /** گام حرکت اسلایدر و دکمه‌های جهت‌دار */
  step?: number;
  /** فاصلهٔ حداقل بین دو دستگیره (پیش‌فرض: یک step) */
  minGap?: number;
  formatValue: (value: number) => string;
  startAriaLabel: string;
  endAriaLabel: string;
  /**
   * خروجی گرفتن از بازهٔ انتخاب‌شده:
   * - `change` => با هر رها کردن موس / تغییر دستگیره (رفتار زندهٔ قبلی)
   * - `apply`  => فقط وقتی مصرف‌کننده `submit()` را صدا بزند یا روی دکمهٔ اعمال بزند
   */
  onCommit: (range: GaugeRange) => void;
  /** `change` (پیش‌فرض) یا `apply` */
  commitOn?: CommitMode;
  /** برای `commitOn="apply"` — تابع submit را به مصرف‌کننده می‌دهد */
  onReady?: (api: RangeGaugeApi) => void;
  ticks?: GaugeTick[];
  showInputs?: boolean;
}

export interface RangeGaugeApi {
  /** مقادیر تأییدشدهٔ فعلی (برای دکمهٔ «اعمال») */
  getRange: () => GaugeRange;
  /** اعمال بازهٔ فعلی روی onCommit */
  submit: () => void;
  /** برگرداندن اسلایدر به محدودهٔ کامل */
  reset: () => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

/** عدد لاتین یا فارسی/عربی را به number تبدیل می‌کند */
function parseDigits(raw: string): number {
  const normalized = raw
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[^\d]/g, "");

  return normalized === "" ? Number.NaN : Number(normalized);
}

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
  const activeHandleRef = useRef<"start" | "end" | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // مقادیر تأییدشدهٔ فعلی (mirror در ref، بدون نیاز به re-render)
  const committedRef = useRef<GaugeRange>(initial);

  const syncInputs = (next: GaugeRange) => {
    setStartInput(formatNumber(next.start));
    setEndInput(formatNumber(next.end));
  };

  /** مرتب‌سازی + کلمپ یک بازه؛ با `sort` ترتیب دستگیره‌ها هم اصلاح می‌شود */
  function normalize(next: GaugeRange, sort = false): GaugeRange {
    let { start, end } = next;

    if (sort && start > end) [start, end] = [end, start];

    start = clamp(start, minValue, maxValue);
    end = clamp(end, minValue, maxValue);

    return {
      start: Math.min(start, end - gap),
      end: Math.max(end, start + gap),
    };
  }

  /** فقط state داخلی را عوض می‌کند (بدون onCommit) */
  function setRangeState(next: GaugeRange, sort = false): GaugeRange {
    const normalized = normalize(next, sort);
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
    committedRef.current = { ...rangeRef.current };
    onCommitRef.current({ ...rangeRef.current });
  }

  /** حرکت یک دستگیره به مقدار جدید (فقط state؛ commit جای دیگر) */
  function moveHandle(handle: "start" | "end", nextValue: number): void {
    setRangeState({
      start: handle === "start" ? nextValue : rangeRef.current.start,
      end: handle === "end" ? nextValue : rangeRef.current.end,
    });
  }

  function getValueFromClientX(clientX: number): number {
    const track = trackRef.current;
    if (!track || span === 0) return minValue;

    const rect = track.getBoundingClientRect();

    // صفحه RTL: مبدأ از سمت راست است، پس جهت را برمی‌گردانیم
    const isRtl = getComputedStyle(track).direction === "rtl";
    const offset = isRtl ? rect.right - clientX : clientX - rect.left;
    const ratio = offset / rect.width;

    const rawValue = minValue + ratio * span;

    // اسنپ نسبت به minValue، نه نسبت به صفر — وگرنه وقتی minValue
    // مضرب step نباشد مقدار از خودِ minValue بیرون میزند.
    const snapped = minValue + Math.round((rawValue - minValue) / step) * step;

    return clamp(snapped, minValue, maxValue);
  }

  /**
   * اگر کلیک مستقیماً روی خودِ دستگیره شروع شده باشد، همان قفل می‌شود.
   *
   * این مهم است چون هنگام گرفتن دستگیره با موس، نقطهٔ کلیک روی بدنهٔ همان
   * دستگیره است و در RTL (که start سمت راست است) ممکن است نقطهٔ محاسبه‌شده
   * به دستگیرهٔ مقابل نزدیک‌تر باشد و اشتباهاً همان را بکشد.
   */
  function getClickedHandle(
    target: EventTarget | null,
  ): DragHandle | undefined {
    const el = (target as HTMLElement | null)?.closest<HTMLElement>(
      "[data-gauge-handle]",
    );
    const handle = el?.dataset.gaugeHandle;

    return handle === "start" || handle === "end" ? handle : undefined;
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>): void {
    if (event.button !== 0 || !trackRef.current) return;

    const clicked = getClickedHandle(event.target);
    const nextValue = getValueFromClientX(event.clientX);

    let handle: DragHandle;

    if (clicked) {
      // کلیک روی خود دستگیره => همان قفل میشود و مقدارش جابهجا نمیشود
      handle = clicked;
    } else {
      // کلیک روی ترک => نزدیکترین دستگیره و پرش به نقطهٔ کلیک
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

    moveHandle(handle, getValueFromClientX(event.clientX));
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
    handle: "start" | "end",
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
    handle: "start" | "end",
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const raw = event.target.value;

    if (handle === "start") setStartInput(raw);
    else setEndInput(raw);

    const numeric = parseDigits(raw);
    if (Number.isNaN(numeric)) return;

    moveHandle(handle, clamp(numeric, minValue, maxValue));
  }

  function handleInputCommit(handle: "start" | "end"): void {
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
      committedRef.current = { ...next };
      onCommitRef.current({ ...next });
    }
  }

  function handleInputKeyDown(
    handle: "start" | "end",
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
        committedRef.current = { ...rangeRef.current };
        onCommitRef.current({ ...rangeRef.current });
      },
      reset: () => {
        const { minValue: lo, maxValue: hi } = boundsRef.current;
        const full = { start: lo, end: hi };
        rangeRef.current = full;
        setRange(full);
        setStartInput(formatNumber(full.start));
        setEndInput(formatNumber(full.end));
        committedRef.current = { ...full };
      },
    });
  }, []);

  const startPercent = span > 0 ? ((range.start - minValue) / span) * 100 : 0;
  const endPercent = span > 0 ? ((range.end - minValue) / span) * 100 : 100;

  const isFullRange = range.start === minValue && range.end === maxValue;

  /**
   * ترک `dir="rtl"` است، پس مبدأ بصری سمت راست است.
   * موقعیت عناصر باید با `right` تنظیم شود تا مقدار min روی لبهٔ راست و
   * مقدار max روی لبهٔ چپ بنشیند — هم‌راستا با `getValueFromClientX`.
   * (اگر `left` استفاده شود، هر دو به‌صورت آینه‌ای جابه‌جا می‌شوند.)
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
          <label className="flex flex-1 items-center gap-2">
            <span className="text-text-gray text-xs">از</span>
            <input
              type="text"
              inputMode="numeric"
              dir="ltr"
              aria-label={startAriaLabel}
              value={startInput}
              onChange={(e) => handleInputChange("start", e)}
              onBlur={() => handleInputCommit("start")}
              onKeyDown={(e) => handleInputKeyDown("start", e)}
              className="border-border bg-background focus:border-primary-400 w-full rounded-xl border px-3 py-2 text-center text-sm font-semibold focus:outline-none"
            />
          </label>

          <span className="bg-border h-px w-4 shrink-0" />

          <label className="flex flex-1 items-center gap-2">
            <span className="text-text-gray text-xs">تا</span>
            <input
              type="text"
              inputMode="numeric"
              dir="ltr"
              aria-label={endAriaLabel}
              value={endInput}
              onChange={(e) => handleInputChange("end", e)}
              onBlur={() => handleInputCommit("end")}
              onKeyDown={(e) => handleInputKeyDown("end", e)}
              className="border-border bg-background focus:border-primary-400 w-full rounded-xl border px-3 py-2 text-center text-sm font-semibold focus:outline-none"
            />
          </label>
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

        <div
          role="slider"
          tabIndex={0}
          data-gauge-handle="start"
          aria-label={startAriaLabel}
          aria-valuemin={minValue}
          aria-valuemax={maxValue}
          aria-valuenow={range.start}
          aria-valuetext={formatValue(range.start)}
          onKeyDown={(event) => handleHandleKeyDown("start", event)}
          className="border-primary-500 bg-surface focus:ring-primary-400/30 absolute top-1/2 z-20 size-5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 shadow-md transition-shadow focus:ring-4 focus:outline-none"
          style={startOffset}
        >
          <span className="bg-primary-400 absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>

        <div
          role="slider"
          tabIndex={0}
          data-gauge-handle="end"
          aria-label={endAriaLabel}
          aria-valuemin={minValue}
          aria-valuemax={maxValue}
          aria-valuenow={range.end}
          aria-valuetext={formatValue(range.end)}
          onKeyDown={(event) => handleHandleKeyDown("end", event)}
          className="border-primary-500 bg-surface focus:ring-primary-400/30 absolute top-1/2 z-30 size-5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 shadow-md transition-shadow focus:ring-4 focus:outline-none"
          style={endOffset}
        >
          <span className="bg-primary-400 absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>
      </div>

      {ticks && ticks.length > 0 && span > 0 && (
        <div dir="rtl" className="relative mt-2 h-7">
          {ticks.map((tick) => {
            // همان مبدأ ترک (سمت راست) برای هم‌راستا شدن تیک با اسلایدر
            const percent = (tick.position / span) * 100;
            return (
              <div
                key={tick.key}
                className="absolute top-0 translate-x-1/2"
                style={{ right: `${percent}%` }}
              >
                <span className="bg-border-strong block h-1.5 w-px" />
                <span className="text-text-gray mt-1.5 block text-[10px] whitespace-nowrap">
                  {tick.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {!isFullRange && commitOn === "apply" && (
        <p className="text-text-gray mt-3 text-center text-[11px]">
          {formatValue(range.start)} تا {formatValue(range.end)}
        </p>
      )}
    </div>
  );
}
