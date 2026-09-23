import { Bath, BedDouble, Maximize, Users } from "lucide-react";
import type { ReactNode } from "react";
import CardContainer from "@/components/ui/CardContainer";
import type { Cabin } from "@/features/cabins/types/cabin.types";

type Props = {
  cabin: Cabin;
};

export default function SpecsGrid({ cabin }: Props): ReactNode {
  const specs = [
    { icon: Users, value: `${cabin.maxCapacity}`, label: "نفر ظرفیت" },
    { icon: BedDouble, value: `${cabin.bedrooms}`, label: "اتاق خواب" },
    { icon: Bath, value: `${cabin.bathrooms}`, label: "سرویس بهداشتی" },
    { icon: Maximize, value: `${cabin.areaSqm}`, label: "متر مربع" },
  ];

  return (
    <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {specs.map((spec) => (
        <CardContainer
          key={spec.label}
          className="hover:border-primary-400/30 text-center shadow-md"
        >
          <spec.icon className="text-primary-400 mx-auto mb-3 size-6" />
          <p className="text-2xl font-bold text-text">{spec.value}</p>
          <p className="mt-1 text-sm text-text-gray">{spec.label}</p>
        </CardContainer>
      ))}
    </div>
  );
}
