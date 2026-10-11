# برنامه‌ی کامیت (پیشنهادی — هنوز کامیت نشده)

**وضعیت درخت:** ۱۰۷ فایل ردیابی‌شده تغییر کرده + ۲۸ فایل جدید. `tsc --noEmit` ✅ · `eslint` ✅ (۰ خطا) · `/`, `/cabins`, `/cabins/3` ⇒ HTTP 200 ✅

**اصل چیدمان:** هر کامیت یک «دغدغه» است، نه یک پوشه. ترتیب مهم است (هر کامیت روی قبلی بنا می‌شود و درخت باید در هر گام سالم بماند).

---

## ۱) `fix(landing): repair preloader and drop fake countdown demo`

**چرا جدا؟** این‌ها باگ واقعی‌اند، نه ریفکتور؛ جدا بودنشان بازبینی و برگرداندن (revert) را ساده می‌کند.

```
M  src/features/landing/components/LandingPreloader.tsx
M  src/features/landing/components/Countdown.tsx
M  src/features/landing/components/LastMinute.tsx
+  src/features/landing/utils/countdown.ts
+  src/features/landing/utils/last-minute.ts
```

- گرادیان شکسته‌ی shimmer و کلاس نامعتبر `block-0.5` (نوار پیشرفت نامرئی بود)
- حذف پیش‌فرض دمویی `7200` ثانیه از `Countdown`
- استخراج `splitSeconds/secondsUntil` و `nearestExpiry` به `utils/`

---

## ۲) `refactor(landing): restructure sections, constants and animation layer` ⭐ landing

```
M  src/features/landing/index.tsx
M  src/features/landing/components/{Hero,Categories,Destinations,Testimonials}.tsx
M  src/features/landing/components/{ExperienceBanner,Stays,BudgetStays,OfferCard,SectionHeading}.tsx
M  src/features/landing/components/LandingAnimationProvider.tsx
M  src/features/landing/hooks/useLandingAnimation.ts
M  src/features/landing/actions/last-minute.actions.ts
+  src/features/landing/components/ImageOverlayCard.tsx
+  src/features/landing/hooks/useLandingReady.ts
+  src/features/landing/utils/gsap.ts
+  src/features/landing/utils/animations/{hero,sections,selectors}.ts
+  src/features/landing/constants/{index,images,experience-banner,testimonials}.ts
-  src/features/landing/components/Footer.tsx
-  src/features/landing/components/Experiences.tsx
-  src/features/landing/constants/{horizon-home,experiences}.ts
+  src/components/ui/Eyebrow.tsx
M  src/components/ui/Footer.tsx
M  src/components/ui/CopyrightText.tsx
+  src/constants/footer.ts
M  src/app/(auth)/layout.tsx
+  src/libs/utils/app-ready.ts
-  src/libs/utils/landing-ready.ts
M  src/components/ui/navbar/index.tsx
+  src/features/cabins/config/category-icons.ts
-  src/libs/utils/icon-map.ts
+  docs/landing-clean-code-audit.md
```

- قلاب انیمیشن از کلاس‌های گلوبال `hz-*` به `data-animate="…"` (تنها منبع: `utils/animations/selectors.ts`)
- شکستن هوک ۲۰۴ خطی به ارکستراتور + `utils/animations/*` + ثبت یک‌جای GSAP
- تفکیک `constants/` و استخراج `ImageOverlayCard` و `Eyebrow` مشترک
- فوتر: حذف بلوک جعلی خبرنامه، سال کپی‌رایت داینامیک، داده به `constants/footer.ts`
- حذف کد مرده (`GsapProvider`, `IconButton`, `SortBy`, `Select`, `hz-hero-title`, کلاس‌های تکراری)
- ⚠️ **حذف سکشن «تجربه‌های خاص»** (`Experiences.tsx` + `constants/experiences.ts`) تصمیم خودت بود، نه بخشی از ریفکتور — اگر می‌خواهی جدا کامیت شود بگو.

---

## ۳) `refactor(search): alias imports, concise comments and component splits` ⭐ landing-related

```
M  هر ۴۰ فایل زیر src/features/search/
M  src/app/api/search/cabins/route.ts
+  docs/search-feature.md
```

- ۱۰۶ import نسبی ⇒ alias `@/` (صفر import نسبی ماند)
- کامنت‌ها به `//*` کوتاه (خطوط کامنتی ۸۵۵ ⇒ ۲۶۳)
- شکستن `SearchPreview` به هدر/گرید/CTA و `Search` به `config/search-fields` + `SearchMobileTrigger`
- انتقال ثابت‌ها از `types/search.types.ts` به `constants/search-limits.ts` و `constants/search-defaults.ts` (فایل تایپ‌ها حالا بدون خروجی زمان‌اجرا است)

---

## ۴) `refactor(ui): split heavy components, drop dead ones, add Breadcrumb`

```
-  src/features/cabins/components/CabinCard.tsx
+  src/features/cabins/components/CabinCard/{index,LandingCard,DefaultCard,DashboardCard,primitives,classes,types}
-  src/components/ui/RangeGauge.tsx
+  src/components/ui/RangeGauge/{index,geometry,GaugeHandle,GaugeNumberInput,GaugeTicks,types}
M  src/components/ui/RangeDatePicker/index.tsx
+  src/components/ui/RangeDatePicker/{dates,day-props,RangeStageFields,types}
M  src/components/ui/Filter/FilterCard/index.tsx
+  src/components/ui/Filter/FilterCard/MobileFilterBranch.tsx
-  src/components/ui/Navigate.tsx
+  src/components/ui/Breadcrumb.tsx
M  src/components/ui/{Container,CardContainer,CardDashContainer,BadgeTitle,Pagination}.tsx
M  src/features/cabins/components/CabinDetail/{index,StickyTabs}.tsx
M  src/features/cabins/components/{CabinDetailSkeleton,CabinList}.tsx
M  src/app/(main)/cabins/[cabinId]/{page,loading}.tsx
M  src/app/(main)/cabins/page.tsx
M  src/app/(dashboard)/dashboard/cabins/page.tsx
M  src/app/(guest)/account/bookings/page.tsx
M  src/features/dashboard/cabins/lib/operations.ts
```

- `CabinCard` ۵۵۵ ⇒ ۷ فایل · `RangeGauge` ۵۱۲ ⇒ ۶ فایل · `RangeDatePicker` ۴۲۳ ⇒ ۵ فایل · `FilterCard` ۴۳۶ ⇒ ۳۰۳ خط
- رفع باگ `className` در `BadgeTitle` و `undefined` در کلاس `Container`/`CardDashContainer`
- `Navigate` ⇒ `Breadcrumb` (نام/تایپ/API) · حذف `Select`/`SortBy`/`GsapProvider`/`IconButton`
- `Container`: `variant="cabin-detail"` ⇒ `size="wide"`

---

## ۵) `refactor(libs): split pagination/url-params and harden price-range`

```
M  src/libs/utils/format.ts
M  src/libs/utils/pagination.ts
+  src/libs/utils/url-params.ts
M  src/libs/utils/price-range.ts
M  src/constants/cabins.ts
```

- `formatPriceShort`/`formatCompactPrice` روی یک هسته‌ی مشترک
- تفکیک «رندر بازه» از «پارامترهای URL» + حذف وابستگی `libs` به `constants/cabins`
- رفع باگ پارس: `"-5000"` دیگر به بازه‌ی غلط `[0, 5000]` تبدیل نمی‌شود

---

## ۶) `chore(types): normalize type-only imports across src`

```
M  src/components/layout/Layout.tsx
M  src/components/ui/Button.tsx
M  src/components/ui/Filter/FilterCard/{Panel,Trigger,types,value}.tsx
M  src/components/ui/Filter/panels/{CityPanel,DateRangePanel}.tsx
M  src/features/auth/schemas/types.ts
M  src/features/cabins/api/{getAmenities,getCabin,getCabins,getCategories,getCities,getLastMinuteCabins,getRegions}.ts
M  src/features/cabins/utils/mapCabin.ts
```

خروجی `--fix` قاعده‌ی `@typescript-eslint/consistent-type-imports` (`fixStyle: "inline-type-imports"`).

> ⚠️ چند فایل (مثل `Container.tsx`, `CardContainer.tsx`, `FilterCard/index.tsx`) هم تغییر دغدغه‌ای دارند و هم تغییر `type`؛ آن‌ها در کامیت‌های ۲–۴ می‌مانند و جدا کردنشان به `git add -p` نیاز دارد. توصیه: همین‌طور بگذار.

---

## ۷) `chore(assets): replace hero background avif with png` (اختیاری)

```
-  src/assets/images/hero-section-bg.avif
+  src/assets/images/hero-section-bg.png
```

تغییر خودت است و به ریفکتور ربطی ندارد؛ می‌توانی جدا یا در کامیت ۲ ادغامش کنی.

---

## اگر می‌خواهی کامیت‌ها کمتر شوند

| ادغام | نتیجه |
| --- | --- |
| ۱ + ۲ | یک کامیت «landing» کامل ⇒ ۶ کامیت |
| ۶ + ۷ | یک کامیت `chore:` ⇒ ۵ کامیت |
| ۴ + ۵ | یک کامیت `refactor(ui,libs)` ⇒ ۴ کامیت |

**ترتیب اعمال:** ۱ → ۲ → ۳ → ۴ → ۵ → ۶ → ۷ (هر گام مستقل سالم می‌ماند).

## چیزی که هنوز تأیید نشده
- `npm run build` اجرا **نشده** (dev روی پورت ۳۰۰۰ است و با `.next` تداخل می‌کند). اعتبارسنجی جایگزین: `tsc` + `eslint` + درخواست واقعی از dev server.
