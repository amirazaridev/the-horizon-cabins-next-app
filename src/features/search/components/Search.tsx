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
} from "../utils/search-summary";
import type {
  BudgetRange,
  Destination,
  SearchController,
} from "../types/search.types";

export type SearchVariant = "hero" | "results";

type Props = {
  cities: City[];
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

  const mobileSummary =
    buildSearchSummary({ filters: draft, cities, compact: !isHero }) ||
    (isHero
      ? "مقصد، تاریخ و مهمان را انتخاب کنید"
      : "برای فیلترکردن نتایج، جستجو را تغییر دهید");

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
   */
  const handleApply = () => {
    apply();
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
        render: ({ value, setValue, close }) => (
          <GuestsPanel
            value={typeof value === "number" ? value : null}
            onChange={setValue}
            onDone={close}
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
        render: ({ value, setValue, close }) => (
          <BudgetPanel
            value={(value as BudgetRange | null) ?? null}
            onChange={(next) => setValue(next)}
            onDone={close}
          />
        ),
      },
    },
  ];

  const wrapperClass = isHero
    ? "hz-search text-text md:bg-background/60 mx-auto flex max-w-256 xl:max-w-264 flex-col gap-2 rounded-none border-0 bg-transparent p-0 shadow-none backdrop-blur-none md:flex-row md:items-center md:gap-0 md:rounded-2xl md:border md:border-white/15 md:p-2 md:shadow-2xl md:shadow-black/20 md:backdrop-blur-xl"
    : "text-text border-foreground/10 bg-surface flex flex-col gap-2 rounded-2xl border p-2 shadow-sm md:flex-row md:items-center md:gap-0";

  const fieldGridClass =
    "text-text grid min-w-0 flex-1 grid-cols-1 gap-1 md:grid-cols-[1.35fr_1fr_1fr_0.9fr_1.15fr] md:gap-0";

  /*
   * در موبایل:
   *  - لندینگ: «مقصد سفرت کجاست؟» + خلاصه + آیکن ذره‌بین
   *  - /cabins : خلاصه‌ی فشرده + دکمه‌ی صریح «تغییر جستجو»
   */
  const mobileTrigger = () =>
    isHero ? (
      <span className="flex w-full items-center gap-3 px-2 py-1.5">
        <span className="flex min-w-0 flex-1 flex-col text-start">
          <span className="text-text text-sm font-extrabold">
            مقصد سفرت کجاست؟
          </span>
          <span className="text-text-gray mt-0.5 truncate text-xs font-medium">
            {mobileSummary}
          </span>
        </span>
        <span className="bg-primary-400 grid size-11 shrink-0 place-items-center rounded-full text-black shadow-sm">
          <SearchIcon className="size-5" />
        </span>
      </span>
    ) : (
      <span className="flex w-full items-center gap-3 px-2 py-1.5">
        <span className="flex min-w-0 flex-1 flex-col text-start">
          <span className="text-text-gray text-xs font-semibold">
            جستجوی شما
          </span>
          <span className="text-text mt-0.5 truncate text-xs font-bold">
            {mobileSummary}
          </span>
        </span>
        <span className="border-primary-400/40 bg-primary-400/10 text-text flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold whitespace-nowrap">
          تغییر جستجو
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
        onMobileApply={handleApply}
        mobileApplyPending={isPending}
        renderMobileTrigger={mobileTrigger}
        mobileTriggerClassName={`w-full rounded-full border py-2 pe-2 ps-4 shadow-lg backdrop-blur-md transition-all duration-200 active:scale-[0.99] ${FOCUS_RING} ${
          isHero
            ? "border-white/15 bg-surface/80 shadow-black/15"
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
          onClick={handleApply}
        />
      </div>
    </div>
  );
}
