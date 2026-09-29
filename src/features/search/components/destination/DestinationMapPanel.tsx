"use client";

import { MapPin } from "lucide-react";

import CabinsMapPanel from "@/features/cabins/components/CabinsMapPanel";
import type { City } from "@/features/cabins/types/city.types";
import type { Destination } from "../../types/search.types";
import { regionAllCitiesLabel } from "../../constants/regions";

type Props = {
  cities: City[];
  destination: Destination | null;
  className?: string;
};

/** جایگاه‌های ثابت پین‌ها — تا رندر دوباره پین‌ها نپرند */
const PIN_SLOTS = [
  { top: "24%", right: "20%" },
  { top: "38%", right: "58%" },
  { top: "30%", right: "78%" },
  { top: "58%", right: "34%" },
  { top: "66%", right: "66%" },
  { top: "48%", right: "12%" },
  { top: "74%", right: "46%" },
  { top: "18%", right: "44%" },
];

/**
 * پنل نقشه‌ی مقصد — «جای‌گاه» نقشه، نه نقشه‌ی واقعی.
 *
 * هیچ کتابخانه‌ی نقشه‌ای نصب نشده و هیچ tile واقعی لود نمی‌شود.
 * قاب و اسلاتِ نقشه از `CabinsMapPanel` موجود پروژه استفاده می‌کند تا
 * بعداً فقط یک provider واقعی روی همین `slotId` سوار شود.
 */
export default function DestinationMapPanel({
  cities,
  destination,
  className = "",
}: Props) {
  const pins = cities.slice(0, PIN_SLOTS.length);

  const caption =
    destination?.type === "region"
      ? regionAllCitiesLabel(destination.name)
      : (destination?.name ?? null);

  return (
    <CabinsMapPanel
      slotId="search-destination-map-slot"
      framed={false}
      className={`border-foreground/10 h-72 w-full rounded-2xl border ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-border-strong)_1px,transparent_1px)] bg-[size:22px_22px]"
      >
        {/* مسیرهای تزئینی */}
        <span className="bg-foreground/5 absolute top-[22%] -right-10 left-0 h-9 rotate-[-8deg] rounded-full" />
        <span className="bg-foreground/5 absolute top-[58%] -right-10 left-0 h-7 rotate-[6deg] rounded-full" />
        <span className="bg-foreground/5 absolute top-0 bottom-0 left-[32%] w-7 rotate-[12deg] rounded-full" />

        {pins.map((city, index) => (
          <span
            key={city.id}
            style={PIN_SLOTS[index]}
            className="absolute grid size-6 -translate-y-1/2 place-items-center rounded-full bg-primary-400 text-black shadow-md ring-2 ring-white/70"
          >
            <MapPin className="size-3.5" />
          </span>
        ))}
      </div>

      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
        <span className="bg-surface/90 border-foreground/10 text-text rounded-xl border px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur-md">
          {pins.length > 0
            ? `${pins.length.toLocaleString("fa-IR")} مقصد روی نقشه`
            : "مقصدی برای نمایش نیست"}
        </span>

        {caption && (
          <span className="bg-primary-400 text-black rounded-xl px-3 py-1.5 text-xs font-bold shadow-sm">
            {caption}
          </span>
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="bg-surface/85 border-foreground/10 flex max-w-64 flex-col items-center gap-2 rounded-2xl border px-5 py-4 text-center shadow-xl backdrop-blur-md">
          <span className="bg-primary-400/15 grid size-10 place-items-center rounded-full">
            <MapPin className="text-primary-400 size-5" />
          </span>
          <p className="text-text text-sm font-bold">نقشه‌ی تعاملی به‌زودی</p>
          <p className="text-text-gray text-xs leading-5">
            این پنل جای‌گاه نقشه است؛ انتخاب مقصد فعلاً از مسیر «جستجو» انجام
            می‌شود.
          </p>
        </div>
      </div>
    </CabinsMapPanel>
  );
}
