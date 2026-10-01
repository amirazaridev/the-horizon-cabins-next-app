import { Bath, BedDouble, Maximize, Users, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import CardContainer from "@/components/ui/CardContainer";
import type { Cabin } from "@/features/cabins/types/cabin.types";
import { SECTION_IDS } from "../../constants/cabin-detail";
import SectionShell from "./SectionShell";

type Props = {
  cabin: Cabin;
};

type Spec = {
  icon: LucideIcon;
  value: string;
  label: string;
};

/** خلاصه‌ی مشخصات — نگاه سریع به ظرفیت، اتاق‌ها و متراژ */
export default function SpecsGrid({ cabin }: Props): ReactNode {
  const specs: Spec[] = [
    {
      icon: Users,
      value: cabin.maxCapacity.toLocaleString("fa-IR"),
      label: "نفر ظرفیت",
    },
    {
      icon: BedDouble,
      value: cabin.bedrooms.toLocaleString("fa-IR"),
      label: "اتاق خواب",
    },
    {
      icon: Bath,
      value: cabin.bathrooms.toLocaleString("fa-IR"),
      label: "سرویس بهداشتی",
    },
    {
      icon: Maximize,
      value: cabin.areaSqm.toLocaleString("fa-IR"),
      label: "متر مربع",
    },
  ];

  /**
   * ⚠️ TODO(backend): «نوع اقامتگاه» (ویلا/کابین/اقامتگاه بومگردی) و
   * «تعداد طبقه» در پاسخ اندپوینت کابین وجود ندارد. با اضافه‌شدن فیلد
   * `category` یا `floors`، فقط یک آیتم به آرایه‌ی بالا اضافه می‌شود و
   * گرید خودش ۵ ستونه می‌شود — هیچ کامپوننت دیگری تغییر نمی‌کند.
   */

  return (
    <SectionShell
      id={SECTION_IDS.specs}
      title="خلاصه‌ی مشخصات"
      hint="نگاه سریع به ظرفیت و ابعاد این اقامتگاه"
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {specs.map((spec) => (
          <CardContainer
            key={spec.label}
            className="hover:border-primary-400/30 text-center shadow-md"
          >
            <spec.icon
              className="text-primary-400 mx-auto mb-3 size-6"
              aria-hidden="true"
            />
            <p className="text-text text-2xl font-bold tabular-nums">
              {spec.value}
            </p>
            <p className="text-text-gray mt-1 text-sm">{spec.label}</p>
          </CardContainer>
        ))}
      </div>
    </SectionShell>
  );
}
