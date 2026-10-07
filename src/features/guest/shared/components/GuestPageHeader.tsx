import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  /** اکشن‌های سمت مقابل عنوان (مثلاً دکمه). */
  actions?: ReactNode;
};

/**
 * سرصفحه‌ی صفحه‌های ناحیه‌ی مهمان.
 *
 * ⚠️ چرا لازم شد؟ پیش‌تر عنوان «حساب کاربری من» در layout مشترک بود؛ با
 * تبدیل ناحیه به چیدمان سایدباری، هر صفحه عنوان خودش را دارد تا عنوان
 * تکراری/گم‌شده نداشته باشیم.
 */
export default function GuestPageHeader({
  title,
  description,
  actions,
}: Props): ReactNode {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-text text-xl font-extrabold md:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="text-text-gray mt-1.5 text-sm">{description}</p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
}
