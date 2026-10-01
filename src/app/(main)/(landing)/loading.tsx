import type { ReactNode } from "react";

import LandingPreloader from "@/features/landing/components/LandingPreloader";

/**
 * لودینگ مسیر لندینگ (`/`).
 *
 * چرا این فایل لازم بود؟ قبلاً نزدیک‌ترین مرزِ لودینگ برای `/` همان
 * `src/app/loading.tsx` بود که یک اسپینرِ روشن و نیمه‌شفاف نشان می‌داد؛ بعد
 * از آن هم `LandingPreloader` تیره می‌آمد. یعنی کاربر دو لودینگ با دو زبانِ
 * بصری متفاوت پشت‌سرهم می‌دید.
 *
 * حالا همان پیش‌لودر — با همان مارک‌آپ و همان استایل — هم در `loading.tsx`
 * و هم داخل `LandingAnimationProvider` رندر می‌شود؛ پس عبور از «سرور در حال
 * رندر» به «سایت آماده» یک تجربه‌ی پیوسته و بدون پرش است.
 *
 * `autoHide={false}` چون این نمونه با آمدن محتوای واقعی از درخت حذف
 * می‌شود؛ اگر خودش هم محو شود، بین دو حالت یک صفحه‌ی خالی دیده می‌شود.
 *
 * ⚠️ چرا صفحه‌ی لندینگ به گروه مسیرِ `(landing)` منتقل شده است؟
 *
 * یک `loading.tsx` در سطح `(main)` فقط برای `/` کار نمی‌کند: Next.js مرزِ
 * والد را هم برای مسیرهای خواهر (`/cabins`، `/cabins/[cabinId]`) فلاش
 * می‌کند. آزمایش عملی نشان داد با `src/app/(main)/loading.tsx` این پیش‌لودر
 * روی `/cabins` هم دیده می‌شد و اسکلتونِ اختصاصیِ همان صفحه را می‌پوشاند.
 *
 * گروه مسیر `(landing)` در URL اثری ندارد (`/` همان `/` می‌ماند) اما یک
 * سگمنت مستقل می‌سازد؛ پس این مرز فقط در درختِ مسیر `/` حاضر است و
 * `/cabins` و `/cabins/[cabinId]` دست‌نخورده می‌مانند.
 */
export default function Loading(): ReactNode {
  return (
    <>
      <LandingPreloader autoHide={false} />
      <div role="status" className="sr-only">
        در حال بارگذاری صفحه…
      </div>
    </>
  );
}
