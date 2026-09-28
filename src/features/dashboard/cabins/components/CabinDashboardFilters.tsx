"use client";

import {
  ArrowUpDown,
  BedDouble,
  MapPin,
  Sparkles,
  Users,
  Wallet,
  X,
} from "lucide-react";

import FilterCard, {
  type FilterCardItem,
} from "@/components/ui/Filter/FilterCard";
import SingleOptionPanel from "@/components/ui/Filter/panels/SingleOptionPanel";
import GuestsPanel from "@/features/cabins/components/filters/panels/GuestsPanel";
import BedroomsPanel from "@/features/cabins/components/filters/panels/BedroomsPanel";
import AmenitiesPanel from "@/features/cabins/components/filters/panels/AmenitiesPanel";
import PricePanel from "@/features/cabins/components/filters/panels/PricePanel";
import CityPanel from "@/features/cabins/components/filters/panels/CityPanel";
import { formatPriceShort } from "@/features/cabins/utils/cabin-filters";
import { useUrlQuery } from "@/hooks/useUrlQuery";
import {
  DASHBOARD_FILTER_KEYS,
  DASHBOARD_SORT_OPTIONS,
  getParam,
  type CabinsSearchParams,
} from "../lib/operations";

const fa = (n: number | string) => Number(n).toLocaleString("fa-IR");

type Props = {
  cities: { id: number; name: string }[];
  amenities: string[];
  /** searchParams خواندهشده در Server Component — جایگزین useSearchParams */
  searchParams: CabinsSearchParams;
  className?: string;
};

export default function CabinDashboardFilters({
  cities,
  amenities,
  searchParams,
  className = "",
}: Props) {
  const { setParams, clearParams } = useUrlQuery(searchParams);

  const guests = getParam(searchParams, "guests");
  const bedrooms = getParam(searchParams, "bedrooms");
  const amenitiesParam =
    getParam(searchParams, "amenities")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean) ?? [];
  const price = getParam(searchParams, "price");
  const city = getParam(searchParams, "city");
  const sortBy = getParam(searchParams, "sortBy");

  const handleValueChange = (id: string, next: unknown) => {
    switch (id) {
      case "amenities": {
        const list = (next as string[] | null) ?? [];
        setParams({ amenities: list.length ? list.join(",") : null });
        break;
      }
      case "guests":
      case "bedrooms":
      case "price":
      case "city":
      case "sortBy":
        setParams({ [id]: (next as string | null) ?? null });
        break;
    }
  };

  // یک navigation واحد برای همهٔ کلیدها — از تداخلِ دو replace پشتسرهم جلوگیری میکند
  const handleClear = () => clearParams(DASHBOARD_FILTER_KEYS);

  const cityName = city
    ? cities.find((item) => String(item.id) === city)?.name
    : undefined;

  const priceSummary = (() => {
    if (!price) return undefined;
    const [lo, hi] = price.split("-").map(Number);
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) return undefined;
    return `${formatPriceShort(lo)} تا ${formatPriceShort(hi)}`;
  })();

  const sortLabel = sortBy
    ? DASHBOARD_SORT_OPTIONS.find((o) => o.value === sortBy)?.label
    : undefined;

  const activeCount = [guests, bedrooms, amenitiesParam.length, price, city]
    .filter(Boolean).length;

  const items: FilterCardItem[] = [];

  if (cities.length > 0) {
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
            cities={cities}
            value={value as string | null}
            onChange={(next) => setValue(next)}
          />
        ),
      },
    });
  }

  items.push(
    {
      id: "guests",
      label: "ظرفیت",
      icon: <Users className="text-primary-400 size-4" />,
      formatLabel: (v) =>
        (v as string | null) ? `${fa(v as string)} نفر` : undefined,
      panel: {
        title: "ظرفیت (حداقل نفرات)",
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
            amenities={amenities}
            value={(value as string[] | null) ?? []}
            onChange={(next) => setValue(next)}
          />
        ),
      },
    },
    {
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
            value={value as string | null}
            onChange={(next) => setValue(next)}
          />
        ),
      },
    },
    {
      id: "sortBy",
      label: "مرتبسازی",
      icon: <ArrowUpDown className="text-primary-400 size-4" />,
      formatLabel: () => sortLabel,
      panel: {
        title: "مرتبسازی",
        size: "sm",
        closeOnSelect: true,
        render: ({ value, setValue }) => (
          <SingleOptionPanel
            value={(value as string | null) ?? null}
            onChange={(next) => setValue(next)}
            allOption={{ label: "پیشفرض", hint: "ترتیب ثبت در سیستم" }}
            options={DASHBOARD_SORT_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
          />
        ),
      },
    },
  );

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <FilterCard
        items={items}
        value={{
          city,
          guests,
          bedrooms,
          amenities: amenitiesParam,
          price,
          sortBy,
        }}
        onValueChange={handleValueChange}
        onClearFilters={handleClear}
        mobileTitle="فیلترها"
        mobileApplyLabel="اعمال"
        className="border-foreground/10 bg-surface/80 flex min-w-0 flex-1 scrollbar-none items-center gap-2 overflow-x-auto rounded-2xl border p-1.5 shadow-sm backdrop-blur-md [&::-webkit-scrollbar]:hidden"
      />

      {activeCount > 0 && (
        <button
          type="button"
          onClick={handleClear}
          className="text-text-gray hover:text-danger hover:bg-danger/10 flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors"
        >
          <X className="size-4" />
          حذف فیلترها
        </button>
      )}
    </div>
  );
}
