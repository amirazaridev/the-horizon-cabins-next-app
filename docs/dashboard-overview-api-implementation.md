# پیاده‌سازی endpoint داشبورد — `GET /dashboard/snapshot`

> فاز: پیاده‌سازی API (بدون اتصال فرانت، بدون کامیت)
> پروژه: `the-horizon-cabins-API-TS`

## خلاصه

یک endpoint تجمیعی که کل **داده‌ی خام** صفحه‌ی Overview داشبورد را در یک
فراخوانی برمی‌گرداند. محاسبه‌ی شاخص‌ها (KPI/نمودار/جدول) عمداً **سمت کلاینت**
می‌ماند تا توابع pure متریک یک‌جا بمانند (تصمیم معماری فاز برنامه‌ریزی).

## فایل‌های جدید

| فایل | نقش |
|---|---|
| `src/routes/dashboard.route.ts` | ثبت مسیر + `protect` + `restrictTo(admin, owner)` |
| `src/controllers/dashboard.controller.ts` | خواندن query و فراخوانی سرویس |
| `src/services/dashboard.service.ts` | ارکستراسیون snapshot + تایپ `DashboardSnapshot` |
| `src/repositories/dashboard.repository.ts` | کوئری‌های Prisma + `select`های مشترک |
| `src/validations/dashboard.validation.ts` | اعتبارسنجی Zod کوئری |
| `src/constants/dashboard.constants.ts` | وضعیت‌های فعال، نگاشت پرداخت، افق/سقف بازه |
| `src/utils/dashboard-range.util.ts` | `resolveCompareRange` + `inclusiveDayCount` |
| `src/utils/dashboard-filter.util.ts` | `resolveStatusFilter` + `buildDashboardFilters` |
| `src/types/dashboard.types.ts` | تایپ‌های دامنه (`DashboardSnapshotQuery` و …) |

فقط یک فایل موجود تغییر کرد: `src/routes/index.ts` (ثبت `router.use("/dashboard", …)`).

## قرارداد

### درخواست
```
GET /api/v1/dashboard/snapshot
  ?from=2026-06-01&to=2026-06-30      ← الزامی (YYYY-MM-DD)
  &compare=prev-period                ← prev-period | prev-year | none (پیش‌فرض prev-period)
  &cityIds=1,2                        ← CSV عددی (اختیاری)
  &cabinIds=5                         ← CSV عددی (اختیاری)
  &statuses=pending,confirmed         ← CSV enum (اختیاری)
  &paymentStatuses=paid,unpaid        ← CSV دوتایی (اختیاری)
```
احراز هویت: کوکی `jwt` + نقش `admin` یا `owner`.

### پاسخ
```jsonc
{
  "status": "success",
  "data": {
    "snapshot": {
      "bookings":        [ /* DashboardBooking[] — رزروهای متداخل با بازه */ ],
      "compareBookings": [ /* همان فیلترها روی بازه‌ی مقایسه */ ],
      "cabins":          [ /* اقامتگاه‌های فیلترشده */ ],
      "todayBookings":   [ /* عملیات امروز — مستقل از بازه/فیلتر */ ],
      "forwardBookings": [ /* امروز تا +۹۰ روز — مستقل از بازه/فیلتر */ ],
      "range":           { "from": "…", "to": "…" },
      "compareRange":    { "from": "…", "to": "…" } | null,
      "today":           "…"
    }
  }
}
```

## منطق‌های پیاده‌شده

1. **تداخل نیم‌باز:** `startDate < to+1 AND endDate > from` (شب خروج اقامت
   حساب نمی‌شود) — عیناً هم‌منطق با `overlapsRange` فرانت.
2. **بازه‌ی مقایسه** (`resolveCompareRange`): `prev-period` = همان طول بی‌درنگ
   قبل از `from`؛ `prev-year` = ۳۶۵ روز عقب؛ `none` = `null`.
3. **«امروز» به وقت Asia/Tehran** (`todayInTimezone(TIMEZONE)`) — نه ساعت سرور.
4. **فیلتر وضعیت پرداخت دوتایی:** `paid` ⇒ `{confirmed, checkedIn, checkedOut}`،
   `unpaid` ⇒ `{pending, cancelled}`؛ با فیلتر `statuses` **اشتراک** گرفته می‌شود
   (اشتراک خالی ⇒ نتیجه‌ی خالی).
5. **استقلال ویجت‌های عملیاتی:** `todayBookings`/`forwardBookings` از **کل**
   دیتاست می‌آیند، نه فقط بازه و نه با فیلتر شهر/اقامتگاه.
6. **گاردها:** `from ≤ to` و سقف طول بازه = ۱۰۹۵ روز (کنترل اندازه‌ی payload).

## تست‌ها

- **واحد (بدون DB):** `tests/unit/utils/dashboard-range.util.test.ts` (۷)،
  `tests/unit/utils/dashboard-filter.util.test.ts` (۱۱)،
  `tests/unit/validations/dashboard.validation.test.ts` (۱۴).
- **Integration (با DB):** `tests/integration/routes/dashboard.routes.test.ts` (۱۶) —
  دسترسی‌ها، اعتبارسنجی، شکل پاسخ، تداخل بازه، فیلترها، بازه‌ی مقایسه،
  عملیات امروز/پیش‌رو.

### نتیجه‌ی اجرا
- `npm run test:unit` → **۳۴۶/۳۴۶** (۱۹ فایل) ✅
- `npm run test:integration` → **۲۲۰/۲۲۰** (۱۳ فایل) ✅
- `npm run lint` → ۰ خطا ✅
- `tsc` → تنها خطای از قبل موجود در `src/utils/booking-price.util.test.ts` (کهنه)

> ℹ️ نکته: DB یک exclusion constraint روی «عدم هم‌پوشانی رزروهای یک کابین»
> (`bookings_no_overlap`) دارد؛ در تست‌ها برای چند رزرو هم‌بازه باید کابین
> جدا ساخت.

## شکاف‌های باقی‌مانده برای فاز «اتصال فرانت»

| مورد | وضعیت | اثر |
|---|---|---|
| `DashboardCabin.discount` | 🔴 در اسکیمای Prisma **وجود ندارد** | فرانت باید این فیلد را از تایپش حذف کند (هیچ ویجتی از آن استفاده نمی‌کند) |
| `totalPrice` | DB: `Int` · فرانت: `bigint` | `hydrateBooking` در فرانت باید `BigInt(...)` بزند یا تایپ به `number` تغییر کند |
| `today = filters.from` | 🐞 باگ احتمالی فرانت | در فاز اتصال، `today` از پاسخ API (`snapshot.today`) استفاده شود |

---

## فاز اتصال فرانت — DONE

صفحه‌ی Overview دیگر mock نیست و به `GET /dashboard/snapshot` متصل شد.

### شکاف‌های رفع‌شده
- **`DashboardCabin.discount`** حذف شد (در اسکیمای Prisma وجود ندارد؛ هیچ ویجتی هم استفاده نمی‌کرد).
- **`totalPrice`** از `bigint` به `number` تغییر کرد و **کل ماشین bigint حذف شد**
  (`sumBigInt`/`toBigInt`/`safeRatioBigInt`/`deltaPercentBigInt`/`kpiValueAsNumber`/`kpiToNumber`).
- **`today`** دیگر `filters.from` نیست؛ مقدار معتبر از پاسخ API (`snapshot.today`) می‌آید.

### فایل‌های جدید (فرانت)
| فایل | نقش |
|---|---|
| `src/app/api/dashboard/snapshot/route.ts` | Route Handler — پروکسی داخلی به بک‌اند با `authFetch` |
| `features/dashboard/overview/services/dashboard-api.server.ts` | `fetchDashboardFilterOptions()` (سرور-ساید) |
| `features/dashboard/overview/data/dashboard.repository.api.ts` | `ApiDashboardRepository` (کلاینت‌محور) |
| `features/dashboard/overview/data/dashboard.hydrate.ts` | بازسازی `Date`ها از JSON |
| `features/dashboard/overview/actions/dashboard.actions.ts` | Server Actionهای check-in/out |

### معماری اتصال
```
[Server Component] page.tsx ──authFetch──▶ GET /locations/cities + GET /cabins
                                            (گزینه‌های فیلتر)

[Client hook] useDashboardFilters
   └─▶ ApiDashboardRepository.getSnapshot(filters)
         └─▶ fetch('/api/dashboard/snapshot?…')          ← Route Handler داخلی
               └─▶ authFetch('dashboard/snapshot?…')      ← کوکی JWT سرور-ساید
                     └─▶ API بک‌اند (protect + admin|owner)
                           └─ hydrateSnapshot(JSON)        ← Dateها بازسازی می‌شوند

[Client hook] useTodayActivity
   └─▶ ApiDashboardRepository.checkIn/checkOut
         └─▶ Server Action ──authFetch──▶ PATCH /bookings/:id/status
```
فایل‌های حذف‌شده: `mock-dataset.ts` و `dashboard.repository.mock.ts`.

### تأیید
- `tsc --noEmit` → ۰ خطا · `eslint` (overview/api/dashboard) → ۰ خطا · `next build` → موفق.
- **smoke test زنده** (API و Next هر دو روی `:3001`/`:3000` در حال اجرا):
  - `GET /api/v1/dashboard/snapshot` بدون احراز هویت → **401** ✓
  - با توکن owner → **200** و `snapshot` با هر ۸ کلید؛ `cabins=10`، `forwardBookings=1` ✓
  - از طریق پروکسی Next (`/api/dashboard/snapshot`) با کوکی → **200** و همان داده ✓
  - شکل رزرو: `totalPrice` عدد (`45000000`)، `guest:{id,fullName}`، `cabin:{id,name}` ✓
  - صفحه‌ی `/dashboard` با احراز هویت → **HTTP 200** ✓
  - ⚠️ نکته: نام کوکی BFF در Next **`JWT`** است (بک‌اند `jwt`) — تست دستی باید `Cookie: JWT=<token>` بفرستد.
