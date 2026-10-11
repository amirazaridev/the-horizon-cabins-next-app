import { type ReactNode } from "react";

type Props = {
  children?: ReactNode;
  ref?: React.Ref<HTMLDivElement> | null;
  variant?: "default";
  className?: string;
};

export default function BadgeTitle({
  ref,
  children,
  className = "",
  // variant = "default",
}: Props): ReactNode {
  return (
    <div
      ref={ref}
      className={`border-foreground/10 bg-background/40 inline-flex items-center rounded-full border backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}
