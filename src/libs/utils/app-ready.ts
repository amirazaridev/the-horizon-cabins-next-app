/**
 * سیگنال «آماده‌شدن اپلیکیشن» — منبع واحد.
 *
 * دو مصرف‌کننده دارد:
 *  - لندینگ (`LandingAnimationProvider`) وقتی پیش‌لودر تمام شد اعلام می‌کند.
 *  - نوار بالا (`Navbar`) تا انیمیشن ورودش را بعد از لندینگ پخش کند و با
 *    ورود هیرو هم‌پوشانی نکند.
 *
 * ⚠️ چرا در `libs` ماند و به `features/landing/lib` منتقل نشد؟ چون
 * `Navbar` یک کامپوننت مشترک در `components/ui` است؛ اگر این ماژول داخل
 * فیچر لندینگ می‌رفت، `components/ui → features/landing` یک وابستگی
 * **معکوس** می‌شد که از مشکل اصلی بدتر است. پس به‌جای جابه‌جایی، نام و
 * API از «لندینگ‌محور» به «آماده‌بودن اپ» تعمیم داده شد.
 *
 * ⚠️ نکته‌ی SSR: این ماژول state سطح‌ماژول دارد. هرگز نباید روی سرور
 * به‌عنوان منبع وضعیت بین درخواست‌ها به آن تکیه کرد؛ فقط در کلاینت
 * استفاده می‌شود.
 */

let ready = false;

const listeners = new Set<() => void>();

/** آیا آمادگی اپ قبلاً اعلام شده است؟ */
export function isAppReady(): boolean {
  return ready;
}

/** اعلام آمادگی و اطلاع‌رسانی به مشترکین فعلی (idempotent). */
export function markAppReady(): void {
  if (ready) return;

  ready = true;

  const currentListeners = [...listeners];
  listeners.clear();

  currentListeners.forEach((listener) => {
    listener();
  });
}

/**
 * اشتراک در وضعیت آمادگی.
 *
 * اگر آمادگی از قبل اعلام شده باشد، لیسنر **همان لحظه** صدا زده می‌شود و
 * یک unsubscribe بی‌اثر برمی‌گردد؛ پس مصرف‌کننده نیازی به چک‌کردن
 * `isAppReady()` قبل از اشتراک ندارد.
 */
export function subscribeAppReady(listener: () => void): () => void {
  if (ready) {
    listener();
    return () => {};
  }

  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
