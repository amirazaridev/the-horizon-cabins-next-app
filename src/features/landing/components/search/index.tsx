"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  CalendarDays,
  ChevronDown,
  MapPin,
  Search as SearchIcon,
  Users,
} from "lucide-react";

import FilterCard, {
  type FilterCardItem,
  type FilterCardValues,
} from "@/components/ui/filter/FilterCard";
import {
  formatJalaliDate,
  type DateRange,
} from "@/components/ui/RangeDatePicker";
import { SEARCH_CITIES, type SearchCity } from "../../constants/search";
import CityPanel from "@/components/ui/filter/panels/CityPanel";
import DateRangePanel from "@/components/ui/filter/panels/DateRangePanel";
import GuestsPanel from "./search-panels/GuestsPanel";
import SearchAction from "./SearchAction";
import FieldContent from "./FieldContent";

type SearchValues = {
  city: SearchCity | null;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number | null;
};

const DEFAULT_VALUES: SearchValues = {
  city: null,
  checkIn: null,
  checkOut: null,
  guests: null,
};

export default function Search() {
  const [values, setValues] = useState<SearchValues>(DEFAULT_VALUES);
  const router = useRouter();

  const handleValueChange = (id: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [id]: value }) as SearchValues);
  };

  const canSearch = Boolean(
    values.city &&
    values.checkIn &&
    values.checkOut &&
    typeof values.guests === "number" &&
    values.guests >= 1,
  );

  const href = useMemo(() => {
    const params = new URLSearchParams();
    if (values.city) params.set("city", String(values.city.id));
    params.set("guests", String(values.guests));
    if (values.checkIn)
      params.set("checkIn", format(values.checkIn, "yyyy-MM-dd"));
    if (values.checkOut)
      params.set("checkOut", format(values.checkOut, "yyyy-MM-dd"));
    return `/cabins?${params.toString()}`;
  }, [values]);

  /* خلاصه موبایل: شهر · بازه تاریخ · مهمان */
  const mobileDateSummary = (() => {
    if (values.checkIn && values.checkOut)
      return `${formatJalaliDate(values.checkIn)} تا ${formatJalaliDate(values.checkOut)}`;
    if (values.checkIn) return formatJalaliDate(values.checkIn);
    if (values.checkOut) return formatJalaliDate(values.checkOut);
    return null;
  })();

  const mobileGuestSummary =
    typeof values.guests === "number" && values.guests >= 1
      ? `${values.guests.toLocaleString("fa-IR")} نفر`
      : null;

  const mobileSummary =
    [values.city?.name ?? null, mobileDateSummary, mobileGuestSummary]
      .filter(Boolean)
      .join("  ·  ") || "مقصد، تاریخ و مهمان را انتخاب کنید";

  const items: FilterCardItem[] = [
    {
      id: "city",
      label: "مثال: شمال ایران",
      variant: "field",
      formatLabel: (v) => (v as SearchCity | null)?.name,
      className: "md:rounded-none",
      renderTrigger: ({ value }) => (
        <FieldContent
          icon={<MapPin className="size-4" />}
          label="مقصد"
          value={(value as SearchCity | null)?.name}
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
          <CityPanel
            cities={SEARCH_CITIES.map((city) => ({
              value: String(city.id),
              label: city.name,
              hint: city.hint,
            }))}
            value={value != null ? String((value as SearchCity).id) : null}
            onChange={(next) => {
              const city =
                SEARCH_CITIES.find((item) => String(item.id) === next) ?? null;
              setValue(city);
            }}
          />
        ),
      },
    },
    {
      id: "checkIn",
      label: "تاریخ ورود",
      variant: "field",
      formatLabel: () => mobileDateSummary ?? undefined,
      className: "md:rounded-none md:border-s md:border-white/10",
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
      hideOnMobile: true,
      className: "md:rounded-none md:border-s md:border-white/10",
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
      formatLabel: (v) =>
        typeof v === "number" && v >= 1
          ? `${v.toLocaleString("fa-IR")} نفر`
          : undefined,
      className: "md:rounded-none md:border-s md:border-white/10",
      renderTrigger: ({ value }) => (
        <FieldContent
          icon={<Users className="size-4" />}
          label="مهمان"
          value={
            (value as null) &&
            `${(value as number).toLocaleString("fa-IR")} نفر`
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
            value={value as number}
            onChange={setValue}
            onDone={close}
          />
        ),
      },
    },
  ];

  /** کارت مشترک تاریخ ورود/خروج: یک تقویم دوقلو که هر دو فیلد را پر می‌کند */
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

  return (
    <div className="hz-search text-text md:bg-background/60 mx-auto flex max-w-255 flex-col gap-2 rounded-none border-0 bg-transparent p-0 shadow-none backdrop-blur-none md:flex-row md:items-center md:gap-0 md:rounded-2xl md:border md:border-white/15 md:p-2 md:shadow-2xl md:shadow-black/20 md:backdrop-blur-xl">
      <FilterCard
        items={items}
        value={values as unknown as FilterCardValues}
        onValueChange={handleValueChange}
        onClearFilters={() => setValues(DEFAULT_VALUES)}
        placement="center"
        mobileTitle="جستجوی اقامتگاه"
        mobileApplyLabel="جستجو"
        mobileApplyDisabled={!canSearch}
        onMobileApply={() => router.push(href)}
        renderMobileTrigger={() => (
          <span className="flex w-full items-center gap-3 px-2 py-1.5">
            <span className="flex min-w-0 flex-1 flex-col text-right">
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
        )}
        mobileTriggerClassName="w-full rounded-full border border-white/15 bg-surface/80 py-2 pe-2 ps-4 shadow-lg shadow-black/15 backdrop-blur-md transition-all duration-200 active:scale-[0.99]"
        className="text-text grid min-w-0 flex-1 grid-cols-1 gap-1 md:grid-cols-4 md:gap-0"
      />

      <div className="hidden md:block">
        <SearchAction href={href} disabled={!canSearch} />
      </div>
    </div>
  );
}
