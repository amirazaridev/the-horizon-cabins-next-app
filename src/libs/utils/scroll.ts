type ScrollOptions = {
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
};

/**
 * اسکرول به یک المان با رعایت `prefers-reduced-motion`.
 *
 * چرا لازم است؟ `scroll-behavior: smooth` که در `globals.css` ست شده فقط
 * روی اسکرول‌های CSS (مثل پرش لینک داخلی) اثر دارد؛ `scrollIntoView` یک
 * API جاوااسکریپتی است و آن تنظیم را نادیده می‌گیرد. پس اگر کاربر
 * «کاهش انیمیشن» را روشن کرده باشد، این تابع بدون انیمیشن اسکرول می‌کند.
 */
export function smoothScrollIntoView(
  target: HTMLElement | null | undefined,
  options: ScrollOptions = {},
): void {
  if (!target) return;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: options.block ?? "start",
    inline: options.inline ?? "nearest",
  });
}

/** اسکرول به سکشنی با `id` مشخص */
export function smoothScrollToId(
  id: string,
  options: ScrollOptions = {},
): void {
  smoothScrollIntoView(document.getElementById(id), options);
}
