import type { ReactNode } from "react";

export default function CopyrightText({
  className = "",
}: {
  className?: string;
}): ReactNode {
  return (
    <p className={`text-text/30 text-center ${className}`}>
      © {new Date().getFullYear()} هورایزن کابینز. تمامی حقوق محفوظ است.
    </p>
  );
}
