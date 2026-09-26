import { TextAlignJustify } from "lucide-react";
import { type ReactNode } from "react";
import ThemeToggle from "../ThemeToggle";
import LoginButton from "./LoginButton";

type Props = { onClickMenu: () => void };

export default function NavMenus({ onClickMenu }: Props): ReactNode {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <ThemeToggle />

      <div className="hidden md:block">
        <LoginButton />
      </div>

      <button
        onClick={onClickMenu}
        className="text flex h-10 w-10 items-center justify-center md:hidden"
        aria-label="Open menu"
      >
        <TextAlignJustify />
      </button>
    </div>
  );
}
