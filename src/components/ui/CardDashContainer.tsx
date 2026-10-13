import { type ComponentProps, type ReactNode } from "react";

type Props = ComponentProps<"div"> & {
  /** غیرفعال‌کردن انیمیشن بالا‌آمدن در hover (مثلاً داخل فرم‌ها). */
  noTransition?: boolean;
};

export default function CardDashContainer({
  children,
  className = "",
  noTransition = false,
  ...otherProps
}: Props): ReactNode {
  const transition = noTransition
    ? ""
    : "transition-all duration-300 hover:-translate-y-0.75";

  return (
    <div
      className={`border-border bg-background-2 shadow-shadow-soft hover:border-border-strong rounded-2xl p-5 ${transition} ${className}`}
      {...otherProps}
    >
      {children}
    </div>
  );
}
