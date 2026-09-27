export function safeParseNumber(value: string | undefined, min: number, max: number) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) return undefined;
  return n;
}