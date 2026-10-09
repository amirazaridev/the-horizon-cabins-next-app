# یادداشت‌های مهاجرت — داشبورد از mock به API/Supabase

> **نسخه:** ۱٫۰ · **وضعیت:** فاز mock · **آخرین به‌روزرسانی:** ۱۴۰۵/۰۷/۱۱

هدف این سند: وقتی بک‌اند آماده شد، **هیچ تغییری در UI و توابع metrics
لازم نباشد**. فقط لایه‌ی داده عوض می‌شود.

---

## معماری فعلی و آینده

```
                    ┌─────────────────────────────┐
UI / hooks  ───────▶│   DashboardRepository       │   ← interface
                    │   (data/dashboard.repository)│
                    └──────────┬──────────────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                  │
   ┌──────────▼──────────┐         ┌─────────────▼─────────────┐
   │ MockDashboardRepos. │         │  ApiDashboardRepository   │
   │  ← فاز فعلی ✅       │         │  ← فاز بعد ⏳             │
   │  mock-dataset.ts    │         │  Express API روی :3001     │
   └─────────────────────┘         └───────────────────────────┘
```

### نقطه‌ی تعویض (تک‌منبع)
```ts
// data/dashboard.repository.mock.ts
export function getDashboardRepository(): DashboardRepository {
  if (!repository) {
    repository = new MockDashboardRepository();   // ← فقط این خط عوض می‌شود
  }
  return repository;
}
```

### قواعد انضباطی
| ✅ مجاز | ❌ ممنوع |
|---|---|
| `getDashboardRepository()` | `import { BOOKINGS } from "mock-data"` |
| توابع metrics روی داده‌ی دریافتی | fetch/query در کامپوننت نمایشی |
| `config/targets.ts` برای اهداف | عدد جادویی داخل JSX |

**تأیید خودکار:** `grep -rn "mock-dataset" src/features/dashboard/overview/components/` باید خالی باشد.

---

## نگاشت مدل‌ها — mock ↔ Prisma

### `DashboardBooking` ↔ `model Booking`

| فیلد mock | ستون Prisma | نوع DB | یادداشت |
|---|---|---|---|
| `id` | `id` | `Int` | ✅ |
| `startDate` | `start_date` | `DateTime` | ✅ |
| `endDate` | `end_date` | `DateTime` | ✅ |
| `numNights` | `num_nights` | `Int` | ✅ |
| `numGuests` | `num_guests` | `Int` | ✅ |
| `cabinPrice` | `cabin_price` | `Int` | ⚠️ در mock نرخ **هر شب**؛ در DB هم همان معنی |
| `totalPrice` | `total_price` | **`BigInt`** | ⚠️ در JSON **رشته** می‌شود |
| `status` | `status` | `enum booking_status` | ⚠️ مقادیر camelCase در Prisma Client |
| `paymentDeadline` | `payment_deadline` | `DateTime?` | ✅ |
| `paidAt` | `paid_at` | `DateTime?` | ✅ |
| `paymentReference` | `payment_reference` | `String?` | ✅ |
| `cancelledAt` | `cancelled_at` | `DateTime?` | ✅ |
| `cancellationReason` | `cancellation_reason` | `enum` | ✅ |
| `cabinId` | `cabin_id` | `Int` | ✅ |
| `guestId` | `guest_id` | `Int` | ✅ |
| `createdAt` | `created_at` | `DateTime` | ✅ مبنای leadTime و نرخ لغو |
| `updatedAt` | `updated_at` | `DateTime` | ✅ |
| `guest` (آبجکت) | relation | — | با `include` می‌آید |
| `cabin` (آبجکت) | relation | — | با `include` می‌آید |
| **`paidAmount`** | 🔴 **ستون ندارد** | — | مشتق — نگاه کنید به پایین |
| **`channel`** | 🔴 **ستون ندارد** | — | mock-only |

#### فیلدهایmock که در schema نیستند

**۱) `paidAmount` (bigint)**
مشتق از جدول پرداخت. سه گزینه:
```sql
-- گزینه A (پیشنهادی): جدول جدا
CREATE TABLE payments (
  id            SERIAL PRIMARY KEY,
  booking_id    INT NOT NULL REFERENCES bookings(id),
  amount        BIGINT NOT NULL,
  status        payment_status NOT NULL DEFAULT 'succeeded',
  gateway_ref   VARCHAR(255),
  paid_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- paidAmount = SUM(amount) WHERE status = 'succeeded'
```
گزینه B: ستون `paid_amount BIGINT DEFAULT 0` روی `bookings` (ساده‌تر،
ولی تاریخ پرداخت‌ها را از دست می‌دهیم و بازگشت وجه دشوار می‌شود).

**۲) `channel` (enum)**
```sql
CREATE TYPE sales_channel AS ENUM ('website', 'phone', 'agency', 'referral');
ALTER TABLE bookings ADD COLUMN channel sales_channel NOT NULL DEFAULT 'website';
```

**۳) حذف‌شده‌ها (تصمیم کاربر)**
`extrasPrice` و `hasBreakfast` **کاملاً حذف شدند** — فروش افزونه در این
فاز لازم نیست. سری «فروش افزونه» در نمودار روند حذف می‌شود.

### `DashboardCabin` ↔ `model Cabin`
| mock | Prisma | یادداشت |
|---|---|---|
| `cityId` | `city_id` | ✅ |
| `city` (آبجکت) | relation | `GET /cabins` آبجکت `{id, name}` می‌دهد |
| `regularPrice` / `discount` | ✅ | `Int` |
| `areaSqm` | `area_sqm` | `Float` (در mock نیست — داشبورد لازم ندارد) |
| `latitude` / `longitude` | ✅ | در DB غیرnullable |

> ⚠️ **ناهم‌خوانی شناخته‌شده:** `GET /cabins` آبجکت `city` می‌دهد ولی
> `GET /cabins/:id` فقط `cityId` عددی. راه‌حل موجود پروژه: `getCityById()`
> در `api/getCities.ts`.

### `DashboardGuest` ↔ `model Guest`
`Guest` جداست از `User` — `guestId` رزرو به `Guest.id` اشاره دارد، نه `User.id`.

---

## اندپوینت‌های موجود در API

پروژه‌ی بک‌اند: `the-horizon-cabins-API-TS` روی `localhost:3001/api/v1`.

| اندپوینت | متد | وضعیت | کفایت برای داشبورد؟ |
|---|---|---|---|
| `/cabins` | GET | ✅ موجود | ✅ لیست اقامتگاه‌ها با `city` |
| `/locations/cities` | GET | ✅ موجود | ✅ فیلتر شهر |
| `/locations/regions` | GET | ✅ موجود | ✅ گروه‌بندی منطقه |
| `/bookings` | GET | ✅ موجود | ⚠️ **فیلترهای ناکافی** (پایین) |
| `/bookings/:id/status` | PATCH | ✅ موجود | ✅ check-in / check-out |
| `/bookings/cabin/:id/booked-dates` | GET | ✅ موجود | برای تقویم |
| **`/dashboard/*`** | — | 🔴 **ندارد** | ❌ |

### محدودیت `GET /bookings`
فیلترهای فعلی (`validation/booking.validation.ts`):
```
status · cabinId · guestId · startDateFrom · startDateTo · page · limit
```
**چیزی که داشبورد لازم دارد ولی نیست:**
- `cityId` / `regionId` — فیلتر شهر
- `channel` — فیلتر کانال فروش
- `paymentStatus` — فیلتر وضعیت پرداخت
- `endDateFrom` / `endDateTo` — لازم برای **تداخل بازه** (نه فقط شروع)
- `include=guest,cabin` — تا نام مهمان/اقامتگاه در پاسخ باشد
- فیلتر چندمقداری (`status` فعلاً تکی است)
- مسیر تجمیعی (`/dashboard/kpis`) — تا محاسبات سنگین سروری شوند

> ⚠️ همچنین `protect` دارد — داشبورد باید با توکن سرور-ساید صدا بزند
> (الگوی موجود: Route Handler داخلی + `authFetch` server-only).

---

## Server Actionهای پیشنهادی

| Server Action | متد/مسیر بک‌اند | ورودی | خروجی |
|---|---|---|---|
| `fetchDashboardSnapshot(filters)` | `GET /dashboard/snapshot` *(جدید)* | فیلترها | `DashboardSnapshot` |
| `checkInBooking(bookingId)` | `PATCH /bookings/:id/status` | `{status:"checkedIn"}` | `DashboardBooking` |
| `checkOutBooking(bookingId)` | `PATCH /bookings/:id/status` | `{status:"checkedOut"}` | `DashboardBooking` |
| `cancelBooking(id, reason)` | `POST /bookings/:id/cancel` | — | `DashboardBooking` |

### چرا یک اندپوینت تجمیعی (`/dashboard/snapshot`) بهتر است؟
داشبورد در هر تغییر فیلتر به **همه‌ی** داده نیاز دارد. اگر کلاینتی
`/bookings?limit=100000` بزنیم:
- 🐌 payload بزرگ و کند
- 🔢 pagination باید دور زده شود (خطر بی‌نهایت حلقه)
- 🧮 محاسبه روی کلاینت = main thread کند

راه‌حل: **تجمیع سروری** (معادل `GET /api/search/cabins` که پروژه از قبل
برای صفحه‌ی لیست دارد).

#### پیشنهاد اسکلت اندپوینت
```ts
// the-horizon-cabins-API-TS/src/routes/dashboard.route.ts  (جدید)
router.use(protect, restrictTo("admin", "owner"));
router.get("/snapshot", validate(dashboardSnapshotQuery), dashboardController.getSnapshot);
router.get("/kpis",     validate(dashboardSnapshotQuery), dashboardController.getKpis);
router.get("/pace",     dashboardController.getPace);
```

فیلترهای پیشنهادی `dashboardSnapshotQuery`:
```
from, to                  (isRequired)
compare                   enum: prev-period | prev-year | none
cityIds, cabinIds         (CSV → Int[])
statuses                  (CSV → enum[])
channels                  (CSV → enum[])
paymentStatuses           (CSV → enum[])
```

#### الگوی محاسبه‌ی سروری
دو گزینه:
- **A) SQL تجمیعی** — `GROUP BY` روی `bookings` با پنجره‌ی شب:
  ```sql
  -- شب‌های هر رزرو با generate_series باز می‌شوند
  WITH nights AS (
    SELECT b.id, b.cabin_id, b.status, b.total_price / b.num_nights AS nightly,
           generate_series(b.start_date, b.end_date - 1, '1 day') AS night
    FROM bookings b
    WHERE b.status IN ('pending','confirmed','checkedIn','checkedOut')
  )
  SELECT night, SUM(nightly) FROM nights
  WHERE night BETWEEN $from AND $to GROUP BY night;
  ```
  ⚠️ فقط در Postgres. برای Supabase مناسب است.
- **B) خواندن رزروهای بازه + محاسبه در سرویس Node** — ساده‌تر،
  همان توابع `lib/metrics/*` قابل انتقال به بک‌اند هستند (کد مشترک).

> 💡 **توصیه:** از گزینه‌ی B شروع کنید. توابع `lib/metrics/` **pure**
> و بدون وابستگی به Next هستند و مستقیماً در بک‌اند استفاده می‌شوند.
> یعنی تعریف شاخص‌ها یک‌جا می‌ماند و بین فرانت/بک تکرار نمی‌شود.

---

## جدول‌های پیشنهادی جدید

```sql
-- ۱) کانال فروش
CREATE TYPE sales_channel AS ENUM ('website','phone','agency','referral');
ALTER TABLE bookings ADD COLUMN channel sales_channel NOT NULL DEFAULT 'website';

-- ۲) پرداخت‌ها (برای paidAmount و Outstanding)
CREATE TABLE payments (...);  -- نگاه کنید به بالا

-- ۳) اهداف شاخص‌ها (وقتی config ثابت کافی نبود)
CREATE TABLE dashboard_targets (
  id          SERIAL PRIMARY KEY,
  kpi_key     VARCHAR(50) NOT NULL UNIQUE,
  target_value NUMERIC,
  direction   VARCHAR(4) NOT NULL DEFAULT 'up',
  is_percent  BOOLEAN NOT NULL DEFAULT false,
  effective_from DATE,
  effective_to   DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ۴) بلوک/تعطیلی اقامتگاه (برای AvailableNights دقیق)
CREATE TABLE cabin_availability (
  id        SERIAL PRIMARY KEY,
  cabin_id  INT NOT NULL REFERENCES cabins(id),
  date      DATE NOT NULL,
  is_blocked BOOLEAN NOT NULL DEFAULT true,
  reason    VARCHAR(50),
  UNIQUE (cabin_id, date)
);

-- ۵) قیف تبدیل (Analytics جداگانه — فاز بعد)
-- TODO(analytics): جدول رویداد یا اتصال به سرویس Analytics
```

### ایندکس‌های پیشنهادی
```sql
CREATE INDEX idx_bookings_status_created  ON bookings(status, created_at);
CREATE INDEX idx_bookings_created         ON bookings(created_at);
CREATE INDEX idx_bookings_channel         ON bookings(channel);
-- ایندکس موجود و کافی برای بازه:
-- @@index([cabinId, startDate, endDate])  ✅
```

---

## لیست کار مهاجرت

| # | کار | محل | وضعیت |
|---|---|---|---|
| ۱ | افزودن `sales_channel` + ستون `channel` | Prisma migration | ⏳ |
| ۲ | افزودن جدول `payments` (یا ستون `paid_amount`) | Prisma migration | ⏳ |
| ۳ | افزودن اندپوینت `GET /dashboard/snapshot` | API | ⏳ |
| ۴ | افزودن فیلترهای `cityId`/`channel`/`paymentStatus`/`endDate` | API validation | ⏳ |
| ۵ | کپی توابع `lib/metrics/*` به بک‌اند (کد مشترک) | API | ⏳ |
| ۶ | نوشتن `ApiDashboardRepository` | فرانت | ⏳ |
| ۷ | Route Handler داخلی + `authFetch` سرور-ساید | فرانت | ⏳ |
| ۸ | تعویض یک خط در `getDashboardRepository()` | فرانت | ⏳ |
| ۹ | حذف `data/mock-dataset.ts` + `dashboard.repository.mock.ts` | فرانت | ⏳ |

### گام ۶ در جزئیات
```ts
// data/dashboard.repository.api.ts   (جدید)
export class ApiDashboardRepository implements DashboardRepository {
  async getSnapshot(query: DashboardQuery): Promise<DashboardSnapshot> {
    const params = serializeFilters(query.filters);       // → query string
    const res = await fetch(`/api/dashboard/snapshot?${params}`);
    const json = await res.json();
    return {                                              // ⚠️ بازسازی Date/bigint
      bookings: json.bookings.map(hydrateBooking),
      compareBookings: json.compareBookings.map(hydrateBooking),
      // ...
    };
  }
}

/** ⚠️ بازسازی حیاتی: JSON تاریخ‌ها را رشته و bigint را رشته می‌کند. */
function hydrateBooking(raw: BookingDto): DashboardBooking {
  return {
    ...raw,
    startDate: new Date(raw.startDate),
    endDate: new Date(raw.endDate),
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    paymentDeadline: raw.paymentDeadline ? new Date(raw.paymentDeadline) : null,
    paidAt: raw.paidAt ? new Date(raw.paidAt) : null,
    cancelledAt: raw.cancelledAt ? new Date(raw.cancelledAt) : null,
    totalPrice: BigInt(raw.totalPrice),   // ← رشته → bigint
    paidAmount: BigInt(raw.paidAmount),
  };
}
```

> ⚠️ **`hydrateBooking` را فراموش نکنید.** بدون آن:
> - مقایسه‌ی تاریخ‌ها با `>=` روی رشته کار می‌کند ولی `getTime()` می‌شکند
> - `totalPrice` رشته می‌ماند و `+` آن‌ها **الحاق رشته** می‌شود نه جمع!
> این همان الگوی موجود پروژه است: `mapCabin` در سرویس سرچ.

---

## چک‌لیست پذیرش مهاجرت

- [ ] هیچ `import` مستقیمی از `mock-dataset` در `components/` نیست
- [ ] هیچ fetch/Supabase در کد داشبورد به‌جز `data/dashboard.repository.api.ts` نیست
- [ ] `hydrateBooking` همه‌ی `Date` و `bigint` را بازسازی می‌کند
- [ ] توابع metrics بین فرانت و بک **یکی** هستند (کد مشترک، نه کپی)
- [ ] `getDashboardRepository()` فقط به `ApiDashboardRepository` اشاره می‌کند
- [ ] خطای TypeScript = صفر · `any` جدید = صفر
