/**
 * اسکرول نرم به بخش «پیش‌نمایش جستجو» در لندینگ.
 *
 * چرا اینجا؟ چون هم کامپوننت سرچ (بعد از اعمال) و هم هر جای دیگری که
 * بخواهد کاربر را به نتیجه‌ی جستجو برساند، به یک شناسه‌ی پایدار نیاز دارد.
 * این شناسه روی `<section>` پیش‌نمایش نشسته است.
 */

export const SEARCH_PREVIEW_ID = "search-preview";

const MOBILE_QUERY = "(max-width: 767.5px)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type ScrollOptions = {
  /** فقط در عرض موبایل اسکرول کن */
  onlyMobile?: boolean;
  /** اگر بخش پیش‌نمایش همین حالا در دید است، اسکرول نکن */
  skipIfVisible?: boolean;
};

/**
 * اسکرول به بخش پیش‌نمایش.
 *
 * `block: "start"` به `scroll-mt-20` روی خود سکشن احترام می‌گذارد، پس هدر
 * زیر نوبارِ fixed پنهان نمی‌شود.
 */
export function scrollToSearchPreview(options: ScrollOptions = {}): void {
  const { onlyMobile = false, skipIfVisible = true } = options;

  if (typeof window === "undefined") return;
  if (onlyMobile && !window.matchMedia(MOBILE_QUERY).matches) return;

  const target = document.getElementById(SEARCH_PREVIEW_ID);
  if (!target) return;

  /* اگر کاربر همین حالا نتیجه را می‌بیند، جابه‌جایی بی‌فایده و آزاردهنده است */
  if (skipIfVisible) {
    const rect = target.getBoundingClientRect();
    const comfortablyVisible =
      rect.top >= 0 && rect.top < window.innerHeight * 0.45;
    if (comfortablyVisible) return;
  }

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

/**
 * نسخه‌ی «تأخیردار» برای بعد از اعمال جستجو.
 *
 * چرا تأخیر؟ در موبایل باتم‌شیت با انیمیشن ۴۰۰ms بسته می‌شود و قفل اسکرولِ
 * body باید اول آزاد شود؛ وگرنه اسکرول نرم اجرا نمی‌شود.
 */
export function scheduleScrollToSearchPreview(
  delayMs = 180,
  options: ScrollOptions = {},
): void {
  if (typeof window === "undefined") return;
  window.setTimeout(() => scrollToSearchPreview(options), delayMs);
}
