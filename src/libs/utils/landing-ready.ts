/**
 * سیگنال «لندینگ آماده است».
 *
 * پیش‌لودر لندینگ و انیمیشن ورودِ Navbar باید دقیقاً هم‌زمان پخش شوند، اما
 * در دو جای مختلف درختِ کامپوننت‌ها زندگی می‌کنند (Navbar در layout،
 * پیش‌لودر داخل صفحه). این ماژول یک نقطه‌ی اشتراکِ سبک و بدون وابستگی
 * بینشان است.
 *
 * رفتار:
 *  - `markLandingReady` فقط یک‌بار در طول عمر هر بارگذاری صفحه اثر دارد.
 *  - هر کسی که دیرتر mount شود و `isLandingReady()` را `true` ببیند،
 *    می‌فهمد که «مراسم ورود قبلاً پخش شده» و نباید دوباره انیمیشن بزند.
 */

let ready = false;
const listeners = new Set<() => void>();

/** آیا مراسم ورود لندینگ قبلاً پخش شده است؟ */
export function isLandingReady(): boolean {
  return ready;
}

/** اعلام آمادگی — همه‌ی مشترکین را یک‌بار صدا می‌زند */
export function markLandingReady(): void {
  if (ready) return;
  ready = true;
  listeners.forEach((listener) => listener());
}

/** اشتراک روی سیگنال؛ تابع لغو اشتراک برمی‌گرداند */
export function subscribeLandingReady(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
