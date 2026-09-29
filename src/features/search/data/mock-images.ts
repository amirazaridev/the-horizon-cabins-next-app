/**
 * تصاویر جایگزین برای کارت‌های پیش‌نمایش در حالت ماک.
 *
 * چرا لازم است؟ چون دامنه‌ی `next/image` فقط برای هاست تصاویر واقعی
 * (Supabase) باز است و نمی‌توان آدرس تصویر دلخواهی گذاشت. بعد از اتصال
 * API واقعی، این فایل بی‌استفاده می‌شود (چون `source === "api"`).
 */

import aboutSection from "@/assets/images/about-section.png";
import authImage from "@/assets/images/auth.png";
import darkHero from "@/assets/images/dark-hero-section.png";
import darkHero2 from "@/assets/images/dark-hero-section1.jpeg";
import lakeImage from "@/assets/images/1.png";
import landscape from "@/assets/images/hero-section-bg.avif";

export const MOCK_CABIN_IMAGES = [
  darkHero,
  lakeImage,
  landscape,
  aboutSection,
  darkHero2,
  authImage,
];
