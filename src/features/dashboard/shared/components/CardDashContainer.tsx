import { ComponentProps, type ReactNode } from "react";

type Props = ComponentProps<"div"> & {
  noTransition?: boolean;
};

export default function CardDashContainer({
  children,
  className,
  noTransition,
  ...otherProps
}: Props): ReactNode {
  return (
    <div
      className={`border-border bg-background-2 shadow-shadow-soft hover:border-border-strong rounded-2xl p-5 ${noTransition ? "" : "transition-all duration-300 hover:-translate-y-0.75"} ${className}`}
      {...otherProps}
    >
      {children}
    </div>
  );
}
