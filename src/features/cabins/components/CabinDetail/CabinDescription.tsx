import type { ReactNode } from "react";
import ExpandableText from "@/components/ui/ExpandableText";
import type { Cabin } from "@/features/cabins/types/cabin.types";
import { SECTION_IDS } from "../../constants/cabin-detail";
import SectionShell from "./SectionShell";

type Props = {
  cabin: Cabin;
};

export default function CabinDescription({ cabin }: Props): ReactNode {
  const description = cabin.description?.trim();

  return (
    <SectionShell
      id={SECTION_IDS.overview}
      title="درباره این اقامتگاه"
      hint={cabin.city?.name ? `اقامتگاه در ${cabin.city.name}` : undefined}
    >
      {description ? (
        <ExpandableText lines={4}>{description}</ExpandableText>
      ) : (
        <p className="text-text-gray text-sm">
          توضیحاتی برای این اقامتگاه ثبت نشده است.
        </p>
      )}
    </SectionShell>
  );
}
