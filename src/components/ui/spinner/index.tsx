"use client";

import styles from "./style.module.css";

const SIZES = {
  xs: { w: 18, sw: 2, labelSize: "text-xs" },
  sm: { w: 28, sw: 2.5, labelSize: "text-sm" },
  md: { w: 40, sw: 3, labelSize: "text-base" },
  lg: { w: 56, sw: 3.5, labelSize: "text-lg" },
  xl: { w: 80, sw: 4, labelSize: "text-xl" },
} as const;

type SpinnerSize = keyof typeof SIZES;

interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  className?: string;
  fullscreen?: boolean;
  fullWidth?: boolean;
}

const STYLES = `
@keyframes sd-spin {
  to { transform: rotate(360deg) }
}
@keyframes sd-draw {
  0%   { stroke-dasharray: 1 150; stroke-dashoffset: 0;    opacity: .6 }
  50%  { stroke-dasharray: 90 150; stroke-dashoffset: -35;  opacity: 1  }
  100% { stroke-dasharray: 1 150; stroke-dashoffset: -124; opacity: .6 }
}
@keyframes sd-label-in {
  from { opacity: 0; transform: translateY(4px) }
  to   { opacity: .45; transform: translateY(0) }
}
`;

export default function Spinner({
  size = "md",
  label,
  className = "",
  fullscreen = false,
  fullWidth = false
}: SpinnerProps) {
  const { w, sw, labelSize } = SIZES[size];

  if (fullscreen) {
    return (
      <div
        className={`bg-background fixed inset-0 z-50 flex flex-col items-center justify-center ${className}`}
        aria-label={label ?? "در حال بارگذاری"}
      >
        <style>{STYLES}</style>
        <svg
          width={SIZES.lg.w}
          height={SIZES.lg.w}
          viewBox="0 0 50 50"
          aria-hidden="true"
          className={styles["animate-sd-spin"]}
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth={SIZES.lg.sw}
            strokeLinecap="round"
            className={`stroke-primary-400 ${styles["animate-sd-draw"]}`}
          />
        </svg>
        {label && (
          <span
            className={`${labelSize} ${styles["animate-sd-label-in"]} text-foreground font-normal opacity-50`}
          >
            {label}
          </span>
        )}
      </div>
    );
  }
  //? base Spinner
  return (
    <div
      className={`inline-flex flex-col items-center justify-center gap-y-3 ${className} ${fullWidth ? "w-full" : ""}`}
      aria-label={label ?? "در حال بارگذاری"}
    >
      <style>{STYLES}</style>

      <svg
        width={w}
        height={w}
        viewBox="0 0 50 50"
        className={styles["animate-sd-spin"]}
        aria-hidden="true"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          className={`stroke-primary-400 ${styles["animate-sd-draw"]}`}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      </svg>

      {label && (
        <span
          className={`${labelSize} text-foreground font-normal opacity-50`}
          style={{
            animation: "sd-label-in .4s ease-out both",
            animationDelay: ".3s",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
