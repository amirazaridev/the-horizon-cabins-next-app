import { Mountain } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";

export default function Logo(): ReactNode {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="هورایزن">
      <span className="border-primary-600/40 bg-primary-400/8 flex size-10 items-center justify-center rounded-xl border shadow">
        <Mountain className="stroke-primary-400" size={22} strokeWidth={1.8} />
      </span>
      <span className="block text-xl font-semibold tracking-[0.24em]">
        هورایزن
      </span>
    </Link>
  );
}
