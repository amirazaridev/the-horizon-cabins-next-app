# گزارش جامع بررسی Clean Code و ساختار — Landing Page

**دامنه:** `src/features/landing/**` + تمام وابستگی‌های مشترکی که این صفحه مصرف می‌کند (`src/components/ui/**`, `src/libs/utils/**`, و کامپوننت‌های `features/search` / `features/cabins` که در مسیر رندر لندینگ هستند).
**وضعیت:** فقط بررسی — **هیچ کدی تغییر نکرده است.**
**تاریخ:** ۱۴۰۵/۰۷/۱۹

### راهنمای اولویت
| نشان | معنا |
| --- | --- |
| 🔴 | بحرانی — باگ واقعی، کد مرده‌ی کامل، یا نقض مستقیم قاعده‌ی «نسخه‌ی دوم نساز» |
| 🟠 | مهم — مسئولیت مخلوط، تکرار جدی، API ناهمگون، شکستن لازم |
| 🟡 | جزئی — نام‌گذاری، سبک import، خوانایی، ناهمگونی سینتکس |

---

## ۱) خلاصه‌ی اجرایی

لندینگ از نظر معماری «سمت داده» تمیز است: `index.tsx` یک Server Component است که همه‌ی سکشن‌های داده‌محور را با `Promise.all` از API می‌گیرد و کامپوننت‌های نمایشی هیچ fetch ندارند. این بخش دقیقاً با قواعد پروژه هم‌خوان است.

اما «سمت ساختار» سه دسته مشکل جدی دارد:

1. **کد مرده و نسخه‌ی دوم** — `features/landing/components/Footer.tsx` یک کپی بیت‌به‌بیت از `components/ui/Footer.tsx` است و هیچ‌جا import نمی‌شود. `EXPERIENCE_CARDS`، `GsapProvider`، `IconButton` هم صفر مصرف‌کننده دارند.
2. **کامپوننت‌های سنگین با چند مسئولیت** — `useLandingAnimation.ts` (۲۰۴ خط / ۶ نگرانی)، `CabinCard.tsx` (۵۵۵ خط / ۳ واریانت)، `Search.tsx` (۴۸۶ خط)، `RangeGauge.tsx` (۵۱۲ خط)، `LandingPreloader.tsx` (سه نقش در یک کامپوننت).
3. **کوپلینگ رشته‌ای و نفوذ به DOM دیگران** — انیمیشن‌ها با کلاس‌های گلوبال `hz-*` هدف‌گیری می‌شوند (هیچ تایپی این قرارداد را تضمین نمی‌کند) و `OfferCard` با سلکتور `[&>a]` به ساختار داخلی `CabinCard` نفوذ می‌کند.

در ضمن **دو باگ واقعی** در `LandingPreloader.tsx` پیدا شد (گرادیان شکسته و کلاس نامعتبر `block-0.5`) و **یک باگ منطقی** در `libs/utils/price-range.ts` (پذیرش بازه‌ی غلط از ورودی منفی).

---

## ۲) فیچر لندینگ — `src/features/landing/`

### 2.1 کد مرده / نسخه‌ی دوم / تکرار داده

#### 🔴 L1 — `components/Footer.tsx` : نسخه‌ی دوم کامل و بی‌استفاده
- فایل ۷۶ خطی که **کاراکتربه‌کاراکتر** با `src/components/ui/Footer.tsx` یکی است.
- `grep` برای مصرف‌کننده: **صفر**. لندینگ هم فوتر را از خودش رندر نمی‌کند؛ فوتر واقعی از `components/layout/Layout.tsx` → `../ui/Footer` می‌آید.
- نقض مستقیم قاعده‌ی «reuse/refactor نه نسخه‌ی دوم». **حذف شود.**

#### 🔴 L3 — `components/ExperienceBanner.tsx` : تکرار داده + ثابت مرده
- آرایه‌ی `items` داخل فایل، همان محتوای `EXPERIENCE_CARDS` در `constants/index.ts` است (هر سه عنوان/توضیح یکی).
- `EXPERIENCE_CARDS` در کل پروژه **صفر مصرف‌کننده** دارد ⇒ هم ثابت مرده، هم داده‌ی دوگانه.
- نتیجه: برای عوض‌کردن یک متن، دو جا باید ویرایش شود (یا یکی بی‌صدا کهنه می‌ماند).

#### 🟠 L15 — `constants/index.ts` : مسئولیت مخلوط + داده‌ی ناهمگون
- یک فایل هم‌زمان تصاویر (`HORIZON_IMAGES`) و محتوای سه سکشن مختلف (`EXPERIENCE_CARDS`, `POPULAR_EXPERIENCES`, `TESTIMONIALS_HOME`) را نگه می‌دارد.
- `POPULAR_EXPERIENCES` تصاویری می‌دهد که با `TESTIMONIALS_HOME` روی همان سه asset تکراری‌اند (`landscapeImage` دو بار در یک آرایه).
- هیچ‌کدام `as const` / `satisfies` ندارند ⇒ خطای فیلد بی‌صدا رد می‌شود.
- `EXPERIENCE_CARDS` مرده است (نگاه کنید L3).

#### 🟡 L16 — `actions/last-minute.actions.ts` : پوشه‌ی `actions/` برای یک اکشن ۳ خطی
- ساختار پوشه‌ی اضافی برای یک `updateTag`. قابل ادغام یا قابل ماندن (کم‌اهمیت).

---

### 2.2 کامپوننت‌های سنگین که باید شکسته شوند

#### 🟠 L6 — `hooks/useLandingAnimation.ts` : ۲۰۴ خط، ۶ نگرانی، کوپلینگ رشته‌ای
یک هوک که هم‌زمان این‌ها را می‌چیند:
1. ورود هیرو (تایم‌لاین eyebrow/word/copy/search/indicator)
2. پارالاکس + kenburns هیرو
3. محوشدن ایندیکیتور اسکرول
4. تیتر بخش دسته‌بندی‌ها
5. reveal عمومی (`.hz-reveal`)
6. گرید کارت‌ها (`.hz-category-card`, `.hz-stay-card`)

مشکلات:
- **کوپلینگ رشته‌ای شکننده:** کامپوننت‌ها کلاس گلوبال می‌گذارند و هوک با رشته انتخاب می‌کند. اگر یک کلاس در `Categories.tsx` تغییر نام دهد، انیمیشن **بی‌صدا** می‌شکند. هیچ تایپی این قرارداد را تضمین نمی‌کند.
- `gsap.registerPlugin(ScrollTrigger)` و `ScrollTrigger.config(...)` در **سطح ماژول** (خطوط ۷–۸) ⇒ اثر جانبی هنگام import؛ این مسئولیت باید یک‌جا و در یک نقطه باشد (نه اینجا و نه دوباره در `GsapProvider.tsx`).
- ناهمگونی انتخابگرها: `HERO_SELECTORS` در یک آرایه، ولی بقیه (`".hz-hero-bg"`, `".hz-category-heading"`, …) رشته‌ی پراکنده.
- پیشنهاد: تفکیک به `useHeroIntro`, `useHeroParallax`, `useRevealBatch` + یک `lib/gsap/registry.ts` + جایگزینی کلاس‌ها با `data-animate="hero-word"` و یک config مرکزی.

#### 🟠 L7 — `components/LandingAnimationProvider.tsx` : چهار مسئولیت در یک کامپوننت
هم‌زمان: انتظار `document.fonts.ready`، مسابقه با تایم‌اوت، دو `requestAnimationFrame`، خواندن `data-client-nav`، سوارکردن `useLandingAnimation`، و رندر `LandingPreloader`.
- `FONTS_TIMEOUT_MS = 500` عدد جادویی در بدنه‌ی فایل (قاعده‌ی پروژه: اعداد در `config/`).
- منطق «آمادگی» قابل استخراج به `useLandingReady()`.
- `LandingPreloader` هم اینجا رندر می‌شود و هم جداگانه در `app/(main)/loading.tsx` ⇒ دو مسیر موازی برای یک چیز.

#### 🟠 L4 — `components/LandingPreloader.tsx` : سه نقش + دو باگ واقعی
نقش‌ها: پوسته‌ی صفحه‌ی انتظار + اسکلتون هیرو + نوار پیشرفت ⇒ مسئولیت مخلوط.

**⚠️ باگ ۱ — گرادیان shimmer شکسته (خط ۱۳):**
```
after:bg-[linear-gradient(90deg,transparent_0%,rgb(255_255_255/0.08_45% rgb(255_255_255/0.16)_50%,...)]
```
پرانتز `rgb(...)` بسته نشده و بین دو رنگ کاما نیست (`0.08_45%` به‌جای `0.08)_45%,`). گرادیان نامعتبر ⇒ افکت shimmer عملاً کار نمی‌کند.

**⚠️ باگ ۲ — کلاس نامعتبر `block-0.5` (خط ۵۶):** یوتیلیتی Tailwind نیست (قصد `h-0.5` بوده). نوار پیشرفت ارتفاع نمی‌گیرد ⇒ **نامرئی** است، هرچند `after:animate-preloader-slide` بی‌اثر می‌ماند.

همچنین: کلاس‌های طولانی داخل رشته‌ی `shimmerClass` (خوانایی صفر) و دو پراپ `done`/`autoHide` که با `data-*` به CSS می‌رسند (قابل ساده‌سازی).

#### 🟠 L5 — `components/Hero.tsx` : کد مرده + کلاس مرده + نبود شکست
- `import { useTheme }` و `const { theme } = useTheme()` هر دو **کامنت‌شده** (خطوط ۸ و ۱۱) ⇒ کد مرده.
- کلاس `hz-hero-title` (خط ۶۱) در هیچ انتخابگر انیمیشنی نیست ⇒ انتخابگر مرده. (`hz-category-icon` و `hz-category-grid` در `Categories.tsx` هم همین‌طور.)
- هفت `<span>` تودرتوی `inline-block overflow-hidden` برای افکت split-word ⇒ کاندید `<SplitWords text="..." />`.
- سه لایه‌ی overlay با `rgba(7,17,30,...)` هاردکد داخل `bg-[linear-gradient(...)]` ⇒ رنگ توکن نیست.

---

### 2.3 مسئولیت‌های مخلوط و وابستگی‌های نامناسب

#### 🟠 L12 — `components/OfferCard.tsx` : نفوذ به DOM کامپوننت دیگر
- `<div className="relative flex-1 [&>a]:h-full">` — این کلاس، تگ `<a>` **داخلی** `CabinCard` را هدف می‌گیرد. یعنی `OfferCard` به ساختار DOM یک کامپوننت دیگر وابسته است.
- شاهد دوطرفه: خود `CabinCard` کامنت کرده «بدون قلب، ساختار DOM عیناً مثل قبل می‌ماند» تا `[&>a]` نشکند ⇒ **کوپلینگ دوطرفه**.
- راه درست: «نشان» و «قیمت» پراپِ `CabinCard` شوند، نه لایه‌ی بیرونی با نفوذ CSS.
- `badge: string` اجباری است و دو مصرف‌کننده دو رشته‌ی مختلف می‌فرستند ⇒ بهتر `variant: "special" | "budget"` با map رنگ.

#### 🟠 L14 — `components/LastMinute.tsx` : منطق کسب‌وکار در UI
- `cabins.map(c => c.expiresAt).sort((a,b)=>a.localeCompare(b))[0]` ⇒ منطق «نزدیک‌ترین انقضا» داخل کامپوننت؛ باید در `lib/` باشد.
- `localeCompare` روی رشته‌ی ISO کار می‌کند ولی به فرمت کامل ISO وابسته است (شکننده؛ `Date.parse` امن‌تر).
- `revalidateLastMinute` (Server Action) مستقیم به `Countdown` تزریق می‌شود ⇒ لایه‌بندی فیچر→کامپوننت بدون لفافه‌ی سرویس.

#### 🟠 L9 — `components/Countdown.tsx` : رفتار دمویی در کد پروداکشن
- `demoDurationSeconds = 7200` پیش‌فرض است ⇒ اگر `expiresAt` نرسد، یک تایمر **ساختگی ۲ ساعته** نمایش داده می‌شود. این پیش‌فرض دمو در کامپوننت پروداکشن است و هیچ مصرف‌کننده‌ای هم صریح ستش نمی‌کند.
- محاسبه‌ی ساعت/دقیقه/ثانیه + رندر + `role="timer"` همه در یک کامپوننت ⇒ استخراج `splitSeconds()` به `lib/`.
- `onExpire` در آرایه‌ی وابستگی افکت ⇒ اگر مصرف‌کننده تابع inline بدهد، اینتروال هر رندر ریست می‌شود (الان سروراکشن پایدار است، ولی قرارداد شکننده).

#### 🟡 L8 — `index.tsx` : ناهمگونی import + ترتیب سکشن‌ها hardcode
- importها مخلوط نسبی/مطلق: `"./components/Hero"` در برابر `"@/features/landing/components/LandingAnimationProvider"`.
- ترتیب ۱۰ سکشن inline در JSX ⇒ افزودن/جابه‌جایی سکشن باید دستی در همین فایل باشد (کاندید `constants/landing-sections.ts`).
- دو درخواست با `.then(res => res.cabins)` و دو درخواست مستقیم ⇒ الگوی ناهمگون در `Promise.all`.
- نکته‌ی ساختاری: این فیچر `types/`, `lib/`, `config/`, `services/` ندارد (فقط `hooks/`, `components/`, `constants/`, `actions/`) ⇒ انحراف از الگوی مستندِ ماژول فیچر. و نام فایل `index.tsx` به‌عنوان **کامپوننت صفحه** (نه barrel) غیرمعمول است.

---

### 2.4 تکرار ساختاری و نام‌گذاری

#### 🟠 L11 — `SectionHeading` و الگوی «eyebrow» : تکرار در چند فایل
- سه `SectionHeading` مستقل در پروژه: `features/landing/.../SectionHeading.tsx`، `features/cabins/components/CabinDetail/SectionHeading.tsx`، و دو تابع محلی در `features/guest/**`. هیچ‌کدام مشترک نیست ⇒ تکرار الگو + ابهام نام.
- الگوی «خط افقی + متن ریز» عیناً در `Categories.tsx` (۱۷–۲۰)، `SearchPreview.tsx` (۹۰–۹۳) و `LastMinute.tsx` (۳۲–۳۵) تکرار شده ⇒ یک `Eyebrow` مشترک لازم است.
- تایپ `title: React.ReactNode` بدون import (بقیه‌ی پروژه `import type { ReactNode }`).
- `hrefLabel` پیش‌فرض دارد ولی اگر `href` ندهند بی‌معنا است (جفت‌شدن ضمنی).

#### 🟠 L13 — `Destinations` / `Experiences` / `Testimonials` : یک الگوی کارت سه بار
- هر سه: `Image fill` + `bg-linear-to-t from-overlay` + عنوان/زیرعنوان روی تصویر + `group-hover:scale` ⇒ کاندید `ImageOverlayCard` مشترک.
- **ناهمگونی سینتکس Tailwind v4:** `Experiences.tsx` از `bg-gradient-to-t` (نام قدیمی) استفاده می‌کند ولی `Destinations.tsx` از `bg-linear-to-t` (نام جدید) ⇒ در یک کدبیس نباید هر دو باشد.
- `Testimonials`: `rating: "۵.۰"` **رشته‌ی فارسی** است ⇒ غیرقابل مرتب‌سازی/محاسبه؛ باید عدد باشد و در لحظه‌ی نمایش فارسی شود.
- `Destinations`/`Experiences` انیمیشن را با کلاس رشته‌ای `hz-reveal` می‌گیرند (همان مسئله‌ی L6).

#### 🟡 L10 — `components/Stays.tsx` : ناهمگونی رفتار + import غیر-type
- سه سکشن دیگر گارد `if (!x.length) return null` دارند؛ `Stays` **ندارد** ⇒ با داده‌ی خالی یک سکشن تیترِ بی‌محتوا نشان می‌دهد.
- `import { Cabin } from "@/features/cabins/types/cabin.types"` بدون `type` (بقیه‌ی فایل‌ها `import type`).
- تنها سکشن بدون `aria-labelledby` است.

---

## ۳) `src/components/ui/` — مشکلات ساختاری

#### 🔴 U1 — `Footer.tsx` : مسئولیت مخلوط + داده‌ی hard-coded + سال نادرست
- ۴ ستون محتوا hardcode داخل JSX: «دسترسی سریع»، «پشتیبانی»، سوشال‌ها، «فرم خبرنامه».
- **فرم خبرنامه واقعی نیست** — فقط یک `<div>` با متن «ایمیل خود را وارد کنید…» است (بدون input/دکمه/TODO) ⇒ کاربر فکر می‌کند فرم دارد.
- **سال کپیرایت `© ۲۰۰۵` هاردکد و نادرست است**؛ در حالی که `CopyrightText.tsx` همان متن را با `new Date().getFullYear()` می‌سازد ⇒ **دو منبع حقیقت برای یک متن**.
- ۴ سوشال با **یک SVG تکراری** (آیکن فیسبوک) رندر می‌شوند ⇒ محتوای گمراه‌کننده.
- «قوانین و شرایط» و «سوالات متداول» هر دو به `/cabins` می‌روند (placeholder بدون `TODO`).
- پیشنهاد: تفکیک به پوسته‌ی `Footer` + `config/footer.ts` (داده) + ادغام با `CopyrightText`.

#### 🔴 U3 — `GsapProvider.tsx` : کامپوننت مرده
- صفر مصرف‌کننده در کل پروژه. تنها کارش `ScrollTrigger.defaults` است که در `useLandingAnimation` هم به شکل دیگری انجام می‌شود ⇒ کد مرده + تکرار مسئولیت ثبت/پیکربندی پلاگین.

#### 🔴 U4 — `IconButton.tsx` : کامپوننت مرده + تکرار کلاس با `ThemeToggle`
- صفر مصرف‌کننده.
- کلاس دکمه‌اش (`flex size-10 items-center justify-center rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10`) **کلمه‌به‌کلمه** با `ThemeToggle.tsx` یکی است ⇒ اگر هر دو زنده شوند، تکرار است.

#### 🟠 U7 — `CardContainer.tsx` : مسئولیت مخلوط + تایپو + API جبرانی
- `varients` (غلط املایی) در کل فایل — نام‌گذاری ضعیف و گمراه‌کننده.
- یک کامپوننت سه مسئولیت: قاب گرادیانی + لایه‌ی داخلی + لکه‌ی تزئینی blur (`-top-24 -left-24 ... blur-[100px]`).
- `contentPadding` با یک کامنت بلند توضیح می‌دهد که «چون پدینگ داخل واریانت هاردکد است، با Tailwind قابل بازنویسی نیست» ⇒ **مشکل طراحی API پوشانده شده، نه حل**. راه درست: پدینگ از بیرون بیاید.
- الگوی ناهمگون: اینجا `className ? className : ""` ولی در `CardDashContainer` فقط `${className}`.

#### 🟠 U8 — `CardDashContainer.tsx` : تکرار با `CardContainer` + `undefined` در کلاس
- همان نقش «کارت پایه» را دارد ولی مستقل کپی شده (border/bg/rounded/padding/hover دوباره نوشته شده‌اند).
- `` className={`... ${className}`} `` بدون fallback ⇒ اگر `className` ندهند، `undefined` وارد رشته‌ی کلاس می‌شود.
- `noTransition?: boolean` برای سوییچ بین دو حالت کلاسی ⇒ پراپ معنادارتر (`variant`) بهتر است.

#### 🟠 U10 — `SortBy.tsx` : منطق URL در کامپوننت + دوباره‌کاری utility موجود
- خودش `useRouter/usePathname/useSearchParams` می‌گیرد و کوئری می‌سازد ⇒ **نقض قاعده‌ی پروژه** («کامپوننت نمایشی بدون query-parsing»).
- `if (params.get("page")) params.set("page", "1")` همان کاری است که `buildPageUrl` در `libs/utils/pagination.ts` انجام می‌دهد ⇒ **دو الگوی موازی برای یک کار**.
- `sortBy` هاردکد است ولی `buildPageUrl` نام پارامتر را می‌گیرد ⇒ ناهمگونی.
- `div` تک‌ردیفی دور `Select` بدون دلیل.

#### 🟠 U6 — `Container.tsx` : اینترپولیشن ناایمن + نفوذ واریانت صفحه‌ای
- `` `${containerClass[variant]} ${className}` `` ⇒ اگر `className` ندهند، رشته‌ی `undefined` در کلاس می‌افتد.
- واریانت `cabin-detail` یعنی **یک صفحه‌ی خاص** به یک کامپوننت عمومی نفوذ کرده؛ کامنت ۱۲ خطی هم توضیح می‌دهد چرا `86rem`. جای این جزئیات، `size` یا `className` است.
- `ComponentProps<"div">` گرفته ولی `className` را از props جدا می‌کند ⇒ ناهمگونی با الگوی بقیه.

#### 🟠 U11 — `BadgeTitle.tsx` : باگ واقعی — `className` در یک واریانت نادیده گرفته می‌شود
- `ref` به‌صورت دستی در props تعریف شده (React 19 `ref` را در props دارد) و `ComponentProps<"div">` دور زده شده.
- در `variant="point-animation"` خروجی `<div ref={ref} className="mb-8 inline-flex">` است و **`className` مصرف نمی‌شود** ⇒ پراپ بی‌اثر.
- دو واریانت با استایل تکراری (rounded-full + border + backdrop-blur) در دو بازگشت جدا.

#### 🟡 U5 — `Navigate.tsx` : نام‌گذاری ضعیف + تایپ ضعیف + API نامناسب
- نام «Navigate» برای یک **بردکرامب** گمراه‌کننده است ⇒ باید `Breadcrumb` باشد.
- `paths: { id: number; ... }[]` — `id` فقط برای `key` است و `number` گرفتن آن بی‌معنا.
- `href` نبود ⇒ `<Link href="">` (لینک به صفحه‌ی جاری) که رفتار غلط است.
- `isSpan` نام boolean مبهم (بهتر `current`).
- `mb-6` داخل کامپوننت هاردکد ⇒ قابل بازنویسی نیست.

#### 🟡 U9 — `Select.tsx` : کد مرده + بدون برچسب
- بلوک `RegisterProps` کامنت‌شده و `{...register}` کامنت‌شده (خطوط ۱۱–۱۶ و ۲۹) ⇒ کد مرده.
- بدون `label`/`aria-label`؛ تایپ props هیچ پراپ برچسبی ندارد.
- `className="py-2"` روی `<option>` تقریباً بی‌اثر است (مرورگر آن را نادیده می‌گیرد).

#### 🟡 U12 — `BackDropBlur.tsx` : نام گمراه‌کننده + رنگ هاردکد
- نامش `backdrop-filter` را تداعی می‌کند ولی کارش **لکه‌های تزئینی** است ⇒ نام غلط. نام‌های `double` / `double-top-down` هم مبهم‌اند.
- رنگ خام `bg-blue-400/20` در کنار توکن‌های `primary-*` ⇒ نقض سیستم طراحی.
- مقادیر جادویی `size-200`, `blur-[150px]`, `blur-[200px]`.
- جای این کامپوننت، یک `config/decorations.ts` است، نه یک کامپوننت با `if`.

#### 🟡 U13 — `ThemeToggle.tsx` : import نسبی + مسئولیت مختلط + کلاس تکراری
- `import { useTheme } from "../../contexts/ThemeContext"` نسبی است در حالی که پروژه `@/contexts/...` می‌نویسد (و `Hero.tsx` هم همان الیاس را کامنت کرده).
- `toggleTheme({ x: e.clientX, y: e.clientY })` ⇒ کامپوننت به **امضای رویداد کلیک و مکان ماوس** وابسته است ⇒ باید `onClick` از بیرون بیاید یا `ThemeContext` فقط `toggle()` بدهد.
- کلاس دکمه با `IconButton` یکی است (نگاه کنید U4).

#### 🟡 U14 — `Carousel.tsx` : key با index + مسئولیت مختلط
- `slides.map((slide, index) => <div key={index}>)` ⇒ **استفاده از index به‌عنوان key** (ضدالگوی React) و از دست رفتن هویت اسلایدها.
- `slideClassName` پیش‌فرض سه‌اندازه‌ای (`82%/46%/31%`) داخل کامپوننت عمومی هاردکد است ⇒ باید از بیرون بیاید (سه مصرف‌کننده هرکدام override می‌کنند).
- دکمه‌ها `hidden ... sm:flex` ⇒ در موبایل ناوبری فقط با swipe و بدون هیچ نشانگر.
- `useCallback`های `scrollPrev/Next/To` بیدلیل‌اند (قابل inline شدن).

#### 🟠 U15 — `Filter/**`, `RangeDatePicker`, `RangeGauge` : فایل‌های بزرگ و تکرار نسخه
- `Filter/FilterCard/index.tsx` (۴۳۶) + `FilterCard/Panel.tsx` (۲۶۳) + `panels/CityPanel.tsx` (۳۶۱) ⇒ مسئولیت‌های چیدمان + پنل + شیت موبایل + اعتبارسنجی در هم تنیده.
- **`CityPanel` دو نسخه دارد:** `components/ui/Filter/panels/CityPanel.tsx` (۳۶۱) و `features/cabins/components/filters/panels/CityPanel.tsx` (۱۲۰) ⇒ کاندید بررسی تکرار/ادغام.
- `RangeGauge.tsx` (۵۱۲ خط) و `RangeDatePicker/index.tsx` (۴۲۳ خط) تک‌فایلی و سنگین ⇒ کاندید شکست.
- `Filter/focus-ring.ts`, `Filter/FilterCard/value.ts`, `Filter/panels/range-picker-breakpoint.ts` فایل‌های بسیار کوچک‌اند (۸ تا ۱۷ خط) ⇒ پراکندگی افراطی.

---

## ۴) `src/libs/utils/` — مشکلات

#### 🟠 X1 — `format.ts` : تکرار منطق قالب‌بندی
- `formatPriceShort` و `formatCompactPrice` حدود ۹۵٪ یکی‌اند؛ فقط پسوند فرق دارد («میلیون»/«هزار» در برابر «م»/«ه»). باید یک تابع با `style: "long" | "compact"` باشد ⇒ نقض DRY.
- `formatCurrency` نامش نمی‌گوید واحد/لوکیل قفل‌شده روی `fa-IR` است (بهتر `formatFaNumber` / `formatToman`).

#### 🔴 X4 — `price-range.ts` : باگ منطقی در پارس + نبود نرمال‌سازی
- `raw.split("-")` روی ورودی منفی، بازه‌ی **غلط** می‌سازد:
  `"-5000"` ⇒ `lo = Number("") = 0`، `hi = 5000` ⇒ شرط‌های اعتبارسنجی ردش **نمی‌کنند** ⇒ بازه‌ی نادرست `[0, 5000]` **پذیرفته می‌شود**.
- رشته‌ی چندخط‌تیره (`"1000-2000-3000"`) ⇒ `[1000, NaN]` ⇒ بی‌صدا `undefined` (پذیرفتنی، ولی بدون هیچ لاگ/خطا).
- `formatPriceRange` هیچ نرمال‌سازی ندارد (`min > max` را رد نمی‌کند).

#### 🟠 X3 — `landing-ready.ts` : منطق فیچر در لایه‌ی عمومی + pub/sub دستی
- یک فلگ ماژول‌سطحی (`let ready`) + `Set` لیسنر ⇒ با HMR و تست شکننده، و اگر اشتباهی روی سرور import شود، state بین درخواست‌ها **مشترک** می‌شود.
- قراردادش همان `useSyncExternalStore` است ولی دستی ساخته شده ⇒ اگر مصرف‌کننده با `useState+useEffect` وصل شود، `subscribe` عملاً بی‌فایده است.
- **`landing-ready` در `libs/utils` یعنی منطق مخصوص یک فیچر در لایه‌ی عمومی** ⇒ نقض مرز؛ جای درستش `features/landing/lib/` است.

#### 🟠 X6 — `pagination.ts` : کد مرده + گره‌خوردگی به دامنه + مسئولیت مخلوط
- بلوک کامنت‌شده‌ی `parsePaginationParams` (خطوط ۳۲–۳۴) ⇒ کد مرده.
- `parseLimitParam` به `@/constants/cabins` وابسته است ⇒ **util عمومی به دامنه‌ی کابین گره خورده** (نقض عمومی‌بودن `libs`).
- سه نگرانی در یک فایل: `parsePageParam`/`buildPageUrl` (URL) در کنار `getPaginationRange` (رندر بازه) ⇒ تفکیک به `pagination.ts` + `url-params.ts`.
- `parseLimitParam` تایپ برگشتی صریح ندارد (بقیه دارند).

#### 🟠 X2 — `icon-map.ts` : وابستگی UI در لایه‌ی عمومی + fallback پنهان
- `getIconByName` برای نام ناشناس **بی‌صدا** `Home` برمی‌گرداند ⇒ خطای داده پنهان می‌شود.
- نقشه به `lucide-react` گره خورده ⇒ `libs` به یک کتابخانه‌ی UI وابسته شده (نقض استقلال لایه). جای درستش `features/cabins/config/` یا `components/ui/`.

#### 🟡 X5 — `scroll.ts` : نبود گارد `document` + ناهمگونی
- `smoothScrollToId` مستقیماً `document.getElementById` می‌زند **بدون گارد**، در حالی که `smoothScrollIntoView` گارد `typeof window` دارد ⇒ ناهمگونی + ریسک در SSR/تست.
- خواندن `matchMedia("(prefers-reduced-motion: reduce)")` در هر فراخوانی، بدون کش.

#### 🟡 X7 — `jalali.ts` : کامنت گمراه‌کننده + نبود گارد مقدار نامعتبر
- کامنت می‌گوید «مشترک بین بخش‌های داشبورد» ولی این توابع در لندینگ/کابین هم مصرف می‌شوند.
- `new Date(value)` بدون اعتبارسنجی ⇒ `Invalid Date` ⇒ `format` **استثنا** می‌دهد. نیاز به `try/catch` یا بررسی `isValid`.
- `HH:mm` با لوکیل `faIR` ممکن است اعداد لاتین بدهد ⇒ ناسازگاری با بقیه‌ی UI فارسی (نیاز به تست).

#### 🟡 X8 — `tehran-date.ts` : نام برند در لایه‌ی عمومی
- `HORIZON_TIMEZONE` و منطق «امروز تهران» خاص دامنه‌ی رزرو است ⇒ بهتر در `features/cabins/lib/` یا `libs/date/`.
- ترفند `Intl.DateTimeFormat("en-CA", ...)` به لوکیل runtime وابسته است (کامنت توضیح داده، ولی همچنان شکننده).

---

## ۵) وابستگی‌های لندینگ در فیچرهای دیگر

#### 🟠 D1 — `features/cabins/components/CabinCard.tsx` : ۵۵۵ خط، سه واریانت، تکرار زیاد
- `LandingCard` / `DefaultCard` / `DashboardCard` هر سه در یک فایل با چیدمان کاملاً متفاوت ⇒ **سنگین‌ترین کامپوننت مسیر لندینگ**. کاندید شکست به `cabin-card/{DefaultCard,LandingCard,DashboardCard}.tsx` + `index.tsx` انتخاب‌کننده.
- **تکرار صریح:**
  - بلوک «تصویر + fallback «تصویر موجود نیست»» در هر سه واریانت کپی شده.
  - ردیف «شهر/ظرفیت/اتاق/سرویس/متراژ» با آیکن‌های یکسان دو بار (`DefaultCard` و `LandingCard`).
  - بلوک «قیمت + تومان» سه بار.
  - کامنت `//* قیمت مؤثر از pricing استخراج می‌شود…` **چهار بار** (خطوط ۱۱۹، ۲۱۶، ۳۶۲، ۴۸۱).
  - `resolveCabinPrice(cabin)` در سه کامپوننت + `PriceBadge` ⇒ **چهار بار** محاسبه‌ی تکراری.
- `variant` به‌عنوان سوییچ سه‌شاخه ⇒ افزودن واریانت چهارم فایل را بزرگ‌تر می‌کند.
- **ناهمگونی رفتار:** `DashboardCard` مقدار `src={image || ""}` می‌دهد (اگر تصویر نباشد `src=""` به `next/image` ⇒ هشدار/شکست) در حالی که دو واریانت دیگر fallback دارند.
- `showFavorite` فقط روی `default` کار می‌کند و همین باعث کامنت توضیحی شده ⇒ نشانه‌ی API ناهمگون.

#### 🟠 D2 — `features/search/components/Search.tsx` : ۴۸۶ خط «گادکامپوننت»
- یک کامپوننت شامل: تعریف پنج فیلد (`items`)، منطق تاریخ/تهران، خلاصه‌سازی موبایل، تریگر موبایل، اکشن‌ها، و دو شاخه‌ی `variant`.
- `handleValueChange` یک `switch` روی `id` رشته با **کست‌های ناایمن** (`value as Destination`, `value as Date`, `value as BudgetRange`) بدون اعتبارسنجی ⇒ کاندید `Record<id, (v: unknown) => void>` تایپ‌شده.
- `wrapperClass` یک رشته‌ی ~۲۵۰ کاراکتری با ~۳۰ کلاس ⇒ خوانایی صفر؛ باید به `config`/`cva` برود.
- `datePanel()` در بدنه‌ی رندر تعریف شده و برای هر دو فیلد تاریخ بازساخته می‌شود.
- `mobileSummary` / `mobileDateSummary` / `mobileApplyLabel` / `mobileTrigger()` همه inline ⇒ حجم رندر بالا.

#### 🟠 D3 — `features/search/components/preview/SearchPreview.tsx` : تکرار JSX + کلید انیمیشن شکننده
- بلوک `<CabinCard variant="landing" showPrice className="h-full" />` **دو بار** (گرید دسکتاپ + کاروسل موبایل) با همان props ⇒ با یک آرایه‌ی مشترک قابل رفع.
- `revision = \`${searchFiltersToQueryString(applied)}::${status}::${cabins.length}\`` ⇒ ساخت کلید انیمیشن با `toString` روی فیلترها؛ کوپلینگ نرم و شکننده.
- چهار مسئولیت: داده (هوک) + انیمیشن + چهار حالت رندر + هدر/CTA ⇒ کاندید استخراج `PreviewHeader` / `PreviewGrid` / `PreviewFooter`.
- importها در همان فایل مخلوط نسبی (`../../hooks/...`) و مطلق (`@/features/cabins/...`).

#### 🟡 D4 — `features/search/index.ts` : barrel غول
- ۹۰ خط export شامل توابع کاملاً داخلی (`serializeSearchFilters`, `rescaleBudgetBetween`, `regionSlugFromId`, …) ⇒ هر تغییر داخلی به API عمومی تبدیل می‌شود. باید فقط صادراتِ مصرف‌شده بین‌فیچری بماند.

---

## ۶) جدول اولویت‌بندی

| اولویت | شناسه | فایل / کامپوننت | خلاصه‌ی مشکل | نوع |
| --- | --- | --- | --- | --- |
| 🔴 | L1 | `landing/components/Footer.tsx` | نسخه‌ی دوم کامل و بی‌استفاده | کد مرده |
| 🔴 | L4 | `landing/components/LandingPreloader.tsx` | گرادیان شکسته + `block-0.5` نامعتبر + سه نقش | باگ + مسئولیت |
| 🔴 | U1 | `components/ui/Footer.tsx` | محتوای hardcoded، فرم جعلی، سال ۲۰۰۵ | مسئولیت + باگ محتوایی |
| 🔴 | U3 | `components/ui/GsapProvider.tsx` | کامپوننت مرده | کد مرده |
| 🔴 | U4 | `components/ui/IconButton.tsx` | کامپوننت مرده + تکرار با ThemeToggle | کد مرده |
| 🔴 | X4 | `libs/utils/price-range.ts` | پذیرش بازه‌ی غلط از ورودی منفی | باگ منطقی |
| 🔴 | L3 | `landing/ExperienceBanner.tsx` | داده‌ی تکراری با `EXPERIENCE_CARDS` (مرده) | تکرار داده |
| 🟠 | L6 | `landing/hooks/useLandingAnimation.ts` | ۲۰۴ خط، ۶ نگرانی، کوپلینگ رشته‌ای | شکستن |
| 🟠 | L7 | `landing/LandingAnimationProvider.tsx` | چهار مسئولیت + عدد جادویی | مسئولیت |
| 🟠 | L5 | `landing/components/Hero.tsx` | کد/کلاس مرده + split-text دستی | کد مرده + شکستن |
| 🟠 | L12 | `landing/components/OfferCard.tsx` | نفوذ `[&>a]` به DOM کامپوننت دیگر | وابستگی |
| 🟠 | L14 | `landing/components/LastMinute.tsx` | منطق انتخاب انقضا در UI | مسئولیت |
| 🟠 | L9 | `landing/components/Countdown.tsx` | پیش‌فرض دمویی در پروداکشن | مسئولیت |
| 🟠 | L11 | `landing/SectionHeading.tsx` | سه نسخه در پروژه + تکرار eyebrow | تکرار + نام‌گذاری |
| 🟠 | L13 | `Destinations`/`Experiences`/`Testimonials` | کارت تصویری سه بار + `bg-gradient-to-t` قدیمی | تکرار |
| 🟠 | L15 | `landing/constants/index.ts` | مسئولیت مخلوط + داده‌ی ناهمگون | ساختار |
| 🟠 | D1 | `cabins/components/CabinCard.tsx` | ۵۵۵ خط، ۳ واریانت، ۴× تکرار قیمت | شکستن |
| 🟠 | D2 | `search/components/Search.tsx` | ۴۸۶ خط، کست ناایمن، کلاس غول | شکستن |
| 🟠 | D3 | `search/preview/SearchPreview.tsx` | JSX تکراری + کلید شکننده | تکرار |
| 🟠 | U7 | `components/ui/CardContainer.tsx` | `varients` تایپو + API جبرانی | نام‌گذاری + مسئولیت |
| 🟠 | U8 | `components/ui/CardDashContainer.tsx` | تکرار با CardContainer + `undefined` کلاس | تکرار |
| 🟠 | U10 | `components/ui/SortBy.tsx` | منطق URL در کامپوننت + دوباره‌کاری utility | مسئولیت |
| 🟠 | U6 | `components/ui/Container.tsx` | `undefined` در کلاس + واریانت صفحه‌ای | مسئولیت |
| 🟠 | U11 | `components/ui/BadgeTitle.tsx` | `className` در یک واریانت نادیده می‌شود | باگ |
| 🟠 | U15 | `Filter/**`, `RangeGauge`, `RangeDatePicker` | فایل‌های سنگین + CityPanel دو نسخه | شکستن + تکرار |
| 🟠 | X1 | `libs/utils/format.ts` | دو تابع ۹۵٪ یکسان | تکرار |
| 🟠 | X3 | `libs/utils/landing-ready.ts` | منطق فیچر در libs + pub/sub دستی | مرز لایه |
| 🟠 | X6 | `libs/utils/pagination.ts` | کد مرده + گره به دامنه‌ی کابین | ساختار |
| 🟠 | X2 | `libs/utils/icon-map.ts` | وابستگی UI در libs + fallback پنهان | مرز لایه |
| 🟡 | L8 | `landing/index.tsx` | import ناهمگون + ترتیب سکشن hardcode | سبک |
| 🟡 | L10 | `landing/components/Stays.tsx` | نبود گارد خالی + import غیر-type | ناهمگونی |
| 🟡 | L16 | `landing/actions/last-minute.actions.ts` | پوشه برای یک اکشن ۳ خطی | ساختار |
| 🟡 | U5 | `components/ui/Navigate.tsx` | نام غلط + `href=""` + تایپ ضعیف | نام‌گذاری |
| 🟡 | U9 | `components/ui/Select.tsx` | کد کامنت‌شده + بدون برچسب | کد مرده |
| 🟡 | U12 | `components/ui/BackDropBlur.tsx` | نام گمراه‌کننده + رنگ هاردکد | نام‌گذاری |
| 🟡 | U13 | `components/ui/ThemeToggle.tsx` | import نسبی + وابستگی به MouseEvent | سبک |
| 🟡 | U14 | `components/ui/Carousel.tsx` | key با index + `slideClassName` هاردکد | ضدالگو |
| 🟡 | X5 | `libs/utils/scroll.ts` | نبود گارد `document` | ناهمگونی |
| 🟡 | X7 | `libs/utils/jalali.ts` | کامنت گمراه‌کننده + نبود گارد Invalid Date | استحکام |
| 🟡 | X8 | `libs/utils/tehran-date.ts` | نام برند در لایه‌ی عمومی | مرز لایه |
| 🟡 | D4 | `features/search/index.ts` | barrel با ۶۰+ export داخلی | API عمومی |

---

## ۷) نقشه‌ی راه پیشنهادی (ترتیب اجرا — بدون کد)

**گام ۱ — پاک‌سازی بدون ریسک (فقط حذف/ادغام):**
`Footer` تکراری لندینگ (L1) · `GsapProvider` (U3) · `IconButton` (U4) · `EXPERIENCE_CARDS` (L3) · بلوک‌های کامنت‌شده در `Select`/`pagination`/`Hero` (U9, X6, L5) · کلاس‌های مرده `hz-hero-title`/`hz-category-icon`/`hz-category-grid` (L5).

**گام ۲ — رفع باگ‌های واقعی:**
گرادیان + `block-0.5` در `LandingPreloader` (L4) · پارس بازه در `price-range` (X4) · `className` در `BadgeTitle` (U11) · سال کپیرایت در `Footer` (U1) · `undefined` در کلاس `Container`/`CardDashContainer` (U6, U8).

**گام ۳ — شکستن کامپوننت‌های سنگین:**
`CabinCard` → سه فایل + انتخاب‌کننده (D1) · `useLandingAnimation` → سه هوک + registry + `data-animate` (L6) · `LandingPreloader` → پوسته + اسکلتون (L4) · `Search` → تعریف فیلدها + تریگر موبایل (D2) · `SearchPreview` → هدر/گرید/فوتر (D3).

**گام ۴ — حذف تکرار ساختاری:**
`format.ts` → یک تابع با `style` (X1) · `Eyebrow` + `SectionHeading` مشترک (L11) · `ImageOverlayCard` برای سه سکشن (L13) · `CardContainer`/`CardDashContainer` → یک کارت پایه (U7, U8) · بررسی دو نسخه‌ی `CityPanel` (U15).

**گام ۵ — تصحیح مرزهای لایه:**
انتقال `landing-ready` به `features/landing/lib` (X3) · انتقال `icon-map` از `libs` (X2) · جداکردن وابستگی `pagination` به `constants/cabins` (X6) · جداکردن منطق URL از `SortBy` (U10) · محدودکردن barrel جستجو (D4).

**گام ۶ — اصلاح قرارداد انیمیشن (اختیاری ولی مؤثر):**
جایگزینی کلاس‌های گلوبال `hz-*` با `data-animate="…"` + یک `config` مرکزی؛ این کار کوپلینگ رشته‌ای بین کامپوننت‌ها و `useLandingAnimation` را حذف می‌کند (L6, L13).

---

# وضعیت اجرا (پس از اعمال)

**اعتبارسنجی:** `tsc --noEmit` ✅ · `eslint` ✅ (۰ خطا؛ ۷ warning که همه از قبل و بیرون از دامنه‌ی این تغییرات‌اند) · صفحات `/`, `/cabins`, `/cabins/[id]`, `/login` روی dev server با HTTP 200 ✅ · همه‌ی قلاب‌های انیمیشن در HTML سرور حاضرند ✅

## انجام‌شده

| شناسه | وضعیت | چه شد |
| --- | --- | --- |
| L1 | ✅ (کاربر) | `landing/components/Footer.tsx` حذف شد |
| L3 | ✅ | `EXPERIENCE_BANNER_ITEMS` در `constants/experience-banner.ts` = تک‌منبع؛ ثابت مرده حذف شد |
| L4 | ✅ | گرادیان shimmer و `block-0.5` اصلاح شد؛ `ShimmerBar` مشترک + تفکیک `SHIMMER_BAR_CLASS` |
| L5 | ✅ | کد/کلاس‌های مرده حذف؛ `HeroWord` استخراج شد؛ قلاب‌ها `data-animate` |
| L6 | ✅ | `lib/gsap.ts` (ثبت یک‌جا) + `lib/animations/{hero,sections,selectors}.ts`؛ هوک ۲۰۴⇒~۸۰ خط؛ `hz-*` ⇒ `data-animate` |
| L7 | ✅ | منطق آمادگی ⇒ `hooks/useLandingReady.ts`؛ Provider فقط ترکیب می‌کند |
| L8 | ✅ | importها یکدست؛ `constants/index.ts` فقط barrel |
| L9 | ✅ | پیش‌فرض دمویی حذف؛ `lib/countdown.ts` (خالص + SSR-safe) |
| L11 | ✅ | `components/ui/Eyebrow.tsx` مشترک در ۴ نقطه |
| L12 | ✅ | نشان ⇒ پراپِ `badge` کارت؛ سلکتور `[&>a]` حذف؛ لینک `h-full` |
| L13 | ✅ | `ImageOverlayCard` مشترک؛ `rating` عدد شد؛ `bg-gradient-to-t` ⇒ `bg-linear-to-t` |
| L14 | ✅ | `lib/last-minute.ts` (`nearestExpiry` با `Date.parse`) |
| L15 | ✅ | تفکیک به `constants/{images,experience-banner,experiences,testimonials}.ts` |
| U1 | ✅ | خبرنامه‌ی جعلی حذف؛ کپی‌رایت از `CopyrightText` (سال داینامیک)؛ لینک/سوشال از `constants/footer.ts`؛ ۴ آیکن درست |
| U3 | ✅ | `GsapProvider.tsx` حذف (کد مرده) |
| U4 | ✅ | `IconButton.tsx` حذف (کد مرده) |
| U6 | ✅ | `undefined` در کلاس رفع؛ `cabin-detail` ⇒ `size="wide"` (۸ فراخوانی) |
| U7 | ✅ | `varients` ⇒ `frame`/`contentPadding`؛ پدینگ به لایه‌ی محتوا منتقل شد |
| U8 | ✅ | `undefined` رفع شد. **ادغام با `CardContainer` انجام نشد** — دو نقش بصری متفاوت با ۹۰+ مصرف‌کننده؛ دلیلش در خود فایل مستند شد |
| U10 | ✅ | `SortBy.tsx` کاملاً کد مرده بود ⇒ حذف (و با آن، مسئله‌ی منطق URL هم منتفی شد) |
| U11 | ✅ | `className` در هر دو واریانت اعمال می‌شود |
| U15 | ✅ | `RangeGauge` ⇒ ۵ فایل (۵۱۲⇒۴۰۵ خط) · `RangeDatePicker` ⇒ ۵ فایل (۴۲۳⇒۱۷۳ خط) · `FilterCard` ⇒ `MobileFilterBranch` (۴۳۶⇒۳۰۳ خط) |
| X1 | ✅ | یک هسته‌ی مشترک + دو پوشش نام‌دار (API عمومی حفظ شد) |
| X2 | ✅ | ⇒ `features/cabins/config/category-icons.ts` + هشدار dev برای نام ناشناخته |
| X3 | ✅ | **به‌جای انتقال به فیچر**، به `libs/utils/app-ready.ts` تعمیم یافت (چون `Navbar` مشترک است و انتقال، وابستگی معکوس می‌ساخت) |
| X4 | ✅ | پارس سخت‌گیر (`\d+`)، رد ورودی منفی/چندخط‌تیره؛ `formatPriceRange` نرمال‌سازی می‌کند |
| X6 | ✅ | تفکیک `pagination.ts` (بازه) از `url-params.ts` (URL)؛ وابستگی به `constants/cabins` با تزریق `CABINS_LIMIT_BOUNDS` حذف شد؛ کد و تایپ مرده حذف |
| D1 | ✅ | ⇒ پوشه‌ی `CabinCard/` با ۷ فایل؛ تکرار تصویر/مشخصات/قیمت و ۴ محاسبه‌ی تکراری حذف شد |
| D2 | ✅ | تعریف فیلدها ⇒ `config/search-fields.tsx`؛ تریگر موبایل ⇒ `SearchMobileTrigger`؛ `switch` ⇒ نگاشت تایپ‌شده (۴۸۶⇒~۳۰۰ خط) |
| D3 | ✅ | ⇒ `PreviewHeader` / `PreviewGrid` / `PreviewCta`؛ JSX تکراری کارت حذف شد |

## اصلاح گزارش (یافته‌ی نادرست)

- **U15 / CityPanel:** دو `CityPanel` **نسخه‌ی دوم نیستند**. فایل `features/cabins/components/filters/panels/CityPanel.tsx` (۱۲۰ خط) یک **آداپتور دامنه** است که روی `components/ui/Filter/panels/CityPanel.tsx` (۳۶۱ خط) سوار می‌شود و شهرها را بر اساس منطقه گروه‌بندی می‌کند. لایه‌بندی درست است؛ فقط **نام تکراری** گیج‌کننده است. تغییری اعمال نشد.

## باقی‌مانده (خارج از دامنه‌ی 🔴+🟠 یا آگاهانه رد شده)

- 🟡 **L10** — گارد «داده‌ی خالی» در `Stays` به‌خواست شما اعمال **نشد**. (`import type` اصلاح شد.)
- 🟡 موارد دیگر: `U12` (`BackDropBlur`)، `U13` (`ThemeToggle`)، `U14` (`Carousel` با `key={index}`)، `X5` (`scroll.ts`)، `X7` (`jalali.ts`)، `X8` (`tehran-date.ts`)، `D4` (barrel جستجو)، `L16`.
- ⚠️ **رنگ‌های هاردکد گرادیان هیرو** (`rgba(7,17,30,…)`) توکن نشدند؛ مقدارشان با `--color-overlay` یکی است ولی جایگزینی‌شان نیاز به سینتکس رنگ نسبی CSS داشت که ریسک بیلد دارد.
- ⚠️ **`npm run build` اجرا نشد** چون dev server روی پورت ۳۰۰۰ در حال اجراست و بیلد با پوشه‌ی `.next` تداخل می‌کند. اعتبارسنجی جایگزین: `tsc` + `eslint` + درخواست واقعی از dev server (HTTP 200 و حضور قلاب‌ها در HTML سرور).
- ℹ️ تغییرات محتوایی جزئی که باید بدانید: جداکننده‌ی اعشار امتیاز نظرات «۵.۰» ⇒ «۵٫۰» (فارسی)، سال کپی‌رایت «۲۰۰۵» ⇒ داینامیک، و عرض خط «ابرو»ی سکشن دسته‌بندی `w-7` ⇒ `w-8` (یکدست‌سازی).

---

# دور دوم (درخواست‌های تکمیلی)

| مورد | وضعیت | چه شد |
| --- | --- | --- |
| **U5** | ✅ | `Navigate.tsx` ⇒ **`Breadcrumb.tsx`**؛ `id`/`isSpan` حذف، `href` نبود ⇒ متن (نه `<Link href="">`)، `mb-6` هاردکد ⇒ `className`، به‌علاوه‌ی `aria-label` و `aria-current="page"` |
| **U9** | ✅ | `Select.tsx` کاملاً حذف شد (صفر مصرف‌کننده — `SortBy` مرده تنها مصرف‌کننده‌اش بود) |
| **importهای لندینگ** | ✅ | همه با alias `@/` — صفر import نسبی در `src/features/landing/**` |
| **`type` در importها** | ✅ | `consistent-type-imports` با `fixStyle: "inline-type-imports"` روی `src` ⇒ ۱۹ فایل به `import { type X, … }` یکدست شد |

**اعتبارسنجی دور دوم:** `tsc` ✅ · `eslint` ✅ (۰ خطا) · `/`, `/cabins`, `/cabins/3`, `/login` ⇒ HTTP 200 ✅ · بردکرامب با `aria-label`/`aria-current` در HTML سرور ✅ · `href=""` صفر ✅

**نکته‌ی باز:** در حین اجرا، کامنت‌های `features/landing/hooks/useLandingReady.ts` از بیرونِ ابزارهای من (نه eslint، نه sed — با آزمایش تأیید شد) کوتاه شده بودند. چون JSDoc سبک غالب پروژه است (۱۴۷۶ در برابر ۸۳ مورد `//*`)، نسخه‌ی مستندشده برگردانده شد. اگر آن کوتاه‌سازی عمدی بوده، بگویید تا دوباره اعمال شود.

**دست‌نخورده (خارج از درخواست):** بقیه‌ی فیچرها (`search`, `cabins`, `dashboard`, `guest`) هنوز importهای نسبی داخلی دارند.

