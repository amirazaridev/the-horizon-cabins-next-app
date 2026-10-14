import type { GaugeRange } from "./types";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** عدد لاتین با جداکننده — قالب داخل `input`. */
export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

/** عدد لاتین یا فارسی/عربی را به `number` تبدیل می‌کند. */
export function parseDigits(raw: string): number {
  const normalized = raw
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[^\d]/g, "");

  return normalized === "" ? Number.NaN : Number(normalized);
}

export function normalizeRange(
  range: GaugeRange,
  {
    min,
    max,
    gap,
    sort = false,
  }: { min: number; max: number; gap: number; sort?: boolean },
): GaugeRange {
  let { start, end } = range;

  if (sort && start > end) [start, end] = [end, start];

  start = clamp(start, min, max);
  end = clamp(end, min, max);

  return {
    start: Math.min(start, end - gap),
    end: Math.max(end, start + gap),
  };
}

export function valueFromClientX(
  clientX: number,
  track: HTMLElement | null,
  { min, max, step }: { min: number; max: number; step: number },
): number {
  if (!track) return min;

  const span = Math.max(max - min, 0);
  if (span === 0) return min;

  const rect = track.getBoundingClientRect();

  const isRtl = getComputedStyle(track).direction === "rtl";
  const offset = isRtl ? rect.right - clientX : clientX - rect.left;
  const ratio = offset / rect.width;

  const rawValue = min + ratio * span;
  const snapped = min + Math.round((rawValue - min) / step) * step;

  return clamp(snapped, min, max);
}
