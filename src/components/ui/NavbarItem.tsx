
import Link from "next/link";
import { type ReactNode } from "react";

type Props = { href: string; label: string };

export default function NavbarItem({ href, label }: Props): ReactNode {
  return (
    <li>
      <Link
        href={href}
        className="group hover:text-primary-400 relative text-sm font-medium text-white/70 transition-colors duration-300"
      >
        {label}
        <span className="bg-primary-400 absolute right-0 -bottom-1 h-0.5 w-0 transition-all duration-300 group-hover:w-full" />
      </Link>
    </li>
  );
}
