"use client";

import Filter from "@/components/ui/Filter";
import { PARAM_STATUS } from "../../hooks/useDashboardFilters";

export default function StatusFilter() {
  return (
    <Filter
      filterField={PARAM_STATUS}
      filterOptions={[
        { value: "all", title: "همه" },
        { value: "confirmed", title: "تایید شده" },
        { value: "checked-out", title: "خروج کرده" },
        { value: "unconfirmed", title: "در انتظار" },
      ]}
    />
  );
}