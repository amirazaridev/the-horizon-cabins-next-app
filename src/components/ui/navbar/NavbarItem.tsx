import Link from "next/link";
import { type ReactNode } from "react";

type Props = {
  href: string;
  label: string;
  forAndroid?: boolean;
  closeMenu?: () => void;
  active: boolean;
};

export default function NavbarItem({
  href,
  label,
  forAndroid = false,
  closeMenu = () => {},
  active,
}: Props): ReactNode {
  if (forAndroid)
    return (
      <Link href={href}>
        <li
          className={`${active ? "text-primary-400 bg-white/5" : "hover:text-primary-400 text-white/80 hover:bg-white/5"} rounded-lg px-4 py-3 text-lg font-medium transition-colors`}
          onClick={closeMenu}
        >
          {label}
        </li>
      </Link>
    );

  return (
    <Link href={href}>
      <li
        className={`group ${active ? "text-primary-400" : "hover:text-primary-400 text-white/70"} relative text-sm font-medium transition-colors duration-300`}
      >
        {label}
        <span
          className={`bg-primary-400 absolute right-0 -bottom-1 h-0.5 w-0 transition-all duration-300 ${active ? "w-full" : "group-hover:w-full"}`}
        />
      </li>
    </Link>
  );
}
