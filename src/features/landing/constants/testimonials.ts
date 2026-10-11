import type { StaticImageData } from "next/image";
import { HORIZON_IMAGES } from "@/features/landing/constants/images";

export type Testimonial = {
  name: string;
  role: string;
  /** امتیاز از ۵. */
  rating: number;
  text: string;
  image: StaticImageData;
};

export const TESTIMONIALS_HOME: Testimonial[] = [
  {
    name: "سارا محمدی",
    role: "بلاگر سفر",
    rating: 5,
    text: "همه چیز دقیقاً همان‌طور بود که در سایت دیده بودیم. از چیدمان کلبه تا منظره و پشتیبانی، یک تجربه کامل بود.",
    image: HORIZON_IMAGES.lake,
  },
  {
    name: "علی رضایی",
    role: "عکاس",
    rating: 4.9,
    text: "برای چند روز آرامش در دل طبیعت عالی بود. مسیر رزرو ساده بود و خود اقامتگاه هم بسیار تمیز و خوش‌طراحی بود.",
    image: HORIZON_IMAGES.hero,
  },
  {
    name: "مریم حسینی",
    role: "کارآفرین",
    rating: 5,
    text: "برای سفر خانوادگی انتخابش کردیم و همه راضی بودند. چیزی که بیشتر دوست داشتم حس خلوت و کیفیت اقامتگاه بود.",
    image: HORIZON_IMAGES.landscape,
  },
];
