import { TextAlignJustify } from "lucide-react";
import { type ReactNode } from "react";
import Button from "../Button";

type Props = { onClickMenu: () => void };

export default function NavMenus({ onClickMenu }: Props): ReactNode {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:block">
        <Button size="md"> ورود | ثبت‌نام</Button>
      </div>

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
