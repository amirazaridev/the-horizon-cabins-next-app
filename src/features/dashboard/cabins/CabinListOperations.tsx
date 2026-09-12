import Filter from "@/components/ui/Filter";
import SortBy from "@/components/ui/SortBy";
import { type ReactNode } from "react";

export default function CabinListOperations(): ReactNode {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:justify-between md:gap-x-3 lg:gap-x-7">
      <div className="flex">

      <Filter
        filterField="discount"
        filterOptions={[
          { value: "all", title: "همه" },
          { value: "no-discount", title: "تخفیف دار ها" },
          { value: "with-discount", title: "بدون تخفیف ها" },
        ]}
      />
      </div>
      <SortBy
        options={[
          { value: "name-asc", label: "مرتب‌سازی بر اساس نام (صعودی)" },
          { value: "name-desc", label: "مرتب‌سازی بر اساس نام (نزولی)" },
          { value: "regularPrice-asc", label: "مرتب بر اساس مبلغ (صعودی)" },
          { value: "regularPrice-desc", label: "مرتب بر اساس مبلغ (نزولی)" },
          {
            value: "maxCapacity-asc",
            label: "مرتب‌سازی بر اساس ظرفیت (صعودی)",
          },
          {
            value: "maxCapacity-desc",
            label: "مرتب‌سازی بر اساس ظرفیت (نزولی)",
          },
        ]}
      />
    </div>
  );
}
