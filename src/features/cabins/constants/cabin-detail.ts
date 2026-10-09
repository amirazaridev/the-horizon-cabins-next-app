import type {
  CabinAmenityGroup,
  CabinReview,
  CabinReviewsData,
  CabinRules,
} from "../types/cabin-detail.types";

/* =========================== بخش‌های صفحه =========================== */

/**
 * ترتیب سکشن‌های صفحه‌ی جزئیات.
 *
 * همین آرایه منبع واحدِ «شناسه‌ی سکشن» است: نوار تب چسبان، Scroll Spy و
 * خودِ سکشن‌ها همه از اینجا می‌خوانند تا هیچ‌وقت شناسه‌ای در سه جا
 * جداگانه تکرار نشود.
 */
export const CABIN_DETAIL_SECTIONS = [
  { id: "gallery", label: "تصاویر" },
  { id: "overview", label: "توضیحات" },
  { id: "specs", label: "مشخصات" },
  // { id: "rooms", label: "اتاق‌ها" },
  { id: "amenities", label: "امکانات" },
  { id: "rate", label: "نرخ و رزرو" },
  { id: "rules", label: "قوانین" },
  { id: "map", label: "نقشه" },
  { id: "reviews", label: "نظرات" },
] as const;

export type CabinDetailSectionId = (typeof CABIN_DETAIL_SECTIONS)[number]["id"];

/**
 * نگاشت شناسه‌ها به خودشان — تا در کد به‌جای رشته‌ی جادویی،
 * `SECTION_IDS.rate` نوشته شود و تغییر نام در یک جا کافی باشد.
 */
export const SECTION_IDS = {
  gallery: "gallery",
  overview: "overview",
  specs: "specs",
  amenities: "amenities",
  rate: "rate",
  rules: "rules",
  map: "map",
  reviews: "reviews",
} as const satisfies Record<CabinDetailSectionId, CabinDetailSectionId>;

/** چند مورد اول امکانات که در صفحه نمایش داده می‌شود */
export const AMENITIES_PREVIEW_COUNT = 8;

/* =========================== قوانین و مقررات =========================== */

/**
 * ⚠️ TODO(backend): قوانین اقامتگاه در بک‌اند وجود ندارد و بین همه‌ی
 * کابین‌ها یکسان فرض شده است. با اضافه‌شدن فیلد `rules` در پاسخ کابین،
 * فقط همین ثابت با داده‌ی واقعی جایگزین می‌شود.
 */
export const CABIN_RULES: CabinRules = {
  checkIn: "از ساعت ۱۴:۰۰",
  checkOut: "تا ساعت ۱۲:۰۰",
  cancellation: [
    {
      id: "free-48",
      title: "لغو رایگان تا ۴۸ ساعت قبل",
      description:
        "اگر تا ۴۸ ساعت پیش از ساعت ورود رزرو را لغو کنید، کل مبلغ پرداختی بدون کسر بازگردانده می‌شود.",
    },
    {
      id: "partial-24",
      title: "لغو بین ۲۴ تا ۴۸ ساعت",
      description:
        "در این بازه ۵۰٪ مبلغ اقامت به‌عنوان هزینه‌ی لغو کسر و باقی مبلغ بازگردانده می‌شود.",
    },
    {
      id: "no-show",
      title: "لغو کمتر از ۲۴ ساعت یا عدم حضور",
      description:
        "مبلغ شب اول قابل بازگشت نیست. در رزروهای بیش از سه شب، ۳۰٪ مبلغ کل کسر می‌شود.",
    },
  ],
  documents: [
    {
      id: "national-id",
      title: "کارت ملی هوشمند یا شناسنامه",
      description:
        "برای هر نفر بزرگسال، اصل کارت ملی هوشمند یا شناسنامه الزامی است و هنگام پذیرش کنترل می‌شود.",
    },
  ],
  general: [
    {
      id: "no-party",
      title: "ممنوعیت مراسم و مهمانی",
      description:
        "برگزاری جشن، مهمانی و هرگونه مراسم پرصدا در اقامتگاه ممنوع است.",
    },
    {
      id: "quiet-hours",
      title: "رعایت سکوت از ساعت ۲۳",
      description:
        "از ساعت ۲۳ تا ۸ صبح، رعایت آرامش محوطه و همسایه‌ها الزامی است.",
    },
    {
      id: "no-smoking",
      title: "استعمال دخانیات در فضای بسته ممنوع",
      description:
        "کشیدن قلیان و سیگار در اتاق‌ها ممنوع است؛ تراس و محوطه‌ی باز آزاد است.",
    },
    {
      id: "pets",
      title: "ورود حیوان خانگی با هماهنگی",
      description:
        "ورود حیوان خانگی فقط با تأیید قبلی میزبان و در فضای باز امکان‌پذیر است.",
    },
  ],
};

/* =============================== نظرات =============================== */

/**
 * ⚠️ TODO(backend): اندپوینت نظرات وجود ندارد. این استخر ثابت است و بر
 * اساس `cabinId` جابه‌جا می‌شود تا هر اقامتگاه فهرست متفاوتی نشان دهد.
 */
const REVIEW_POOL: Omit<CabinReview, "id">[] = [
  {
    authorName: "سارا محمدی",
    createdAt: "2026-08-18T10:00:00.000Z",
    rating: 5,
    text: "اقامت فوق‌العاده‌ای بود. ویو دریا و کوه هم‌زمان واقعاً حرف نداشت و صبح‌ها با منظره‌ی طلوع از پشت پنجره‌های سراسری بیدار می‌شدیم. نظافت بسیار خوب و میزبان همیشه پاسخگو بود.",
    tags: ["نظافت بی‌نظیر", "منظره‌ی عالی", "میزبان پاسخگو"],
    hostReply: {
      text: "سپاس از اعتماد شما؛ خوشحالیم که اقامتتان خاطره‌انگیز شد. منتظر دیدن دوباره‌تان هستیم.",
      createdAt: "2026-08-19T08:30:00.000Z",
    },
  },
  {
    authorName: "امیر رضایی",
    createdAt: "2026-08-02T16:20:00.000Z",
    rating: 4,
    text: "خانه بسیار تمیز و مرتب بود و دقیقاً مطابق تصاویر. تنها نکته این بود که آب استخر روز اول کمی سرد بود که بعد از پیگیری حل شد.",
    tags: ["دقیقاً مطابق تصاویر", "پیگیری سریع"],
  },
  {
    authorName: "نگار کیانی",
    createdAt: "2026-07-25T09:15:00.000Z",
    rating: 5,
    text: "برای سفر خانوادگی هفت‌نفره رزرو کردیم و فضا کافی بود. آشپزخانه کامل و مجهز، و حیاط برای بچه‌ها بی‌نظیر بود.",
    tags: ["مناسب خانواده", "آشپزخانه‌ی مجهز"],
  },
  {
    authorName: "محمد پارسا",
    createdAt: "2026-07-11T19:45:00.000Z",
    rating: 3,
    text: "موقعیت خوب و دسترسی راحت بود، اما در روزهای تعطیل اطراف کمی شلوغ می‌شود و پارکینگ برای ماشین دوم محدود بود.",
    tags: ["دسترسی راحت"],
  },
  {
    authorName: "الهام نوری",
    createdAt: "2026-06-29T12:05:00.000Z",
    rating: 5,
    text: "تجربه‌ی آرام و بی‌دغدغه. سیستم گرمایش از کف عالی بود و شب‌ها واقعاً گرم و راحت خوابیدیم. حتماً دوباره رزرو می‌کنم.",
    tags: ["آرامش کامل", "گرمایش عالی"],
    hostReply: {
      text: "ممنون از شما؛ باعث افتخار است که دوباره میزبانتان باشیم.",
      createdAt: "2026-06-30T07:10:00.000Z",
    },
  },
  {
    authorName: "رضا شریفی",
    createdAt: "2026-06-14T08:40:00.000Z",
    rating: 4,
    text: "کیفیت اقامت نسبت به قیمت مناسب بود. وای‌فای سرعت خوبی داشت و امکان دورکاری از ویلا راحت بود.",
    tags: ["ارزش خرید بالا", "اینترنت پرسرعت"],
  },
  {
    authorName: "مریم اسدی",
    createdAt: "2026-05-30T14:30:00.000Z",
    rating: 5,
    text: "معماری ویلا مدرن و چشم‌نواز است و عکس‌های واقعی هم دقیقاً همین فضا را نشان می‌دهد. پذیرش سریع و بدون معطلی انجام شد.",
    tags: ["پذیرش سریع", "معماری مدرن"],
  },
  {
    authorName: "حسین آذری",
    createdAt: "2026-05-09T11:10:00.000Z",
    rating: 4,
    text: "فضای باربیکیو و تراس چوبی نقطه‌ی قوت این اقامتگاه است. فقط کاش تعداد حوله‌های استخر بیشتر بود.",
    tags: ["فضای باز عالی"],
  },
];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/** فهرست نظرات یک اقامتگاه — فعلاً ماک و وابسته به شناسه (TODO: بک‌اند) */
export function buildReviews(cabinId: number): CabinReviewsData {
  const offset = Math.abs(cabinId) % REVIEW_POOL.length;
  const items: CabinReview[] = [
    ...REVIEW_POOL.slice(offset),
    ...REVIEW_POOL.slice(0, offset),
  ].map((review, index) => ({ ...review, id: index + 1 }));

  const distribution: CabinReviewsData["distribution"] = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  for (const review of items) {
    distribution[Math.min(5, Math.max(1, review.rating)) as 1 | 2 | 3 | 4 | 5] +=
      1;
  }

  const total = items.length;
  const sum = items.reduce((acc, review) => acc + review.rating, 0);

  // امتیاز زیرمعیارها حول میانگین کلی با کمی اختلاف ثابت (تا داده‌ی ماک
  // یکنواخت نباشد) ساخته می‌شود.
  const average = total ? round1(sum / total) : 0;

  return {
    average,
    total,
    distribution,
    subscores: {
      cleanliness: round1(Math.min(5, average + 0.2)),
      location: round1(Math.min(5, average - 0.1)),
      value: round1(Math.max(1, average - 0.3)),
      accuracy: round1(Math.min(5, average + 0.1)),
      checkIn: round1(Math.min(5, average + 0.3)),
    },
    items,
  };
}

/* ========================== دسته‌بندی امکانات ========================== */

type AmenityGroupDefinition = {
  id: string;
  title: string;
  /** کلیدواژه‌هایی که با «شامل بودن» در متن امکانات تطبیق داده می‌شوند */
  keywords: string[];
};

/**
 * ⚠️ TODO(backend): بک‌اند امکانات را به‌صورت رشته‌های توصیفی آزاد
 * برمی‌گرداند و دسته‌بندی ندارد. این نگاشت کلیدواژه‌ای جای آن را می‌گیرد.
 */
const AMENITY_GROUP_DEFINITIONS: AmenityGroupDefinition[] = [
  {
    id: "outdoor",
    title: "فضای باز و نما",
    keywords: [
      "استخر",
      "نما",
      "چشم‌انداز",
      "جنگل",
      "کوه",
      "حیاط",
      "چمن",
      "تراس",
      "باربیکیو",
      "باغ",
      "سنگ‌فرش",
      "شیشه‌ای",
    ],
  },
  {
    id: "indoor",
    title: "فضای داخلی و رفاه",
    keywords: [
      "نشیمن",
      "آشپزخانه",
      "اتاق خواب",
      "گرمایش",
      "سرمایش",
      "مبله",
      "کابینت",
      "مرمر",
      "نورپردازی",
    ],
  },
  {
    id: "services",
    title: "خدمات و دسترسی",
    keywords: ["وای‌فای", "اینترنت", "پارکینگ", "پارکینگ اختصاصی"],
  },
];

const OTHER_GROUP_TITLE = "سایر امکانات";

/**
 * امکانات را به گروه‌های نمایشی تقسیم می‌کند.
 * هر مورد فقط در اولین گروهی که کلیدواژه‌اش را دارد قرار می‌گیرد؛
 * موارد بی‌گروه در «سایر امکانات» می‌مانند.
 */
export function groupAmenities(amenities: string[]): CabinAmenityGroup[] {
  const groups: CabinAmenityGroup[] = AMENITY_GROUP_DEFINITIONS.map(
    (definition) => ({ id: definition.id, title: definition.title, items: [] }),
  );
  const other: CabinAmenityGroup = {
    id: "other",
    title: OTHER_GROUP_TITLE,
    items: [],
  };

  for (const amenity of amenities) {
    const groupIndex = AMENITY_GROUP_DEFINITIONS.findIndex((definition) =>
      definition.keywords.some((keyword) => amenity.includes(keyword)),
    );

    if (groupIndex === -1) other.items.push(amenity);
    else groups[groupIndex].items.push(amenity);
  }

  return [...groups, other].filter((group) => group.items.length > 0);
}
