/**
 * بازه‌ی قیمت — ابزار مشترک و خالص.
 *
 * قرارداد رشته‌ای پروژه برای بازه‌ی قیمت `lo-hi` است (مثل `1000000-8000000`).
 * این ماژول تنها محل پارس/ساخت آن است تا منطق در سرچ و فیلترها تکرار نشود.
 */

export type PriceRangeTuple = [min: number, max: number];

/** هر طرف بازه باید یک عدد صحیح نامنفیِ خالص باشد (`12`, `0` — نه `""`, `-5`, `1e5`). */
const NON_NEGATIVE_INTEGER = /^\d+$/;

/**
 * پارس امن `lo-hi`.
 *
 * ⚠️ چرا این‌قدر سخت‌گیر است؟ نسخه‌ی قبلی `Number(part)` می‌گرفت و
 * `Number("")` در جاوااسکریپت `0` است؛ پس ورودی `"-5000"` به `["", "5000"]`
 * می‌شکست و بازه‌ی **غلط** `[0, 5000]` را **می‌پذیرفت**. همچنین ورودی
 * چندخط‌تیره (`"1000-2000-3000"`) بی‌صدا به دو عضو اول کوتاه می‌شد.
 *
 * اکنون: دقیقاً دو عضو، هر دو عدد صحیح نامنفی، و `hi >= lo`.
 * هر ورودی نامعتبر `undefined` برمی‌گرداند.
 */
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

/**
 * ساخت رشته‌ی `lo-hi`.
 *
 * ترتیب را نرمال می‌کند تا خروجی همیشه با `parsePriceRange` رفت‌وبرگشت
 * معتبر بماند (وگرنه یک بازه‌ی معکوس به رشته‌ای تبدیل می‌شد که پارسش
 * `undefined` می‌دهد ⇒ از دست رفتن بی‌صدای فیلتر).
 */
export function formatPriceRange(min: number, max: number): string {
  const [lo, hi] = min <= max ? [min, max] : [max, min];
  return `${lo}-${hi}`;
}
