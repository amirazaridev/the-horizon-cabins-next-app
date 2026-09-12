
export type BookingStatus = "unconfirmed" | "confirmed" | "checked-out";

export interface Cabin {
  id: number;
  name: string;
  city: string;
  capacity: number;
  basePrice: number;
}

export interface Booking {
  id: number;
  cabinId: number;
  guestName: string;
  startDate: string; // yyyy-MM-dd
  endDate: string;   // yyyy-MM-dd
  numNights: number;
  numGuests: number;
  totalPrice: number;
  extrasPrice: number;
  status: BookingStatus;
  hasBreakfast: boolean;
  isPaid: boolean;
}


export const ALL = "all";
export const DEFAULT_RANGE_DAYS = 7;
export const PARAM_FROM = "from";
export const PARAM_TO = "to";
export const PARAM_CITY = "city";
export const PARAM_STATUS = "status";

export const CITIES = [
  "کردان",
  "لواسان",
  "رامسر",
  "ماسال",
  "سرعین",
  "طبس",
] as const;

export const CABINS: Cabin[] = [
  { id: 1,  name: "کلبه چوبی آرامش",   city: "کردان",  capacity: 4, basePrice: 3_800_000 },
  { id: 2,  name: "سوییت دریاچه",       city: "لواسان", capacity: 2, basePrice: 2_500_000 },
  { id: 3,  name: "ویلای جنگلی باران",  city: "رامسر",  capacity: 6, basePrice: 5_200_000 },
  { id: 4,  name: "اقامتگاه کوهستان",   city: "ماسال",  capacity: 5, basePrice: 4_100_000 },
  { id: 5,  name: "سوییت چشمه گرم",     city: "سرعین",  capacity: 3, basePrice: 3_300_000 },
  { id: 6,  name: "خانه باغ کویر",      city: "طبس",    capacity: 4, basePrice: 2_900_000 },
  { id: 7,  name: "کلبه شیشه‌ای ستاره", city: "کردان",  capacity: 2, basePrice: 4_500_000 },
  { id: 8,  name: "ویلای ساحلی نیلوفر", city: "رامسر",  capacity: 8, basePrice: 6_800_000 },
  { id: 9,  name: "سوییت دنج لواسان",   city: "لواسان", capacity: 3, basePrice: 3_100_000 },
  { id: 10, name: "اقامتگاه عشایری",    city: "ماسال",  capacity: 6, basePrice: 3_600_000 },
];


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
  "علی", "زهرا", "محمد", "فاطمه", "رضا", "مریم", "حسین", "سارا",
  "امیر", "نرگس", "مهدی", "الهام", "سعید", "نگار", "کاوه", "شیما",
  "بهنام", "پریسا", "فرهاد", "مینا", "آرش", "هدیه", "سینا", "رویا",
  "پویا", "لیلا", "یاسر", "بهار", "کیوان", "شیرین",
];

const LAST_NAMES = [
  "محمدی", "احمدی", "حسینی", "رضایی", "کریمی", "موسوی", "صادقی", "نوری",
  "جعفری", "قاسمی", "شریفی", "مرادی", "کاظمی", "یوسفی", "زمانی", "امینی",
  "طاهری", "رحیمی", "بهرامی", "سلطانی",
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
    const numGuests = randInt(rng, 1, cabin.capacity);

    // قیمت
    const basePerNight = Math.round(
      cabin.basePrice * (0.85 + rng() * 0.4),
    );
    const discount = hasBreakfast ? 0 : Math.round(basePerNight * 0.15);
    const totalPrice = (basePerNight - discount) * numNights;
    const extrasPrice =
      EXTRA_ITEMS.filter(() => rng() < 0.25).length * randInt(rng, 200_000, 800_000);

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