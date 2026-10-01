import type { ReactNode } from "react";

type Props = {
  /** وقتی `true` شود، CSS آن را بی‌درنگ محو می‌کند */
  done?: boolean;
  /**
   * حذف خودکارِ پشتیبان (پیش‌فرض `true`).
   *
   * برای نمونه‌ای که داخل `loading.tsx` رندر می‌شود `false` بگذارید: آن
   * نمونه با آمدن محتوای واقعی از درخت حذف می‌شود و اگر خودش هم محو شود،
   * بین دو حالت یک صفحه‌ی خالی دیده می‌شود.
   */
  autoHide?: boolean;
};

/**
 * پیش‌لودر لندینگ — ترکیبی از هیرو و یک اسکلتون سبک.
 *
 * ویژگی‌های کلیدی:
 *  - در HTML سرور حضور دارد، پس در **اولین paint** دیده می‌شود.
 *  - ترکیب‌بندی‌اش آینه‌ی هیرو است (چشم‌انداز، عنوان، متن، نوار جستجو) تا
 *    تحویل به سایت اصلی حس «جا‌به‌جایی» ندهد.
 *  - `pointer-events: none` است → هرگز تعامل کاربر را مسدود نمی‌کند.
 *  - حذف آن با **CSS** انجام می‌شود (صفت `data-state="done"` یا انیمیشن
 *    پشتیبان)، بنابراین با غیرفعال بودن JS یا خطای GSAP هم کنار می‌رود و
 *    سایت کاملاً قابل استفاده می‌ماند.
 */
export default function LandingPreloader({
  done = false,
  autoHide = true,
}: Props): ReactNode {
  return (
    <div
      className="hz-preloader"
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
            <span className="hz-shimmer block h-9 w-[min(100%,26rem)] rounded-lg bg-white/30 sm:h-12 lg:h-14" />
            <span className="hz-shimmer block h-9 w-[min(100%,16rem)] rounded-lg bg-white/25 sm:h-12 lg:h-14" />
          </div>

          {/* متن کوتاه */}
          <div className="mt-4 flex flex-col gap-2">
            <span className="hz-shimmer block h-3 w-[min(100%,30rem)] rounded-full bg-white/15" />
            <span className="hz-shimmer block h-3 w-[min(100%,20rem)] rounded-full bg-white/10" />
          </div>

          {/* نوار جستجو — هم‌ارتفاع نوار واقعی */}
          <div className="hz-shimmer border-white/15 mt-7 block h-16 w-full rounded-2xl border bg-white/10 md:h-[4.75rem]" />

          {/* نوار پیشرفت */}
          <div className="hz-preloader-bar mt-8 w-full max-w-3xl" />
        </div>
      </div>
    </div>
  );
}
