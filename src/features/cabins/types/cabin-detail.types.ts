/**
 * انواع اختصاصی صفحه‌ی جزئیات اقامتگاه.
 *
 * ⚠️ بک‌اند فعلی فقط موجودیت «کابین» را می‌دهد و هیچ اندپوینتی برای
 * اتاق‌ها، قوانین و نظرات ندارد. این تایپ‌ها قرارداد آینده‌ی آن داده‌ها
 * هستند تا روزی که اندپوینت اضافه شد، فقط منبع داده عوض شود و هیچ
 * کامپوننتی دست نخورد.
 */

/* ============================== اتاق‌ها ============================== */

/** یک ردیف تخت داخل اتاق (مثل «۲ تخت دونفره») */
export type CabinRoomBed = {
  id: string;
  label: string;
  count: number;
};

export type CabinRoom = {
  id: number;
  name: string;
  /** ظرفیت نفرات این اتاق */
  capacity: number;
  /** متراژ اتاق؛ `null` یعنی نامشخص */
  sizeSqm: number | null;
  beds: CabinRoomBed[];
  amenities: string[];
  /** تصویر اتاق؛ نبودنش یعنی کارت بدون تصویر رندر می‌شود */
  image?: string | null;
};

/* ============================ قوانین و مقررات ============================ */

export type CabinRuleItem = {
  id: string;
  title: string;
  description: string;
};

export type CabinRules = {
  /** متن ساعت ورود — مثل «از ساعت ۱۴:۰۰» */
  checkIn: string;
  /** متن ساعت خروج — مثل «تا ساعت ۱۲:۰۰» */
  checkOut: string;
  /** مقررات لغو رزرو */
  cancellation: CabinRuleItem[];
  /** مدارک موردنیاز هنگام پذیرش */
  documents: CabinRuleItem[];
  /** سایر قوانین اقامتگاه */
  general: CabinRuleItem[];
};

/* =============================== نظرات =============================== */

/** امتیاز زیرمعیارها — همه بین ۱ تا ۵ */
export type CabinReviewSubScores = {
  cleanliness: number;
  location: number;
  value: number;
  accuracy: number;
  checkIn: number;
};

/** پاسخ میزبان به یک نظر */
export type CabinReviewHostReply = {
  text: string;
  /** ISO — تبدیل به `Date` در لحظه‌ی نمایش */
  createdAt: string;
};

export type CabinReview = {
  id: number;
  authorName: string;
  /** مسیر تصویر آواتار؛ نبودش یعنی حرف اول نام نمایش داده می‌شود */
  avatarUrl?: string | null;
  /** ISO — تبدیل به `Date` در لحظه‌ی نمایش */
  createdAt: string;
  /** امتیاز کلی، بین ۱ تا ۵ */
  rating: number;
  text: string;
  /** تگ‌های کوتاه مثل «نظافت بی‌نظیر» */
  tags: string[];
  hostReply?: CabinReviewHostReply;
};

export type CabinReviewsData = {
  average: number;
  total: number;
  /** تعداد نظرات هر امتیاز: کلید `1`..`5` */
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  subscores: CabinReviewSubScores;
  items: CabinReview[];
};

/* ========================== امکانات (دسته‌بندی) ========================== */

export type CabinAmenityGroup = {
  id: string;
  title: string;
  items: string[];
};
