import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Compass, House, Mail } from "lucide-react";

import forestCabin from "@/assets/images/about-section.png";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { FOOTER_CONTACT } from "@/constants/footer";

export default function NotFound() {
  return (
    <main className="bg-background text-text relative isolate flex min-h-dvh w-full flex-col overflow-hidden px-4 py-6 sm:px-6 md:py-10">
      <div
        aria-hidden="true"
        className="bg-primary-400/10 pointer-events-none absolute -top-40 -right-40 -z-10 size-96 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-primary-400/10 pointer-events-none absolute -bottom-44 -left-32 -z-10 size-96 rounded-full blur-3xl"
      />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        <Link
          href="/"
          className="text-text-gray hover:text-text focus-visible:outline-primary-400 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-sm"
        >
          صفحه اصلی
          <ArrowLeft aria-hidden="true" className="size-4" />
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center py-10 md:py-16">
        <section
          aria-labelledby="not-found-title"
          className="border-border bg-surface grid w-full overflow-hidden rounded-[1.75rem] border shadow-[0_24px_80px_-32px_rgba(36,34,29,0.3)] md:min-h-125 md:grid-cols-2 md:rounded-[2.5rem]"
        >
          <div className="order-2 flex flex-col justify-center p-7 sm:p-10 md:order-1 md:p-12 lg:p-16">
            <div className="border-border bg-surface-raised text-text-gray mb-7 inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold">
              <Compass aria-hidden="true" className="text-primary-600 size-4" />
              خطای ۴۰۴ · مسیر پیدا نشد
            </div>

            <h1
              id="not-found-title"
              className="text-text text-3xl leading-normal font-black tracking-tight sm:text-4xl md:text-[2.65rem]"
            >
              صفحه مورد نظر
              <span className="text-primary-600 block">یافت نشد</span>
            </h1>
            <p className="text-text-gray mt-4 max-w-md text-sm leading-8 sm:text-base">
              به‌نظر می‌رسد این مسیر دیگر وجود ندارد یا نشانی آن تغییر کرده است.
              نگران نباشید؛ از صفحه اصلی می‌توانید دوباره سفر خود را آغاز کنید.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                href="/"
                size="md"
                className="focus-visible:outline-primary-400 min-h-12 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <House aria-hidden="true" className="size-4" />
                بازگشت به صفحه اصلی
              </Button>
              <Link
                href="/cabins"
                className="border-border text-text hover:border-primary-400 hover:bg-surface-raised focus-visible:outline-primary-400 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                دیدن اقامتگاه‌ها
                <ArrowLeft aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>

          <div className="bg-overlay relative order-1 min-h-52 overflow-hidden md:order-2 md:min-h-full">
            <Image
              src={forestCabin}
              alt="کلبه‌ای در میان درختان جنگل"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,30,0.12),rgba(7,17,30,0.58))]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span
                aria-hidden="true"
                className="text-[5.5rem] leading-none font-black tracking-[-0.06em] drop-shadow-lg sm:text-[7rem] md:text-[9rem] lg:text-[11rem]"
              >
                ۴۰۴
              </span>
              <span className="mt-2 text-xs font-medium tracking-wide sm:text-sm">
                هر مسیر، آغاز یک ماجراجویی تازه است
              </span>
            </div>
          </div>
        </section>
      </div>

      <p className="text-text-gray mx-auto text-center text-xs">
        هورایزن کابینز · تمامی حقوق محفوظ است.
      </p>
    </main>
  );
}
