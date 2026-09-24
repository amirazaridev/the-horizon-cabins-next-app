"use client";

import {
  BedDouble,
  CalendarDays,
  MapPin,
  Sparkles,
  Users,
  Wallet,
  X,
} from "lucide-react";

import FilterCard, {
  type FilterCardItem,
} from "@/components/ui/filter/FilterCard";
import {
  formatPriceShort,
  type CabinFilterOptions,
} from "../../utils/cabin-filters";
import {
  formatDateRangeLabel,
  type CabinDateValue,
} from "../../utils/cabin-date";
import { useCabinQuery } from "./useCabinQuery";
import DatePanel from "./panels/DatePanel";
import GuestsPanel from "./panels/GuestsPanel";
import BedroomsPanel from "./panels/BedroomsPanel";
import AmenitiesPanel from "./panels/AmenitiesPanel";
import PricePanel from "./panels/PricePanel";
import CityPanel from "./panels/CityPanel";

const fa = (n: number | string) => Number(n).toLocaleString("fa-IR");

type Props = {
  options: CabinFilterOptions;
  className?: string;
};

/**
 * فیلترهای دسکتاپ صفحه cabins بر پایه FilterCard عمومی.
 *
 * controlled از URL: مقدار هر آیتم از searchParams خوانده و
 * هر تغییر با setParam/setParams به URL نوشته می‌شود (الگوی FilterBar داشبورد).
 * فقط در lg به بالا نمایش داده می‌شود؛ موبایل bottom-sheet قبلی را دارد.
 */
export default function CabinsDesktopFilters({
  options,
  className = "",
}: Props) {
  const { searchParams, setParam, setParams, clearFilters } = useCabinQuery();

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");
  const bedrooms = searchParams.get("bedrooms");
  const amenities =
    searchParams
      .get("amenities")
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) ?? [];
  const price = searchParams.get("price");
  const city = searchParams.get("city");

  /** تاریخِ خالی (هر دو null) یعنی null تا دکمه حالت idle بماند */
  const dateValue: CabinDateValue | null =
    checkIn || checkOut ? { checkIn, checkOut } : null;

  const handleValueChange = (id: string, next: unknown) => {
    switch (id) {
      case "date": {
        const range = (next as CabinDateValue | null) ?? {
          checkIn: null,
          checkOut: null,
        };
        setParams({ checkIn: range.checkIn, checkOut: range.checkOut });
        break;
      }
      case "amenities": {
        const list = (next as string[] | null) ?? [];
        setParam("amenities", list.length ? list.join(",") : null);
        break;
      }
      case "guests":
      case "bedrooms":
      case "price":
      case "city":
        setParam(id, (next as string | null) ?? null);
        break;
    }
  };

  const cityName = city
    ? options.cities.find((item) => String(item.id) === city)?.name
    : undefined;

  const priceSummary = (() => {
    if (!price) return undefined;
    const [lo, hi] = price.split("-").map(Number);
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) return undefined;
    const bucket = options.priceBuckets.find(
      (item) => item.value[0] === lo && item.value[1] === hi,
    );
    return (
      bucket?.label ?? `${formatPriceShort(lo)} تا ${formatPriceShort(hi)}`
    );
  })();

  const activeCount = [
    checkIn ?? checkOut,
    guests,
    bedrooms,
    amenities.length,
    price,
    city,
  ].filter(Boolean).length;

  const items: FilterCardItem[] = [
    {
      id: "date",
      label: "تاریخ سفر",
      icon: <CalendarDays className="text-primary-400 size-4" />,
      formatLabel: (v) => {
        const range = v as CabinDateValue | null;
        if (!range) return undefined;
        return formatDateRangeLabel(range.checkIn, range.checkOut);
      },
      panel: {
        title: "تاریخ سفر",
        size: "xl",
        render: ({ value, setValue, close }) => (
          <DatePanel
            value={
              (value as CabinDateValue | null) ?? {
                checkIn: null,
                checkOut: null,
              }
            }
            onChange={(range) => setValue(range)}
            onDone={close}
          />
        ),
      },
    },
    {
      id: "guests",
      label: "تعداد نفرات",
      icon: <Users className="text-primary-400 size-4" />,
      formatLabel: (v) =>
        (v as string | null) ? `${fa(v as string)} نفر` : undefined,
      panel: {
        title: "تعداد نفرات",
        size: "sm",
        closeOnSelect: true,
        render: ({ value, setValue }) => (
          <GuestsPanel
            value={value as string | null}
            onChange={(next) => setValue(next)}
          />
        ),
      },
    },
    {
      id: "bedrooms",
      label: "تعداد خواب",
      icon: <BedDouble className="text-primary-400 size-4" />,
      formatLabel: (v) =>
        (v as string | null) ? `${fa(v as string)} خوابه` : undefined,
      panel: {
        title: "تعداد خواب",
        size: "sm",
        closeOnSelect: true,
        render: ({ value, setValue }) => (
          <BedroomsPanel
            value={value as string | null}
            onChange={(next) => setValue(next)}
          />
        ),
      },
    },
    {
      id: "amenities",
      label: "امکانات",
      icon: <Sparkles className="text-primary-400 size-4" />,
      formatLabel: (v) => {
        const list = (v as string[] | null) ?? [];
        return list.length ? `${fa(list.length)} مورد` : undefined;
      },
      panel: {
        title: "امکانات اقامتگاه",
        size: "md",
        render: ({ value, setValue }) => (
          <AmenitiesPanel
            options={options}
            value={(value as string[] | null) ?? []}
            onChange={(next) => setValue(next)}
          />
        ),
      },
    },
  ];

  if (options.priceBuckets.length > 0) {
    items.push({
      id: "price",
      label: "بازه قیمت",
      icon: <Wallet className="text-primary-400 size-4" />,
      formatLabel: () => priceSummary,
      panel: {
        title: "بازه قیمت هر شب",
        size: "md",
        closeOnSelect: true,
        render: ({ value, setValue }) => (
          <PricePanel
            options={options}
            value={value as string | null}
            onChange={(next) => setValue(next)}
          />
        ),
      },
    });
  }

  if (options.cities.length > 0) {
    items.push({
      id: "city",
      label: "شهر / مقصد",
      icon: <MapPin className="text-primary-400 size-4" />,
      formatLabel: () => cityName,
      panel: {
        title: "شهر / مقصد",
        size: "md",
        closeOnSelect: true,
        render: ({ value, setValue }) => (
          <CityPanel
            options={options}
            value={value as string | null}
            onChange={(next) => setValue(next)}
          />
        ),
      },
    });
  }

  return (
    <div className={`min-w-0 flex-1 items-center gap-2 ${className}`}>
      <FilterCard
        items={items}
        value={{
          date: dateValue,
          guests,
          bedrooms,
          amenities,
          price,
          city,
        }}
        onValueChange={handleValueChange}
        className="bg-surface/80 border-foreground/10 flex min-w-0 flex-1 scrollbar-none items-center gap-2 overflow-x-auto rounded-2xl border p-1.5 shadow-sm backdrop-blur-md [&::-webkit-scrollbar]:hidden"
      />

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearFilters}
          className="text-text-gray hover:text-danger hover:bg-danger/10 flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors"
        >
          <X className="size-4" />
          حذف فیلترها
        </button>
      )}
    </div>
  );
}
