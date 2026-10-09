# وضعیت صفحه Overview داشبورد (Admin)

> هدف این فایل: معرفی سریع و جامع وضعیت فعلی صفحه `overview` داشبورد مدیریت تا هر AI / توسعه‌دهنده‌ای با یک نگاه متوجه بشه چه چیزهایی پیاده‌سازی شده، از کجا داده میاد، و چی در حالت ناقص یا mock هست.

---

## ۱) مسیر و فایل‌های اصلی

- صفحه: `src/app/(dashboard)/dashboard/page.tsx`
- لایه اصلی: `src/features/dashboard/overview/MainPageLayout.tsx`
- اسکلتون لودینگ: `src/features/dashboard/overview/components/OverviewSkeleton.tsx`
- داده و منطق فیلترها:
  - `src/features/dashboard/overview/data/mock-data.ts`
  - `src/features/dashboard/overview/hooks/useDashboardFilters.ts`
  - `src/features/dashboard/overview/lib/date-range.ts`

صفحه داخل `<Suspense fallback={<OverviewSkeleton />}>` رندر می‌شه و دادهٔ شهرهای داشبورد از `DASHBOARD_CITIES` میاد.

---

## ۲) ساختار صفحه (ترتیب از بالا به پایین)

1. **Header**
   - عنوان: «داشبورد»
   - زیرعنوان: «خلاصه وضعیت سوییت‌ها از … تا …» (تاریخ شمسی با `date-fns-jalali`)

2. **FilterBar** — فیلترهای اصلی کسب‌وکار
   - بازهٔ تاریخی (`from`, `to`, `range`, `dateTab`) با سه حالت روز/ماه/سال
   - فیلتر چندانتخابی شهر (`city`)
   - فیلتر چندانتخابی وضعیت رزرو (`status`): `confirmed`, `checked-out`, `unconfirmed`
   - دکمهٔ پاک کردن همهٔ فیلترها
   - همهٔ فیلترها از طریق query params در URL اعمال می‌شن و با `router.replace` + `startTransition` آپدیت می‌شن (بدون navigation کامل).

3. **Stats (۴ کارت KPI)** — شاخص‌های کلیدی کسب‌وکار
   - تعداد رزروها (با درصد رشد نسبت به بازهٔ قبلی)
   - درآمد کل به تومان (با درصد رشد)
   - نرخ اشغال (%) — `nights / (numDays * cabins.length)`
   - میانگین طول اقامت (شب) (با درصد رشد)

4. **نمودار فروش روزانه (SalesChart)** — ردیابی درآمد در طول بازهٔ انتخابی
5. **نمودار توزیع مدت اقامت (DurationChart)** — pie chart توزیع رزروها بر اساس تعداد شب
6. **نمودار نرخ اشغال (OccupancyChart)** — درصد اشغال به‌ازای روز/بازه
7. **نمودار سهم درآمد شهرها (CityRevenueChart)** — درآمد به تفکیک شهر + مجموع درآمد
8. **فعالیت امروز (TodayActivity)** — لیست ورود/خروج‌های امروز + دکمهٔ check-in/check-out

---

## ۳) منبع داده

- **داده واقعی متصل نیست.** همهٔ داده‌ها از `src/features/dashboard/overview/data/mock-data.ts` تولید می‌شن:
  - ۱۰ سوییت mock با `CABINS` (نام، ظرفیت، قیمت، شهر، تصاویر Supabase، مختصات)
  - ~۱۴۰ رزرو mock با seed ثابت `20240912` (guestName, dates, nights, price, status, extras, isPaid, hasBreakfast)
  - `DASHBOARD_CITIES` از روی سوییت‌ها استخراج می‌شه (`regionId = 1`)
- توابع کمکی:
  - `filterBookingsByRange(bookings, from, to)`
  - `filterPrevBookings(bookings, from, to)` — بازهٔ قبلی برای محاسبهٔ growth
  - `calcGrowth(current, previous)`

---

## ۴) URL Params و منطق فیلتر

- `from`, `to` (yyyy-MM-dd)
- `range`: preset بازه (`last-7-days`, `last-30-days`, `this-season`, `this-year`, `custom`)
- `dateTab`: `day` | `month` | `year`
- `city`: لیست نام شهرها با کاما
- `status`: لیست وضعیت‌ها با کاما
- `resolveDashboardDateRange()` بازه را clamp می‌کند (حداکثر تا امروز) و preset متناظر را تشخیص می‌دهد.

---

## ۵) وضعیت فعلی (چی آماده / چی نقص داره)

| بخش | وضعیت | توضیح |
|---|---|---|
| Layout و اسکلتون لودینگ | آماده | `OverviewSkeleton` + `Spinner` |
| فیلتر تاریخ (روز/ماه/سال) | آماده | gauge-based picker |
| فیلتر شهر/وضعیت | آماده | چندانتخابی از طریق query param |
| KPI ها | آماده ولی mock | growth نسبت به بازهٔ قبلی |
| چارت‌ها (فروش، مدت، اشغال، شهر) | آماده ولی mock | recharts-like سفارشی |
| TodayActivity | **ناقص** | دادهٔ hardcoded داخل کامپوننت، دکمه‌ها action واقعی ندارن |
| TodayItem | **نقص تایپی** | `activity: any` |
| اتصال به Supabase / API واقعی | ❌ | فقط mock |
| Real bookings/cabins از DB | ❌ | `BOOKINGS` و `CABINS` ثابت در bundle |

---

## ۶) تکنولوژی‌ها

- Next.js App Router + React client components (`"use client"`)
- Tailwind CSS
- `date-fns` + `date-fns-jalali` (تاریخ شمسی)
- `lucide-react` آیکون‌ها
- recharts-style custom charts
- دادهٔ سوییت‌ها از Supabase Storage (تصاویر)

---

## ۷) چیزهایی که برای production لازم است

1. جایگزینی `mock-data.ts` با query واقعی Supabase (bookings, cabins, cities)
2. تبدیل `TodayActivity` و `TodayItem` به دادهٔ real + اتصال دکمه‌ها به mutation (check-in/check-out)
3. تایپ درست برای `TodayItem`
4. تست لودینگ/خطا برای fetch واقعی
5. همگام‌سازی نام شهرها بین فیلتر mock و cities واقعی
