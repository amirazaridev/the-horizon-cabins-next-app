import { type ComponentProps, type ReactNode } from "react";

type CardVariant = "default" | "gradient" | "primary";

type Props = ComponentProps<"div"> & {
  variant?: CardVariant;
  contentClassName?: string;
};


const frame: Record<CardVariant, string> = {
  default:
    "rounded-2xl border border-foreground/5 bg-surface-raised/50 transition-all duration-500",
  gradient:
    "relative rounded-3xl bg-linear-to-br from-primary-400/40 via-foreground/10 to-transparent p-px",
  primary:
    "group relative rounded-3xl bg-linear-to-br from-foreground/10 via-foreground/5 to-transparent p-px transition-all duration-500",
};

const contentPadding: Record<CardVariant, string> = {
  default: "p-8",
  gradient: "p-8 md:p-10",
  primary: "p-6 md:p-7",
};

export default function CardContainer({
  variant = "default",
  contentClassName,
  children,
  className = "",
  ...otherProps
}: Props): ReactNode {
  const padding = contentClassName ?? contentPadding[variant];

  if (variant === "gradient") {
    return (
      <div className={`${frame.gradient} ${className}`} {...otherProps}>
        <div
          className={`bg-surface/80 relative h-full overflow-hidden rounded-3xl backdrop-blur-sm ${padding}`}
        >
          {/* لکه‌ی تزئینی — `pointer-events-none` تا کلیک گوشه را نگیرد */}
          <div
            aria-hidden="true"
            className="bg-primary-400/30 pointer-events-none absolute -top-24 -left-24 size-64 rounded-full blur-[100px]"
          />
          {children}
        </div>
      </div>
    );
  }

  if (variant === "primary") {
    return (
      <div className={`${frame.primary} ${className}`} {...otherProps}>
        <div
          className={`bg-surface/80 rounded-3xl backdrop-blur-sm ${padding}`}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`${frame.default} ${padding} ${className}`} {...otherProps}>
      {children}
    </div>
  );
}
