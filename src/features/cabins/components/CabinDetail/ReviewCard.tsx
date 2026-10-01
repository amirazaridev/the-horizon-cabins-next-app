"use client";

import { MessageSquare } from "lucide-react";
import type { ReactNode } from "react";
import ExpandableText from "@/components/ui/ExpandableText";
import { formatJalaliDate } from "@/components/ui/RangeDatePicker";
import type { CabinReview } from "../../types/cabin-detail.types";
import Stars from "./Stars";

type Props = {
  review: CabinReview;
};

/** حرف اول نام برای آواتار — تا وقتی آواتار واقعی وجود ندارد */
function getInitial(name: string): string {
  return name.trim().charAt(0) || "؟";
}

/** کارت یک نظر: آواتار، نام، تاریخ، ستاره، متن، تگ‌ها و پاسخ میزبان */
export default function ReviewCard({ review }: Props): ReactNode {
  const date = new Date(review.createdAt);
  const dateLabel = formatJalaliDate(
    Number.isNaN(date.getTime()) ? null : date,
    "DD MMMM YYYY",
  );

  return (
    <article className="border-foreground/10 bg-surface rounded-3xl border p-5 shadow-sm">
      <header className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="bg-primary-400/15 text-primary-600 dark:text-primary-400 grid size-11 shrink-0 place-items-center rounded-full text-sm font-extrabold"
        >
          {getInitial(review.authorName)}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-text text-sm font-bold">{review.authorName}</p>
          {dateLabel && (
            <p className="text-text-gray mt-0.5 text-xs">{dateLabel}</p>
          )}
        </div>

        <Stars
          value={review.rating}
          iconClassName="size-3.5"
          className="shrink-0 pt-1"
          label={`امتیاز ${review.rating.toLocaleString("fa-IR")} از ۵`}
        />
      </header>

      <ExpandableText className="mt-4" lines={3} expandLabel="ادامه">
        {review.text}
      </ExpandableText>

      {review.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {review.tags.map((tag) => (
            <li
              key={tag}
              className="border-foreground/10 bg-background-2 text-text-gray rounded-full border px-3 py-1 text-xs"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      {review.hostReply && (
        <div className="border-foreground/10 bg-surface-raised/60 mt-4 rounded-2xl border-s-2 border-s-primary-400 px-4 py-3">
          <p className="text-text flex items-center gap-2 text-xs font-bold">
            <MessageSquare className="text-primary-400 size-3.5" aria-hidden="true" />
            پاسخ میزبان
          </p>
          <p className="text-text-gray mt-2 text-xs leading-relaxed">
            {review.hostReply.text}
          </p>
        </div>
      )}
    </article>
  );
}
