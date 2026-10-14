import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import type { Cabin } from "@/features/cabins/types/cabin.types";
import type { CabinBookingData } from "@/features/cabins/types/cabin-booking.types";
import { SECTION_IDS } from "../../constants/cabin-detail";
import BookingAuthCheck from "../BookingAuthCheck";
import AmenitiesSection from "./AmenitiesSection";
import BookingAside from "./BookingAside";
import BookingProvider from "./BookingProvider";
import BookingSheet from "./BookingSheet";
import BookingSummaryDialog from "./BookingSummaryDialog";
import CabinDatePicker from "./CabinDatePicker";
import CabinDescription from "./CabinDescription";
import CabinGallery from "./CabinGallery";
import GalleryHeader from "./GalleryHeader";
import MapSection from "./MapSection";
import MobileBookingBar from "./MobileBookingBar";
import ReviewsSection from "./ReviewsSection";
import RulesSection from "./RulesSection";
import SectionShell from "./SectionShell";
import SpecsGrid from "./SpecsGrid";
import StickyTabs from "./StickyTabs";

type Props = {
  cabin: Cabin;
  cityName?: string | null;
  booking: CabinBookingData;
  isAuthenticated: boolean;
};

export default function CabinDetail({
  cabin,
  cityName,
  booking,
}: Props): ReactNode {
  return (
    <BookingProvider
      cabin={cabin}
      settings={booking.settings}
      calendarDays={booking.calendarDays}
      bookedRanges={booking.bookedRanges}
    >
      <Container size="wide">
        <section id={SECTION_IDS.gallery} className="hz-scroll-mt">
          <CabinGallery images={cabin.images ?? []} altBase={cabin.name}>
            <GalleryHeader cabin={cabin} cityName={cityName} />
          </CabinGallery>
        </section>
      </Container>

      <StickyTabs />

      <Container size="wide">
        <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start lg:gap-8">
          <div className="space-y-10">
            <CabinDescription cabin={cabin} />
            <SpecsGrid cabin={cabin} />
            <AmenitiesSection amenities={cabin.amenities ?? []} />

            <SectionShell
              id={SECTION_IDS.rate}
              title="نرخ و انتخاب تاریخ"
              hint="تاریخ ورود و خروج را انتخاب کنید تا مبلغ کل محاسبه شود"
            >
              <div className="space-y-5">
                <CabinDatePicker />
              </div>
            </SectionShell>

            <RulesSection />
            <MapSection cabin={cabin} />
            <ReviewsSection cabinId={cabin.id} />
          </div>

          <BookingAside />
        </div>
      </Container>

      {/* لایه‌های موبایل — بیرون از کانتینر تا هیچ والدی آن‌ها را نبرد */}
      <MobileBookingBar />
      <BookingSheet />
      <BookingSummaryDialog />
    </BookingProvider>
  );
}
