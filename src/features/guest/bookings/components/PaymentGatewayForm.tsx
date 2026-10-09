"use client";

import { ArrowRight, CreditCard, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import { formatToman } from "@/features/guest/shared/lib/format";
import { payBookingAction } from "../actions/booking.actions";

type Props = {
  bookingId: number;
  /** نام اقامتگاه — به‌عنوان «پذیرنده» نمایش داده می‌شود. */
  merchantName: string;
  amount: number;
  /** تاریخ سفارش (جلالی، از سرور فرمت‌شده تا hydration mismatch نشود). */
  orderDateLabel: string;
  /** مهلت پرداخت (جلالی) — همان `paymentDeadline` خود رزرو. */
  deadlineLabel: string;
};

/** رقم فارسی با صفر پیشوند — برای گزینه‌های ماه/سال. */
function fa(value: number): string {
  return value.toLocaleString("fa-IR", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

const MONTHS = Array.from({ length: 12 }, (_, index) => fa(index + 1));
const YEARS = Array.from({ length: 10 }, (_, index) => fa(26 + index));

/** یک ردیف «برچسب/مقدار» در جعبه‌ی اطلاعات پذیرنده. */
function InfoRow({ label, value }: { label: string; value: string }): ReactNode {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-text-gray text-[11px]">{label}</dt>
      <dd className="text-text truncate text-xs font-semibold">{value}</dd>
    </div>
  );
}

const INPUT_CLASS =
  "border-foreground/10 bg-background-2 text-text placeholder:text-text-gray/50 focus:border-primary-400 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors";

/**
 * فرم درگاه پرداخت **نمونه** — فقط طرح و ظاهر.
 *
 * ⚠️ اعتبارسنجی ندارد (طبق درخواست): حتی با فیلدهای خالی هم دکمه کار می‌کند.
 * هیچ داده‌ی کارتی جایی ارسال نمی‌شود؛ فقط `payBookingAction` صدا زده می‌شود
 * که `POST /bookings/:id/pay` را می‌زند و رزرو را «تأییدشده» می‌کند.
 */
export default function PaymentGatewayForm({
  bookingId,
  merchantName,
  amount,
  orderDateLabel,
  deadlineLabel,
}: Props): ReactNode {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** فقط ظاهر: رقم‌ها را جدا و در گروه‌های چهارتایی نشان می‌دهد. */
  function handleCardChange(value: string): void {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(digits.replace(/(\d{4})(?=\d)/g, "$1 "));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await payBookingAction(bookingId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      // رزرو حالا «تأییدشده» است ⇒ تب «جاری».
      router.push("/account/bookings?status=active");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-background-2 flex min-h-dvh flex-col items-center px-4 py-8 sm:py-12">
      {/* هدر درگاه */}
      <header className="mb-6 flex w-full max-w-xl items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary-400 grid size-9 place-items-center rounded-xl text-white shadow-sm">
            <CreditCard className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-text text-sm font-extrabold">
              درگاه پرداخت اینترنتی
            </p>
            <p className="text-text-gray text-[11px]">
              پرداخت امن کارت بانکی
            </p>
          </div>
        </div>

        <Link
          href={`/account/bookings/${bookingId}/pay`}
          className="text-text-gray hover:text-primary-400 inline-flex shrink-0 items-center gap-1 text-xs font-medium transition-colors"
        >
          انصراف و بازگشت
          <ArrowRight className="size-3.5" />
        </Link>
      </header>

      <main className="w-full max-w-xl">
        <div className="border-foreground/10 bg-surface overflow-hidden rounded-3xl border shadow-lg">
          {/* اطلاعات پذیرنده */}
          <section className="border-foreground/10 border-b p-5 sm:p-6">
            <p className="text-text-gray mb-3 text-[11px] font-semibold">
              اطلاعات پرداخت
            </p>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              <InfoRow label="پذیرنده" value={merchantName} />
              <InfoRow label="شماره سفارش" value={String(bookingId)} />
              <InfoRow label="تاریخ" value={orderDateLabel} />
              <InfoRow label="مهلت پرداخت" value={deadlineLabel} />
            </dl>

            <div className="bg-primary-400/10 mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl px-4 py-3">
              <span className="text-text-gray text-xs">مبلغ قابل پرداخت</span>
              <span className="text-text text-base font-extrabold tabular-nums">
                {formatToman(amount)}
              </span>
            </div>
          </section>

          {/* فرم کارت */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 sm:p-6">
            <label className="flex flex-col gap-1.5">
              <span className="text-text text-xs font-semibold">شماره کارت</span>
              <input
                type="text"
                value={cardNumber}
                onChange={(event) => handleCardChange(event.target.value)}
                inputMode="numeric"
                dir="ltr"
                placeholder="---- ---- ---- ----"
                className={`${INPUT_CLASS} text-center tracking-[0.15em]`}
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-text text-xs font-semibold">CVV2</span>
                <input
                  type="text"
                  inputMode="numeric"
                  dir="ltr"
                  maxLength={4}
                  placeholder="---"
                  className={`${INPUT_CLASS} text-center tracking-[0.15em]`}
                />
              </label>

              <div className="flex flex-col gap-1.5">
                <span className="text-text text-xs font-semibold">
                  تاریخ انقضا
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    dir="ltr"
                    aria-label="ماه انقضا"
                    className={`${INPUT_CLASS} text-center`}
                  >
                    <option value="">ماه</option>
                    {MONTHS.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    dir="ltr"
                    aria-label="سال انقضا"
                    className={`${INPUT_CLASS} text-center`}
                  >
                    <option value="">سال</option>
                    {YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-text text-xs font-semibold">
                رمز پویا (رمز دوم)
              </span>
              <input
                type="password"
                dir="ltr"
                inputMode="numeric"
                maxLength={8}
                placeholder="------"
                className={`${INPUT_CLASS} text-center tracking-[0.3em]`}
              />
            </label>

            <Button type="submit" shape="xl" fullWidth disabled={isSubmitting}>
              <Lock className="size-4" />
              {isSubmitting ? "در حال پرداخت..." : "پرداخت"}
            </Button>

            <p className="text-text-gray flex items-start gap-2 text-[11px] leading-relaxed">
              <ShieldCheck className="text-secondary-500 mt-px size-3.5 shrink-0" />
              <span>
                این یک درگاه آزمایشی است؛ اطلاعات کارت شما جایی ذخیره یا ارسال
                نمی‌شود و فقط وضعیت رزرو تأیید می‌گردد.
              </span>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
