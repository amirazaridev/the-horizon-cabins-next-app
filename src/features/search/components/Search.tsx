"use client";

import {
  CalendarDays,
  MapPin,
  PencilLine,
  Search as SearchIcon,
  Users,
  Wallet,
  X,
} from "lucide-react";

import FilterCard, {
  type FilterCardItem,
  type FilterCardValues,
} from "@/components/ui/Filter/FilterCard";
import { FOCUS_RING } from "@/components/ui/Filter/focus-ring";
import DateRangePanel, {
  type DateRange,
} from "@/components/ui/Filter/panels/DateRangePanel";
import { formatJalaliDate } from "@/components/ui/RangeDatePicker";
import type { City } from "@/features/cabins/types/city.types";

import BudgetPanel from "./fields/BudgetPanel";
import FieldContent from "./fields/FieldContent";
import GuestsPanel from "./fields/GuestsPanel";
import SearchAction from "./fields/SearchAction";
import DestinationPanel from "./destination/DestinationPanel";
import { hasAnySearchFilter } from "../utils/search-params";
import { scheduleScrollToSearchPreview } from "../utils/scroll-to-preview";
import {
  buildSearchSummary,
  destinationLabel,
  formatBudgetRangeLabel,
  formatBudgetRangeLabelCompact,
  MOBILE_SEARCH_CHANGE_LABEL,
  MOBILE_SEARCH_EMPTY_HINT,
  MOBILE_SEARCH_RESULTS_LABEL,
  MOBILE_SEARCH_TITLE,
} from "../utils/search-summary";
import type {
  BudgetRange,
  Destination,
  Region,
  SearchController,
  SearchFilters,
} from "../types/search.types";

export type SearchVariant = "hero" | "results";

type Props = {
  cities: City[];
  /** مناطق واقعی از API — برای گروه‌بندی شهرها در پنل مقصد */
  regions: Region[];
  controller: SearchController;
  variant?: SearchVariant;
  className?: string;
};

/**
 * کامپوننت سرچ یکپارچه — یک منطق، دو نمای متفاوت.
 *
 * منطق مشترک (مقصد، تاریخ، مهمان، بودجه، اعتبارسنجی، draft/apply) اینجاست؛
 * تفاوت لندینگ و /cabins فقط در «کنترلر» (Zustand در برابر URL) و در
 * چیدمان/برچسب‌هاست.
 *
 * توجه: هیچ‌جای این کامپوننت fetch نمی‌زند؛ فقط draft را عوض می‌کند و
 * `apply()` را صدا می‌زند.
 */
export default function Search({
  cities,
  regions,
  controller,
  variant = "hero",
  className = "",
}: Props) {
  const { draft, applied, setField, apply, reset, resetDraft, isPending } =
    controller;

  const isHero = variant === "hero";
  const divider = isHero ? "md:border-white/10" : "md:border-foreground/10";

  /** جستجوی خالی هم معتبر است: یعنی «همه‌ی اقامتگاه‌ها» */
  const hasDraftFilters = hasAnySearchFilter(draft);
  const hasApplied = hasAnySearchFilter(applied);

  const mobileDateSummary = (() => {
    const from = formatJalaliDate(draft.checkIn);
    const to = formatJalaliDate(draft.checkOut);
    if (from && to) return `${from} تا ${to}`;
    return from ?? to ?? null;
  })();

  /**
   * خلاصه‌ی یک‌خطی زیر عنوان تریگر موبایل.
   *
   * ترتیب قطعات: مقصد · تاریخ · مهمان · بودجه. هر قطعه فقط وقتی می‌آید که
   * واقعاً مقدار داشته باشد؛ بازه‌ی بودجه‌ی کامل هم «بدون محدودیت» است و
   * عمداً نمایش داده نمی‌شود (تا کاربر بازه‌ی پیش‌فرض را «فیلتر» نپندارد).
   */
  const mobileSummaryRaw = buildSearchSummary({
    filters: draft,
    cities,
    compact: !isHero,
  });

  const mobileSummary = mobileSummaryRaw || MOBILE_SEARCH_EMPTY_HINT;

  const handleValueChange = (id: string, value: unknown) => {
    switch (id) {
      case "destination":
        setField("destination", (value as Destination | null) ?? null);
        break;
      case "checkIn":
        setField("checkIn", (value as Date | null) ?? null);
        break;
      case "checkOut":
        setField("checkOut", (value as Date | null) ?? null);
        break;
      case "guests":
        setField("guests", typeof value === "number" ? value : null);
        break;
      case "budget":
        setField("budget", (value as BudgetRange | null) ?? null);
        break;
      default:
        break;
    }
  };

  const values: FilterCardValues = {
    destination: draft.destination,
    checkIn: draft.checkIn,
    checkOut: draft.checkOut,
    guests: draft.guests,
    budget: draft.budget,
  };

  /**
   * اکشن «اعمال» — هم دسکتاپ و هم موبایل.
   *
   * بعد از اعمال، با تأخیر کوتاه به بخش پیش‌نمایش اسکرول نرم می‌کنیم تا
   * کاربر نتیجه‌ی جستجو را ببیند (در موبایل باتم‌شیت هم اول باید بسته شود
   * و قفل اسکرول body آزاد گردد). اگر صفحه بخش پیش‌نمایش نداشته باشد
   * (مثل `/cabins`) این فراخوانی بی‌اثر است.
   *
   * `patch` اختیاری برای «اعمال اتمیک» است — دکمه‌ی «اعمال» پنل بودجه،
   * مقدار تازه را همان لحظه ثبت می‌کند و جستجو را اجرا می‌کند.
   *
   * ⚠️ همیشه با wrapper صدا زده می‌شود (`() => handleApply()`)، وگرنه
   * رویداد کلیک به‌جای patch به `apply` می‌رود.
   */
  const handleApply = (patch?: Partial<SearchFilters>) => {
    apply(patch);
    scheduleScrollToSearchPreview();
  };

  /** کارت مشترک تاریخ ورود/خروج — یک تقویم دوقلو که هر دو فیلد را پر می‌کند */
  function datePanel(): FilterCardItem["panel"] {
    return {
      title: "تاریخ سفر",
      size: "xl",
      placement: "center",
      render: ({ getValue, setFieldValue, close, openPanel }) => {
        const range: DateRange = {
          from: (getValue("checkIn") as Date | null) ?? null,
          to: (getValue("checkOut") as Date | null) ?? null,
        };

        return (
          <DateRangePanel
            value={range}
            onChange={(next) => {
              setFieldValue("checkIn", next.from);
              setFieldValue("checkOut", next.to);
            }}
            onComplete={() => {
              close();
              openPanel("guests");
            }}
          />
        );
      },
    };
  }

  const items: FilterCardItem[] = [
    {
      id: "destination",
      label: "مثال: شمال ایران",
      variant: "field",
      formatLabel: (value) =>
        destinationLabel(value as Destination | null, cities),
      className: "md:rounded-none",
      renderTrigger: ({ value }) => (
        <FieldContent
          icon={<MapPin className="size-4" />}
          label="مقصد"
          value={destinationLabel(value as Destination | null, cities)}
          placeholder="مثال: شمال ایران"
          caret
        />
      ),
      panel: {
        title: "کجا می‌خواهید بروید؟",
        size: "md",
        placement: "center",
        closeOnSelect: true,
        advanceTo: "checkIn",
        render: ({ value, setValue }) => (
          <DestinationPanel
            cities={cities}
            regions={regions}
            value={(value as Destination | null) ?? null}
            onChange={(next) => setValue(next)}
          />
        ),
      },
    },
    {
      id: "checkIn",
      label: "تاریخ ورود",
      variant: "field",
      // ورود و خروج یک فیلتر حساب می‌شوند
      group: "dates",
      formatLabel: () => mobileDateSummary ?? undefined,
      className: `md:rounded-none md:border-s ${divider}`,
      renderTrigger: ({ value }) => (
        <FieldContent
          icon={<CalendarDays className="size-4" />}
          label="تاریخ ورود"
          value={formatJalaliDate(value as Date | null)}
          placeholder="افزودن تاریخ"
        />
      ),
      panel: datePanel(),
    },
    {
      id: "checkOut",
      label: "تاریخ خروج",
      variant: "field",
      group: "dates",
      hideOnMobile: true,
      className: `md:rounded-none md:border-s ${divider}`,
      renderTrigger: ({ value }) => (
        <FieldContent
          icon={<CalendarDays className="size-4" />}
          label="تاریخ خروج"
          value={formatJalaliDate(value as Date | null)}
          placeholder="افزودن تاریخ"
        />
      ),
      panel: datePanel(),
    },
    {
      id: "guests",
      label: "تعداد مهمان",
      variant: "field",
      formatLabel: (value) =>
        typeof value === "number" && value >= 1
          ? `${value.toLocaleString("fa-IR")} مهمان`
          : undefined,
      className: `md:rounded-none md:border-s ${divider}`,
      renderTrigger: ({ value }) => (
        <FieldContent
          icon={<Users className="size-4" />}
          label="مهمان"
          value={
            typeof value === "number"
              ? `${value.toLocaleString("fa-IR")} نفر`
              : undefined
          }
          placeholder="تعداد مهمان"
        />
      ),
      panel: {
        title: "تعداد مهمان",
        size: "md",
        placement: "end",
        /*
         * بعد از تأیید تعداد مهمان، پنل بعدی (بودجه) خودکار باز می‌شود —
         * ادامه‌ی همان زنجیره‌ای که پنل تاریخ با `advanceTo: "checkIn"`
         * شروع می‌کند. `openPanel` هم روی دسکتاپ (پاپ‌اور) و هم روی موبایل
         * (آکاردئون شیت) کار می‌کند.
         */
        render: ({ value, setValue, openPanel }) => (
          <GuestsPanel
            value={typeof value === "number" ? value : null}
            onChange={setValue}
            onDone={() => openPanel("budget")}
          />
        ),
      },
    },
    {
      id: "budget",
      label: "بازه‌ی بودجه",
      variant: "field",
      formatLabel: (value) =>
        formatBudgetRangeLabel(value as BudgetRange | null),
      className: `md:rounded-none md:border-s ${divider}`,
      renderTrigger: ({ value }) => (
        <FieldContent
          icon={<Wallet className="size-4" />}
          label="بودجه‌ی هر شب"
          value={formatBudgetRangeLabelCompact(value as BudgetRange | null)}
          placeholder="بازه‌ی بودجه"
          caret
        />
      ),
      panel: {
        title: "بازه‌ی بودجه‌ی هر شب",
        size: "md",
        placement: "end",
        /*
         * «اعمال» بودجه فقط مقدار را ثبت نمی‌کند؛ جستجو را هم همان لحظه
         * اجرا می‌کند. مقدار تازه با `patch` می‌رود تا روی کنترلر URL — که
         * draft را در state نگه می‌دارد — مقدار کهنه ثبت نشود.
         * «حذف بودجه» این مسیر را طی نمی‌کند (onApply فقط از اعمال می‌آید).
         *
         * `commitFullRange` فقط در لندینگ فعال است: آنجا «اعمال» باید همیشه
         * یک جستجوی واقعی بسازد، حتی وقتی کاربر فقط یک دستگیره را جابه‌جا
         * کرده و نتیجه روی مرز بازه افتاده است. در `/cabins` بازه‌ی کامل
         * همان `null` می‌ماند تا URL پارامتر بی‌مورد نگیرد.
         */
        render: ({ value, setValue, close }) => (
          <BudgetPanel
            value={(value as BudgetRange | null) ?? null}
            onChange={(next) => setValue(next)}
            onDone={close}
            onApply={(next) => handleApply({ budget: next })}
            commitFullRange={isHero}
          />
        ),
      },
    },
  ];

  const wrapperClass = isHero
    ? "hz-search text-text md:bg-background/60 mx-auto flex max-w-256 xl:max-w-264 flex-col gap-2 rounded-none border-0 bg-transparent p-2 shadow-none backdrop-blur-none md:flex-row md:items-center md:gap-0 md:rounded-2xl md:border md:border-white/15 md:p-2 md:shadow-2xl md:shadow-black/20 md:backdrop-blur-xl"
    : "text-text border-foreground/10 bg-surface flex flex-col gap-2 rounded-2xl border p-2 shadow-sm md:flex-row md:items-center md:gap-0";

  const fieldGridClass =
    "text-text grid min-w-0 flex-1 grid-cols-1 gap-1 md:grid-cols-[1.35fr_1fr_1fr_0.9fr_1.15fr] md:gap-0";

  /*
   * تریگر موبایل:
   *  - لندینگ : پرسش «مقصد، بودجه و تاریخ سفرت رو بگو» + خلاصه‌ی فیلترها + ذره‌بین
   *  - /cabins: برچسب «جستجوی شما» + خلاصه + دکمه‌ی صریح «تغییر جستجو»
   *
   * `w-full` روی ریشه‌ی هر دو شاخه تضمین می‌کند دکمه تا لبه‌ی کانتینر
   * والد (خودِ Search) کشیده شود؛ پدینگ کم و آیکن بزرگ‌تر هم نوار را
   * جادارتر نشان می‌دهد.
   */
  const mobileTrigger = () =>
    isHero ? (
      <span className="flex w-full min-w-80 items-center gap-3 py-2 ps-4.5 pe-2">
        <span className="flex min-w-0 flex-1 flex-col gap-1 text-start">
          <span className="text-text truncate text-[15px] leading-6 font-extrabold">
            {MOBILE_SEARCH_TITLE}
          </span>
          <span
            className={`truncate text-[13px] leading-5 font-medium ${
              mobileSummaryRaw ? "text-text-gray" : "text-text-gray/80"
            }`}
          >
            {mobileSummary}
          </span>
        </span>
        <span className="bg-primary-400 grid size-12 shrink-0 place-items-center rounded-full text-black shadow-md shadow-black/20">
          <SearchIcon className="size-5.5" />
        </span>
      </span>
    ) : (
      <span className="flex w-full min-w-0 items-center gap-3 py-2 ps-4 pe-2">
        <span className="flex min-w-0 flex-1 flex-col gap-1 text-start">
          <span className="text-text-gray truncate text-[11px] leading-4 font-semibold">
            {MOBILE_SEARCH_RESULTS_LABEL}
          </span>
          <span className="text-text truncate text-[13px] leading-5 font-bold">
            {mobileSummary}
          </span>
        </span>
        <span className="border-primary-400/40 bg-primary-400/10 text-text flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold whitespace-nowrap">
          {MOBILE_SEARCH_CHANGE_LABEL}
          <PencilLine className="size-3.5" />
        </span>
      </span>
    );

  /** جستجوی خالی یعنی «همه‌ی اقامتگاه‌ها» */
  const mobileApplyLabel = isHero
    ? hasDraftFilters
      ? "اعمال و مشاهده نتایج"
      : "مشاهده‌ی همه‌ی اقامتگاه‌ها"
    : "مشاهده نتایج";

  return (
    <div className={`${wrapperClass} ${className}`}>
      <FilterCard
        items={items}
        value={values}
        onValueChange={handleValueChange}
        // داخل شیت موبایل فقط draft پاک می‌شود تا نتایجِ پشت شیت نپرد
        onClearFilters={resetDraft}
        placement="center"
        mobileTitle={isHero ? "جستجوی اقامتگاه" : "جستجوی شما"}
        mobileApplyLabel={mobileApplyLabel}
        onMobileApply={() => handleApply()}
        mobileApplyPending={isPending}
        renderMobileTrigger={mobileTrigger}
        /*
         * پدینگ/ارتفاع را خودِ تریگر می‌دهد، پس اینجا فقط ظاهر نوار است.
         * `w-full` تضمین می‌کند دکمه تا انتهای کانتینر `Search` کشیده شود.
         */
        mobileTriggerClassName={`w-full rounded-full border shadow-lg backdrop-blur-md transition-all duration-200 active:scale-[0.99] md:shadow-xl ${FOCUS_RING} ${
          isHero
            ? "border-white/15 bg-surface/85 shadow-black/15"
            : "border-foreground/10 bg-surface shadow-black/5"
        }`}
        className={fieldGridClass}
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
