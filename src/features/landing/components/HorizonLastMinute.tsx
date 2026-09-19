import { Zap } from "lucide-react";
import Container from "@/components/ui/Container";
import type { Cabin } from "@/features/cabins/lib/data-service";
import HorizonCountdown from "./HorizonCountdown";
import HorizonOfferCard from "./HorizonOfferCard";

export type LastMinuteOffer = {
  cabin: Cabin;
  price: number;
};

export type HorizonLastMinuteProps = {
  offers: LastMinuteOffer[];
  expiresAt?: string;
  isDemo?: boolean;
  demoDurationSeconds?: number;
};

export default function HorizonLastMinute({
  offers,
  expiresAt,
  isDemo = false,
  demoDurationSeconds = 7200,
}: HorizonLastMinuteProps) {
  if (!offers.length) return null;

  return (
    <section id="last-minute" aria-labelledby="last-minute-title" className="hz-reveal bg-background px-4 py-14 md:px-6 md:py-20">
      <Container>
        <div className="rounded-3xl border border-primary-400/25 bg-linear-to-bl from-primary-400/10 via-surface to-background p-5 sm:p-8">
          <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-text">
                <Zap size={16} className="text-primary-400" />
                فرصت یک سفر خودجوش
                {isDemo && <span className="rounded-full border border-primary-400/30 px-2 py-1 text-text-gray">پیشنهاد نمایشی</span>}
              </div>
              <h2 id="last-minute-title" className="text-2xl font-extrabold text-text sm:text-3xl">ویلاهای <span className="text-primary-400">لحظه‌آخری</span></h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-text-gray">
                {isDemo ? "قیمت‌ها و زمان این بخش نمونه‌اند و پیشنهاد قابل رزرو محسوب نمی‌شوند." : "فرصت‌های محدود برای اقامت بعدی؛ جزئیات و موجودی را پیش از رزرو بررسی کنید."}
              </p>
            </div>
            {(isDemo || expiresAt) && (
              <div className="flex flex-col gap-2 self-start">
                <span className="text-xs text-text-gray">{isDemo ? "شمارش‌معکوس نمایشی" : "زمان باقی‌مانده"}</span>
                <HorizonCountdown expiresAt={expiresAt} demoDurationSeconds={demoDurationSeconds} />
              </div>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map(({ cabin, price }) => (
              <HorizonOfferCard key={cabin.id} cabin={cabin} price={price} originalPrice={cabin.regularPrice} badge={isDemo ? "تخفیف نمونه" : "پیشنهاد ویژه"} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
