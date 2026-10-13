import { type ComponentProps, type ReactNode } from "react";

type Size = "default" | "wide";
const containerClass: Record<Size, string> = {
  default: "mx-auto max-w-7xl px-5 md:px-0",
  wide: "mx-auto max-w-[86rem] px-3 md:px-8 lg:px-0",
};

type Props = ComponentProps<"div"> & { size?: Size };

export default function Container({
  size = "default",
  children,
  className = "",
  ...otherProps
}: Props): ReactNode {
  return (
    <div className={`${containerClass[size]} ${className}`} {...otherProps}>
      {children}
    </div>
  );
}
