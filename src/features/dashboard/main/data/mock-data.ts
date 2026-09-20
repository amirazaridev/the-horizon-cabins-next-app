import { Cabin } from "@/features/cabins/lib/data-service";
import type { City } from "@/features/cabins/types/City";

export type BookingStatus = "unconfirmed" | "confirmed" | "checked-out";

export interface Booking {
  id: number;
  cabinId: number;
  guestName: string;
  startDate: string; // yyyy-MM-dd
  endDate: string; // yyyy-MM-dd
  numNights: number;
  numGuests: number;
  totalPrice: number;
  extrasPrice: number;
  status: BookingStatus;
  hasBreakfast: boolean;
  isPaid: boolean;
}

export const ALL = "all";
export const DEFAULT_RANGE_DAYS = 30;
export const PARAM_FROM = "from";
export const PARAM_TO = "to";
export const PARAM_CITY = "city";
export const PARAM_STATUS = "status";
export const PARAM_RANGE = "range";

export const CITIES = [
  "کردان",
  "لواسان",
  "رامسر",
  "ماسال",
  "سرعین",
  "طبس",
] as const;

export const CABINS: Cabin[] = [
  {
    id: 1,
    name: "ویلا لوکس استخردار نوشهر",
    maxCapacity: 10,
    regularPrice: 18000000,
    discount: 1500000,
    description:
      "ویلای مدرن با نمای شیشه‌ای و استخر روباز بی‌نهایت (اینفینیتی) در ارتفاعات نوشهر، با چشم‌اندازی هم‌زمان به دریای خزر و رشته‌کوه البرز. فضای نشیمن با پنجره‌های سراسری، نور طبیعی فراوانی به داخل ویلا می‌آورد.",
    amenities: [
      "استخر روباز اینفینیتی",
      "نمای هم‌زمان دریا و کوهستان",
      "نشیمن مدرن با پنجره‌های سراسری",
      "پارکینگ اختصاصی",
      "وای‌فای پرسرعت",
      "گرمایش از کف",
    ],
    bedrooms: 4,
    bathrooms: 3,
    areaSqm: 320,
    city: {
      id: 1,
      name: "نوشهر",
    },
    images: [
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/01/01.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/01/02.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/01/03.jpg",
    ],
    latitude: 36.645,
    longitude: 51.5,

    createdAt: new Date("2025-03-12T08:30:00.000Z"),
    updatedAt: new Date("2025-03-12T08:30:00.000Z"),
    rating: 5,
  },
  {
    id: 2,
    name: "ویلا ساحلی استخردار رامسر",
    maxCapacity: 12,
    regularPrice: 24000000,
    discount: 2000000,
    description:
      "ویلایی بزرگ و لوکس در رامسر با حیاط چمن وسیع و استخر روباز اختصاصی، مناسب اقامت خانوادگی و جمع‌های دوستانه. آشپزخانه مجهز با کابینت مرمر و تراس بزرگ مشرف به استخر از امکانات این ویلاست.",
    amenities: [
      "استخر روباز در حیاط چمن",
      "آشپزخانه مجهز با کابینت مرمر",
      "تراس بزرگ مشرف به استخر",
      "پارکینگ سرپوشیده",
      "دوربین مداربسته",
    ],
    bedrooms: 5,
    bathrooms: 4,
    areaSqm: 400,
    city: {
      id: 2,
      name: "رامسر",
    },
    images: [
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/02/01.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/02/02.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/02/03.jpg",
    ],
    latitude: 36.9169,
    longitude: 50.6736,

    createdAt: new Date("2025-04-02T10:15:00.000Z"),
    updatedAt: new Date("2025-04-05T09:00:00.000Z"),
    rating: 4,
  },
  {
    id: 3,
    name: "ویلای جنگلی کلاردشت",
    maxCapacity: 6,
    regularPrice: 9000000,
    discount: 0,
    description:
      "ویلایی آرام و بدون استخر در دل جنگل‌های کلاردشت، مناسب برای فرار از شلوغی شهر و استراحت در طبیعت. اتاق‌خواب‌های دنج و آشپزخانه اپن مدرن، این ویلا را برای اقامت خانوادگی کوتاه‌مدت ایده‌آل کرده است.",
    amenities: [
      "نمای جنگل و طبیعت اطراف",
      "آشپزخانه اپن مدرن",
      "اتاق خواب دنج با نورپردازی ملایم",
      "تراس چوبی",
      "پارکینگ حیاط",
    ],
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 180,
    city: {
      id: 3,
      name: "کلاردشت",
    },
    images: [
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/03/01.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/03/02.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/03/03.jpg",
    ],
    latitude: 36.483,
    longitude: 51.1,

    createdAt: new Date("2025-05-18T07:45:00.000Z"),
    updatedAt: new Date("2025-05-18T07:45:00.000Z"),
    rating: 4.5,
  },
  {
    id: 4,
    name: "ویلا چوبی سنتی ماسال",
    maxCapacity: 5,
    regularPrice: 7500000,
    discount: 500000,
    description:
      "ویلایی با نمای بیرونی چوبی و طراحی سنتی در روستاهای خوش‌آب‌وهوای ماسال، بدون استخر اما با باغ میوه اختصاصی و فضای کباب‌پز در حیاط. فضای داخلی گرم و دنج، حس اقامت در یک خانه روستایی اصیل را منتقل می‌کند.",
    amenities: [
      "نمای بیرونی چوبی سنتی",
      "باغ میوه اختصاصی",
      "نشیمن راحتی با کاناپه",
      "کباب‌پز در حیاط",
      "پارکینگ اختصاصی",
    ],
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 150,
    city: {
      id: 4,
      name: "ماسال",
    },
    images: [
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/04/01.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/04/02.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/04/03.jpg",
    ],
    latitude: 37.3631,
    longitude: 49.1328,

    createdAt: new Date("2025-06-09T12:20:00.000Z"),
    updatedAt: new Date("2025-06-11T14:00:00.000Z"),
    rating: 3.5,
  },
  {
    id: 5,
    name: "ویلا کوهستانی استخردار محمودآباد",
    maxCapacity: 8,
    regularPrice: 16000000,
    discount: 1000000,
    description:
      "ویلایی مدرن در نزدیکی محمودآباد با استخر روباز و چشم‌انداز مستقیم به کوهستان، مناسب اقامت خانواده‌های بزرگ. اتاق خواب مستر با سرویس بهداشتی اختصاصی و فضای بازی کودکان از ویژگی‌های این ویلاست.",
    amenities: [
      "استخر روباز با چشم‌انداز کوهستان",
      "اتاق خواب مستر با سرویس اختصاصی",
      "پارکینگ دوبل",
      "سیستم تهویه مطبوع",
      "فضای بازی کودکان",
    ],
    bedrooms: 4,
    bathrooms: 3,
    areaSqm: 280,
    city: {
      id: 5,
      name: "محمودآباد",
    },
    images: [
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/05/01.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/05/02.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/05/03.jpg",
    ],
    latitude: 36.6319,
    longitude: 52.2628,

    createdAt: new Date("2025-07-21T16:10:00.000Z"),
    updatedAt: new Date("2025-07-21T16:10:00.000Z"),
    rating: 4,
  },
  {
    id: 6,
    name: "ویلا باغی نور",
    maxCapacity: 6,
    regularPrice: 8500000,
    discount: 0,
    description:
      "ویلای بدون استخر با حیاط چمن وسیع در منطقه نور، مناسب گردهمایی‌های خانوادگی و دورهمی‌های آرام. آشپزخانه مدرن با نورپردازی شیک و فضای باربیکیو در حیاط از امکانات جانبی این ویلاست.",
    amenities: [
      "حیاط چمن وسیع",
      "آشپزخانه مدرن با نورپردازی شیک",
      "اتاق خواب دو نفره مبله",
      "پارکینگ حیاط",
      "فضای باربیکیو",
    ],
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 200,
    city: {
      id: 6,
      name: "نور",
    },
    images: [
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/06/01.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/06/02.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/06/03.jpg",
    ],
    latitude: 36.57361,
    longitude: 52.01389,

    createdAt: new Date("2025-08-14T09:00:00.000Z"),
    updatedAt: new Date("2025-08-16T11:30:00.000Z"),
    rating: 4,
  },
  {
    id: 7,
    name: "ویلا لوکس استخردار چالوس",
    maxCapacity: 9,
    regularPrice: 17500000,
    discount: 1200000,
    description:
      "ویلای شیک با استخر روباز اینفینیتی مشرف به دامنه‌های کوهستانی چالوس. غروب دل‌انگیزی که از تراس و استخر ویلا دیده می‌شود، این اقامتگاه را برای عکاسی و استراحت عصرگاهی خاص کرده است.",
    amenities: [
      "استخر روباز اینفینیتی",
      "تراس مشرف به کوهستان",
      "نشیمن مدرن با پنجره‌های بزرگ",
      "پارکینگ اختصاصی",
      "وای‌فای پرسرعت",
    ],
    bedrooms: 4,
    bathrooms: 3,
    areaSqm: 300,
    city: {
      id: 7,
      name: "چالوس",
    },
    images: [
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/07/01.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/07/02.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/07/03.jpg",
    ],
    latitude: 36.65,
    longitude: 51.42,

    createdAt: new Date("2025-09-05T08:00:00.000Z"),
    updatedAt: new Date("2025-09-05T08:00:00.000Z"),
    rating: 3.5,
  },
  {
    id: 8,
    name: "ویلا استخردار بابلسر",
    maxCapacity: 8,
    regularPrice: 14000000,
    discount: 800000,
    description:
      "ویلای مدرن در نزدیکی ساحل بابلسر با استخر روباز و آشپزخانه اپن مجهز به وسایل استیل، مناسب برای دورهمی‌های خانوادگی و تابستانی کنار دریا.",
    amenities: [
      "استخر روباز",
      "آشپزخانه اپن با وسایل استیل",
      "حیاط چمن",
      "پارکینگ اختصاصی",
      "سیستم تهویه مطبوع",
    ],
    bedrooms: 3,
    bathrooms: 3,
    areaSqm: 260,
    city: {
      id: 8,
      name: "بابلسر",
    },
    images: [
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/08/01.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/08/02.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/08/03.jpg",
    ],
    latitude: 36.7,
    longitude: 52.65,

    createdAt: new Date("2025-10-10T09:30:00.000Z"),
    updatedAt: new Date("2025-10-10T09:30:00.000Z"),
    rating: 4,
  },
  {
    id: 9,
    name: "ویلای باغی سیاهکل",
    maxCapacity: 6,
    regularPrice: 8000000,
    discount: 0,
    description:
      "ویلایی آرام و بدون استخر در سیاهکل با نمای شیشه‌ای رو به حیاط چمن. اتاق‌خواب‌های دنج و آشپزخانه‌ای با ترکیب چوب و سنگ مرمر، حس اقامتی خانگی و راحت را فراهم می‌کند.",
    amenities: [
      "نمای شیشه‌ای رو به حیاط",
      "آشپزخانه با کابینت چوب و مرمر",
      "اتاق خواب دنج",
      "پارکینگ حیاط",
      "فضای سبز اختصاصی",
    ],
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 190,
    city: {
      id: 9,
      name: "سیاهکل",
    },
    images: [
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/09/01.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/09/02.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/09/03.jpg",
    ],
    latitude: 37.1528,
    longitude: 49.8708,

    createdAt: new Date("2025-11-02T13:15:00.000Z"),
    updatedAt: new Date("2025-11-04T10:00:00.000Z"),
    rating: 3,
  },
  {
    id: 10,
    name: "ویلای کوهستانی بدون استخر رودبارک",
    maxCapacity: 5,
    regularPrice: 7800000,
    discount: 300000,
    description:
      "ویلایی کوهستانی و بدون استخر در رودبارک کلاردشت، با محوطه چمن و مسیرهای سنگ‌فرش میان درختان. مناسب برای اقامتی آرام و دورهمی‌های کوچک در دل طبیعت کوهستانی.",
    amenities: [
      "محوطه چمن با مسیر سنگ‌فرش",
      "چشم‌انداز کوهستانی",
      "آشپزخانه روشن و مدرن",
      "اتاق خواب مبله شیک",
      "پارکینگ حیاط",
    ],
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 170,
    city: {
      id: 3,
      name: "کلاردشت",
    },
    images: [
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/10/01.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/10/02.jpg",
      "https://hmkleisvyqlrgdkvhmdp.supabase.co/storage/v1/object/public/cabins_images/10/03.jpg",
    ],
    latitude: 36.0541,
    longitude: 53.5551,

    createdAt: new Date("2025-12-20T15:45:00.000Z"),
    updatedAt: new Date("2025-12-20T15:45:00.000Z"),
    rating: 4,
  },
];
export const DASHBOARD_CITIES: City[] = CABINS.reduce<City[]>(
  (cities, cabin) => {
    const city = cabin.city;

    if (city && !cities.some((item) => item.id === city.id)) {
      cities.push(city);
    }

    return cities;
  },
  [],
).sort((a, b) => a.name.localeCompare(b.name, "fa"));

function makeRng(seed: number) {
  let s = seed >>> 0;
  return function rng() {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function diffDays(a: Date, b: Date): number {
  const MS = 86_400_000;
  const a0 = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const b0 = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((b0 - a0) / MS);
}

// ---------------------------------------------------------------------------
// اسم‌های مهمان (فارسی)
// ---------------------------------------------------------------------------
const FIRST_NAMES = [
  "علی",
  "زهرا",
  "محمد",
  "فاطمه",
  "رضا",
  "مریم",
  "حسین",
  "سارا",
  "امیر",
  "نرگس",
  "مهدی",
  "الهام",
  "سعید",
  "نگار",
  "کاوه",
  "شیما",
  "بهنام",
  "پریسا",
  "فرهاد",
  "مینا",
  "آرش",
  "هدیه",
  "سینا",
  "رویا",
  "پویا",
  "لیلا",
  "یاسر",
  "بهار",
  "کیوان",
  "شیرین",
];

const LAST_NAMES = [
  "محمدی",
  "احمدی",
  "حسینی",
  "رضایی",
  "کریمی",
  "موسوی",
  "صادقی",
  "نوری",
  "جعفری",
  "قاسمی",
  "شریفی",
  "مرادی",
  "کاظمی",
  "یوسفی",
  "زمانی",
  "امینی",
  "طاهری",
  "رحیمی",
  "بهرامی",
  "سلطانی",
];

const EXTRA_ITEMS = ["صبحانه", "شام", "تور", "ماساژ", "اجاره دوچرخه"] as const;

// ---------------------------------------------------------------------------
// ساخت رزروها
// ---------------------------------------------------------------------------
function generateBookings(): Booking[] {
  const rng = makeRng(20240912);
  const bookings: Booking[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const horizonStart = addDays(today, -120);

  let id = 1000;

  for (let i = 0; i < 140; i++) {
    const cabin = pick(rng, CABINS);
    const start = addDays(horizonStart, randInt(rng, 0, 119));
    const numNights = randInt(rng, 1, 7);
    const end = addDays(start, numNights);

    // وضعیت بر اساس فاصله با امروز
    let status: BookingStatus;
    if (end < today) {
      status = "checked-out";
    } else if (start <= today && today <= end) {
      status = "confirmed";
    } else {
      // آینده: ۷۰٪ تایید شده، ۳۰٪ در انتظار
      status = rng() < 0.7 ? "confirmed" : "unconfirmed";
    }

    const hasBreakfast = rng() < 0.55;
    const numGuests = randInt(rng, 1, cabin.maxCapacity);

    // قیمت
    const basePerNight = Math.round(cabin.regularPrice * (0.85 + rng() * 0.4));
    const discount = hasBreakfast ? 0 : Math.round(basePerNight * 0.15);
    const totalPrice = (basePerNight - discount) * numNights;
    const extrasPrice =
      EXTRA_ITEMS.filter(() => rng() < 0.25).length *
      randInt(rng, 200_000, 800_000);

    const isPaid = status === "checked-out" ? true : rng() < 0.75;

    const guestName = `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)}`;

    bookings.push({
      id: id++,
      cabinId: cabin.id,
      guestName,
      startDate: toISO(start),
      endDate: toISO(end),
      numNights,
      numGuests,
      totalPrice,
      extrasPrice,
      status,
      hasBreakfast,
      isPaid,
    });
  }

  return bookings.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );
}

export const BOOKINGS: Booking[] = generateBookings();

// ---------------------------------------------------------------------------
// توابع کمکی برای استفاده در کامپوننت‌ها / هوک
// ---------------------------------------------------------------------------

/** رزروهایی که در بازه [from, to] شروع شده‌اند */
export function filterBookingsByRange(
  bookings: Booking[],
  from: Date,
  to: Date,
): Booking[] {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return bookings.filter((b) => {
    const t = new Date(`${b.startDate}T00:00:00`).getTime();
    return t >= fromTime && t <= toTime;
  });
}

/** رزروهای بازه قبل (برای محاسبهٔ رشد) */
export function filterPrevBookings(
  bookings: Booking[],
  from: Date,
  to: Date,
): Booking[] {
  const numDays = diffDays(from, to) + 1;
  const prevTo = addDays(from, -1);
  const prevFrom = addDays(prevTo, -(numDays - 1));
  return filterBookingsByRange(bookings, prevFrom, prevTo);
}

/** رشد درصدی نسبت به دوره قبل (اگر دوره قبل صفر باشد، null) */
export function calcGrowth(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}
