type ScrollOptions = {
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
};

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
