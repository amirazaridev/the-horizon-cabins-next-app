import type { CSSProperties, ReactNode } from "react";

import styles from "./style.module.css";

type Length = number | string;

export interface SkeletonProps {
  /**
   * تعداد بلوک‌های اسکلتی. پیش‌فرض ۱.
   * برای `count > 1` بلوک‌ها داخل یک ظرف flex چیده می‌شوند.
   */
  count?: number;
  /** عرض: عدد → پیکسل، رشته → همان مقدار CSS (مثل `"60%"`) */
  width?: Length;
  /** ارتفاع: عدد → پیکسل، رشته → همان مقدار CSS */
  height?: Length;
  /** شعاع گوشه‌ها */
  radius?: Length;
  /** نسبت ابعاد، مثل `"16 / 9"` — ارتفاع را خودکار می‌کند */
  aspectRatio?: string;
  /** بلوک دایره‌ای (ارتفاع = عرض) */
  circle?: boolean;
  /** جهت چیدمان وقتی `count > 1` */
  direction?: "row" | "column";
  /** فاصله بین بلوک‌ها وقتی `count > 1` */
  gap?: Length;
  /**
   * کلاس‌های تکمیلی روی هر بلوک — برای سایزدهی با Tailwind
   * (مثل `"h-4 w-2/3 rounded-full"`).
   */
  className?: string;
  /** کلاس‌های ظرف (فقط وقتی `count > 1` یا `label` داده شده) */
  containerClassName?: string;
  /** متن اعلام‌شده به screen reader */
  label?: string;
  style?: CSSProperties;
}

const toCss = (value?: Length): string | undefined =>
  value === undefined
    ? undefined
    : typeof value === "number"
      ? `${value}px`
      : value;

/**
 * اسکلتون پایه — یک بلوک shimmer با ابعاد قابل تنظیم.
 *
 * سبک و بدون وابستگی: هیچ کتابخانه‌ای اضافه نمی‌کند و انیمیشن کاملاً با
 * CSS اجرا می‌شود. برای ساخت اسکلتون‌های هم‌ابعاد، کلاس‌های سایز واقعی
 * (مثل `aspect-video`, `p-3.5`, `gap-1.5`) را از کامپوننت واقعی کپی کنید
 * تا هنگام تبدیل لودینگ به محتوا هیچ layout shift رخ ندهد.
 */
export default function Skeleton({
  count = 1,
  width,
  height,
  radius,
  aspectRatio,
  circle = false,
  direction = "column",
  gap = 8,
  className = "",
  containerClassName = "",
  label,
  style,
}: SkeletonProps): ReactNode {
  const total = Math.max(1, Math.floor(count));

  const blockStyle: CSSProperties = {
    width: toCss(width),
    height: circle ? toCss(width) : toCss(height),
    borderRadius: circle ? "9999px" : toCss(radius),
    aspectRatio: circle ? undefined : aspectRatio,
    ...style,
  };

  const blockClass = `${styles.block} ${className}`.trim();

  /* تک‌بلوک تزئینی: بدون ظرف اضافه */
  if (total === 1 && !label) {
    return <div aria-hidden="true" className={blockClass} style={blockStyle} />;
  }

  return (
    <div
      role="status"
      aria-busy="true"
      className={`flex ${direction === "row" ? "flex-row" : "flex-col"} ${containerClassName}`.trim()}
      style={{ gap: toCss(gap) }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className={blockClass}
          style={blockStyle}
        />
      ))}
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}
