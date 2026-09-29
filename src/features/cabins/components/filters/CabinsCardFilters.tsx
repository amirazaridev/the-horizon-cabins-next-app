"use client";

import { BedDouble, Sparkles, X } from "lucide-react";

import FilterCard, {
  type FilterCardItem,
} from "@/components/ui/Filter/FilterCard";
import { useCabinQuery } from "./useCabinQuery";
import BedroomsPanel from "./panels/BedroomsPanel";
import AmenitiesPanel from "./panels/AmenitiesPanel";

const fa = (n: number | string) => Number(n).toLocaleString("fa-IR");

type Props = {
  amenities: string[];
  className?: string;
  resultCount?: number;
};

/**
 * فیلترهای پیشرفته‌ی `/cabins`.
 *
 * فقط «تعداد خواب» و «امکانات» اینجا هستند. مقصد، تاریخ، تعداد نفرات و
 * بازه‌ی بودجه در نوار جستجوی بالای همین صفحه‌اند؛ نگه‌داشتنشان در هر دو
 * جا باعث تکرار و دو منبع حقیقت می‌شد.
 */
export default function CabinsCardFilters({
  amenities,
  className = "",
  resultCount,
}: Props) {
  const { searchParams, setParam, clearFilters } = useCabinQuery();

  const bedrooms = searchParams.get("bedrooms");
  const amenitiesParam =
    searchParams
      .get("amenities")
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  const handleValueChange = (id: string, next: unknown) => {
    switch (id) {
      case "amenities": {
        const list = (next as string[] | null) ?? [];
        setParam("amenities", list.length ? list.join(",") : null);
        break;
      }
      case "bedrooms":
        setParam("bedrooms", (next as string | null) ?? null);
        break;
    }
  };

  const activeCount = [bedrooms, amenitiesParam.length].filter(Boolean).length;

  const items: FilterCardItem[] = [
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
  ];

  return (
    <div className={`min-w-0 flex-1 items-center gap-2 ${className}`}>
      <FilterCard
        items={items}
        value={{
          bedrooms,
          amenities: amenitiesParam,
        }}
        onValueChange={handleValueChange}
        onClearFilters={clearFilters}
        resultCount={resultCount}
        mobileTitle="فیلترها"
        mobileTriggerLabel="فیلترها"
        mobileApplyLabel="مشاهده نتایج"
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
