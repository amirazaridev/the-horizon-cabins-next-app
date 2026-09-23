import { Zap } from "lucide-react";
import Container from "@/components/ui/Container";
import type { Cabin } from "@/features/cabins/types/cabin.types";
import Countdown from "./Countdown";
import OfferCard from "./OfferCard";
import Carousel from "@/components/ui/Carousel";

export type LastMinuteOffer = {
  cabin: Cabin;
  price: number;
};

export type LastMinuteProps = {
  offers: LastMinuteOffer[];
  expiresAt?: string;
  demoDurationSeconds?: number;
};

export default function LastMinute({
  offers,
  expiresAt ,
  demoDurationSeconds = 7200,
}: LastMinuteProps) {
  if (!offers.length) return null;

  return (
    <section
      id="last-minute"
      aria-labelledby="last-minute-title"
      className="hz-reveal bg-background px-4 py-14 md:px-6 md:py-20"
    >
      <Container>
        <div className="border-primary-400/25 from-primary-400/10 via-surface to-background rounded-3xl border bg-linear-to-bl p-5 sm:p-8">
          <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="text-text mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
                <Zap size={16} className="text-primary-400" />
                فرصت یک سفر خودجوش
              </div>
              <h2
                id="last-minute-title"
                className="text-text text-2xl font-extrabold sm:text-3xl"
              >
                تخفیف های <span className="text-primary-400">لحظه‌آخری</span>
              </h2>
              <p className="text-text-gray mt-3 max-w-xl text-sm leading-7">
                فرصت‌های محدود برای اقامت بعدی؛ جزئیات و موجودی را پیش از رزرو
                بررسی کنید.
              </p>
            </div>
              <div className="flex flex-col gap-2 self-start">
                <span className="text-text-gray text-xs">زمان باقی‌مانده</span>
                <Countdown
                  expiresAt={expiresAt}
                  demoDurationSeconds={demoDurationSeconds}
                />
              </div>
          </div>
          <div>

          <Carousel showDots>
            {offers.map(({ cabin, price }) => (
              <OfferCard
                key={cabin.id}
                cabin={cabin}
                price={price}
                originalPrice={cabin.regularPrice}
                badge={"پیشنهاد ویژه"}
              />
            ))}
          </Carousel>
          </div>
        </div>
      </Container>
    </section>
  );
}
