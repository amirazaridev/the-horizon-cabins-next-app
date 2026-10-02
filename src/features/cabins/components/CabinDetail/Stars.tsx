import { Star } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  /** امتیاز بین ۰ تا ۵ */
  value: number;
  /** اندازه‌ی آیکن با کلاس Tailwind */
  iconClassName?: string;
  className?: string;
  /** متن جایگزین برای screen reader */
  label?: string;
};

/** نمایش ستاره‌های امتیاز — مشترک بین خلاصه‌ی امتیاز و کارت هر نظر */
export default function Stars({
  value,
  iconClassName = "size-4",
  className = "",
  label,
}: Props): ReactNode {
  const rounded = Math.round(value);

  return (
    <span
      role="img"
      aria-label={label ?? `امتیاز ${value.toLocaleString("fa-IR")} از ۵`}
      className={`inline-flex items-center gap-0.5 ${className}`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={`${iconClassName} ${
            index < rounded
              ? "fill-primary-400 text-primary-400"
              : "text-text/15"
          }`}
        />
      ))}
    </span>
  );
}
