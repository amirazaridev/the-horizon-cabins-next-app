import type { ReactNode } from "react";
import BookingPanel from "@/features/cabins/components/BookingPanel";
import CabinGallery from "@/features/cabins/components/CabinGallery";
import DateSelectorPanel from "@/features/cabins/components/DateSelectorPanel";
import type { Cabin } from "../../lib/data-service";
import CabinDescription from "./CabinDescription";
import GalleryHeader from "./GalleryHeader";
import SpecsGrid from "./SpecsGrid";

type Props = { cabin: Cabin };

export default function CabinDetail({ cabin }: Props): ReactNode {
  const images = cabin.images.length ? cabin.images : [cabin.image];

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
        </div>
      </div>
    </div>
  );
}
