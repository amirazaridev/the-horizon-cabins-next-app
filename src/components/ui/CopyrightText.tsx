import { type ReactNode } from "react";


export default function CopyrightText(): ReactNode {
  return (
    <p className="z-10 mt-6 text-center text-xs text-white/30">
      © {new Date().getFullYear()} هورایزن کابینز. تمامی حقوق محفوظ است.
    </p>
  );
}
