import heroImage from "@/assets/images/dark-hero-section.png";
import lakeImage from "@/assets/images/1.png";
import landscapeImage from "@/assets/images/hero-section-bg.avif";

/**
 * داده‌های ثابت سکشن‌های «محتوایی» لندینگ (تجربه‌ها، بنر و نظرات).
 *
 * ⚠️ سکشن‌های داده‌محور (`مقاصد محبوب` / `منتخب` / `لحظه‌آخری` / `اقتصادی`)
 * دیگر hard-coded نیستند و از API می‌آیند؛ پس ثابت‌های مربوط به آن‌ها
 * (`DESTINATIONS`, `FEATURED_STAYS`, `PROPERTY_CATEGORIES`) حذف شدند.
 */
export const HORIZON_IMAGES = {
  hero: heroImage,
  lake: lakeImage,
  landscape: landscapeImage,
};

export const EXPERIENCE_CARDS = [
  {
    title: "رزرو مطمئن",
    desc: "پرداخت امن و پشتیبانی واقعی در تمام مراحل رزرو",
    icon: "shield",
  },
  {
    title: "اقامتگاه‌های منتخب",
    desc: "کیفیت اقامتگاه‌ها پیش از ورود شما بررسی می‌شود",
    icon: "star",
  },
  {
    title: "تجربه‌های متفاوت",
    desc: "از جنگل و کویر تا ساحل؛ مقصد بعدی‌تان را پیدا کنید",
    icon: "spark",
  },
];

export const POPULAR_EXPERIENCES = [
  { title: "کویر", desc: "شب‌های آرام و آسمان پرستاره", image: landscapeImage },
  { title: "جنگل", desc: "هوای خنک و اقامت میان درختان", image: heroImage },
  {
    title: "کوهستان",
    desc: "طلوع‌های تماشایی در ارتفاعات",
    image: landscapeImage,
  },
  {
    title: "سواحل جنوب",
    desc: "آفتاب، دریا و آرامش بی‌پایان",
    image: lakeImage,
  },
];

export const TESTIMONIALS_HOME = [
  {
    name: "سارا محمدی",
    role: "بلاگر سفر",
    rating: "۵.۰",
    text: "همه چیز دقیقاً همان‌طور بود که در سایت دیده بودیم. از چیدمان کلبه تا منظره و پشتیبانی، یک تجربه کامل بود.",
    image: lakeImage,
  },
  {
    name: "علی رضایی",
    role: "عکاس",
    rating: "۴.۹",
    text: "برای چند روز آرامش در دل طبیعت عالی بود. مسیر رزرو ساده بود و خود اقامتگاه هم بسیار تمیز و خوش‌طراحی بود.",
    image: heroImage,
  },
  {
    name: "مریم حسینی",
    role: "کارآفرین",
    rating: "۵.۰",
    text: "برای سفر خانوادگی انتخابش کردیم و همه راضی بودند. چیزی که بیشتر دوست داشتم حس خلوت و کیفیت اقامتگاه بود.",
    image: landscapeImage,
  },
];
