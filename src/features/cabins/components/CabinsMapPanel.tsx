import { MapPin } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  /** شناسه‌ی اسلات نقشه؛ کتابخانه‌ی نقشه در آینده همین‌جا سوار می‌شود */
  slotId?: string;
  /** قاب گرد و بردر؛ در حالت داک تمام‌قد (fixed) خاموش می‌شود */
  framed?: boolean;
  className?: string;
  children?: ReactNode;
};

/**
 * پنل نمایشی نقشه.
 * فعلاً فقط استایل و جایگاه (slot) آماده است؛ بدون نصب هیچ پکیجی.
 * برای اتصال نقشه‌ی واقعی کافیست آن را داخل `children`
 * یا روی `#slotId` سوار کنید.
 */
export default function CabinsMapPanel({
  slotId = "cabins-map-slot",
  framed = true,
  className = "",
  children,
}: Props) {
  return (
    <div
      className={`bg-background-2 relative overflow-hidden ${
        framed ? "border-foreground/10 rounded-3xl border" : ""
      } ${className}`}
    >
      {/* اسلات نقشه */}
      <div id={slotId} data-map-slot="true" className="absolute inset-0">
        {children ?? <MapPlaceholder />}
      </div>
    </div>
  );
}

function MapPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-border-strong)_1px,transparent_1px)] bg-[size:22px_22px]"
    >
      {/* مسیرهای تزئینی */}
      <div className="bg-foreground/5 absolute top-[18%] -right-10 left-0 h-10 rotate-[-8deg] rounded-full" />
      <div className="bg-foreground/5 absolute top-[55%] -right-10 left-0 h-7 rotate-[6deg] rounded-full" />
      <div className="bg-foreground/5 absolute top-0 bottom-0 left-[30%] w-7 rotate-[12deg] rounded-full" />

      {/* پین‌های تزئینی */}
      <span className="bg-primary-400/70 absolute top-[30%] right-[22%] size-3 rounded-full shadow" />
      <span className="bg-primary-400/50 absolute top-[62%] right-[60%] size-2.5 rounded-full shadow" />
      <span className="bg-primary-400/70 absolute top-[42%] right-[75%] size-2 rounded-full shadow" />

      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="bg-surface/85 border-foreground/10 flex flex-col items-center gap-2 rounded-2xl border px-6 py-5 text-center shadow-xl backdrop-blur-md">
          <span className="bg-primary-400/15 flex size-11 items-center justify-center rounded-full">
            <MapPin className="text-primary-400 size-5" />
          </span>
          <p className="text-text text-sm font-bold">نقشه‌ی تعاملی به‌زودی</p>
          <p className="text-text-gray max-w-55 text-xs leading-5">
            این پنل جایگاه نقشه است؛ پین اقامتگاه‌ها اینجا نمایش داده می‌شود.
          </p>
        </div>
      </div>
    </div>
  );
}
