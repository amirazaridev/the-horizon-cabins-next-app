import type { ReactNode } from "react";
import { CheckCircle2, TriangleAlert, X } from "lucide-react";

/** خروجی مشترک اکشن‌های فرم داشبورد (موفق/ ناموفق + پیام). */
export interface Feedback {
  success: boolean;
  message: string;
}

interface FeedbackBannerProps {
  feedback: Feedback;
  onDismiss: () => void;
}

export default function FeedbackBanner({
  feedback,
  onDismiss,
}: FeedbackBannerProps): ReactNode {
  return (
    <div
      role="status"
      className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm ${
        feedback.success
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-danger/40 bg-danger/10 text-danger"
      }`}
    >
      <span className="flex items-center gap-2">
        {feedback.success ? (
          <CheckCircle2 className="size-4 shrink-0" />
        ) : (
          <TriangleAlert className="size-4 shrink-0" />
        )}
        {feedback.message}
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="بستن پیام"
        className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
