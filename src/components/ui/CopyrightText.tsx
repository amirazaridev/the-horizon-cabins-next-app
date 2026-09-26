import { type ReactNode } from "react";

export default function CopyrightText(): ReactNode {
  return (
    <p className="text-foreground/30 z-10 mt-6 text-center text-xs">
      © {new Date().getFullYear()} هورایزن کابینز. تمامی حقوق محفوظ است.
    </p>
  );
}
