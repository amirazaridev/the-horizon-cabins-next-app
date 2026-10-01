"use client";

import { useMemo, useState, type ReactNode } from "react";
import { MessageSquareOff } from "lucide-react";
import { buildReviews, SECTION_IDS } from "../../constants/cabin-detail";
import RatingSummary from "./RatingSummary";
import ReviewCard from "./ReviewCard";
import SectionShell from "./SectionShell";

/** چند نظر اول که بدون کلیک دیده می‌شود */
const INITIAL_VISIBLE_COUNT = 4;

type SortId = "newest" | "highest";

const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: "newest", label: "جدیدترین" },
  { id: "highest", label: "بالاترین امتیاز" },
];

type Props = {
  cabinId: number;
};

/**
 * نظرات کاربران.
 *
 * ⚠️ TODO(backend): اندپوینت نظرات وجود ندارد؛ داده از `buildReviews`
 * می‌آید. با اضافه‌شدن `GET /cabins/:id/reviews`، فقط منبع `data` عوض
 * می‌شود (به‌ترجیح با `useEffect`/`Suspense` و اسکلتون مستقل) و کل UI
 * مرتب‌سازی و «مشاهده‌ی بیشتر» دست‌نخورده می‌ماند.
 */
export default function ReviewsSection({ cabinId }: Props): ReactNode {
  const data = useMemo(() => buildReviews(cabinId), [cabinId]);
  const [sort, setSort] = useState<SortId>("newest");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  /**
   * تغییر مرتب‌سازی، فهرست را از ابتدا نشان می‌دهد.
   *
   * عمداً در handler انجام می‌شود و نه در یک `useEffect` با وابستگی
   * `sort`؛ چون setState در بدنه‌ی effect باعث رندر آبشاری می‌شود و lint
   * پروژه هم آن را خطا می‌گیرد.
   */
  const handleSortChange = (next: SortId) => {
    setSort(next);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const sortedReviews = useMemo(() => {
    const items = [...data.items];

    items.sort((a, b) => {
      const timeDiff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === "newest") return timeDiff;
      return b.rating - a.rating || timeDiff;
    });

    return items;
  }, [data.items, sort]);

  const visibleReviews = sortedReviews.slice(0, visibleCount);
  const remaining = sortedReviews.length - visibleReviews.length;

  return (
    <SectionShell
      id={SECTION_IDS.reviews}
      title="نظرات کاربران"
      hint={
        data.total > 0
          ? `تجربه‌ی ${data.total.toLocaleString("fa-IR")} مهمان این اقامتگاه`
          : undefined
      }
    >
      {data.total === 0 ? (
        <div className="border-foreground/10 bg-surface-raised/50 text-text-gray flex flex-col items-center gap-3 rounded-3xl border border-dashed px-6 py-12 text-center">
          <MessageSquareOff className="size-7" aria-hidden="true" />
          <p className="text-text text-sm font-bold">
            هنوز نظری برای این اقامتگاه ثبت نشده
          </p>
          <p className="text-xs">اولین نفری باشید که تجربه‌اش را می‌نویسد.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <RatingSummary data={data} />

          {/* مرتب‌سازی */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-text-gray text-sm">
              {`${sortedReviews.length.toLocaleString("fa-IR")} نظر`}
            </p>

            <div
              role="group"
              aria-label="مرتب‌سازی نظرات"
              className="border-foreground/10 bg-surface flex gap-1 rounded-2xl border p-1"
            >
              {SORT_OPTIONS.map((option) => {
                const isActive = option.id === sort;

                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleSortChange(option.id)}
                    className={`h-9 rounded-xl px-4 text-xs font-bold transition-colors duration-300 ${
                      isActive
                        ? "bg-primary-400 text-black"
                        : "text-text-gray hover:bg-foreground/5 hover:text-text"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {visibleReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {remaining > 0 && (
            <div className="text-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((count) => count + INITIAL_VISIBLE_COUNT)
                }
                className="border-foreground/15 text-text hover:border-primary-400/50 hover:text-primary-500 inline-flex h-11 items-center rounded-xl border px-6 text-sm font-bold transition-colors"
              >
                {`مشاهده‌ی ${remaining.toLocaleString("fa-IR")} نظر دیگر`}
              </button>
            </div>
          )}
        </div>
      )}
    </SectionShell>
  );
}
