import { TextAlignJustify } from "lucide-react";
import { type ReactNode } from "react";
import ThemeToggle from "../ThemeToggle";
import LoginButton from "./LoginButton";
import ProfileMenu from "./ProfileMenu";
import type { NavbarUser } from "./types";

type Props = {
  onClickMenu: () => void;
  /** کاربر وارد‌شده — اگر باشد، حالت پروفایل جای دکمه‌ی ورود می‌نشیند. */
  user?: NavbarUser | null;
};

export default function NavMenus({ onClickMenu, user }: Props): ReactNode {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <ThemeToggle />

      <div className="hidden md:block">
        {user ? (
          <ProfileMenu email={user.email} role={user.role} />
        ) : (
          <LoginButton />
        )}
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
