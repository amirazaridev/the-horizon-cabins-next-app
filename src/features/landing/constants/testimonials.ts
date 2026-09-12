export type Testimonial = {
  id: number;
  name: string;
  role: string;
  image: string;
  text: string;
  rating: number;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "سارا محمدی",
    role: "بلاگر سفر",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    text: "تجربه‌ای واقعاً جادویی بود. کابین از تمام انتظارات ما فراتر رفت. از خواب بیدار شدن با آن منظره‌های کوهستانی واقعاً فوق‌العاده بود.",
    rating: 5,
  },
  {
    id: 2,
    name: "علی رضایی",
    role: "عکاس",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    text: "ترکیبی کامل از لوکس بودن و طبیعت. من در هتل‌های لوکس زیادی اقامت داشته‌ام، اما این واقعاً خاص بود.",
    rating: 5,
  },
  {
    id: 3,
    name: "مریم حسینی",
    role: "کارآفرین",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    text: "خانواده کامل را آوردیم و همه عاشقش شدند. بچه‌ها هنوز درباره تراس تماشای ستارگان صحبت می‌کنند!",
    rating: 3,
  },
];
