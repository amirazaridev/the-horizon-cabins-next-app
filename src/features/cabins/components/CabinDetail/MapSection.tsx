import { Map, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import type { Cabin } from "@/features/cabins/types/cabin.types";
import { SECTION_IDS } from "../../constants/cabin-detail";
import SectionShell from "./SectionShell";

type Props = {
  cabin: Cabin;
};

/**
 * نقشه — فعلاً یک پنل خالی با نسبت تصویر مناسب.
 *
 * ارتفاع رزرو شده (`aspect-16/9`) عمدی است: وقتی نقشه‌ی واقعی اضافه شد،
 * چیدمان صفحه جهش نمی‌کند. مختصات اقامتگاه از بک‌اند می‌آید و همین حالا
 * نمایش داده می‌شود تا پنل کاملاً توخالی نباشد.
 *
 * TODO(feature): جای این پنل، کامپوننت نقشه (بدون کتابخانه‌ی جدید، مثلاً
 * `iframe` نقشه یا SVG سبک) قرار می‌گیرد.
 */
export default function MapSection({ cabin }: Props): ReactNode {
  const hasCoordinates =
    typeof cabin.latitude === "number" && typeof cabin.longitude === "number";

  return (
    <SectionShell
      id={SECTION_IDS.map}
      title="موقعیت روی نقشه"
      hint={cabin.city?.name ? `محدوده‌ی ${cabin.city.name}` : undefined}
    >
      <div className="border-foreground/10 bg-surface-raised/40 relative aspect-16/9 w-full overflow-hidden rounded-3xl border border-dashed">
        <div className="text-text-gray absolute inset-0 grid place-items-center px-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <span className="bg-background-2 border-foreground/10 grid size-14 place-items-center rounded-2xl border">
              <Map className="size-6" aria-hidden="true" />
            </span>
            <p className="text-text text-sm font-bold">نقشه به‌زودی</p>
            <p className="max-w-sm text-xs leading-relaxed">
              موقعیت دقیق این اقامتگاه پس از رزرو و تأیید میزبان برای شما
              نمایش داده می‌شود.
            </p>

            {hasCoordinates && (
              <p className="text-text-gray/80 mt-1 flex items-center gap-1.5 text-[11px] tabular-nums">
                <MapPin className="size-3.5" aria-hidden="true" />
                {`${cabin.latitude?.toFixed(3)} , ${cabin.longitude?.toFixed(3)}`}
              </p>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
