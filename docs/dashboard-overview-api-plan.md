# برنامه‌ریزی API برای صفحهٔ Overview داشبورد ادمین — نسخهٔ ۲ (بازنگری‌شده)

> **فاز:** ۱ (بازنگری) — بررسی + برنامه‌ریزی (بدون تغییر کد)
> **هدف:** جایگزینی دادهٔ mock صفحهٔ Overview با دادهٔ واقعی از API
> **قید اصلی:** **اسکیمای جدول تغییر نمی‌کند.** هر چیزی که به تغییر اسکیما
> نیاز دارد از فرانت‌اند **حذف** می‌شود.
> **وضعیت:** ⏸️ توقف برای بازبینی کاربر — فاز بعدی فقط پس از تأیید

---

## ۰) تصمیمات تأییدشدهٔ کاربر (این بازنگری)

| # | موضوع | تصمیم |
|---|---|---|
| ۱ | کانال فروش (`channel`) | **حذف کامل** از فرانت‌اند — بدون تغییر اسکیما |
| ۲ | فیلد `paidAmount` | **حذف کامل** — بدون تغییر اسکیما |
| ۳ | کارت KPI «مطالبات معوق» (`outstanding`) | **حذف کامل کارت** (ردیف KPI از ۸ به ۷ کارت) |
| ۴ | هشدارهای `aged-outstanding` و `payment-expired-spike` | **حذف هر دو** (نوار از ۵ به ۳ هشدار) |
| ۵ | فیلتر «وضعیت پرداخت» | **نگه‌داشتن نسخهٔ دوتایی ساده**: `پرداخت‌شده` / `پرداخت‌نشده` — مشتق از `status` |
| ۶ | قاعدهٔ پرداخت | `cancelled` و `pending` ⇒ **پرداخت‌نشده**؛ بقیه ⇒ **پرداخت‌شده** |

> نتیجه: تنها مفهوم «پرداخت» باقی‌مانده، یک پرچم دوتایی مشتق از وضعیت رزرو
> است که **هیچ ستون یا جدول جدیدی لازم ندارد**.

---

## ۱) خلاصهٔ اجرایی

صفحهٔ Overview کاملاً در فرانت‌اند ساخته شده و همهٔ ویجت‌ها فقط از طریق
interface `DashboardRepository` به داده دسترسی دارند. با حذف کانال و
پرداختِ پیچیده، **شکاف API کوچک‌تر و کاملاً بدون تغییر اسکیما** می‌شود:

1. **افزودن یک endpoint تجمیعی `GET /dashboard/snapshot`** که آرایه‌های خام
   رزرو/اقامتگاه را برمی‌گرداند (کلاینت با توابع pure محاسبه می‌کند).
2. **گسترش فیلترهای رزرو** در همان endpoint (چندمقداری، شهر، وضعیت،
   وضعیت پرداخت دوتایی، تداخل بازه).
3. **بدون هیچ migration** — `channel` و `paidAmount` حذف شدند؛ تنها فیلد
   موردنیاز `paymentDeadline`/`cancellationReason` است که از قبل در اسکیماست.

---

## ۲) فهرست کامل حذفیات از فرانت‌اند

### ۲٫۱ کانال فروش — حذف کامل 🔴

| عنصر / فایل | محل | نوع |
|---|---|---|
| `SalesChannel` (type) | `types/dashboard.types.ts:54` | Type |
| `SALES_CHANNEL_LABELS` | `types/dashboard.types.ts:234` | Const |
| `DashboardBooking.channel` | `types/dashboard.types.ts:176` | Field |
| `DashboardFilters.channels` | `types/dashboard.types.ts:213` | Field |
| `ChannelShareChart.tsx` | `components/charts/` | کامپوننت کامل |
| import + رندر `ChannelShareChart` | `MainPageLayout.tsx:17,263` | JSX |
| `channelShare()` + `ChannelShareRow` | `lib/metrics/analytics.ts:164–203` | تابع |
| `PARAM_CHANNEL` | `constants/dashboard-params.ts:35` | Const |
| `CHANNEL_OPTIONS`, `isSalesChannel`, `CHANNEL_VALUES` | `FilterBar/index.tsx:73`, `dashboard-params.ts:100,107` | Const/Fn |
| آیتم فیلتر «کانال فروش» + handler | `FilterBar/index.tsx:202,321–339,389` | JSX/Logic |
| پارس `channels` + `filtersKey` | `hooks/useDashboardFilters.ts:60,133` | Logic |
| فیلتر کانال در `applyBookingFilters` | `data/dashboard.repository.ts:147,164` | Logic |
| `CHANNELS` + `channel` در ساخت رزرو | `data/mock-dataset.ts:215,394,445` | Mock |

### ۲٫۲ پرداخت — حذف بخش پیچیده 🔴

| عنصر / فایل | محل | نوع |
|---|---|---|
| `paidAmount` (field) | `types/dashboard.types.ts:159` | Field |
| `PaymentStatus` → فقط `paid \| unpaid` | `types/dashboard.types.ts:60` | Type (کوچک‌سازی) |
| `PAYMENT_STATUS_LABELS` → فقط ۲ برچسب | `types/dashboard.types.ts:241` | Const |
| `derivePaymentStatus` → ساده‌سازی بر مبنای `status` | `data/dashboard.repository.ts:117` | Fn |
| کارت KPI `outstanding` | `config/kpi-cards.config.tsx:216–228` | کارت کامل |
| `KpiKey` = `outstanding` | `config/targets.ts:34,84` | Type/Const |
| `KpiSnapshot.outstanding` + `outstanding()` | `lib/metrics/kpi.ts:299,418,444` | Fn/Type |
| `overdueOutstanding()` / `overdueOutstandingCount()` | `lib/metrics/kpi.ts:317,338` | Fn |
| `paymentExpiredCount()` / `paymentExpiredRate()` | `lib/metrics/kpi.ts:212,228` | Fn |
| هشدار `aged-outstanding` (rule+meta+logic) | `config/alerts.config.ts:57,101` + `lib/metrics/alerts.ts:102` | Logic |
| هشدار `payment-expired-spike` (rule+meta+logic) | `config/alerts.config.ts:70,113` + `lib/metrics/alerts.ts:134` | Logic |
| drill-down `outstanding → paymentStatus=overdue` | `MainPageLayout.tsx:52` | Logic |
| `operationsPulse.outstandingTotal` | `lib/metrics/alerts.ts:185,219` | Field (کد مرده) |
| `KpiCard.lowerIsBetter` شامل outstanding | `components/KpiRow/KpiCard.tsx:259` | Logic |
| `KpiRow` شاخهٔ bigint برای outstanding | `components/KpiRow/index.tsx:57` | Logic |
| تولید `paidAmount` در mock | `data/mock-dataset.ts:358–371,389,461,478,496,514` | Mock |

### ۲٫۳ کد مرده / پیچیدگی غیرضروری (بونوس) ⚠️

| عنصر | محل | دلیل حذف |
|---|---|---|
| `leadTime` در `KpiSnapshot` | `lib/metrics/kpi.ts:419,445` | هیچ کارتی آن را نشان نمی‌دهد |
| `operationsPulse()` + `OperationsPulse` | `lib/metrics/alerts.ts:180–225` | هیچ‌جا استفاده نمی‌شود |
| `buildSummary()` + `SummaryLine` | `lib/metrics/analytics.ts:375–400` | هیچ‌جا استفاده نمی‌شود |
| `overdueOutstanding()` | `lib/metrics/kpi.ts:317` | فقط `…Count` استفاده می‌شد |
| `CANCELLATION_REASON_LABELS` | `types/dashboard.types.ts:228` | در UI استفاده نمی‌شود |
| snapshot: `allCabins`,`cities`,`regions`,`guests` | `data/dashboard.repository.ts:66–69` | در UI استفاده نمی‌شوند (۱۲ → ۸ فیلد) |
| `DashboardRegion` + `getFilterOptions().regions` | `types` + `data` | در UI استفاده نمی‌شود |
| `data/mock-data.ts` | — | فایل **یتیم**؛ هیچ‌جا import نمی‌شود |
| ماشین `bigint` (به‌شرط تأیید بند ۷-۳) | `lib/metrics/money.ts` + `kpi.ts` | چون `total_price` در DB از نوع **`Int`** است، نه `BigInt` |

### ۲٫۴ تغییر چیدمان
- ردیف ۳ قبلاً «سهم کانال (۳/۵) + وضعیت رزرو (۲/۵)» بود. با حذف نمودار
  کانال، `StatusDistributionChart` تنها می‌ماند.
  **پیشنهاد:** این نمودار **تمام‌عرض** شود (یا با `DurationChart` هم‌ردیف).
  (تصمیم جزئی UI — بند ۹-۴.)

---

## ۳) آنچه می‌ماند (بدون تغییر)

| بخش | وضعیت | دلیل |
|---|---|---|
| `AlertsBar` (۳ قاعده: افت اشغال، نرخ لغو، اقامتگاه بی‌رزرو) | ✅ | بدون نیاز به اسکیما |
| `KpiRow` (۷ کارت) | ✅ | همه از `bookings` مشتق |
| `RevenueTrendChart`, `DurationChart`, `OccupancyAdrChart`, `CityRevenueChart`, `StatusDistributionChart` | ✅ | — |
| `PerformanceTable` | ✅ | — |
| `PaceChart` | ✅ | — |
| `TodayActivity` (+ check-in/out) | ✅ | mutation موجود |
| `ForwardBookings` | ✅ | — |
| فیلترهای تاریخ/شهر/اقامتگاه/وضعیت/مقایسه | ✅ | — |
| فیلتر «وضعیت پرداخت» **دوتایی** (`paid`/`unpaid`) | ✅ | مشتق از `status` |
| لایهٔ کیفیت (`WidgetBoundary`, skeleton, empty, DataFreshness) | ✅ | — |

---

## ۴) قرارداد دادهٔ نهایی `DashboardSnapshot`

```ts
{
  bookings:         DashboardBooking[];  // رزروهای متداخل با بازه — فیلترشده
  compareBookings:  DashboardBooking[];  // همان فیلترها روی بازهٔ مقایسه
  cabins:           DashboardCabin[];    // اقامتگاه‌های فعال بعد از فیلتر
  todayBookings:    DashboardBooking[];  // مستقل از فیلتر تاریخ (فقط فعال)
  forwardBookings:  DashboardBooking[];  // امروز تا +۹۰ روز (فقط فعال)
  range:            DateRange;
  compareRange:     DateRange | null;
  today:            Date;
}
```
> حذف‌شده نسبت به نسخهٔ ۱: `allCabins`, `cities`, `regions`, `guests`،
> و فیلد `channel`/`paidAmount` داخل هر رزرو. (۱۲ → ۸ فیلد سطح بالا.)

`DashboardBooking` نهایی (بدون `channel` و `paidAmount`):
`id, startDate, endDate, numNights, numGuests, cabinPrice, totalPrice,
status, paymentDeadline, paidAt, paymentReference, cancelledAt,
cancellationReason, cabinId, guestId, createdAt, updatedAt, guest?, cabin?`

`DashboardFilters` نهایی:
`from, to, numDays, cities[], cabinIds[], statuses[], paymentStatuses[],
compare` — (بدون `channels`؛ `paymentStatuses` فقط `paid|unpaid`).

### قاعدهٔ پرداخت (جایگزین `paidAmount`)
```ts
// دادهٔ فقط از status مشتق می‌شود — بدون ستون/جدول جدید
paid   ⇔ status ∈ { confirmed, checkedIn, checkedOut }
unpaid ⇔ status ∈ { pending, cancelled }
```

---

## ۵) طرح نهایی API

### `GET /dashboard/snapshot` — `protect` + `restrictTo("admin","owner")`

#### Query
| پارامتر | نوع | الزامی | توضیح |
|---|---|---|---|
| `from` | date | ✅ | ابتدای بازه |
| `to` | date | ✅ | انتهای بازه |
| `compare` | enum | — | `prev-period`(پیش‌فرض) \| `prev-year` \| `none` |
| `cityIds` | CSV عدد | — | چند شهر |
| `cabinIds` | CSV عدد | — | چند اقامتگاه |
| `statuses` | CSV enum | — | چند وضعیت |
| `paymentStatuses` | CSV enum | — | `paid` \| `unpaid` (سرور به statuses ترجمه می‌کند) |

#### پاسخ
```jsonc
{
  "status": "success",
  "data": {
    "bookings":        [ /* ... */ ],
    "compareBookings": [ /* ... */ ],
    "cabins":          [ /* ... */ ],
    "todayBookings":   [ /* ... */ ],
    "forwardBookings": [ /* ... */ ],
    "range":           { "from": "2026-01-01", "to": "2026-01-31" },
    "compareRange":    { "from": "2025-12-02", "to": "2025-12-31" } | null,
    "today":           "2026-01-31"
  }
}
```

#### معناشناسی (باید عیناً حفظ شود)
1. **تداخل نیم‌باز:** `startDate < to+1 AND endDate > from`.
2. **`SOLD_STATUSES`** = `pending, confirmed, checkedIn, checkedOut`
   (درآمد/اشغال/ADR/RevPAR). **`ACTIVE_BOOKING_STATUSES`** =
   `pending, confirmed, checkedIn` (عملیات/پیش‌رو).
3. درآمد شب‌به‌شب: `totalPrice ÷ numNights` (توزیع باقی‌ماندهٔ دقیق).
4. نرخ لغو و توزیع وضعیت بر مبنای `createdAt` داخل بازه.
5. `todayBookings`/`forwardBookings` **بدون** فیلتر شهر/اقامتگاه/بازه.
6. `today` = «امروز» به وقت **Asia/Tehran** (از `TIMEZONE` موجود).

### چرا آرایهٔ خام و نه KPI پیش‌محاسبه؟
همهٔ ویجت‌ها محاسبه را روی کلاینت با توابع pure `lib/metrics/*` انجام
می‌دهند. با برگرداندن آرایهٔ خام، **هیچ تابعی لازم نیست به بک‌اند منتقل
شود** و ریسک واگرایی محاسبات صفر می‌شود. (کمترین تغییر API.)

---

## ۶) بدون تغییر اسکیما ✅

| مورد قبلاً پیشنهادی | وضعیت جدید |
|---|---|
| enum `sales_channel` + ستون `channel` | ❌ حذف شد (کانال از فرانت حذف شد) |
| جدول `payments` / ستون `paid_amount` | ❌ حذف شد (پرداخت دوتایی از `status`) |
| جدول `dashboard_targets` | ❌ لازم نیست (اهداف در `config/targets.ts`) |
| جدول `cabin_availability` | ❌ لازم نیست (فرض: هر شب قابل‌فروش) |
| ایندکس‌های جدید | 🟡 اختیاری (`(status, created_at)` برای کوئری داشبورد) |

> ⚠️ تنها نکتهٔ هم‌راستاسازی: `Booking.total_price` در `schema.prisma` از
> نوع **`Int`** است، ولی types فرانت `bigint` فرض می‌کنند. راه‌حل پیشنهادی:
> **فرانت را به `number` تغییر دهیم** (اسکیما دست‌نخورده می‌ماند) — بند ۹-۳.

---

## ۷) لیست دقیق اقدامات لازم در API

| # | اقدام | محل | نوع |
|---|---|---|---|
| ۱ | ساخت `routes/dashboard.route.ts` (`protect` + `restrictTo`) | `src/routes/` | Route |
| ۲ | ثبت `/dashboard` در `routes/index.ts` | `src/routes/index.ts` | Route |
| ۳ | ساخت `validations/dashboard.validation.ts` (CSV/بازه/compare) | `src/validations/` | Validation |
| ۴ | ساخت `controllers/dashboard.controller.ts` | `src/controllers/` | Controller |
| ۵ | ساخت `services/dashboard.service.ts` (snapshot + compare + ترجمهٔ paymentStatus) | `src/services/` | Service |
| ۶ | ساخت `repositories/dashboard.repository.ts` (کوئری رزرو/اقامتگاه) | `src/repositories/` | Repo |
| ۷ | گسترش `BookingFilters` (چندمقداری + شهر + `endDate`/تداخل) | `src/types/booking.types.ts` | Type |
| ۸ | تعریف `today` به وقت Asia/Tehran در سرویس | `services/dashboard.service.ts` | Logic |
| ۹ | (اختیاری) ایندکس `(status, created_at)` | migration | DB |
| ۱۰ | تست‌های integration برای `/dashboard/snapshot` | `tests/integration/` | Test |

> ✅ **هیچ migration الزامی برای ستون/جدول جدید وجود ندارد.**

---

## ۸) تغییرات فرانت (فاز بعد — خارج از دامنهٔ این فاز)

| # | اقدام | فایل |
|---|---|---|
| ۱ | اعمال حذفیات بند ۲ (کانال + پرداخت پیچیده + کد مرده) | متعدد |
| ۲ | ساخت `data/dashboard.repository.api.ts` (`ApiDashboardRepository`) | جدید |
| ۳ | `hydrateBooking` (بازسازی `Date`ها از JSON) | جدید |
| ۴ | Route Handler/Server Action برای `GET /dashboard/snapshot` | جدید |
| ۵ | Server Action برای check-in/out | `hooks/useTodayActivity.ts` |
| ۶ | تعویض یک خط در `getDashboardRepository()` | `data/dashboard.repository.mock.ts` |
| ۷ | حذف `mock-dataset.ts` + `dashboard.repository.mock.ts` + `mock-data.ts` | — |

---

## ۹) تصمیمات باقی‌مانده

| # | مورد | وضعیت |
|---|---|---|
| ۱ | `today` فعلاً = `filters.from` (`useDashboardFilters.ts:158`) | 🐞 پیشنهاد: در فاز API، `today` از سرور بیاید و فرانت از آن استفاده کند |
| ۲ | `totalPrice` نوع `Int` (DB) vs `bigint` (فرانت) | 🟡 پیشنهاد: فرانت → `number` و حذف ماشین bigint |
| ۳ | چیدمان ردیف ۳ بعد از حذف نمودار کانال | 🟡 پیشنهاد: `StatusDistributionChart` تمام‌عرض |
| ۴ | آیا فیلتر «وضعیت پرداخت» دوتایی در URL بماند؟ | ✅ طبق تصمیم کاربر می‌ماند |

---

## ۱۰) فازبندی پیشنهادی

- **فاز ۱ (این سند):** بررسی + برنامه‌ریزی بازنگری‌شده. ✅
- **فاز ۲:** تأیید این سند + رفع بند ۹.
- **فاز ۳:** پیاده‌سازی `GET /dashboard/snapshot` + تست integration.
- **فاز ۴:** اعمال حذفیات فرانت + `ApiDashboardRepository` + swap.
