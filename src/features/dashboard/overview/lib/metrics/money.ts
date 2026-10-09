/**
 * ابزارهای کار با مبالغ پولی.
 *
 * `Booking.totalPrice` در Prisma از نوع `Int` است، پس مبالغ در فرانت هم
 * `number` هستند (بدون `bigint`). مبالغ ایرانی (تومان) به‌راحتی در محدوده‌ی
 * `Number.MAX_SAFE_INTEGER` جا می‌شوند.
 */

/**
 * تقسیم دو عدد با محافظت از صفر.
 * برای نسبت‌هایی مثل `SoldNights / AvailableNights` یا `Revenue / Nights`.
 */
export function safeRatio(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null;
  return numerator / denominator;
}

/**
 * سهم یک شب از کل مبلغ رزرو.
 *
 * درآمد در این داشبورد **شب‌به‌شب (prorated)** توزیع می‌شود. برای رزروی
 * که `numNights = 3` دارد، هر شب یک‌سوم `totalPrice` را می‌گیرد. اگر
 * `numNights` صفر یا نامعتبر باشد، کل مبلغ به شب صفر نسبت داده می‌شود.
 */
export function perNightAmount(totalPrice: number, numNights: number): number {
  if (numNights <= 0) return totalPrice;
  return Math.floor(totalPrice / numNights);
}

/**
 * اصلاح خطای گردکردن: وقتی مبلغ را بین N شب تقسیم می‌کنیم، باقی‌مانده‌ی
 * تقسیم صحیح گم می‌شود. این تابع سهم دقیق شبِ `index` را می‌دهد به‌طوری‌که
 * **جمع همه‌ی شب‌ها دقیقاً برابر `totalPrice`** باشد.
 */
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
