"use client";

import { X } from "lucide-react";

import { type FilterCardValues } from "@/components/ui/Filter/FilterCard";
import { FOCUS_RING } from "@/components/ui/Filter/focus-ring";
import type { City } from "@/features/cabins/types/city.types";
import SearchCard from "@/features/search/components/SearchCard";
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
  formatDateRangeSummary,
} from "@/features/search/utils/search-summary";
import {
  MOBILE_SEARCH_EMPTY_HINT,
  MOBILE_SEARCH_HERO_TITLE,
  MOBILE_SEARCH_RESULTS_LABEL,
  SEARCH_CLEAR_LABEL,
} from "@/features/search/constants/search-mobile-texts";
import { FALLBACK_PUBLIC_SETTINGS } from "@/features/settings/types/public-settings.types";

//* واریانت‌های همین کامپوننت: لندینگ (`hero`) و `/cabins` (`results`)
type SearchVariant = "hero" | "results";

const SEARCH_WRAPPER_CLASS: Record<SearchVariant, string> = {
  hero: "text-text lg:bg-background mx-auto flex h-17 max-w-full xl:max-w-264 flex-col gap-2 rounded-none border-0 bg-transparent p-2 shadow-none backdrop-blur-none lg:flex-row lg:items-center lg:gap-0 lg:rounded-2xl lg:border lg:border-white/15 lg:p-2 lg:shadow-lg",
  results:
    "text-text border-foreground/10 bg-surface flex flex-col gap-2 rounded-2xl border p-0.5 shadow-sm lg:flex-row lg:items-center lg:gap-0",
};

//* گرید پنج فیلد روی دسکتاپ. ⚠️ نسبت ستون‌ها به ترتیب فیلدها گره خورده است (مقصد / ورود / خروج / مهمان / بودجه).
const SEARCH_FIELD_GRID_CLASS =
  "text-text grid min-w-0 flex-1 grid-cols-1 gap-1 lg:grid-cols-[1.35fr_1fr_1fr_0.9fr_1.15fr] lg:gap-0";

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
  const divider = isHero ? "lg:border-white/10" : "lg:border-foreground/10";

  //* تعداد شب بازه‌ی در حال ویرایش — مبنای «حالت بودجه» (هر شب / کل سفر)، برچسب‌هایش و سقف اسلایدر؛ صفر یعنی بازه ناقص یا خالی ⇒ بودجه‌ی هر شب.
  const draftNights = nightsBetween(draft.checkIn, draft.checkOut);

  //* جستجوی خالی هم معتبر است: یعنی «همه‌ی اقامتگاه‌ها»
  const hasDraftFilters = hasAnySearchFilter(draft);
  const hasApplied = hasAnySearchFilter(applied);

  const mobileDateSummary = formatDateRangeSummary(draft.checkIn, draft.checkOut) ?? null;

  const mobileSummaryRaw = buildSearchSummary({
    filters: draft,
    cities,
    compact: !isHero,
  });

  const mobileSummary = mobileSummaryRaw || MOBILE_SEARCH_EMPTY_HINT;

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

  return (
    <div
      className={`${SEARCH_WRAPPER_CLASS[isHero ? "hero" : "results"]} ${className}`}
      //* قلاب انیمیشن ورود لندینگ — فقط روی واریانت `hero` معنا دارد
      data-animate={isHero ? "search" : undefined}
    >
      <SearchCard
        items={items}
        values={values}
        onValueChange={handleValueChange}
        //* داخل شیت موبایل فقط draft پاک می‌شود تا نتایجِ پشت شیت نپرد
        onClearFilters={resetDraft}
        onApply={() => handleApply()}
        isPending={isPending}
        isHero={isHero}
        mobileTitle={isHero ? MOBILE_SEARCH_HERO_TITLE : MOBILE_SEARCH_RESULTS_LABEL}
        mobileApplyLabel={mobileApplyLabel}
        mobileSummaryRaw={mobileSummaryRaw}
        mobileSummary={mobileSummary}
        className={SEARCH_FIELD_GRID_CLASS}
      />

      <div className="hidden items-center gap-1 lg:flex">
        {!isHero && hasApplied && (
          <button
            type="button"
            onClick={() => reset()}
            className={`text-text-gray hover:text-danger hover:bg-danger/10 flex h-12 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-bold whitespace-nowrap transition-colors ${FOCUS_RING}`}
          >
            <X className="size-4" />
            {SEARCH_CLEAR_LABEL}
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
