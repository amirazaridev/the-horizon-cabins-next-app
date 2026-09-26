"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeToggle({
  forMobile = false,
}: {
  forMobile?: boolean;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
      className={`size-10 items-center justify-center rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10 ${forMobile ? "flex md:hidden" : "hidden md:flex"}`}
    >
      {theme === "dark" ? (
        <Sun className="size-5 text-yellow-400" />
      ) : (
        <Moon className="size-5" />
      )}
    </button>
  );
}
