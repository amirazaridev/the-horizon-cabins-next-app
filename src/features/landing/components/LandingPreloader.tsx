import type { ReactNode } from "react";

type Props = {
  done?: boolean;
  autoHide?: boolean;
};

/**
 * پوسته‌ی مشترک همه‌ی بلوک‌های اسکلتون.
 *
 * ⚠️ گرادیان shimmer قبلاً شکسته بود (`rgb(255_255_255/0.08_45%` بدون
 * پرانتز بسته و بدون کاما) و افکت عملاً بی‌اثر می‌ماند؛ اکنون هر رنگ با
 * `)` بسته شده و بین‌شان کاما هست.
 */
const SHIMMER_BAR_CLASS =
  "relative block overflow-hidden after:absolute after:inset-0 after:animate-shimmer after:bg-[linear-gradient(90deg,transparent_0%,rgb(255_255_255/0.08)_45%,rgb(255_255_255/0.16)_50%,rgb(255_255_255/0.08)_55%,transparent_100%)]";

/** یک خط/بلوک اسکلتون با افکت shimmer. */
function ShimmerBar({ className }: { className: string }): ReactNode {
  return <span className={`${SHIMMER_BAR_CLASS} ${className}`} />;
}

export default function LandingPreloader({
  done = false,
  autoHide = true,
}: Props): ReactNode {
  return (
    <div
      className="bg-overlay animate-preloader-out data-[state=done]:animate-preloader-out-now pointer-events-none fixed inset-0 z-100 grid place-items-center p-4 opacity-100 data-[autohide=off]:animate-none in-data-[client-nav=1]:data-[autohide=on]:hidden motion-reduce:[animation-delay:0.04s]"
      data-state={done ? "done" : "pending"}
      data-autohide={autoHide ? "on" : "off"}
      aria-hidden="true"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="max-w-2xl">
          {/* چشم‌انداز — همان رنگ و ریتم هیرو */}
          <div className="text-primary-400 mb-4 flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em]">
            <span className="bg-primary-400/70 inline-block h-px w-8" />
            HORIZON
          </div>

          {/* عنوان */}
          <div className="flex flex-col gap-3">
            <ShimmerBar className="h-9 w-[min(100%,26rem)] rounded-lg bg-white/30 sm:h-12 lg:h-14" />
            <ShimmerBar className="h-9 w-[min(100%,16rem)] rounded-lg bg-white/25 sm:h-12 lg:h-14" />
          </div>

          {/* متن کوتاه */}
          <div className="mt-4 flex flex-col gap-2">
            <ShimmerBar className="h-3 w-[min(100%,30rem)] rounded-full bg-white/15" />
            <ShimmerBar className="h-3 w-[min(100%,20rem)] rounded-full bg-white/10" />
          </div>

          {/* نوار جستجو — هم‌ارتفاع نوار واقعی */}
          <ShimmerBar className="mt-7 h-16 w-full rounded-2xl border border-white/15 bg-white/10 md:h-19" />

          {/* نوار پیشرفت
              ⚠️ کلاس قبلی `block-0.5` یک یوتیلیتی نامعتبر Tailwind بود و
              نوار ارتفاع نمی‌گرفت ⇒ نامرئی می‌ماند. مقدار درست `h-0.5` است. */}
          <div className="after:bg-primary-400 after:animate-preloader-slide relative mt-8 block h-0.5 w-full max-w-3xl overflow-hidden rounded-full bg-black/12 after:absolute after:inset-y-0 after:w-[38%] after:rounded-[inherit]" />
        </div>
      </div>
    </div>
  );
}
