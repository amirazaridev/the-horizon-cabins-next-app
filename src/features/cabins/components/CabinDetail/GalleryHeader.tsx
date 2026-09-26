import { MapPin, Star } from "lucide-react";
import type { ReactNode } from "react";
import BadgeTitle from "@/components/ui/BadgeTitle";
import type { Cabin } from "@/features/cabins/types/cabin.types";

type Props = {
  cabin: Cabin;
};

export default function GalleryHeader({ cabin }: Props): ReactNode {
  return (
    <div className="pointer-events-none absolute right-5 bottom-5 left-5 z-10 flex flex-wrap items-end justify-between gap-4 sm:right-8 sm:bottom-8 sm:left-8">
      <div>
        <BadgeTitle className="text-text/80 mb-3 gap-2 px-4 py-1.5 text-xs font-medium">
          <MapPin className="text-primary-400 size-3.5" />
          {cabin.city?.name}
        </BadgeTitle>
        <h1 className="text-text text-3xl font-bold sm:text-4xl md:text-5xl">
          {cabin.name}
          <span className="text-primary-400">.</span>
        </h1>
      </div>

      <BadgeTitle className="gap-x-2 px-4 py-2">
        <Star className="fill-primary-400 text-primary-400 size-4" />
        <span className="text-text font-bold">{cabin.rating}</span>
        {/* <span className="text-text/50 text-sm"></span> */}
      </BadgeTitle>
    </div>
  );
}
