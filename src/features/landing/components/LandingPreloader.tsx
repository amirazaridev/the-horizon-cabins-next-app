import type { ReactNode } from "react";

type Props = {
  done?: boolean;
  autoHide?: boolean;
};

const SHIMMER_BAR_CLASS = [
  "relative block isolate overflow-hidden",
  "after:absolute after:inset-0 after:content-['']",
  "after:animate-shimmer",
  "after:bg-linear-to-r",
  "after:from-transparent",
  "after:via-primary-400/20",
  "after:to-transparent",
  "dark:after:via-primary-300/15",
].join(" ");

/** یک خط اسکلتون با درخشش ملایم. */
function ShimmerBar({
  className,
}: {
  className: string;
}): ReactNode {
  return <span className={`${SHIMMER_BAR_CLASS} ${className}`} />;
}

export default function LandingPreloader({
  done = false,
  autoHide = true,
}: Props): ReactNode {
  return (
    <div
      className={[
        "pointer-events-none fixed inset-0 z-100",
        "grid place-items-center p-4",
        "bg-background text-text",
        "animate-preloader-out",
        "data-[state=done]:animate-preloader-out-now",
        "data-[autohide=off]:animate-none",
        "in-data-[client-nav=1]:data-[autohide=on]:hidden",
        "motion-reduce:[animation-delay:0.04s]",
      ].join(" ")}
      data-state={done ? "done" : "pending"}
      data-autohide={autoHide ? "on" : "off"}
      aria-hidden="true"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="max-w-2xl">
          {/* Brand */}
          <div className="mb-5 flex items-center gap-3 text-[11px] font-bold tracking-[0.24em]">
            <span className="h-px w-8 bg-primary-500 dark:bg-primary-400" />
            <span className="text-primary-600 dark:text-primary-400">
              HORIZON
            </span>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-3">
            <ShimmerBar
              className={[
                "h-9 w-[min(100%,26rem)] rounded-lg",
                "bg-background-2 sm:h-12 lg:h-14",
              ].join(" ")}
            />

            <ShimmerBar
              className={[
                "h-9 w-[min(100%,16rem)] rounded-lg",
                "bg-surface-raised sm:h-12 lg:h-14",
              ].join(" ")}
            />
          </div>

          {/* Supporting text */}
          <div className="mt-5 flex flex-col gap-3">
            <ShimmerBar className="h-3 w-[min(100%,30rem)] rounded-full bg-border/80" />
            <ShimmerBar className="h-3 w-[min(100%,20rem)] rounded-full bg-border/50" />
          </div>

          {/* Search placeholder */}
          <ShimmerBar
            className={[
              "mt-8 h-16 w-full rounded-2xl border",
              "border-border bg-surface shadow-sm shadow-black/3",
              "md:h-19",
            ].join(" ")}
          />

          {/* Progress indicator */}
          <div
            className={[
              "relative mt-8 block h-0.5 w-full max-w-3xl",
              "overflow-hidden rounded-full bg-border/70",
              "after:absolute after:inset-y-0 after:left-0",
              "after:w-[38%] after:rounded-full",
              "after:bg-primary-500 dark:after:bg-primary-400",
              "after:animate-preloader-slide",
            ].join(" ")}
          />
        </div>
      </div>
    </div>
  );
}