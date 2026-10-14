export function safeRatio(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null;
  return numerator / denominator;
}

export function perNightAmount(totalPrice: number, numNights: number): number {
  if (numNights <= 0) return totalPrice;
  return Math.floor(totalPrice / numNights);
}

export function perNightAmountExact(
  totalPrice: number,
  numNights: number,
  index: number,
): number {
  if (numNights <= 0) return index === 0 ? totalPrice : 0;
  const base = Math.floor(totalPrice / numNights);
  const remainder = totalPrice % numNights;
  // باقی‌مانده به شب‌های ابتدایی اضافه می‌شود (یکی‌یکی)
  return index < remainder ? base + 1 : base;
}
