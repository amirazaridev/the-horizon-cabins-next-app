//* انتخابگرهای انیمیشن لندینگ.
export const ANIM = {
  /** خودِ هیرو — مبنای تریگر پارالاکس. */
  hero: '[data-animate="hero"]',
  heroBg: '[data-animate="hero-bg"]',
  heroWord: '[data-animate="hero-word"]',
  heroCopy: '[data-animate="hero-copy"]',
  search: '[data-animate="search"]',
  categoryCard: '[data-animate="category-card"]',
  stayCard: '[data-animate="stay-card"]',
  reveal: '[data-animate="reveal"]',
} as const;

/** المان‌هایی که باید در حالت خطا/پاک‌سازی از پراپ‌های GSAP آزاد شوند. */
export const HERO_INTRO_SELECTORS = [ANIM.heroWord, ANIM.heroCopy, ANIM.search];
