import type { ReactNode } from "react";
import CardContainer from "@/components/ui/CardContainer";
import type { CabinReviewsData } from "../../types/cabin-detail.types";
import Stars from "./Stars";

type Props = {
  data: CabinReviewsData;
};

// زیرمعیارها فعلاً نمایش داده نمی‌شوند (بلوک کامنت‌شده در بدنه).
// داده‌اش در `CabinReviewsData.subscores` هست؛ با برگرداندن کامنت‌ها فعال می‌شود.
// const SCORE_KEYS = [
//   { key: "cleanliness", label: "نظافت" },
//   { key: "location", label: "موقعیت" },
//   { key: "value", label: "ارزش در برابر قیمت" },
//   { key: "accuracy", label: "دقت توضیحات" },
//   { key: "checkIn", label: "فرایند ورود" },
// ] as const;

/** خلاصه‌ی امتیاز: میانگین، توزیع ستاره‌ها و امتیاز زیرمعیارها */
export default function RatingSummary({ data }: Props): ReactNode {
  const { average, total, distribution } = data;

  return (
    <CardContainer className="shadow-md">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,15rem)_1fr]">
        {/* میانگین */}
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-text text-5xl font-extrabold tabular-nums">
            {average.toLocaleString("fa-IR")}
          </p>
          <Stars
            value={average}
            iconClassName="size-5"
            className="mt-3"
            label={`میانگین امتیاز ${average.toLocaleString("fa-IR")} از ۵`}
          />
          <p className="text-text-gray mt-3 text-sm">
            {`بر پایه‌ی ${total.toLocaleString("fa-IR")} نظر ثبت‌شده`}
          </p>
        </div>

        {/* توزیع ستاره‌ها */}
        <div className="min-w-0">
          <ul className="space-y-2.5">
            {([5, 4, 3, 2, 1] as const).map((score) => {
              const count = distribution[score];
              const percent = total > 0 ? (count / total) * 100 : 0;

              return (
                <li key={score} className="flex items-center gap-3">
                  <span className="text-text-gray w-10 shrink-0 text-xs tabular-nums">
                    {`${score.toLocaleString("fa-IR")} ستاره`}
                  </span>
                  <span className="bg-foreground/8 h-2 min-w-0 flex-1 overflow-hidden rounded-full">
                    <span
                      className="bg-primary-400 block h-full rounded-full transition-[width] duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </span>
                  <span className="text-text-gray w-8 shrink-0 text-end text-xs tabular-nums">
                    {count.toLocaleString("fa-IR")}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* زیرمعیارها */}
          {/* <ul className="border-foreground/10 mt-6 grid grid-cols-2 gap-3 border-t pt-5 sm:grid-cols-3">
            {SCORE_KEYS.map(({ key, label }) => (
              <li
                key={key}
                className="border-foreground/10 bg-background-2 rounded-2xl border px-3.5 py-3"
              >
                <p className="text-text-gray text-xs">{label}</p>
                <p className="text-text mt-1 text-lg font-extrabold tabular-nums">
                  {subscores[key].toLocaleString("fa-IR")}
                </p>
              </li>
            ))}
          </ul> */}
        </div>
      </div>
    </CardContainer>
  );
}
