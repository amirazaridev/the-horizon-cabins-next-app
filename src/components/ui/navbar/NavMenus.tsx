import { TextAlignJustify } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";

type Props = {onClickMenu : () => void};

export default function NavMenus({onClickMenu}: Props): ReactNode {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/contact"
        className="bg-primary-500 hover:bg-primary-400 hidden rounded-full px-5 py-2.5 text-sm font-semibold text-black transition-colors duration-300 md:inline-flex lg:px-6"
      >
        رزرو کنید
      </Link>

      <button
        onClick={onClickMenu}
        className="flex h-10 w-10 items-center justify-center text-white md:hidden"
        aria-label="Open menu"
      >
        <TextAlignJustify />
      </button>
    </div>
  );
}
