/**
 * تبدیل تاریخ جلالی → میلادی.
 *
 * ⚠️ چرا الگوریتم دستی و نه کتابخانه؟ فرم پروفایل تاریخ تولد را به‌شکل
 * جلالی (`۱۳۷۰/۰۵/۱۲`) می‌گیرد ولی بک‌اند `YYYY-MM-DD` میلادی می‌خواهد.
 * `date-fns-jalali` فقط «قالب‌بندی» می‌کند و پارس/تبدیل ندارد؛
 * `react-multi-date-picker` هم سنگین و client-oriented است. این پیاده‌سازی
 * همان الگوریتم شناخته‌شده‌ی jalaali-js (Borkowski) است، بدون وابستگی و
 * قابل استفاده در Server Action.
 *
 * مرجع الگوریتم: https://github.com/jalaali/jalaali-js (MIT)
 */

/** مرزهای سال‌های کبیسه/جهش تقویم جلالی — همان جدول jalaali-js. */
const BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394,
  2456, 3178,
] as const;

function div(a: number, b: number): number {
  return Math.trunc(a / b);
}

function mod(a: number, b: number): number {
  return a - Math.trunc(a / b) * b;
}

/** محاسبه‌ی کبیسه‌بودن و روز شروع سال جلالی نسبت به تقویم میلادی. */
function jalCal(jy: number): { leap: number; gy: number; march: number } {
  const bl = BREAKS.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp: number = BREAKS[0];
  let jm = 0;
  let jump = 0;

  if (jy < jp || jy >= BREAKS[bl - 1]) {
    throw new RangeError(`Invalid Jalaali year ${jy}`);
  }

  for (let i = 1; i < bl; i += 1) {
    jm = BREAKS[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }

  let n = jy - jp;

  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;

  const march = 20 + leapJ - leapG;

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;

  return { leap, gy, march };
}

/** شماره‌ی روز مطلق (Julian Day Number) از تاریخ میلادی. */
function g2d(gy: number, gm: number, gd: number): number {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

/** تبدیل شماره‌ی روز مطلق به تاریخ میلادی. */
function d2g(jdn: number): { gy: number; gm: number; gd: number } {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

/** شماره‌ی روز مطلق از تاریخ جلالی. */
function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function isLeapJalaaliYear(jy: number): boolean {
  return jalCal(jy).leap === 0;
}

/** تعداد روزهای یک ماه جلالی (۱..۶ = ۳۱، ۷..۱۱ = ۳۰، اسفند = ۲۹/۳۰). */
function jalaaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaaliYear(jy) ? 30 : 29;
}

/** تبدیل تاریخ جلالی به میلادی. */
export function jalaliToGregorian(
  jy: number,
  jm: number,
  jd: number,
): { gy: number; gm: number; gd: number } {
  return d2g(j2d(jy, jm, jd));
}

/** ورودی جلالی: `۱۳۷۰/۰۵/۱۲` (بعد از نرمال‌سازی ارقام، لاتین). */
const JALALI_INPUT_PATTERN = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;

/**
 * بازه‌ی سال جلالی قابل قبول برای «تاریخ تولد».
 *
 * ⚠️ عمداً گشاد است (۱۳۰۰ ≈ ۱۹۲۱ تا ۱۴۲۰ ≈ ۲۰۴۱) تا فقط ورودی بی‌معنا رد
 * شود؛ سخت‌گیری دقیق‌تر (مثلاً «نباید در آینده باشد») کار بک‌اند است.
 */
const MIN_JALALI_YEAR = 1300;
const MAX_JALALI_YEAR = 1420;

/**
 * تبدیل ورودی جلالی `YYYY/MM/DD` به تاریخ میلادی ISO (`YYYY-MM-DD`).
 *
 * ⚠️ اعتبارسنجی واقعی تاریخ (طول ماه/کبیسه) همین‌جا انجام می‌شود تا مقدار
 * بی‌معنا به بک‌اند نرود.
 *
 * @returns رشته‌ی `YYYY-MM-DD`، یا `null` اگر ورودی نامعتبر باشد.
 */
export function jalaliToIsoDate(input: string): string | null {
  const match = JALALI_INPUT_PATTERN.exec(input.trim());
  if (!match) return null;

  const jy = Number(match[1]);
  const jm = Number(match[2]);
  const jd = Number(match[3]);

  if (jy < MIN_JALALI_YEAR || jy > MAX_JALALI_YEAR) return null;
  if (jm < 1 || jm > 12) return null;
  if (jd < 1 || jd > jalaaliMonthLength(jy, jm)) return null;

  const { gy, gm, gd } = jalaliToGregorian(jy, jm, jd);
  return `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`;
}
