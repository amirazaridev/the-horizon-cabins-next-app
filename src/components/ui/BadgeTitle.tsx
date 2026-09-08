import { PropsWithChildren, Ref, type ReactNode } from "react";

type Props = PropsWithChildren & {
  ref?: Ref<HTMLDivElement> | null;
  variant?: "default" | "point-animation";
  className?: string;
};

export default function BadgeTitle({
  ref,
  children,
  className,
  variant = "default",
}: Props): ReactNode {
  if (variant === "point-animation")
    return (
      <div ref={ref} className="mb-8 inline-flex">
        <div className="flex items-center gap-3 rounded-full border border-foreground/10 bg-foreground/5 px-5 py-2.5 backdrop-blur-sm">
          <div className="bg-primary-400 size-2 animate-pulse rounded-full" />
          <span className="text-primary-400 text-xs font-medium tracking-wider md:text-sm">
            {children}
          </span>
        </div>
      </div>
    );

  return (
    <div className={`inline-flex items-center rounded-full border border-foreground/10 bg-background/40 backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
}
