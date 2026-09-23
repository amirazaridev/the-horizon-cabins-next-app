import type { ReactNode } from "react";
import BookingPanel from "@/features/cabins/components/CabinDetail/BookingPanel";
import CabinGallery from "@/features/cabins/components/CabinDetail/CabinGallery";
import DateSelectorPanel from "@/features/cabins/components/CabinDetail/DateSelectorPanel";
import type { Cabin } from "@/features/cabins/types/cabin.types";
import CabinDescription from "./CabinDescription";
import GalleryHeader from "./GalleryHeader";
import SpecsGrid from "./SpecsGrid";
import BookingAuthCheck from "../BookingAuthCheck";

type Props = { cabin: Cabin };

export default function CabinDetail({ cabin }: Props): ReactNode {
  const { images } = cabin;

  return (
    <div>
      <CabinGallery images={images} altBase={cabin.name}>
        <GalleryHeader cabin={cabin} />
      </CabinGallery>

      <SpecsGrid cabin={cabin} />

      <div className="mt-12 space-y-10">
        <CabinDescription cabin={cabin} />

        <div className="grid gap-6 lg:grid-cols-5">
          <DateSelectorPanel />
          <BookingPanel cabin={cabin} />
          <BookingAuthCheck />
        </div>
      </div>
    </div>
  );
}
