import Filter from "@/components/ui/Filter";
import SortBy from "@/components/ui/SortBy";
import { type ReactNode } from "react";
import CityFilter from "./CityFilter";
import { getCities } from "@/features/cabins/api";

export default async function CabinListOperations(): Promise<ReactNode> {
  const cities = await getCities();

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* <Filter
        filterField="discount"
        filterOptions={[
          { value: "all", title: "همه" },
          { value: "with-discount", title: "تخفیف‌دار" },
          { value: "no-discount", title: "بدون تخفیف" },
        ]}
      /> */}

      {/* <Filter
        filterField="capacity"
        filterOptions={[
          { value: "all", title: "همه ظرفیت‌ها" },
          { value: "small", title: "کوچک (تا ۳ نفر)" },
          { value: "medium", title: "متوسط (۴ تا ۷ نفر)" },
          { value: "large", title: "بزرگ (۸ نفر و بیشتر)" },
        ]}
      /> */}

      <div className="mr-auto space-y-5">
      <CityFilter cities={cities} value="" />
        <SortBy
          options={[
            { value: "name-asc", label: "نام (صعودی)" },
            { value: "name-desc", label: "نام (نزولی)" },
            { value: "regularPrice-asc", label: "مبلغ (ارزان‌ترین)" },
            { value: "regularPrice-desc", label: "مبلغ (گران‌ترین)" },
            { value: "maxCapacity-asc", label: "ظرفیت (کمترین)" },
            { value: "maxCapacity-desc", label: "ظرفیت (بیشترین)" },
          ]}
        />
      </div>
    </div>
  );
}
