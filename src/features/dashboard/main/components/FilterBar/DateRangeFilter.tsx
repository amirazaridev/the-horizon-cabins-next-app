"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  addDays,
  differenceInCalendarDays,
  isSameDay,
  startOfDay,
} from "date-fns";

import {
  formatDateKey,
  formatJalaliDayMonth,
  getDateAtIndex,
  getDateIndex,
  getGaugeDomain,
  getJalaliMonthTicks,
} from "../../lib/date-range";

interface DateRangeFilterProps {
  from: Date;
  to: Date;
  onChange: (from: Date, to: Date) => void;
}

type DragHandle = "start" | "end";

interface RangeIndices {
  start: number;
  end: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export default function DateRangeFilter({
  from,
  to,
  onChange,
}: DateRangeFilterProps) {
  const today = useMemo(() => startOfDay(new Date()), []);

  const domain = useMemo(
    () => getGaugeDomain(today, from, to),
    [today, from, to],
  );

  const maxIndex = Math.max(
    1,
    differenceInCalendarDays(domain.to, domain.from),
  );

  const propStartIndex = clamp(getDateIndex(from, domain.from), 0, maxIndex);
  const propEndIndex = clamp(getDateIndex(to, domain.from), 0, maxIndex);

  const [indices, setIndices] = useState<RangeIndices>({
    start: propStartIndex,
    end: propEndIndex,
  });

  const indicesRef = useRef<RangeIndices>(indices);
  const activeHandleRef = useRef<DragHandle | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nextIndices = {
      start: propStartIndex,
      end: propEndIndex,
    };

    indicesRef.current = nextIndices;
    setIndices(nextIndices);
  }, [propStartIndex, propEndIndex]);

  const selectedFrom = getDateAtIndex(domain.from, indices.start);
  const selectedTo = getDateAtIndex(domain.from, indices.end);

  const startPercent = (indices.start / maxIndex) * 100;
  const endPercent = (indices.end / maxIndex) * 100;

  const monthTicks = useMemo(() => getJalaliMonthTicks(domain), [domain]);

  function updateHandle(handle: DragHandle, nextIndex: number): void {
    setIndices((current) => {
      const next: RangeIndices =
        handle === "start"
          ? {
              start: Math.min(nextIndex, current.end),
              end: current.end,
            }
          : {
              start: current.start,
              end: Math.max(nextIndex, current.start),
            };

      indicesRef.current = next;
      return next;
    });
  }

  function commitCurrentRange(): void {
    const current = indicesRef.current;
    const nextFrom = getDateAtIndex(domain.from, current.start);
    const nextTo = getDateAtIndex(domain.from, current.end);

    if (!isSameDay(nextFrom, from) || !isSameDay(nextTo, to)) {
      onChange(nextFrom, nextTo);
    }
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

    if (event.key === "Home") {
      nextIndex = 0;
    }

    if (event.key === "End") {
      nextIndex = maxIndex;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    updateHandle(handle, clamp(nextIndex, 0, maxIndex));
  }

  return (
    <div className="border-border bg-surface w-full rounded-2xl border p-4 sm:p-5">
      <div
        dir="rtl"
        className="mb-6 flex items-center justify-between gap-4 text-xs sm:text-sm"
      >
        <div>
          <span className="text-text-gray block text-[11px]">از</span>
          <strong className="text-text font-semibold">
            {formatJalaliDayMonth(selectedFrom)}
          </strong>
        </div>

        <span className="bg-border h-px flex-1" />

        <div className="text-end">
          <span className="text-text-gray block text-[11px]">تا</span>
          <strong className="text-text font-semibold">
            {formatJalaliDayMonth(selectedTo)}
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
          aria-label="انتخاب تاریخ شروع"
          aria-valuemin={0}
          aria-valuemax={maxIndex}
          aria-valuenow={indices.start}
          aria-valuetext={formatJalaliDayMonth(selectedFrom)}
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
          aria-label="انتخاب تاریخ پایان"
          aria-valuemin={0}
          aria-valuemax={maxIndex}
          aria-valuenow={indices.end}
          aria-valuetext={formatJalaliDayMonth(selectedTo)}
          onKeyDown={(event) => handleKeyDown("end", event)}
          onKeyUp={commitCurrentRange}
          className="border-primary-500 bg-surface focus:ring-primary-400/30 absolute top-1/2 z-30 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-md transition-shadow focus:ring-4 focus:outline-none"
          style={{ left: `${endPercent}%` }}
        >
          <span className="bg-primary-400 absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>
      </div>

      <div dir="ltr" className="relative mt-2 h-7">
        {monthTicks.map((tick) => {
          const percent = (tick.position / maxIndex) * 100;

          return (
            <div
              key={formatDateKey(tick.date)}
              className="absolute top-0 -translate-x-1/2"
              style={{ left: `${percent}%` }}
            >
              <span className="bg-border-strong block h-1.5 w-px" />
              <span className="text-text-gray mt-1.5 hidden text-[10px] whitespace-nowrap sm:block">
                {tick.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}