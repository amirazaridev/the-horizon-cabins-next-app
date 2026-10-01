import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import type { Cabin } from "@/features/cabins/types/cabin.types";
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
import RoomsSection from "./RoomsSection";
import RulesSection from "./RulesSection";
import SectionShell from "./SectionShell";
import SpecsGrid from "./SpecsGrid";
import StickyTabs from "./StickyTabs";

type Props = {
  cabin: Cabin;
  /**
   * نام شهر — اندپوینت جزئیات کابین فقط `cityId` می‌دهد (برخلاف اندپوینت
   * لیست که آبجکت `city` را برمی‌گرداند). صفحه در سمت سرور آن را resolve
   * می‌کند و اینجا پاس می‌دهد.
   */
  cityName?: string | null;
};

/**
 * صفحه‌ی جزئیات اقامتگاه.
 *
 * چیدمان از سه تکه ساخته شده:
 *
 *  ۱) **گالری** — بالای همه چیز، داخل کانتینر.
 *  ۲) **نوار تب چسبان** — بین گالری و محتوا، زیر Navbar می‌چسبد و با
 *     Scroll Spy تب فعال را نشان می‌دهد.
 *  ۳) **بدنه** — در دسکتاپ دو ستون: سکشن‌ها + aside رزرو چسبان. در موبایل
 *     یک ستون، به‌همراه نوار ثابت پایین و باتم‌شیت.
 *
 * ⚠️ تفکیک سرور/کلاینت: این کامپوننت و همه‌ی سکشن‌های متنی (توضیحات،
 * مشخصات، اتاق‌ها، قوانین، نقشه) سروری و بدون state هستند و در HTML اولیه
 * رندر می‌شوند. فقط لایه‌ی تعاملی (Provider، تب‌ها، تقویم، امکانات با
 * مودال، نظرات با مرتب‌سازی، aside/نوار/شیت/مودال) کلاینت است.
 *
 * `BookingProvider` کلاینت است ولی `children` را از سرور می‌گیرد؛ پس
 * هیچ‌کدام از سکشن‌های سروری به باندل کلاینت منتقل نمی‌شوند.
 */
export default function CabinDetail({ cabin, cityName }: Props): ReactNode {
  return (
    <BookingProvider cabin={cabin}>
      <Container variant="cabin-detail">
        <section id={SECTION_IDS.gallery} className="hz-scroll-mt">
          <CabinGallery images={cabin.images ?? []} altBase={cabin.name}>
            <GalleryHeader cabin={cabin} cityName={cityName} />
          </CabinGallery>
        </section>
      </Container>

      <StickyTabs />

      <Container variant="cabin-detail">
        <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start lg:gap-8">
          <div className="space-y-10">
            <CabinDescription cabin={cabin} />
            <SpecsGrid cabin={cabin} />
            <RoomsSection cabin={cabin} />
            <AmenitiesSection amenities={cabin.amenities ?? []} />

            <SectionShell
              id={SECTION_IDS.rate}
              title="نرخ و انتخاب تاریخ"
              hint="تاریخ ورود و خروج را انتخاب کنید تا مبلغ کل محاسبه شود"
            >
              <div className="space-y-5">
                <CabinDatePicker />
                <BookingAuthCheck />
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
