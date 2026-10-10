import type { ReactNode } from "react";
import { CircleCheckBig, CircleSlash } from "lucide-react";

/**
 * چیپ وضعیت حساب کاربر — فعال/غیرفعال.
 *
 * ⚠️ کلاس‌های رنگ به‌صورت رشته‌ی کامل نوشته شده‌اند (Tailwind JIT کلاس‌های
 * ساخته‌شده با الحاق را تولید نمی‌کند).
 */
export default function UserStatusBadge({ active }: { active: boolean }): ReactNode {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-emerald-700 dark:text-emerald-300">
        <CircleCheckBig className="size-3.5 shrink-0" aria-hidden="true" />
        فعال
      </span>
    );
  }

  return (
    <span className="text-danger-strong inline-flex items-center gap-1.5 rounded-full border border-danger/40 bg-danger/10 px-2.5 py-1 text-xs font-semibold whitespace-nowrap dark:text-red-300">
      <CircleSlash className="size-3.5 shrink-0" aria-hidden="true" />
      غیرفعال
    </span>
  );
}
