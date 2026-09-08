import Link from "next/link";
import { type ReactNode } from "react";

export default function Logo(): ReactNode {
  return (
    <Link
      href="/"
      className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
    >
      هورایزن
      <span className="text-primary-400">.</span>
    </Link>
  );
}
