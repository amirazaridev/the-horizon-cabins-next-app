import { Zap } from "lucide-react";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Carousel from "@/components/ui/Carousel";
import type { LastMinuteCabin } from "@/features/cabins/types/cabin.types";
import { revalidateLastMinute } from "@/features/landing/actions/last-minute.actions";
import { nearestExpiry } from "@/features/landing/utils/last-minute";
import Countdown from "@/features/landing/components/Countdown";
import OfferCard from "@/features/landing/components/OfferCard";

export type LastMinuteProps = {
  /** پیشنهادهای تخفیف لحظه‌آخری — از `GET /cabins/last-minute`. */
  cabins: LastMinuteCabin[];
};

export default function LastMinute({ cabins }: LastMinuteProps) {
  if (!cabins.length) return null;

  /*
   * نزدیک‌ترین انقضا، مبنای تایمر کل سکشن است.
   * ⚠️ این منطق به `lib/last-minute.ts` منتقل شد (قبلاً داخل همین
   * کامپوننت با `localeCompare` روی رشته‌ی ISO انجام می‌شد).
   */
  const expiresAt = nearestExpiry(cabins);

  return (
    <section
      id="last-minute"
      aria-labelledby="last-minute-title"
      data-animate="reveal"
      className="bg-background px-4 py-14 md:px-6 md:py-20"
    >
      <Container>
        <div className="border-primary-400/25 from-primary-400/10 via-surface to-background rounded-3xl border bg-linear-to-bl p-5 sm:p-8">
          <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <Eyebrow
                className="text-text mb-3 flex-wrap"
                icon={<Zap size={16} className="text-primary-400" />}
              >
                فرصت یک سفر خودجوش
              </Eyebrow>
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
              {/* با پایان تایمر، داده‌ی سکشن باطل و از API تازه می‌شود. */}
              <Countdown
                expiresAt={expiresAt}
                onExpire={revalidateLastMinute}
              />
            </div>
          </div>
          <div>
            <Carousel showDots>
              {cabins.map((cabin) => (
                <OfferCard
                  key={cabin.id}
                  cabin={cabin}
                  price={cabin.finalPrice}
                  originalPrice={cabin.originalPrice}
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
