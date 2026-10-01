import Image from "next/image";
import { BedDouble, ImageOff, Maximize, Users } from "lucide-react";
import type { ReactNode } from "react";
import type { Cabin } from "@/features/cabins/types/cabin.types";
import { buildRooms, SECTION_IDS } from "../../constants/cabin-detail";
import SectionShell from "./SectionShell";

type Props = {
  cabin: Cabin;
};

/**
 * اتاق‌ها و دسته‌بندی.
 *
 * ⚠️ منبع داده فعلاً `buildRooms(cabin)` است (ماک تایپ‌شده بر پایه‌ی
 * تعداد اتاق خواب). با اضافه‌شدن اندپوینت اتاق‌ها در بک‌اند، همین یک
 * خط عوض می‌شود و کل سکشن بدون تغییر باقی می‌ماند.
 */
export default function RoomsSection({ cabin }: Props): ReactNode {
  const rooms = buildRooms(cabin);

  return (
    <SectionShell
      id={SECTION_IDS.rooms}
      title="اتاق‌ها و دسته‌بندی"
      hint={
        rooms.length > 0
          ? `${rooms.length.toLocaleString("fa-IR")} اتاق با چیدمان و ظرفیت مشخص`
          : undefined
      }
    >
      {rooms.length === 0 ? (
        <div className="border-foreground/10 bg-surface-raised/50 text-text-gray flex flex-col items-center gap-2 rounded-3xl border border-dashed px-6 py-12 text-center">
          <BedDouble className="size-7" aria-hidden="true" />
          <p className="text-sm">اطلاعات اتاق‌ها برای این اقامتگاه ثبت نشده است.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {rooms.map((room) => (
            <article
              key={room.id}
              className="border-foreground/10 bg-surface group overflow-hidden rounded-3xl border shadow-md transition-all duration-500 hover:border-primary-400/30"
            >
              <div className="bg-background-2 relative aspect-16/10 overflow-hidden">
                {room.image ? (
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="text-text-gray grid h-full place-items-center">
                    <ImageOff className="size-6" aria-hidden="true" />
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-text font-bold">{room.name}</h3>

                <div className="text-text-gray mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <span className="flex items-center gap-1.5">
                    <Users className="size-3.5" aria-hidden="true" />
                    {`ظرفیت ${room.capacity.toLocaleString("fa-IR")} نفر`}
                  </span>

                  {room.sizeSqm !== null && (
                    <span className="flex items-center gap-1.5">
                      <Maximize className="size-3.5" aria-hidden="true" />
                      {`${room.sizeSqm.toLocaleString("fa-IR")} متر مربع`}
                    </span>
                  )}
                </div>

                <ul className="mt-4 space-y-2">
                  {room.beds.map((bed) => (
                    <li
                      key={bed.id}
                      className="text-text/70 flex items-center gap-2 text-sm"
                    >
                      <BedDouble
                        className="text-primary-400 size-4 shrink-0"
                        aria-hidden="true"
                      />
                      {`${bed.count.toLocaleString("fa-IR")} × ${bed.label}`}
                    </li>
                  ))}
                </ul>

                {room.amenities.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {room.amenities.map((amenity) => (
                      <li
                        key={amenity}
                        className="border-foreground/10 bg-background-2 text-text-gray rounded-full border px-3 py-1 text-xs"
                      >
                        {amenity}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </SectionShell>
  );
}
