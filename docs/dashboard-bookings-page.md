# کامپوننت Table و صفحهٔ رزروهای داشبورد

> فاز: ساخت Table قابل استفادهٔ مجدد + صفحهٔ رزروهای ادمین + اتصال به API
> (بدون کامیت)

## ۱) کامپوننت Table قابل استفادهٔ مجدد

`src/components/ui/Table/` (index.tsx + types.ts)

```tsx
<Table
  columns={columns}          // TableColumn<T>[]
  rows={bookings}
  rowKey={(b) => b.id}
  loading={false}
  skeletonRows={6}
  emptyState={<EmptyState />}
  caption="فهرست رزروها"     // sr-only
  onRowClick={...}
  initialSort={{ key: "total", direction: "desc" }}
/>
```

| قابلیت | توضیح |
|---|---|
| ستون‌بندی | `TableColumn<T>` با `header`، `align`، `className`، `hideOnMobile`، `render` |
| مرتب‌سازی | کلاینت‌ساید، فقط ستون‌های دارای `sortValue`؛ `null` همیشه آخر |
| حالت‌ها | `loading` (اسکلتون)، `emptyState` (ردیف تمام‌عرض) |
| ریسپانسیو | اسکرول افقی؛ `hideOnMobile` → `hidden md:table-cell` |
| دسترس‌پذیری | `caption` sr-only، `scope="col"`، `aria-sort`، دکمهٔ مرتب‌سازی با `aria-label` |
| تم | هم‌راستا با `CardDashContainer` (`border-border`، `text-text`، `text-text-gray`، تأکید `primary-400`) |

> ⚠️ چون `columns.render` تابع است، جدول فقط داخل **کلاینت‌کامپوننت** قابل
> استفاده است (توابع از مرز سرور→کلاینت رد نمی‌شوند).

## ۲) صفحهٔ رزروها

`src/app/(dashboard)/dashboard/bookings/page.tsx` (Server Component)

```
page.tsx (سرور) ──authFetch──▶ GET /bookings?<فیلترها>  →  BookingsTable (کلاینت)
                            └─▶ GET /cabins + /locations/cities → BookingsFilters
```

### فایل‌های فیچر (`src/features/dashboard/bookings/`)
| فایل | نقش |
|---|---|
| `lib/booking-filters.ts` | پارس/سریال‌سازی فیلترهای URL → کوئری API |
| `services/bookings.api.server.ts` | `fetchBookings` + `fetchBookingsFilterOptions` (سرور-ساید) |
| `actions/booking.actions.ts` | Server Actionهای تحویل/تخلیه/کنسل (→ `PATCH /bookings/:id/status`) |
| `components/BookingsFilters.tsx` | نوار فیلتر (وضعیت، تاریخ ورود، شهر، اقامتگاه، جستجوی مهمان) |
| `components/BookingsTable.tsx` | جدول + بنر نتیجهٔ عملیات + مودال جزییات |
| `components/BookingRowMenu.tsx` | منوی ستون آخر |
| `components/BookingDetailsModal.tsx` | مودال «جزییات رزرو» |
| `components/BookingStatusBadge.tsx` | چیپ وضعیت |

### فیلترها (URL → API)
| فیلتر | پارامتر URL | پارامتر API |
|---|---|---|
| وضعیت (چندتایی) | `status` (CSV) | `statuses` (CSV) |
| بازهٔ تاریخ ورود | `from` / `to` | `startDateFrom` / `startDateTo` |
| اقامتگاه | `cabin` | `cabinId` |
| شهر | `city` | `cityId` |
| جستجوی نام مهمان | `q` (≥۲ کاراکتر) | `guestQuery` |
| صفحه | `page` | `page` + `limit=10` |

### منوی ستون آخر
- **جزییات رزرو** → مودال کامل (وضعیت، مهمان، اقامتگاه، تاریخ‌ها، پرداخت، لغو، نرخ هر شب، توضیحات).
- **تحویل یا تخلیه** → بسته به وضعیت: `confirmed` ⇒ «تحویل اتاق»، `checkedIn` ⇒ «تخلیه اتاق»؛ در بقیهٔ وضعیت‌ها غیرفعال.
- **کنسل کردن رزرو** → با `ConfirmModal`؛ فقط برای `pending`/`confirmed` فعال.

> گذارهای مجاز از قواعد بک‌اند پیروی می‌کنند؛ بک‌اند خودش هم اعتبارسنجی
> می‌کند و لغو توسط ادمین `cancellationReason = adminCancelled` می‌گیرد.

## ۳) تغییرات API

`GET /bookings` گسترش یافت (بدون شکستن مصرف‌کنندهٔ فعلی):

| پارامتر جدید | توضیح |
|---|---|
| `statuses` | CSV چندوضعیتی — بر `status` تکی اولویت دارد |
| `cityId` | فیلتر شهر از طریق رابطهٔ اقامتگاه |
| `guestQuery` | جستجوی نام مهمان (`contains`، بدون حساسیت به بزرگی/کوچکی، حداقل ۲ کاراکتر) |

فایل‌های تغییرکرده: `types/booking.types.ts` · `repositories/booking.repository.ts`
(`buildWhereClause`) · `validations/booking.validation.ts` · `controllers/booking.controller.ts` ·
`validations/shared.validation.ts` (`csvToArray` مشترک).

## ۴) تغییرات UI مشترک
- `components/ui/Menus.tsx` → `Menus.Button` حالا `disabled` می‌پذیرد (غیرفعال‌کردن
  آیتم‌های غیرمجاز به‌جای پنهان‌کردنشان).
- `libs/utils/jalali.ts` (جدید) → `formatJalaliFull` / `formatJalaliDayMonth` / `formatJalaliTime`.

## ۵) تأیید
- `tsc --noEmit` → ۰ خطا · `eslint` → ۰ خطا · `next build` → موفق.
- تست‌های API: unit **۳۵۴/۳۵۴** (۸ تست جدید) · integration فیلترهای لیست **۶/۶**.
- **smoke test زنده**: `GET /bookings?statuses=confirmed,pending` → 200؛
  `/dashboard/bookings` → 200 با **۱۰ ردیف** و ۱۱ منوی ردیف؛ برچسب‌های وضعیت رندر شدند؛
  فیلتر `?status=confirmed&q=ali` → 200.
