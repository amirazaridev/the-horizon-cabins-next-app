# حذفیات صفحهٔ Overview — فاز حذف (فرانت‌اند)

> فاز: حذف موارد تأییدشده. **بدون تغییر بک‌اند، بدون تغییر اسکیما، بدون کامیت.**
> شاخهٔ فعلی: `refactor/dashboard`

## نتیجهٔ بررسی
- `tsc --noEmit` → **موفق (۰ خطا)**
- `eslint` (کل پروژه) → **۰ خطا**؛ `eslint src/features/dashboard/overview` → **تمیز**
- `git diff --stat` → ۱۸ فایل، **۶۸ درج، ۱۳۳۳ حذف**، ۲ فایل حذف‌شده

---

## ۱) کانال فروش — حذف کامل
- [x] نوع `SalesChannel` و ثابت `SALES_CHANNEL_LABELS` — `types/dashboard.types.ts`
- [x] فیلد `DashboardBooking.channel` — `types/dashboard.types.ts`
- [x] فیلد `DashboardFilters.channels` — `types/dashboard.types.ts`
- [x] کامپوننت `ChannelShareChart.tsx` — **فایل حذف شد**
- [x] import + رندر نمودار — `MainPageLayout.tsx`
- [x] `channelShare()` و `ChannelShareRow` — `lib/metrics/analytics.ts`
- [x] `PARAM_CHANNEL`، `CHANNEL_OPTIONS`، `isSalesChannel` — `constants/dashboard-params.ts` + `FilterBar/index.tsx`
- [x] آیتم فیلتر «کانال فروش» + handler — `FilterBar/index.tsx`
- [x] پارس `channels` + `filtersKey` — `hooks/useDashboardFilters.ts`
- [x] فیلتر کانال در `applyBookingFilters` — `data/dashboard.repository.ts`
- [x] `CHANNELS` و `channel` در ساخت رزرو — `data/mock-dataset.ts`

## ۲) پرداخت پیچیده — حذف
- [x] فیلد `paidAmount` — `types/dashboard.types.ts` + `mock-dataset.ts`
- [x] کارت KPI «مطالبات معوق» (`outstanding`) — `config/kpi-cards.config.tsx` (ردیف ۸ → ۷ کارت)
- [x] `KpiKey`/`KPI_TARGETS.outstanding` — `config/targets.ts`
- [x] `KpiSnapshot.outstanding` + توابع `outstanding`/`overdueOutstanding`/`overdueOutstandingCount` — `lib/metrics/kpi.ts`
- [x] `paymentExpiredCount`/`paymentExpiredRate` — `lib/metrics/kpi.ts`
- [x] هشدار `aged-outstanding` و `payment-expired-spike` (rule + meta + logic) — `config/alerts.config.ts` + `lib/metrics/alerts.ts` (نوار ۵ → ۳ هشدار)
- [x] drill-down `outstanding → paymentStatus=overdue` — `MainPageLayout.tsx`
- [x] `PaymentStatus` کوچک‌سازی به `paid | unpaid` + `derivePaymentStatus` بر مبنای `status`
- [x] `lowerIsBetter` کارت KPI — `KpiCard.tsx`

**باقی‌مانده (طبق تصمیم):** فیلتر «وضعیت پرداخت» دوتایی (`پرداخت‌شده`/`پرداخت‌نشده`) که از `status` مشتق می‌شود.

## ۳) کد مرده / فیلدهای بی‌استفاده
- [x] `leadTime` از `KpiSnapshot` — `lib/metrics/kpi.ts`
- [x] `operationsPulse` + `OperationsPulse` — `lib/metrics/alerts.ts`
- [x] `buildSummary` + `SummaryLine` — `lib/metrics/analytics.ts`
- [x] `CANCELLED` / `CANCELLED_STATUSES` بی‌استفاده — `lib/metrics/analytics.ts`
- [x] `CANCELLATION_REASON_LABELS` (نسخهٔ داشبورد) — `types/dashboard.types.ts`
- [x] فیلدهای مردهٔ snapshot: `allCabins`، `cities`، `regions`، `guests` (۱۲ → ۸ فیلد) — `data/dashboard.repository.ts` + mock
- [x] `DashboardRegion` + `getFilterOptions().regions` — types + repository
- [x] `mock-data.ts` (فایل یتیم) — **فایل حذف شد**
- [x] کد مردهٔ `rangeBookings` در `getSnapshot` — `dashboard.repository.mock.ts`

## ۴) چیدمان
- [x] ردیف ۳ (کانال + وضعیت) → `StatusDistributionChart` تنها و **تمام‌عرض** — `MainPageLayout.tsx`

---

## فایل‌های تغییریافته (۱۸)
`MainPageLayout.tsx` · `components/FilterBar/index.tsx` · `components/KpiRow/{KpiCard,index}.tsx` ·
`components/charts/ChannelShareChart.tsx` (حذف) · `config/{alerts.config.ts,kpi-cards.config.tsx,targets.ts}` ·
`constants/dashboard-params.ts` · `data/{dashboard.repository.mock.ts,dashboard.repository.ts,mock-dataset.ts}` ·
`data/mock-data.ts` (حذف) · `hooks/useDashboardFilters.ts` · `lib/metrics/{alerts,analytics,kpi}.ts` ·
`types/dashboard.types.ts`

## موارد تأییدنشده (دست‌نخورده ماندند)
- `today` فعلاً = `filters.from` (باگ احتمالی ویجت‌های «امروز») — نیازمند تصمیم.
- ماشین `bigint` (چون `total_price` در DB `Int` است) — نیازمند تأیید.

---

## فاز دوم حذف (این نوبت)

- [x] **کارت KPI «RevPAR»** حذف شد (ردیف KPI از ۷ به **۶** کارت):
  `KpiKey`/`KPI_TARGETS.revPar`، `KpiSnapshot.revPar` + تابع `revPar()`،
  کارت در `kpi-cards.config.tsx`، و ورودی `revPar` در `higherIsBetter` (`KpiCard.tsx`).
  ⚠️ **ستون RevPAR در `PerformanceTable` باقی می‌ماند** (تصمیم: فقط «کارت» حذف شود).
- [x] **نمودار `PaceChart`** حذف شد (`components/charts/PaceChart.tsx` — فایل حذف شد)
  + import/رندر در `MainPageLayout` + `paceRows`/`PaceRow`/`countNightsInWindow` در `analytics.ts`.
  ⚠️ **لیست «رزروهای پیش‌رو» (`ForwardBookings`) باقی می‌ماند** (تصمیم کاربر) و به
  `forwardBookings` در snapshot وابسته است.

بررسی: `tsc` موفق (۰ خطا)، `eslint src/features/dashboard/overview` تمیز.
