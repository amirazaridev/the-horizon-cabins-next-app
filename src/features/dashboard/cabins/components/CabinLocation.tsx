import { MapPin, Navigation } from "lucide-react";
import type { ReactNode } from "react";
import type { Cabin } from "@/features/cabins/lib/data-service";
import CardDashContainer from "../../shared/components/CardDashContainer";

/**
 * جایگاه نمایش موقعیت مکانی — آماده برای نقشه.
 * وقتی فیلد location از API آمد، بلوک if اجرا می‌شود؛
 * تا آن زمان Placeholder نمایش داده می‌شود.
 */
export default function CabinLocation({ cabin }: { cabin: Cabin }): ReactNode {
  return (
    <section>
      <h2 className="text-text mb-4 text-xl font-bold">موقعیت مکانی</h2>

      {cabin.location ? (
        <CardDashContainer className="flex flex-col gap-3 p-5">
          {cabin.location.address && (
            <p className="text-text flex items-center gap-2 text-sm">
              <MapPin className="text-primary-400 size-4" />
              {cabin.location.address}
            </p>
          )}
          {/* TODO: نقشه را با lat / lng رندر کنید */}
          <div className="bg-background-2 text-text-gray grid h-56 place-items-center rounded-xl text-sm">
            نقشه — به زودی
          </div>
        </CardDashContainer>
      ) : (
        <div className="border-border bg-background-2/50 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 text-center">
          <Navigation className="text-text-gray size-8" />
          <p className="text-text font-medium">موقعیت مکانی ثبت نشده است</p>
          <p className="text-text-gray text-sm">
            وقتی API مختصات (lat / lng) آماده شد، نقشه همین‌جا نمایش داده
            می‌شود.
          </p>
        </div>
      )}
    </section>
  );
}
