export type PriceRangeTuple = [min: number, max: number];

/** هر طرف بازه باید یک عدد صحیح نامنفیِ خالص باشد (`12`, `0` — نه `""`, `-5`, `1e5`). */
const NON_NEGATIVE_INTEGER = /^\d+$/;

export function parsePriceRange(
  raw: string | null | undefined,
): PriceRangeTuple | undefined {
  if (!raw) return undefined;

  const parts = raw.split("-");
  if (parts.length !== 2) return undefined;

  const [rawLo, rawHi] = parts.map((part) => part.trim());

  if (!NON_NEGATIVE_INTEGER.test(rawLo) || !NON_NEGATIVE_INTEGER.test(rawHi)) {
    return undefined;
  }

  const lo = Number(rawLo);
  const hi = Number(rawHi);

  if (hi <= 0 || hi < lo) return undefined;

  return [lo, hi];
}

export function formatPriceRange(min: number, max: number): string {
  const [lo, hi] = min <= max ? [min, max] : [max, min];
  return `${lo}-${hi}`;
}
