import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** توضیح کوتاه زیر عنوان — مثل شمارش امکانات */
  hint?: ReactNode;
  /** محتوای سمت مقابلِ عنوان (شمارنده، دکمه، …) */
  action?: ReactNode;
  className?: string;
};

/**
 * عنوان بخش‌های صفحه‌ی جزئیات اقامتگاه.
 *
 * قبلاً به‌صورت تابع محلی داخل `CabinDescription` بود؛ چون چند بخش همین
 * سرتیتر را می‌خواهند، به فایل مستقل منتقل شد تا نسخه‌ی دومی ساخته نشود.
 */
export default function SectionHeading({
  children,
  hint,
  action,
  className = "mb-4",
}: Props): ReactNode {
  return (
    <div className={`flex items-end justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <h2 className="text-text text-xl font-bold">{children}</h2>
        {hint && <p className="text-text-gray mt-1 text-sm">{hint}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
