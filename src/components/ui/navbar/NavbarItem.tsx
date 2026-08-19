import Link from "next/link";
import { type ReactNode } from "react";

type Props = {
  href: string;
  label: string;
  forAndroid?: boolean;
  closeMenu?: () => void;
};

export default function NavbarItem({
  href,
  label,
  forAndroid = false,
  closeMenu = () => {},
}: Props): ReactNode {
  if (forAndroid)
    return (
      <li className="nav-item hover:text-primary-400 rounded-lg px-4 py-3 text-lg font-medium text-white/80 transition-colors hover:bg-white/5" onClick={closeMenu}>
        <Link href={href}>{label}</Link>
      </li>
    );

  return (
    <li className="group hover:text-primary-400 relative text-sm font-medium text-white/70 transition-colors duration-300">
      <Link href={href}>
        {label}
        <span className="bg-primary-400 absolute right-0 -bottom-1 h-0.5 w-0 transition-all duration-300 group-hover:w-full" />
      </Link>
    </li>
  );
}
