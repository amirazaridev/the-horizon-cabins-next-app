"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts/ThemeProvider";

export default function ThemeToggle({
  forMobile = false,
}: {
  forMobile?: boolean;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10 ${forMobile ? "flex" : "hidden md:flex"}`}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
    </button>
  );
}
