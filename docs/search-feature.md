# فیچر جستجو (`src/features/search`) — راهنمای ساختار

## ۱. این فیچر چه می‌کند؟

یک «سرچ یکپارچه‌ی اقامتگاه» است که در **دو نقطه‌ی ورود** استفاده می‌شود، ولی منطقش یکی است:

| نقطه‌ی ورود | کامپوننت | منبع حقیقت | رفتار «اعمال» |
| --- | --- | --- | --- |
| لندینگ (`/`) | `HeroSearch` → `Search variant="hero"` | استور Zustand (فقط در حافظه) | بخش «پیش‌نمایش جستجو» را باز می‌کند (بدون ناوبری) |
| لیست (`/cabins`) | `SearchBar` → `Search variant="results"` | `searchParams` سرور (URL) | URL را عوض می‌کند و لیست را دوباره رندر می‌کند |

پنج فیلتر هسته: **مقصد** (شهر یا منطقه)، **تاریخ ورود**، **تاریخ خروج**، **تعداد مهمان**، **بودجه**.

---

## ۲. معماری داده — یک زنجیره‌ی یک‌طرفه

```
UI (Search / SearchPreview)
  ↓ فقط از repository
cabinSearchRepository.search(filters, limit)      ← کلاینت
  ↓ fetch
GET /api/search/cabins?...                        ← Route Handler (پروکسی، سرور)
  ↓
searchCabinsFromApi(query)                        ← server-only (apiFetch + API_URL)
  ↓
queryCabins(params)                               ← فیچر cabins
  ↓
API بک‌اند
```

**چرا پروکسی؟** `apiFetch` با `server-only` علامت خورده و `API_URL` یک متغیر محیطی سروری است؛ پس کلاینت نه می‌تواند و نه باید مستقیم به بک‌اند بزند. آدرس و کلیدها هرگز به باندل مرورگر نمی‌رسند و درگیر CORS هم نمی‌شویم.

هیچ کامپوننتی نمی‌داند داده از کجا می‌آید؛ همه فقط `cabinSearchRepository.search(...)` را صدا می‌زنند.

---

## ۳. قرارداد URL

تنها منبع حقیقت نام پارامترها `utils/search-params.ts` است. هیچ کامپوننتی خودش query نمی‌سازد یا نمی‌خواند.

| پارامتر | معنا |
| --- | --- |
| `city` | شناسه‌ی عددی شهر (`city=12`) |
| `region` | اسلاگ منطقه (`region=north`) |
| `checkIn` / `checkOut` | `yyyy-MM-dd` میلادی |
| `guests` | عدد صحیح |
| `price` | بازه‌ی بودجه‌ی **هر شب** (`price=1000000-8000000`) |
| `totalPrice` | بازه‌ی بودجه‌ی **کل سفر** (فقط با تاریخ) |

⭐ **بودجه یک مقدار است با دو نام پارامتر.** بدون تاریخ ⇒ `price`، با تاریخ ⇒ `totalPrice`. این دو هرگز با هم نمی‌آیند و مستقیماً به پارامتر هم‌نام API نگاشت می‌شوند.

**منطقه معنایی است:** `region=north` در URL می‌ماند و فقط در لحظه‌ی ساخت کوئری به `regionId` عددی ترجمه می‌شود — نه فهرست ده‌ها `cityId`.

---

## ۴. نقش هر فایل

### ریشه
| فایل | نقش |
| --- | --- |
| `index.ts` | تنها نقطه‌ی ورود مصرف‌کننده‌های بیرونی (barrel). |

### `components/`
| فایل | نقش |
| --- | --- |
| `Search.tsx` | **کامپوننت سرچ یکپارچه** — ارکستراسیون: مقدار draft/applied، خلاصه‌ی موبایل، اکشن «اعمال»، و کلاس‌های چیدمان (محلی، چون تنها مصرف‌کننده خودش است). هیچ fetchی نمی‌زند. |
| `HeroSearch.tsx` | لایه‌ی نازک برای لندینگ (چون `Hero` سروری است و به استور کلاینت وصل نمی‌شود) + ذخیره‌ی «آخرین جستجو» + چیپ آن. |
| `SearchBar.tsx` | نوار جستجوی `/cabins` با کنترلر URL. عمداً sticky نیست. |
| `SearchMobileTrigger.tsx` | تریگر موبایل — دو نما: لندینگ (پرسش + خلاصه + ذره‌بین) و `/cabins` (برچسب + خلاصه + «تغییر جستجو»). |
| `LastSearchChip.tsx` | چیپ «آخرین جستجو» زیر نوار هیرو؛ فقط وقتی جستجوی فعالی نیست. |

### `components/fields/`
| فایل | نقش |
| --- | --- |
| `FieldContent.tsx` | محتوای مشترک یک فیلد (آیکون + عنوان + مقدار + فلش). |
| `GuestsPanel.tsx` | انتخاب تعداد مهمان با `Counter` (۱ تا ۱۰). |
| `BudgetPanel.tsx` | آداپتور «بازه‌ی بودجه» روی `PriceRangePanel` مشترک؛ حالت هر شب/کل سفر و سقف اسلایدر را تعیین می‌کند. |
| `SearchAction.tsx` | دکمه‌ی نهایی سرچ (دسکتاپ) با spinner بدون پرش عرض. |

### `components/destination/`
| فایل | نقش |
| --- | --- |
| `DestinationPanel.tsx` | انتخاب مقصد — سوییچ «لیست/نقشه» + گروه‌بندی شهرها بر اساس منطقه. رندر لیست به `CityPanel` مشترک سپرده شده. |
| `DestinationMapPanel.tsx` | «جای‌گاه» نقشه (بدون کتابخانه‌ی نقشه)؛ قاب از `CabinsMapPanel` می‌آید تا بعداً provider واقعی روی همان `slotId` سوار شود. |

### `components/preview/`
| فایل | نقش |
| --- | --- |
| `SearchPreview.tsx` | بخش «پیش‌نمایش جستجو» در لندینگ — فقط ارکستراسیون (هوک داده + انیمیشن + چهار حالت). |
| `PreviewHeader.tsx` | ابرو، تیتر پویا، زیرعنوان و دکمه‌ی «حذف جستجو». |
| `PreviewGrid.tsx` | نتایج: گرید دسکتاپ + کاروسل موبایل با کارت مشترک. |
| `PreviewCta.tsx` | تعداد نتایج + CTA به `/cabins` با همان فیلترها. |
| `PreviewStates.tsx` | سه حالت `PreviewSkeleton` / `PreviewEmpty` / `PreviewError`. |

### `hooks/`
| فایل | نقش |
| --- | --- |
| `useSearchPreview.ts` | fetch پیش‌نمایش بر اساس مقدار «اعمال‌شده» + محافظت از race. |
| `useSearchPreviewAnimation.ts` | انیمیشن باز/بسته‌ی سبک با GSAP (سه تله‌ی آن در خود فایل مستند است). |
| `useLandingSearchController.ts` | کنترلر لندینگ روی استور Zustand — تاریخ‌ها با ادغام تابعی + مقیاس بودجه. |
| `useUrlSearchController.ts` | کنترلر `/cabins` روی URL — هم‌گام‌سازی draft/applied بدون حلقه. |
| `useLastSearch.ts` | ذخیره/خواندن «آخرین جستجو» (`useSyncExternalStore`). |

### `services/`
| فایل | نقش |
| --- | --- |
| `cabin-search.repository.ts` | **تنها مرز داده‌ی کلاینت** + `CABIN_SEARCH_ENDPOINT`. |
| `cabin-search.api.ts` | آداپتور server-only: نگاشت فیلترها به پارامترهای API. |
| `destination.service.ts` | جستجو/گروه‌بندی مقصدها (لیست مناطق و شهرها). |
| `recent-search.storage.ts` | localStorage «آخرین جستجو» به‌شکل استور خارجی + هم‌گام‌سازی بین تب‌ها. |
| `index.ts` | barrel سرویس‌ها. |

### `constants/`
| فایل | نقش |
| --- | --- |
| `search-limits.ts` | مقادیر عددی: `GUESTS_MIN/MAX`، `BUDGET_MIN/MAX/STEP`، `SEARCH_PREVIEW_LIMIT`. |
| `search-defaults.ts` | `EMPTY_SEARCH_FILTERS` — حالت خالی فیلترها. |
| `regions.ts` | نگاشت نمایشی مناطق (hint/name/id) + `toSearchRegions`. |

> ℹ️ کلاس‌های چیدمان نوار جستجو (wrapper، گرید فیلدها، تریگر موبایل) در `constants/` **نیستند** — فقط `Search.tsx` مصرفشان می‌کند، پس همان‌جا محلی تعریف شده‌اند. قاعده‌ی پروژه: هر چیزی که تنها یک فایل مصرف می‌کند، در همان فایل می‌ماند.

> ⚠️ `types/search.types.ts` عمداً **فقط تایپ** است. مقادیر زمان‌اجرا در `constants/` هستند تا `import type` واقعاً از باندل حذف شود.

### `utils/`
| فایل | نقش |
| --- | --- |
| `search-params.ts` | سریال‌سازی/پارس فیلتر ↔ URL (تنها منبع حقیقت پارامترها). |
| `search-summary.ts` | همه‌ی متن‌های نمایشی فارسی (برچسب بودجه، خلاصه، عنوان پیش‌نمایش، CTA). |
| `budget.ts` | منطق «بودجه با دو معنا»: `nightsBetween`، `budgetModeFor`، `budgetBoundsFor`، `rescaleBudgetBetween`. |
| `destination-value.ts` | کدگذاری مقصد به رشته‌ی واحد (`city:12` / `region:north`) برای `CityPanel` مشترک. |
| `city-groups.ts` | گروه‌بندی داده‌محور شهرها بر اساس `city.regionId`. |
| `scroll-to-preview.ts` | اسکرول نرم به بخش پیش‌نمایش + شناسه‌ی پایدار آن. |

### `store/` و `config/` و `types/`
| فایل | نقش |
| --- | --- |
| `store/search.store.ts` | استور Zustand لندینگ: `draft` / `applied` / `appliedToken`. بدون persistence. |
| `config/search-fields.tsx` | تعریف پنج فیلد نوار جستجو (تریگر + پنل هر فیلد). |
| `types/search.types.ts` | مدل دامنه: `SearchFilters`، `Destination`، `BudgetRange`، `SearchController`، `RegionId`. |

---

## ۵. جریان‌های کلیدی

**اعمال (apply):** `draft` عوض می‌شود، بعد `apply()` مقدار را به `applied` می‌برد و `appliedToken` را یکی زیاد می‌کند. لندینگ: پیش‌نمایش باز می‌شود. `/cabins`: URL عوض می‌شود.

**چرا `appliedToken` لازم است؟** کوئری فقط با تغییر محتوای فیلترها عوض می‌شود؛ پس زدن دوباره‌ی «جستجو» بدون تغییر فیلتر کلید کوئری را ثابت می‌گذاشت و دکمه بی‌اثر می‌شد.

**حذف جستجو:** دو نسخه دارد — `reset()` (draft + applied + URL) و `resetDraft()` (فقط draft، تا نتایجِ پشت شیت موبایل وسط کار عوض نشود).

**بودجه:** یک بازه‌ی تک‌مقداری با دو معنا. با تغییر تعداد شب، `rescaleBudgetBetween` مقدار را مقیاس می‌دهد تا قصد «هر شب» کاربر حفظ شود (۵–۱۰ م/شب × ۳ شب ← ۱۵–۳۰ م کل).

**آخرین جستجو:** یک اسنپ‌شات مستقل در localStorage (نه `persist()` روی استور). به‌شکل استور خارجی رفتار می‌کند و با `useSyncExternalStore` خوانده می‌شود.

---

## ۶. تله‌هایی که نباید دوباره‌کاری شوند

- ⭐ **تقویم با هر انتخاب بازه دو فراخوانی پشت‌سرهم می‌زند** (`checkIn` و بعد `checkOut`). اگر مقدار «همراه» را از closure بخوانید، مقدار کهنه ثبت می‌شود. راه‌حل: ادغام تابعی (`setDraft(prev => …)` یا `setFilters`).
- ⭐ **گارد `ref` برای «درخواست تکراری» در `useSearchPreview` نگذارید** — در StrictMode افکت دوبار اجرا می‌شود و بار دوم زودهنگام return می‌کند؛ وضعیت روی `loading` گیر می‌کند. وابستگی افکت (`key`) خودش کافی است.
- ⭐ **در انیمیشن پیش‌نمایش، `overwrite` گزینه‌ی tween است نه timeline** ⇒ قبل از ساخت تایم‌لاین `gsap.killTweensOf([...])`.
- ⭐ **`gsap.from()` استفاده نکنید، فقط `fromTo()`** — `from()` مقادیر شروع را فوراً inline می‌نویسد و با `kill()` شدن تایم‌لاین، محتوا برای همیشه نامرئی می‌ماند.
- ⚠️ **`data-preview-card` فقط روی گرید دسکتاپ است** — `useSearchPreviewAnimation` با همان انتخابگر کارت‌ها را پیدا می‌کند.
- ⚠️ **بودجه‌ی «کامل» = `null`**، نه بازه‌ی min..max. برای همین «بدون محدودیت» در خلاصه نمایش داده نمی‌شود.
