"use client";

import { Menu, User } from "lucide-react";
import { SIDEBAR_ITEMS } from "../constants/sidebar-items";
import ThemeToggle from "@/components/ui/ThemeToggle";
import IconButton from "@/components/ui/IconButton";

interface HeaderProps {
  pathname: string;
  onMenuClick: () => void;
}

export default function Header({ pathname, onMenuClick }: HeaderProps) {
  const activeItem = SIDEBAR_ITEMS.find((item) => pathname === item.href);
  const title = activeItem?.name ?? "داشبورد";

  return (
    <header className="bg-surface/80 border-border inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-md sm:px-6 sticky">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="hover:bg-foreground/10 rounded-lg p-2 lg:hidden"
          aria-label="باز کردن منو"
        >
          <Menu className="size-5" />
        </button>
        <h1 className="text-foreground text-lg font-bold">{title}</h1>
      </div>
      <div className="flex">
        <ThemeToggle />
        <IconButton>
          <User />
        </IconButton>
      </div>
    </header>
  );
}
