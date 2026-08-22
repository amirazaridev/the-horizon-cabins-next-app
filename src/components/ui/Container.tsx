import { ComponentProps, type ReactNode } from "react";

type Props = ComponentProps<"div">;

export default function Container({
  children,
  className,
  ...otherProps
}: Props): ReactNode {
  return (
    <div className={`mx-auto max-w-7xl ${className}`} {...otherProps}>
      {children}
    </div>
  );
}
