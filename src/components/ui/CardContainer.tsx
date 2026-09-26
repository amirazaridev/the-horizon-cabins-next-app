import { ComponentProps, type ReactNode } from "react";

type TVariant = "default" | "gradient" | "primary";

type Props = ComponentProps<"div"> & {
  variant?: TVariant;
};
const varients: Record<TVariant, string> = {
  default:
    "rounded-2xl border border-foreground/5 bg-surface-raised/50 p-8 transition-all duration-500",
  gradient:
    "from-primary-400/40 relative rounded-3xl bg-linear-to-br via-foreground/10 to-transparent p-px",
  primary:
    "group hover:from-primary-400/40 relative rounded-3xl bg-linear-to-br from-foreground/10 via-foreground/5 to-transparent p-px transition-all duration-500",
};

export default function CardContainer({
  variant = "default",
  children,
  className,
  ...otherProps
}: Props): ReactNode {
  return (
    <div
      className={`${varients[variant]} ${className ? className : ""}`}
      {...otherProps}
    >
      {variant === "gradient" && (
        <div className="bg-surface/80 relative h-full overflow-hidden rounded-3xl p-8 backdrop-blur-sm md:p-10">
          <div className="bg-primary-400/30 absolute -top-24 -left-24 h-64 w-64 rounded-full blur-[100px]" />
          {children}
        </div>
      )}
      {variant === "primary" && (
        <div className="bg-surface/80 rounded-3xl p-6 backdrop-blur-sm md:p-7">
          {children}
        </div>
      )}
      {variant === "default" && children}
    </div>
  );
}
