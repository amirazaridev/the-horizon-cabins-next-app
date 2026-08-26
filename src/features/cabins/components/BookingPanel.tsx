import { Check, MoveLeft, Phone } from "lucide-react";
import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import PriceDisplay from "@/features/cabins/components/PriceDisplay";
import type { Cabin } from "../lib/data-service";
import { BOOKING_PERKS } from "../lib/constants";
import CardContainer from "@/components/ui/CardContainer";
import { SUPPORT_PHONE_HREF } from "@/constants/suport-phone";

type Props = { cabin: Cabin };

export default function BookingPanel({ cabin }: Props): ReactNode {
  return (
    <CardContainer variant="gradient" className="h-full lg:col-span-2">
      {/* <div className="bg-primary-400/20 absolute -top-20 -left-20 size-48 rounded-full blur-[80px]" /> */}

      <h3 className="relative mb-6 text-lg font-bold text-white">رزرو اقامت</h3>

      <PriceDisplay
        price={cabin.price}
        discount={cabin.discount}
        perNightText="در هر شب × تعداد شب‌های انتخابی"
      />

      <div className="relative space-y-3 border-y border-white/10 py-5 text-sm">
        {BOOKING_PERKS.map((perk) => (
          <p key={perk} className="flex items-center gap-3 text-white/60">
            <Check className="text-primary-400 size-4 shrink-0" />
            {perk}
          </p>
        ))}
      </div>

      <div className="relative mt-auto pt-6">
        <BookingActions />
        <p className="mt-4 text-center text-xs text-white/40">
          رزرو نهایی در صفحه پرداخت انجام می‌شود
        </p>
      </div>
    </CardContainer>
  );
}

function BookingActions(): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <Button shape="xl" fullWidth>
        رزرو این اقامتگاه
        <MoveLeft className="size-5 transition-transform duration-300 group-hover:-translate-x-1" />
      </Button>
      <Button href={SUPPORT_PHONE_HREF} variant="outline" shape="xl">
        <Phone className="size-5" />
        مشاوره و تماس
      </Button>
    </div>
  );
}
