import { Check, MoveLeft, Phone } from "lucide-react";
import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import type { Cabin } from "../lib/data-service";

const perks = [
  "تأیید آنی رزرو",
  "پرداخت هنگام ورود",
  "لغو رایگان تا ۴۸ ساعت",
];

export default function BookingPanel({ cabin }: { cabin: Cabin }): ReactNode {
  return (
    <div className="h-full rounded-3xl p-[1px] bg-gradient-to-br from-primary-400/40 via-white/10 to-transparent">
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-slate-900/80 p-7 backdrop-blur-sm md:p-8">
        <div className="absolute -top-20 -left-20 size-48 rounded-full bg-primary-400/10 blur-[80px]" />

        <h3 className="relative mb-6 text-lg font-bold text-white">رزرو اقامت</h3>

        {cabin.discount ? (
          <div className="relative mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-white">
                ${cabin.price - cabin.discount}
              </span>
              <span className="text-lg text-white/40 line-through">
                ${cabin.price}
              </span>
              <span className="rounded-full bg-primary-400 px-3 py-1 text-xs font-bold text-black">
                {Math.round((cabin.discount / cabin.price) * 100)}٪ تخفیف
              </span>
            </div>
            <p className="mt-2 text-sm text-white/50">
              در هر شب &times; تعداد شب‌های انتخابی
            </p>
          </div>
        ) : (
          <div className="relative mb-6">
            <span className="text-4xl font-bold text-white">${cabin.price}</span>
            <p className="mt-2 text-sm text-white/50">
              در هر شب &times; تعداد شب‌های انتخابی
            </p>
          </div>
        )}

        <div className="relative space-y-3 border-y border-white/10 py-5 text-sm">
          {perks.map((perk) => (
            <p key={perk} className="flex items-center gap-3 text-white/60">
              <Check className="text-primary-400 size-4 shrink-0" />
              {perk}
            </p>
          ))}
        </div>

        <div className="relative mt-auto pt-6">
          <div className="flex flex-col gap-3">
            <Button shape="xl" fullWidth>
              رزرو این اقامتگاه
              <MoveLeft className="size-5 transition-transform duration-300 group-hover:-translate-x-1" />
            </Button>
            <Button href="tel:+989000000000" variant="outline" shape="xl">
              <Phone className="size-5" />
              مشاوره و تماس
            </Button>
          </div>

          <p className="mt-4 text-center text-xs text-white/40">
            رزرو نهایی در صفحه پرداخت انجام می‌شود
          </p>
        </div>
      </div>
    </div>
  );
}
