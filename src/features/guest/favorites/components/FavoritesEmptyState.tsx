import { Heart, HeartHandshake, Search, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import Button from "@/components/ui/Button";

/** ویژگی‌های کوتاه لیست علاقه‌مندی‌ها — برای پرکردن معنادار حالت خالی. */
const HINTS = [
  {
    icon: Heart,
    title: "با یک کلیک ذخیره کنید",
    description: "روی آیکون قلب هر اقامتگاه بزنید تا اینجا ذخیره شود.",
  },
  {
    icon: Search,
    title: "سریع پیدایش کنید",
    description: "لازم نیست دوباره جستجو کنید؛ همه‌ی گزینه‌ها یک‌جا هستند.",
  },
  {
    icon: HeartHandshake,
    title: "مقایسه و تصمیم راحت‌تر",
    description: "گزینه‌های موردعلاقه‌تان را کنار هم ببینید و انتخاب کنید.",
  },
] as const;

/**
 * حالت خالی صفحه‌ی «علاقه‌مندی‌ها».
 *
 * ⚠️ در این فاز لیست واقعی وجود ندارد (ذخیره‌سازی در فاز بعد به API وصل
 * می‌شود)؛ این کامپوننت به‌جای صفحه‌ی خالیِ بی‌توضیح، کاربر را با نحوه‌ی
 * کارکرد قابلیت آشنا می‌کند و مسیر بعدی را نشان می‌دهد.
 */
export default function FavoritesEmptyState(): ReactNode {
  return (
    <div className="flex flex-col gap-5">
      <section className="border-foreground/10 bg-surface/60 relative overflow-hidden rounded-3xl border border-dashed px-6 py-14 text-center">
        {/* لکه‌ی نورانی تزئینی */}
        <div
          className="bg-danger/10 pointer-events-none absolute -top-24 left-1/2 size-56 -translate-x-1/2 rounded-full blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col items-center">
          <span className="bg-danger/10 text-danger ring-danger/15 grid size-16 place-items-center rounded-2xl ring-1">
            <Heart className="size-8" />
          </span>

          <h2 className="text-text mt-5 text-lg font-bold">
            هنوز اقامتگاهی را لایک نکرده‌اید
          </h2>
          <p className="text-text-gray mt-2 max-w-sm text-sm leading-relaxed">
            اقامتگاه‌های موردعلاقه‌تان را با زدن آیکون قلب ذخیره کنید تا بعداً
            راحت‌تر پیدایشان کنید و با هم مقایسه کنید.
          </p>

          <Button href="/cabins" shape="xl" className="mt-6">
            <Sparkles className="size-4" />
            مشاهده اقامتگاه‌ها
          </Button>
        </div>
      </section>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {HINTS.map(({ icon: Icon, title, description }) => (
          <li
            key={title}
            className="border-foreground/10 bg-surface/60 flex items-start gap-3 rounded-2xl border p-4"
          >
            <span className="bg-primary-400/10 text-primary-500 grid size-9 shrink-0 place-items-center rounded-xl">
              <Icon className="size-4.5" />
            </span>
            <span className="min-w-0">
              <span className="text-text block text-sm font-semibold">
                {title}
              </span>
              <span className="text-text-gray mt-1 block text-xs leading-relaxed">
                {description}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
