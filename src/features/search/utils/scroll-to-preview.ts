/**
 * اسکرول نرم به بخش «پیش‌نمایش جستجو» در لندینگ.
 *
 * چرا اینجا؟ چون هم کامپوننت سرچ (برای دکمه‌ی موبایل) و هم هر جای دیگری
 * که بخواهد کاربر را به نتیجه‌ی جستجو برساند، به یک شناسه‌ی پایدار نیاز دارد.
 * این شناسه روی `<section>` پیش‌نمایش نشسته است.
 */

export const SEARCH_PREVIEW_ID = "search-preview";

const MOBILE_QUERY = "(max-width: 767.5px)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * اسکرول به بخش پیش‌نمایش.
 *
 * @param onlyMobile اگر true باشد، فقط در عرض موبایل اسکرول می‌کند
 *                   (رفتار پیش‌فرض برای دکمه‌ی «اعمال» در باتم‌شیت).
 */
export function scrollToSearchPreview(onlyMobile = false): void {
  if (typeof window === "undefined") return;
  if (onlyMobile && !window.matchMedia(MOBILE_QUERY).matches) return;

  const target = document.getElementById(SEARCH_PREVIEW_ID);
  if (!target) return;

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

/**
 * نسخه‌ی «تأخیردار» برای بعد از بسته‌شدن باتم‌شیت موبایل.
 *
 * چرا تأخیر؟ چون شیت با انیمیشن ۴۰۰ms بسته می‌شود و قفل اسکرولِ body
 * باید اول آزاد شود؛ وگرنه اسکرول نرم اجرا نمی‌شود.
 */
export function scheduleScrollToSearchPreview(
  delayMs = 180,
  onlyMobile = true,
): void {
  if (typeof window === "undefined") return;
  window.setTimeout(() => scrollToSearchPreview(onlyMobile), delayMs);
}
