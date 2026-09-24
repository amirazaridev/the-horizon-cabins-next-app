"use client";

import { useEffect, useRef } from "react";
import { List, X } from "lucide-react";
import type { CabinFilterOptions } from "../../utils/cabin-filters";
import { useCabinQuery } from "./useCabinQuery";
import BedroomsPanel from "./panels/BedroomsPanel";
import AmenitiesPanel from "./panels/AmenitiesPanel";
import PricePanel from "./panels/PricePanel";
import CityPanel from "./panels/CityPanel";

const CLOSE_THRESHOLD = 96;

type Props = {
  options: CabinFilterOptions;
  resultCount: number;
  open: boolean;
  onClose: () => void;
};

type Section = {
  id: string;
  title: string;
  body: React.ReactNode;
};

/** شیت «سایر فیلترها» — فقط زیر lg؛ همه فیلترهای مخفی موبایل اینجاست */
export default function MoreFiltersSheet({
  options,
  resultCount,
  open,
  onClose,
}: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const sections: Section[] = [
    { id: "bedrooms", title: "تعداد خواب", body: <BedroomsPanel /> },
    {
      id: "amenities",
      title: "امکانات اقامتگاه",
      body: <AmenitiesPanel options={options} />,
    },
  ];
  if (options.priceBuckets.length > 0) {
    sections.push({
      id: "price",
      title: "بازه قیمت هر شب",
      body: <PricePanel options={options} />,
    });
  }
  if (options.cities.length > 0) {
    sections.push({
      id: "city",
      title: "شهر / مقصد",
      body: <CityPanel options={options} />,
    });
  }

  const handleMove = (clientY: number) => {
    if (dragStartY.current === null || !sheetRef.current) return;
    const dy = clientY - dragStartY.current;
    if (dy > 0) sheetRef.current.style.transform = `translateY(${dy}px)`;
  };

  const handleUp = (clientY: number) => {
    if (dragStartY.current === null) return;
    const dy = clientY - dragStartY.current;
    dragStartY.current = null;
    if (sheetRef.current) sheetRef.current.style.transform = "";
    if (dy > CLOSE_THRESHOLD) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="سایر فیلترها"
      className="fixed inset-0 z-70 lg:hidden"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />

      <div
        ref={sheetRef}
        className="bg-surface absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-3xl shadow-2xl transition-transform duration-300 motion-reduce:transition-none"
      >
        <div
          aria-hidden="true"
          onPointerDown={(e) => {
            dragStartY.current = e.clientY;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (e.pressure > 0) handleMove(e.clientY);
          }}
          onPointerUp={(e) => handleUp(e.clientY)}
          onPointerCancel={() => {
            dragStartY.current = null;
            if (sheetRef.current) sheetRef.current.style.transform = "";
          }}
          className="flex cursor-grab touch-none justify-center py-3 active:cursor-grabbing"
        >
          <span className="bg-foreground/15 h-1.5 w-12 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3">
          <p className="text-text text-base font-extrabold">سایر فیلترها</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن فیلترها"
            className="text-text hover:bg-foreground/5 flex size-9 items-center justify-center rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pb-4">
          {sections.map((section) => (
            <section key={section.id}>
              <h3 className="text-text mb-2.5 text-sm font-extrabold">
                {section.title}
              </h3>
              {section.body}
            </section>
          ))}
        </div>

        <SheetFooter resultCount={resultCount} onClose={onClose} />
      </div>
    </div>
  );
}

function SheetFooter({
  resultCount,
  onClose,
}: {
  resultCount: number;
  onClose: () => void;
}) {
  const { clearFilters } = useCabinQuery();
  return (
    <div className="border-foreground/10 border-t px-5 py-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={clearFilters}
          className="text-text-gray border-foreground/10 hover:text-text flex-1 rounded-xl border py-3 text-sm font-bold transition-colors"
        >
          حذف فیلترها
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-primary-400 flex flex-[2] items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-black transition-transform active:scale-95"
        >
          <List className="size-4" />
          مشاهده نتایج
          <span className="rounded-full bg-black/15 px-2 py-0.5 text-xs font-bold tabular-nums">
            {resultCount.toLocaleString("fa-IR")}
          </span>
        </button>
      </div>
    </div>
  );
}
