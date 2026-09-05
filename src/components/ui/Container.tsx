import { ComponentProps, type ReactNode } from "react";

type Variant = "default" | "cabin-detail";

const containerClass: Record<Variant, string> = {
  default: "mx-auto max-w-7xl px-5 md:px-0",
  "cabin-detail": "mx-auto max-w-5xl px-3 md:px-8 lg:px-0 overflow-x-hidden",
};

type Props = ComponentProps<"div"> & { variant?: Variant };
export default function Container({
  variant = "default",
  children,
  className,
  ...otherProps
}: Props): ReactNode {
  return (
    <div className={`${containerClass[variant]} ${className}`} {...otherProps}>
      {children}
    </div>
  );
}
