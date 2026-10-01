"use client";

import { useState, type ReactNode } from "react";
import { Check, Sparkles, Sofa, Trees, Wifi, type LucideIcon } from "lucide-react";
import Modal from "@/components/ui/Modal";
import {
  AMENITIES_PREVIEW_COUNT,
  groupAmenities,
  SECTION_IDS,
} from "../../constants/cabin-detail";
import SectionShell from "./SectionShell";

const GROUP_ICONS: Record<string, LucideIcon> = {
  outdoor: Trees,
  indoor: Sofa,
  services: Wifi,
  other: Sparkles,
};

type Props = {
  amenities: string[];
};

/**
 * امکانات و ویژگی‌ها.
 *
 * در صفحه فقط `AMENITIES_PREVIEW_COUNT` مورد اول به‌شکل چیپ نمایش داده
 * می‌شود و بقیه پشت دکمه‌ی «مشاهده‌ی همه» می‌مانند — لیست کامل داخل مودال
 * و **دسته‌بندی‌شده** است (فضای باز، فضای داخلی، خدمات، سایر).
 *
 * دکمه با `aria-expanded` وضعیتش را اعلام می‌کند و مودال خودش تله‌ی
 * فوکوس و بستن با Esc را دارد.
 */
export default function AmenitiesSection({ amenities }: Props): ReactNode {
  const [isOpen, setOpen] = useState(false);

  if (amenities.length === 0) {
    return (
      <SectionShell id={SECTION_IDS.amenities} title="امکانات و ویژگی‌ها">
        <p className="text-text-gray text-sm">
          فهرست امکانات این اقامتگاه ثبت نشده است.
        </p>
      </SectionShell>
    );
  }

  const preview = amenities.slice(0, AMENITIES_PREVIEW_COUNT);
  const hasMore = amenities.length > preview.length;
  const groups = groupAmenities(amenities);

  return (
    <SectionShell
      id={SECTION_IDS.amenities}
      title="امکانات و ویژگی‌ها"
      hint={`${amenities.length.toLocaleString("fa-IR")} مورد`}
    >
      <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {preview.map((amenity) => (
          <li key={amenity} className="flex items-center gap-3">
            <span className="bg-primary-400/10 grid size-6 shrink-0 place-items-center rounded-full">
              <Check className="text-primary-400 size-3.5" aria-hidden="true" />
            </span>
            <span className="text-text/70 text-sm">{amenity}</span>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className="border-foreground/15 text-text hover:border-primary-400/50 hover:text-primary-500 mt-5 inline-flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-bold transition-colors"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          {`مشاهده‌ی همه‌ی ${amenities.length.toLocaleString("fa-IR")} امکانات`}
        </button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        size="lg"
        title="همه‌ی امکانات اقامتگاه"
        description="امکانات این اقامتگاه بر اساس نوع، دسته‌بندی شده‌اند."
      >
        <div className="max-h-[60dvh] space-y-6 overflow-y-auto pe-1">
          {groups.map((group) => {
            const Icon = GROUP_ICONS[group.id] ?? Sparkles;

            return (
              <div key={group.id}>
                <h4 className="text-text mb-3 flex items-center gap-2 text-sm font-extrabold">
                  <Icon className="text-primary-400 size-4" aria-hidden="true" />
                  {group.title}
                  <span className="text-text-gray text-xs font-medium">
                    {`(${group.items.length.toLocaleString("fa-IR")} مورد)`}
                  </span>
                </h4>

                <ul className="grid gap-2 sm:grid-cols-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-text/70 flex items-start gap-2 text-sm"
                    >
                      <Check
                        className="text-primary-400 mt-0.5 size-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Modal>
    </SectionShell>
  );
}
