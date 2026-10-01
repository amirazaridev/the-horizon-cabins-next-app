import { ComponentProps, type ReactNode } from "react";

type TVariant = "default" | "gradient" | "primary";

type Props = ComponentProps<"div"> & {
  variant?: TVariant;
  /**
   * پدینگ لایه‌ی داخلی — پیش‌فرض بر اساس واریانت.
   *
   * چرا لازم است؟ پدینگ داخل `varients` هاردکد شده و با کلاس‌های Tailwind
   * نمی‌شود بازنویسی‌اش کرد (ترتیب تولید CSS تعیین‌کننده است، نه ترتیب
   * کلاس‌ها). برای جاهایی که قاب گرادیانی لازم است ولی پدینگ باید
   * فشرده‌تر باشد (مثل aside رزرو)، از این پراپ استفاده کنید.
   */
  contentClassName?: string;
};

const varients: Record<TVariant, string> = {
  default:
    "rounded-2xl border border-foreground/5 bg-surface-raised/50 p-8 transition-all duration-500",
  gradient:
    "from-primary-400/40 relative rounded-3xl bg-linear-to-br via-foreground/10 to-transparent p-px",
  primary:
    "group hover:from-primary-400/40 relative rounded-3xl bg-linear-to-br from-foreground/10 via-foreground/5 to-transparent p-px transition-all duration-500",
};

/** پدینگ پیش‌فرض لایه‌ی داخلی هر واریانت */
const contentPadding: Record<TVariant, string> = {
  default: "",
  gradient: "p-8 md:p-10",
  primary: "p-6 md:p-7",
};

export default function CardContainer({
  variant = "default",
  contentClassName,
  children,
  className,
  ...otherProps
}: Props): ReactNode {
  const innerPadding = contentClassName ?? contentPadding[variant];

  return (
    <div
      className={`${varients[variant]} ${className ? className : ""}`}
      {...otherProps}
    >
      {variant === "gradient" && (
        <div
          className={`bg-surface/80 relative h-full overflow-hidden rounded-3xl backdrop-blur-sm ${innerPadding}`}
        >
          <div className="bg-primary-400/30 absolute -top-24 -left-24 h-64 w-64 rounded-full blur-[100px]" />
          {children}
        </div>
      )}
      {variant === "primary" && (
        <div
          className={`bg-surface/80 rounded-3xl backdrop-blur-sm ${innerPadding}`}
        >
          {children}
        </div>
      )}
      {variant === "default" && children}
    </div>
  );
}
