import heroImage from "@/assets/images/dark-hero-section.png";
import lakeImage from "@/assets/images/1.png";
import landscapeImage from "@/assets/images/hero-section-bg.avif";

export const HORIZON_IMAGES = {
  hero: heroImage,
  lake: lakeImage,
  landscape: landscapeImage,
};

export const PROPERTY_CATEGORIES = [
  { id: 1, title: "کلبه", meta: "۳۲۵ اقامتگاه", icon: "cabin" },
  { id: 2, title: "ویلا استخردار", meta: "۳۵۲ اقامتگاه", icon: "pool" },
  { id: 3, title: "آپارتمان", meta: "۲۴۸ اقامتگاه", icon: "apartment" },
  { id: 4, title: "خانه سنتی", meta: "۱۸۷ اقامتگاه", icon: "traditional" },
  { id: 5, title: "لب آب", meta: "۱۴۲ اقامتگاه", icon: "beach" },
  { id: 6, title: "ویلا جنگلی", meta: "۲۹۱ اقامتگاه", icon: "forest" },
  { id: 7, title: "اقامتگاه لوکس", meta: "۱۱۰ اقامتگاه", icon: "luxury" },
  { id: 8, title: "دنج و رمانتیک", meta: "۱۵۶ اقامتگاه", icon: "romantic" },
  { id: 9, title: "صبحانه", meta: "۱۹۵ اقامتگاه", icon: "breakfast" },
  { id: 10, title: "مناسب خانواده", meta: "۳۸۲ اقامتگاه", icon: "family" },
  { id: 11, title: "بوم‌گردی", meta: "۲۷۷ اقامتگاه", icon: "eco" },
  { id: 12, title: "خانه تاریخی", meta: "۹۶ اقامتگاه", icon: "traditional2" },
  { id: 13, title: "خوش‌منظره", meta: "۴۳۵ اقامتگاه", icon: "nature" },
  { id: 14, title: "اتاق دنج", meta: "۱۸۹ اقامتگاه", icon: "cozy" },
  { id: 15, title: "کلبه ماجراجویی", meta: "۱۳۸ اقامتگاه", icon: "adventure" },
];

export const DESTINATIONS = [
  { id: 1, title: "مازندران", meta: "۱۸ اقامتگاه", image: landscapeImage, tone: "جنگل و کوهستان" },
  { id: 2, title: "گیلان", meta: "۲۷ اقامتگاه", image: lakeImage, tone: "جاده‌های سبز" },
  { id: 3, title: "یزد", meta: "۱۴ اقامتگاه", image: landscapeImage, tone: "کویر و معماری" },
  { id: 4, title: "کردستان", meta: "۱۹ اقامتگاه", image: lakeImage, tone: "طبیعت بکر" },
  { id: 5, title: "هرمزگان", meta: "۱۶ اقامتگاه", image: landscapeImage, tone: "آفتاب و ساحل" },
];

export const FEATURED_STAYS = [
  { id: 1, title: "ویلا مدرن در دل جنگل", city: "ماسال", score: "۴.۹", reviews: "۲۴", price: "۲,۸۰۰,۰۰۰", image: heroImage, specs: ["۴ خواب", "۸ مهمان", "پارکینگ"] },
  { id: 2, title: "کلبه چوبی برفراز ماسال", city: "گیلان", score: "۴.۸", reviews: "۳۲", price: "۲,۵۰۰,۰۰۰", image: lakeImage, specs: ["۳ خواب", "۶ مهمان", "جکوزی"] },
  { id: 3, title: "خانه سنتی در یزد", city: "یزد", score: "۴.۷", reviews: "۱۸", price: "۲,۳۰۰,۰۰۰", image: landscapeImage, specs: ["۳ خواب", "۷ مهمان", "استخر"] },
  { id: 4, title: "ویلا جنگلی نور شهر", city: "مازندران", score: "۴.۹", reviews: "۲۶", price: "۲,۶۰۰,۰۰۰", image: heroImage, specs: ["۴ خواب", "۸ مهمان", "چشم‌انداز"] },
];

export const EXPERIENCE_CARDS = [
  { title: "رزرو مطمئن", desc: "پرداخت امن و پشتیبانی واقعی در تمام مراحل رزرو", icon: "shield" },
  { title: "اقامتگاه‌های منتخب", desc: "کیفیت اقامتگاه‌ها پیش از ورود شما بررسی می‌شود", icon: "star" },
  { title: "تجربه‌های متفاوت", desc: "از جنگل و کویر تا ساحل؛ مقصد بعدی‌تان را پیدا کنید", icon: "spark" },
];

export const POPULAR_EXPERIENCES = [
  { title: "کویر", desc: "شب‌های آرام و آسمان پرستاره", image: landscapeImage },
  { title: "جنگل", desc: "هوای خنک و اقامت میان درختان", image: heroImage },
  { title: "کوهستان", desc: "طلوع‌های تماشایی در ارتفاعات", image: landscapeImage },
  { title: "سواحل جنوب", desc: "آفتاب، دریا و آرامش بی‌پایان", image: lakeImage },
];

export const TESTIMONIALS_HOME = [
  { name: "سارا محمدی", role: "بلاگر سفر", rating: "۵.۰", text: "همه چیز دقیقاً همان‌طور بود که در سایت دیده بودیم. از چیدمان کلبه تا منظره و پشتیبانی، یک تجربه کامل بود.", image: lakeImage },
  { name: "علی رضایی", role: "عکاس", rating: "۴.۹", text: "برای چند روز آرامش در دل طبیعت عالی بود. مسیر رزرو ساده بود و خود اقامتگاه هم بسیار تمیز و خوش‌طراحی بود.", image: heroImage },
  { name: "مریم حسینی", role: "کارآفرین", rating: "۵.۰", text: "برای سفر خانوادگی انتخابش کردیم و همه راضی بودند. چیزی که بیشتر دوست داشتم حس خلوت و کیفیت اقامتگاه بود.", image: landscapeImage },
];
