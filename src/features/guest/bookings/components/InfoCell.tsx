import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  label: string;
  value: string;
};

/**
 * سلول اطلاعات رزرو (بازه، مدت، مهمان…) — نمایشی و بدون state.
 *
 * ⚠️ از `BookingCard` استخراج شد تا صفحه‌ی پرداخت هم همان ظاهر را داشته
 * باشد و دو نسخه‌ی موازی از این بلوک نداشته باشیم.
 */
export default function InfoCell({ icon, label, value }: Props): ReactNode {
  return (
    <div className="border-foreground/10 bg-foreground/5 flex items-center gap-3 rounded-2xl border px-3.5 py-3">
      <span className="text-primary-400 shrink-0">{icon}</span>
      <span className="min-w-0">
        <span className="text-text-gray block text-[11px]">{label}</span>
        <span className="text-text mt-0.5 block truncate text-sm font-semibold">
          {value}
        </span>
      </span>
    </div>
  );
}
