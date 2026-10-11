"use client";

import { X } from "lucide-react";

import FilterCard, {
  type FilterCardValues,
} from "@/components/ui/Filter/FilterCard";
import { FOCUS_RING } from "@/components/ui/Filter/focus-ring";
import { formatJalaliDate } from "@/components/ui/RangeDatePicker";
import type { City } from "@/features/cabins/types/city.types";
import SearchMobileTrigger from "@/features/search/components/SearchMobileTrigger";
import SearchAction from "@/features/search/components/fields/SearchAction";
import { buildSearchFieldItems } from "@/features/search/config/search-fields";
import type {
  BudgetRange,
  Destination,
  Region,
  SearchController,
  SearchFilters,
} from "@/features/search/types/search.types";
import { nightsBetween } from "@/features/search/utils/budget";
import { hasAnySearchFilter } from "@/features/search/utils/search-params";
import { scheduleScrollToSearchPreview } from "@/features/search/utils/scroll-to-preview";
import {
  buildSearchSummary,
  MOBILE_SEARCH_EMPTY_HINT,
} from "@/features/search/utils/search-summary";
import { FALLBACK_PUBLIC_SETTINGS } from "@/features/settings/types/public-settings.types";

//* کلاس‌های چیدمان — فقط در همین فایل استفاده می‌شوند، پس محلی‌اند (نه در `constants`).
//* ⚠️ اگر روزی کامپوننت دومی همین رشته‌ها را خواست، آن‌وقت به `constants/` منتقل شوند.

//* واریانت‌های همین کامپوننت: لندینگ (`hero`) و `/cabins` (`results`)
type SearchVariant = "hero" | "results";

const SEARCH_WRAPPER_CLASS: Record<SearchVariant, string> = {
  hero: "text-text md:bg-background/60 mx-auto flex min-h-20 md:min-h-19 max-w-256 xl:max-w-264 flex-col gap-2 rounded-none border-0 bg-transparent p-2 shadow-none backdrop-blur-none md:flex-row md:items-center md:gap-0 md:rounded-2xl md:border md:border-white/15 md:p-2 md:shadow-2xl md:shadow-black/20 md:backdrop-blur-xl",
  results:
    "text-text border-foreground/10 bg-surface flex flex-col gap-2 rounded-2xl border p-2 shadow-sm md:flex-row md:items-center md:gap-0",
};

//* گرید پنج فیلد روی دسکتاپ. ⚠️ نسبت ستون‌ها به ترتیب فیلدها گره خورده است (مقصد / ورود / خروج / مهمان / بودجه).
const SEARCH_FIELD_GRID_CLASS =
  "text-text grid min-w-0 flex-1 grid-cols-1 gap-1 md:grid-cols-[1.35fr_1fr_1fr_0.9fr_1.15fr] md:gap-0";

//* قاب تریگر موبایل (فقط ارتفاع/شکل — رنگ‌ها در `MOBILE_TRIGGER_TONE`)
const MOBILE_TRIGGER_BASE =
  "w-full min-h-16 rounded-full border shadow-lg backdrop-blur-md transition-all duration-200 active:scale-[0.99] md:shadow-xl";

//* ته‌رنگ تریگر موبایل به‌تفکیک واریانت
const MOBILE_TRIGGER_TONE: Record<SearchVariant, string> = {
  hero: "border-white/15 bg-surface/85 shadow-black/15",
  results: "border-foreground/10 bg-surface shadow-black/5",
};

type Props = {
  cities: City[];
  //* مناطق واقعی از API — برای گروه‌بندی شهرها در پنل مقصد
  regions: Region[];
  controller: SearchController;
  variant?: SearchVariant;
  className?: string;
  //* افق رزرو (تعداد روز از امروز) از `GET /settings/public` — سقف تقویم تا کاربر تاریخی فراتر از آنچه بک‌اند می‌پذیرد انتخاب نکند. مقدار واقعی همیشه از سرور می‌آید؛ اینجا فقط پیش‌فرض امن است.
  bookingWindowDays?: number;
};

//* کامپوننت سرچ یکپارچه — یک منطق، دو نمای متفاوت (لندینگ و `/cabins`). تفاوتشان فقط در «کنترلر» (Zustand در برابر URL) و چیدمان/برچسب‌هاست.
//* توجه: هیچ‌جای این کامپوننت fetch نمی‌زند؛ فقط draft را عوض می‌کند و `apply()` را صدا می‌زند.
//* تفکیک‌های انجام‌شده: تعریف پنج فیلد ⇒ `config/search-fields.tsx` · تریگر موبایل ⇒ `SearchMobileTrigger`. کلاس‌های چیدمان عمداً همین‌جا مانده‌اند چون فقط این فایل مصرفشان می‌کند.
export default function Search({
  cities,
  regions,
  controller,
  variant = "hero",
  className = "",
  bookingWindowDays = FALLBACK_PUBLIC_SETTINGS.maxAdvanceBookingDays,
}: Props) {
  const { draft, applied, setField, apply, reset, resetDraft, isPending } =
    controller;

  const isHero = variant === "hero";
  const divider = isHero ? "md:border-white/10" : "md:border-foreground/10";

  //* تعداد شب بازه‌ی در حال ویرایش — مبنای «حالت بودجه» (هر شب / کل سفر)، برچسب‌هایش و سقف اسلایدر؛ صفر یعنی بازه ناقص یا خالی ⇒ بودجه‌ی هر شب.
  const draftNights = nightsBetween(draft.checkIn, draft.checkOut);

  //* جستجوی خالی هم معتبر است: یعنی «همه‌ی اقامتگاه‌ها»
  const hasDraftFilters = hasAnySearchFilter(draft);
  const hasApplied = hasAnySearchFilter(applied);

  const mobileDateSummary = (() => {
    const from = formatJalaliDate(draft.checkIn);
    const to = formatJalaliDate(draft.checkOut);
    if (from && to) return `${from} تا ${to}`;
    return from ?? to ?? null;
  })();

  //* خلاصه‌ی یک‌خطی زیر عنوان تریگر موبایل — ترتیب قطعات: مقصد · تاریخ · مهمان · بودجه.
  //* هر قطعه فقط با مقدار واقعی می‌آید؛ بازه‌ی بودجه‌ی کامل «بدون محدودیت» است و عمداً نمایش داده نمی‌شود تا کاربر بازه‌ی پیش‌فرض را «فیلتر» نپندارد.
  const mobileSummaryRaw = buildSearchSummary({
    filters: draft,
    cities,
    compact: !isHero,
  });

  const mobileSummary = mobileSummaryRaw || MOBILE_SEARCH_EMPTY_HINT;

  //* نگاشت تایپ‌شده‌ی «شناسه‌ی فیلد ⇒ ثبت مقدار».
  //* `Record<keyof SearchFilters, …>` تضمین می‌کند هر فیلتر یک setter داشته باشد و کست‌ها فقط در همین یک نقطه (مرز `unknown` ورودی `FilterCard`) متمرکز بمانند.
  const fieldSetters: Record<
    keyof SearchFilters,
    (value: unknown) => void
  > = {
    destination: (value) =>
      setField("destination", (value as Destination | null) ?? null),
    checkIn: (value) => setField("checkIn", (value as Date | null) ?? null),
    checkOut: (value) => setField("checkOut", (value as Date | null) ?? null),
    guests: (value) =>
      setField("guests", typeof value === "number" ? value : null),
    budget: (value) =>
      setField("budget", (value as BudgetRange | null) ?? null),
  };

  const handleValueChange = (id: string, value: unknown) => {
    fieldSetters[id as keyof SearchFilters]?.(value);
  };

  const values: FilterCardValues = {
    destination: draft.destination,
    checkIn: draft.checkIn,
    checkOut: draft.checkOut,
    guests: draft.guests,
    budget: draft.budget,
  };

  //* اکشن «اعمال» — هم دسکتاپ و هم موبایل. بعد از اعمال با تأخیر کوتاه به بخش پیش‌نمایش اسکرول نرم می‌کنیم (در موبایل اول باید باتم‌شیت بسته و قفل اسکرول body آزاد شود)؛ اگر صفحه پیش‌نمایش نداشته باشد (مثل `/cabins`) بی‌اثر است.
  //* `patch` برای «اعمال اتمیک» است (دکمه‌ی «اعمال» پنل بودجه).
  //* ⚠️ همیشه با wrapper صدا زده می‌شود (`() => handleApply()`)، وگرنه رویداد کلیک به‌جای patch به `apply` می‌رود.
  const handleApply = (patch?: Partial<SearchFilters>) => {
    apply(patch);
    scheduleScrollToSearchPreview();
  };

  const items = buildSearchFieldItems({
    cities,
    regions,
    draftNights,
    mobileDateSummary,
    divider,
    bookingWindowDays,
    onApplyBudget: (budget) => handleApply({ budget }),
    commitFullRange: isHero,
  });

  //* جستجوی خالی یعنی «همه‌ی اقامتگاه‌ها»
  const mobileApplyLabel = isHero
    ? hasDraftFilters
      ? "اعمال و مشاهده نتایج"
      : "مشاهده‌ی همه‌ی اقامتگاه‌ها"
    : "مشاهده نتایج";

  const tone = MOBILE_TRIGGER_TONE[isHero ? "hero" : "results"];

  return (
    <div
      className={`${SEARCH_WRAPPER_CLASS[isHero ? "hero" : "results"]} ${className}`}
      //* قلاب انیمیشن ورود لندینگ — فقط روی واریانت `hero` معنا دارد
      data-animate={isHero ? "search" : undefined}
    >
      <FilterCard
        items={items}
        value={values}
        onValueChange={handleValueChange}
        //* داخل شیت موبایل فقط draft پاک می‌شود تا نتایجِ پشت شیت نپرد
        onClearFilters={resetDraft}
        placement="center"
        mobileTitle={isHero ? "جستجوی اقامتگاه" : "جستجوی شما"}
        mobileApplyLabel={mobileApplyLabel}
        onMobileApply={() => handleApply()}
        mobileApplyPending={isPending}
        renderMobileTrigger={
          <SearchMobileTrigger
            isHero={isHero}
            summaryRaw={mobileSummaryRaw}
            summary={mobileSummary}
          />
        }
        //* `min-h-16` ارتفاع تریگر را از همان اول رزرو می‌کند: نه در رندر سرور و نه هنگام تعویض فونت کوچک‌تر نمی‌شود (و چون یک خط ثابت دارد بزرگ‌تر هم نمی‌شود) ⇒ بدون CLS
        mobileTriggerClassName={`${MOBILE_TRIGGER_BASE} ${FOCUS_RING} ${tone}`}
        className={SEARCH_FIELD_GRID_CLASS}
      />

      <div className="hidden items-center gap-1 md:flex">
        {!isHero && hasApplied && (
          <button
            type="button"
            onClick={() => reset()}
            className={`text-text-gray hover:text-danger hover:bg-danger/10 flex h-12 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-bold whitespace-nowrap transition-colors ${FOCUS_RING}`}
          >
            <X className="size-4" />
            حذف جستجو
          </button>
        )}

        <SearchAction
          label={isHero ? "جستجو" : "اعمال جستجو"}
          pending={isPending}
          onClick={() => handleApply()}
        />
      </div>
    </div>
  );
}
