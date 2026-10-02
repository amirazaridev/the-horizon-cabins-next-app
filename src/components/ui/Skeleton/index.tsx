import type { CSSProperties, ReactNode } from "react";

import styles from "./style.module.css";

type Length = number | string;

export interface SkeletonProps {
  
  count?: number;
  width?: Length;
  height?: Length;
  radius?: Length;
  aspectRatio?: string;
  circle?: boolean;
  direction?: "row" | "column";
  gap?: Length;
  className?: string;
  containerClassName?: string;
  label?: string;
  style?: CSSProperties;
}

const toCss = (value?: Length): string | undefined =>
  value === undefined
    ? undefined
    : typeof value === "number"
      ? `${value}px`
      : value;


export default function Skeleton({
  count = 1,
  width,
  height,
  radius,
  aspectRatio,
  circle = false,
  direction = "column",
  gap = 8,
  className = "",
  containerClassName = "",
  label,
  style,
}: SkeletonProps): ReactNode {
  const total = Math.max(1, Math.floor(count));

  const blockStyle: CSSProperties = {
    width: toCss(width),
    height: circle ? toCss(width) : toCss(height),
    borderRadius: circle ? "9999px" : toCss(radius),
    aspectRatio: circle ? undefined : aspectRatio,
    ...style,
  };

  const blockClass = `${styles.block} ${className}`.trim();

  /* تک‌بلوک تزئینی: بدون ظرف اضافه */
  if (total === 1 && !label) {
    return <div aria-hidden="true" className={blockClass} style={blockStyle} />;
  }

  return (
    <div
      role="status"
      aria-busy="true"
      className={`flex ${direction === "row" ? "flex-row" : "flex-col"} ${containerClassName}`.trim()}
      style={{ gap: toCss(gap) }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className={blockClass}
          style={blockStyle}
        />
      ))}
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}
