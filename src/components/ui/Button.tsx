import Link from "next/link";
import { ComponentProps, type ReactNode } from "react";

type Variant = "primary" | "outline" | "success" | "warning";
type Size = "md" | "lg";
type Shape = "full" | "xl";

type Props = Omit<ComponentProps<"button">, "className" | "children"> & {
  href?: string;
  variant?: Variant;
  size?: Size;
  shape?: Shape;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

const base =
  "group inline-flex cursor-pointer select-none items-center justify-center gap-2 font-semibold transition-all duration-300";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary-400 text-black hover:bg-primary-300 hover:shadow-lg hover:shadow-primary-400/30",
  outline:
    "border border-foreground/20 text-foreground backdrop-blur-sm hover:border-primary-400/50 hover:bg-foreground/10 hover:text-primary-400",
  success:
    "bg-emerald-400 text-black hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/30",
  warning:
    "bg-orange-400 text-black hover:bg-orange-300 hover:shadow-lg hover:shadow-orange-400/30",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const shapes: Record<Shape, string> = {
  full: "rounded-full",
  xl: "rounded-xl",
};

export default function Button({
  href,
  variant = "primary",
  size = "lg",
  shape = "full",
  fullWidth = false,
  className = "",
  children,
  ...otherProps
}: Props) {
  const classes = [
    base,
    variants[variant],
    sizes[size],
    shapes[shape],
    fullWidth ? "w-full" : "",
    "disabled:pointer-events-none disabled:opacity-60",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (!href) return <button className={classes} {...otherProps}>{children}</button>;

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}