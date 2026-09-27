"use client";

import {
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

interface RangeGaugeProps {
  startIndex: number;
  endIndex: number;
  min?: number;
  max?: number;
  step?: number;
  formatValue: (value: number) => string;
  startAriaLabel: string;
  endAriaLabel: string;
  onCommit: (range: GaugeRange) => void;
  ticks?: GaugeTick[];
  showInputs?: boolean;
}

type DragHandle = "start" | "end";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function snapToStep(value: number, step: number, min: number): number {
  return Math.round((value - min) / step) * step + min;
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export default function RangeGauge({
  startIndex,
  endIndex,
  min = 1_000_000,
  max = 30_000_000,
  step = 100_000,
  formatValue,
  startAriaLabel,
  endAriaLabel,
  onCommit,
  ticks,
  showInputs = true,
}: RangeGaugeProps) {
  const [indices, setIndices] = useState<GaugeRange>({
    start: startIndex,
    end: endIndex,
  });
  const [startInput, setStartInput] = useState(formatNumber(startIndex));
  const [endInput, setEndInput] = useState(formatNumber(endIndex));

  const indicesRef = useRef<GaugeRange>(indices);
  const activeHandleRef = useRef<DragHandle | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const maxIndex = max - min;
  const startPercent = ((indices.start - min) / maxIndex) * 100;
  const endPercent = ((indices.end - min) / maxIndex) * 100;

  function updateHandle(handle: DragHandle, nextValue: number): void {
    const snapped = snapToStep(nextValue, step, min);
    setIndices((current) => {
      const next: GaugeRange =
        handle === "start"
          ? { start: Math.min(snapped, current.end), end: current.end }
          : { start: current.start, end: Math.max(snapped, current.start) };

      indicesRef.current = next;
      setStartInput(formatNumber(next.start));
      setEndInput(formatNumber(next.end));
      return next;
    });
  }

  function commitCurrentRange(): void {
    onCommit({ ...indicesRef.current });
  }

  function getValueFromClientX(clientX: number): number {
    const track = trackRef.current;
    if (!track) return min;

    const rect = track.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const rawValue = min + ratio * maxIndex;
    return clamp(snapToStep(rawValue, step, min), min, max);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>): void {
    if (event.button !== 0 || !trackRef.current) return;

    const nextValue = getValueFromClientX(event.clientX);
    const distanceToStart = Math.abs(nextValue - indicesRef.current.start);
    const distanceToEnd = Math.abs(nextValue - indicesRef.current.end);

    const handle: DragHandle =
      distanceToStart <= distanceToEnd ? "start" : "end";

    activeHandleRef.current = handle;
    updateHandle(handle, nextValue);

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>): void {
    if (!activeHandleRef.current) return;
    updateHandle(activeHandleRef.current, getValueFromClientX(event.clientX));
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
    const currentValue = indicesRef.current[handle];
    let nextValue: number | null = null;

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      nextValue = currentValue - step;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      nextValue = currentValue + step;
    }
    if (event.key === "Home") nextValue = min;
    if (event.key === "End") nextValue = max;

    if (nextValue === null) return;

    event.preventDefault();
    updateHandle(handle, clamp(nextValue, min, max));
  }

  function handleInputChange(
    handle: DragHandle,
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const raw = event.target.value.replace(/[^\d]/g, "");
    const numeric = Number(raw);

    if (handle === "start") {
      setStartInput(raw ? formatNumber(numeric) : "");
    } else {
      setEndInput(raw ? formatNumber(numeric) : "");
    }

    if (!Number.isFinite(numeric)) return;

    const clamped = clamp(numeric, min, max);
    updateHandle(handle, clamped);
  }

  function handleInputBlur(handle: DragHandle): void {
    const inputValue = handle === "start" ? startInput : endInput;
    const numeric = Number(inputValue.replace(/[^\d]/g, ""));

    if (!Number.isFinite(numeric)) {
      setStartInput(formatNumber(indicesRef.current.start));
      setEndInput(formatNumber(indicesRef.current.end));
      return;
    }

    const clamped = clamp(numeric, min, max);
    updateHandle(handle, clamped);
    commitCurrentRange();
  }

  function handleInputKeyDown(
    handle: DragHandle,
    event: KeyboardEvent<HTMLInputElement>,
  ): void {
    if (event.key === "Enter") {
      event.preventDefault();
      handleInputBlur(handle);
    }
  }

  return (
    <div className="border-border bg-surface w-full rounded-2xl border p-4 sm:p-5">
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
              onBlur={() => handleInputBlur("start")}
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
              onBlur={() => handleInputBlur("end")}
              onKeyDown={(e) => handleInputKeyDown("end", e)}
              className="border-border bg-background focus:border-primary-400 w-full rounded-xl border px-3 py-2 text-center text-sm font-semibold focus:outline-none"
            />
          </label>
        </div>
      )}

      <div
        ref={trackRef}
        dir="ltr"
        className="relative h-12 cursor-ew-resize touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="border-border bg-surface-raised absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 overflow-hidden rounded-full border shadow-inner">
          <div
            className="from-primary-300 via-primary-400 to-primary-500 absolute inset-y-0 bg-gradient-to-r"
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
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={indices.start}
          aria-valuetext={formatValue(indices.start)}
          onKeyDown={(event) => handleKeyDown("start", event)}
          onKeyUp={commitCurrentRange}
          className="border-primary-500 bg-surface focus:ring-primary-400/30 absolute top-1/2 z-20 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-md transition-shadow focus:ring-4 focus:outline-none"
          style={{ left: `${startPercent}%` }}
        >
          <span className="bg-primary-400 absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>

        <div
          role="slider"
          tabIndex={0}
          aria-label={endAriaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={indices.end}
          aria-valuetext={formatValue(indices.end)}
          onKeyDown={(event) => handleKeyDown("end", event)}
          onKeyUp={commitCurrentRange}
          className="border-primary-500 bg-surface focus:ring-primary-400/30 absolute top-1/2 z-30 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-md transition-shadow focus:ring-4 focus:outline-none"
          style={{ left: `${endPercent}%` }}
        >
          <span className="bg-primary-400 absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>
      </div>

      {ticks && ticks.length > 0 && (
        <div dir="ltr" className="relative mt-2 h-7">
          {ticks.map((tick) => {
            const percent = (tick.position / maxIndex) * 100;
            return (
              <div
                key={tick.key}
                className="absolute top-0 -translate-x-1/2"
                style={{ left: `${percent}%` }}
              >
                <span className="bg-border-strong block h-1.5 w-px" />
                <span className="mt-1.5 block text-[10px] whitespace-nowrap text-text-gray">
                  {tick.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
