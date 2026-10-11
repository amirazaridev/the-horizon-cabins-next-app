//* انتخابگرهای انیمیشن لندینگ.
export const ANIM = {
  /** خودِ هیرو — مبنای تریگر پارالاکس. */
  hero: '[data-animate="hero"]',
  heroBg: '[data-animate="hero-bg"]',
  heroEyebrow: '[data-animate="hero-eyebrow"]',
  heroWord: '[data-animate="hero-word"]',
  heroCopy: '[data-animate="hero-copy"]',
  scrollIndicator: '[data-animate="scroll-indicator"]',
  search: '[data-animate="search"]',
  categoryHeading: '[data-animate="category-heading"]',
  categoryCard: '[data-animate="category-card"]',
  stayCard: '[data-animate="stay-card"]',
  reveal: '[data-animate="reveal"]',
} as const;

/** المان‌هایی که باید در حالت خطا/پاک‌سازی از پراپ‌های GSAP آزاد شوند. */
export const HERO_INTRO_SELECTORS = [
  ANIM.heroEyebrow,
  ANIM.heroWord,
  ANIM.heroCopy,
  ANIM.search,
  ANIM.scrollIndicator,
];
