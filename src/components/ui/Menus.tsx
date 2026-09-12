"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { MoreHorizontal } from "lucide-react";
import { createPortal } from "react-dom";
import useOutsideClick from "@/hooks/useOutsideClick";

type MenuPosition = { side: number; top: number };

interface MenuContextValue {
  openId: string;
  position: RefObject<MenuPosition | null>;
  close: () => void;
  open: (id: string) => void;
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

function useMenuContext() {
  const context = useContext(MenuContext);
  if (!context) throw new Error("اجزای Menus باید داخل <Menus> استفاده بشن");
  return context;
}

function Menus({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState("");
  const position = useRef<MenuPosition | null>(null);

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenuContext value={{ openId, position, close, open }}>
      {children}
    </MenuContext>
  );
}

interface ToggleProps {
  id: string;
  icon?: ReactNode;
  justBottom?: boolean;
}

function Toggle({ id, icon, justBottom = false }: ToggleProps) {
  const { openId, open, close, position } = useMenuContext();

  useEffect(() => {
    const handleScroll = () => close();
    document.addEventListener("scroll", handleScroll, true);
    return () => document.removeEventListener("scroll", handleScroll, true);
  }, [close]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = (e.target as HTMLElement)
      .closest("button")!
      .getBoundingClientRect();
    const isRtl = document.documentElement.dir === "rtl";

    position.current = isRtl
      ? {
          side: justBottom
            ? window.innerWidth - rect.right - 120
            : window.innerWidth - rect.right - rect.right / 1,
          top: rect.bottom + 8,
        }
      : {
          side: rect.left - 100,
          top: rect.bottom + 8,
        };

    openId === "" || openId !== id ? open(id) : close();
  }

  return (
    <button
      className="flex cursor-pointer items-center rounded-lg p-1.5 text-text-gray transition-colors duration-150 hover:bg-primary-400/10 hover:text-primary-400"
      onClick={handleClick}
    >
      {icon || <MoreHorizontal className="size-5" />}
    </button>
  );
}

interface ListProps {
  id: string;
  children: ReactNode;
}

function List({ id, children }: ListProps) {
  const { position, openId, close } = useMenuContext();
  const ref = useOutsideClick(close, true);

  if (openId !== id || !position.current) return null;

  const isRtl = document.documentElement.dir === "rtl";

  const style = isRtl
    ? { right: position.current.side + "px", top: position.current.top + "px" }
    : { left: position.current.side + "px", top: position.current.top + "px" };

  return createPortal(
    <ul
      ref={ref}
      className="menu-dropdown fixed z-50 min-w-44 flex-col overflow-hidden rounded-xl border border-border-strong bg-surface p-1 shadow-shadow-soft md:min-w-48"
      style={style}
    >
      {children}
    </ul>,
    document.body,
  );
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  danger?: boolean;
}

function Button({ children, onClick, icon, danger }: ButtonProps) {
  const { close } = useMenuContext();

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <button
        onClick={handleClick}
        className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 ${
          danger
            ? "text-danger hover:bg-danger/10"
            : "text-text hover:bg-primary-400/10"
        }`}
      >
        {icon && (
          <span
            className={`flex size-5 items-center justify-center transition-colors duration-150 ${
              danger
                ? "text-danger/60 group-hover:text-danger"
                : "text-text-gray group-hover:text-primary-400"
            }`}
          >
            {icon}
          </span>
        )}
        <span>{children}</span>
      </button>
    </li>
  );
}

function Divider() {
  return <li className="my-1 h-px bg-border-strong" />;
}

Menus.Button = Button;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Divider = Divider;

export default Menus;