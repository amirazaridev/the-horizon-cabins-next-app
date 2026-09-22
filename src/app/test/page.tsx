import FilterCard from "@/components/ui/Filter/FilterCard";
import OptionRow from "@/features/cabins/components/filters/OptionRow";
import { MapPin } from "lucide-react";
import { type ReactNode } from "react";

const cities = [{ id: 1, name: "sasa" }];
type City = (typeof cities)[number];

export default function page(): ReactNode {
  return (
    <FilterCard
      items={[
        {
          id: "city",
          label: "تعیین شهر",
          icon: <MapPin className="size-4" />,
          //   formatLabel: (v) => v?.name,          // اسم دکمه عوض میشه
          panel: {
            title: "شهر / مقصد",
            size: "md", // sm | md | lg | auto
            closeOnSelect: true,
            showArrow: true,
            // render: ({ value, setValue, close }) => ( /* فیلترها */ ),
          },
        },
        {
          id: "price",
          label: "بازه قیمت",
          panel: { size: "sm", children: <p>...</p> },
        },
      ]}
      placement="start" // start | center | end
      //   defaultValue={{ city: ... }}
      //   onValueChange={(id, value) => updateQuery(id, value)}
    />
  );
}
