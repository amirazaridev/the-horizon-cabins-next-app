"use client";

import {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

export interface GaugeTick {
  key: string;
  label: string;
  position: number;
}

export interface GaugeRange {
  start: number;
  end: number;
}

interface RangeGaugeProps {
  startIndex: number;
  endIndex: number;
  maxIndex: number;
  formatValue: (index: number) => string;
  ticks: GaugeTick[];
  startAriaLabel: string;
  endAriaLabel: string;
  /** فقط وقتی کاربر رها می‌کند (pointer-up / key-up) صدا زده می‌شود */
  onCommit: (range: GaugeRange) => void;
  /** پیش‌فرض true — مثل گیج روز، لیبل تیک‌ها در موبایل مخفی می‌شود */
  hideTickLabelsOnMobile?: boolean;
}

type DragHandle = "start" | "end";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * اسلایدر دو دسته‌ای عمومی (استخراج‌شده از DateRangeFilter)
 * state داخلی دارد و با تغییر props همگام می‌شود؛ والد فقط commit را می‌گیرد
 */
export default function RangeGauge({
  startIndex,
  endIndex,
  maxIndex,
  formatValue,
  ticks,
  startAriaLabel,
  endAriaLabel,
  onCommit,
  hideTickLabelsOnMobile = true,
}: RangeGaugeProps) {
  // پنل با هر بار باز شدن mount تازه می‌شود و تب‌ها هم unmount/remount
  // می‌شوند، پس state داخلی فقط از props اولیه ساخته می‌شود (بدون effect همگام‌ساز)
  const [indices, setIndices] = useState<GaugeRange>({
    start: startIndex,
    end: endIndex,
  });

  const indicesRef = useRef<GaugeRange>(indices);
  const activeHandleRef = useRef<DragHandle | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const startPercent = (indices.start / maxIndex) * 100;
  const endPercent = (indices.end / maxIndex) * 100;

  const tickLabelClass = hideTickLabelsOnMobile
    ? "mt-1.5 hidden text-[10px] whitespace-nowrap text-text-gray sm:block"
    : "mt-1.5 text-[10px] whitespace-nowrap text-text-gray";

  function updateHandle(handle: DragHandle, nextIndex: number): void {
    setIndices((current) => {
      const next: GaugeRange =
        handle === "start"
          ? { start: Math.min(nextIndex, current.end), end: current.end }
          : { start: current.start, end: Math.max(nextIndex, current.start) };

      indicesRef.current = next;
      return next;
    });
  }

  function commitCurrentRange(): void {
    onCommit({ ...indicesRef.current });
  }

  function getIndexFromClientX(clientX: number): number {
    const track = trackRef.current;
    if (!track) return 0;

    const rect = track.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;

    return clamp(Math.round(ratio * maxIndex), 0, maxIndex);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>): void {
    if (event.button !== 0 || !trackRef.current) return;

    const nextIndex = getIndexFromClientX(event.clientX);
    const distanceToStart = Math.abs(nextIndex - indicesRef.current.start);
    const distanceToEnd = Math.abs(nextIndex - indicesRef.current.end);

    const handle: DragHandle =
      distanceToStart <= distanceToEnd ? "start" : "end";

    activeHandleRef.current = handle;
    updateHandle(handle, nextIndex);

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>): void {
    if (!activeHandleRef.current) return;

    updateHandle(
      activeHandleRef.current,
      getIndexFromClientX(event.clientX),
    );
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>): void {
    if (!activeHandleRef.current) return;

    commitCurrentRange();
    activeHandleRef.current = null;

    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function handleKeyDown(
    handle: DragHandle,
    event: KeyboardEvent<HTMLDivElement>,
  ): void {
    const currentIndex = indicesRef.current[handle];
    let nextIndex: number | null = null;

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      nextIndex = currentIndex - 1;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      nextIndex = currentIndex + 1;
    }

    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = maxIndex;

    if (nextIndex === null) return;

    event.preventDefault();
    updateHandle(handle, clamp(nextIndex, 0, maxIndex));
  }

  return (
    <div className="w-full rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div
        dir="rtl"
        className="mb-6 flex items-center justify-between gap-4 text-xs sm:text-sm"
      >
        <div>
          <span className="block text-[11px] text-text-gray">از</span>
          <strong className="font-semibold text-text">
            {formatValue(indices.start)}
          </strong>
        </div>

        <span className="h-px flex-1 bg-border" />

        <div className="text-end">
          <span className="block text-[11px] text-text-gray">تا</span>
          <strong className="font-semibold text-text">
            {formatValue(indices.end)}
          </strong>
        </div>
      </div>

      <div
        ref={trackRef}
        dir="ltr"
        className="relative h-12 cursor-ew-resize touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 overflow-hidden rounded-full border border-border bg-surface-raised shadow-inner">
          <div
            className="absolute inset-y-0 bg-gradient-to-r from-primary-300 via-primary-400 to-primary-500"
            style={{
              left: `${startPercent}%`,
              width: `${Math.max(endPercent - startPercent, 0)}%`,
            }}
          />
        </div>

        <div
          role="slider"
          tabIndex={0}
          aria-label={startAriaLabel}
          aria-valuemin={0}
          aria-valuemax={maxIndex}
          aria-valuenow={indices.start}
          aria-valuetext={formatValue(indices.start)}
          onKeyDown={(event) => handleKeyDown("start", event)}
          onKeyUp={commitCurrentRange}
          className="absolute top-1/2 z-20 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary-500 bg-surface shadow-md transition-shadow focus:outline-none focus:ring-4 focus:ring-primary-400/30"
          style={{ left: `${startPercent}%` }}
        >
          <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400" />
        </div>

        <div
          role="slider"
          tabIndex={0}
          aria-label={endAriaLabel}
          aria-valuemin={0}
          aria-valuemax={maxIndex}
          aria-valuenow={indices.end}
          aria-valuetext={formatValue(indices.end)}
          onKeyDown={(event) => handleKeyDown("end", event)}
          onKeyUp={commitCurrentRange}
          className="absolute top-1/2 z-30 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary-500 bg-surface shadow-md transition-shadow focus:outline-none focus:ring-4 focus:ring-primary-400/30"
          style={{ left: `${endPercent}%` }}
        >
          <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400" />
        </div>
      </div>

      <div dir="ltr" className="relative mt-2 h-7">
        {ticks.map((tick) => {
          const percent = (tick.position / maxIndex) * 100;

          return (
            <div
              key={tick.key}
              className="absolute top-0 -translate-x-1/2"
              style={{ left: `${percent}%` }}
            >
              <span className="block h-1.5 w-px bg-border-strong" />
              <span className={tickLabelClass}>{tick.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
