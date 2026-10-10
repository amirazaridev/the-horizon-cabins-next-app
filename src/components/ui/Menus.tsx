"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { MoreHorizontal } from "lucide-react";
import { createPortal } from "react-dom";
import useOutsideClick from "@/hooks/useOutsideClick";

interface AnchorInfo {
  rect: DOMRect;
  justBottom: boolean;
}

interface MenuContextValue {
  openId: string;
  anchor: RefObject<AnchorInfo | null>;
  /**
   * المان دکمه‌ی تریگر منوی باز.
   *
   * ⚠️ لازم است تا «کلیک بیرون» کلیک روی خودِ تریگر را نبَرد؛ در غیر این
   * صورت منو بسته و بی‌درنگ با `onClick` همان دکمه دوباره باز می‌شود.
   */
  toggleRef: RefObject<HTMLElement | null>;
  close: () => void;
  open: (id: string, info: AnchorInfo) => void;
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

function useMenuContext() {
  const context = useContext(MenuContext);
  if (!context) throw new Error("اجزای Menus باید داخل <Menus> استفاده بشن");
  return context;
}

function Menus({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState("");
  const anchor = useRef<AnchorInfo | null>(null);
  const toggleRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpenId(""), []);
  const open = useCallback((id: string, info: AnchorInfo) => {
    anchor.current = info;
    setOpenId(id);
  }, []);

  /**
   * بستن منو با اسکرول/تغییر اندازه و Escape.
   *
   * منو نسبت به `getBoundingClientRect` تریگر (یعنی نسبت به viewport)
   * موقعیت‌دهی می‌شود؛ با اسکرول یا ریسایز آن مستطیل بی‌اعتبار می‌شود، پس
   * به‌جای تعقیب موقعیت، منو را می‌بندیم.
   */
  useEffect(() => {
    if (!openId) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [openId, close]);

  return (
    <MenuContext value={{ openId, anchor, toggleRef, close, open }}>
      {children}
    </MenuContext>
  );
}

interface ToggleProps {
  id: string;
  icon?: ReactNode;
  justBottom?: boolean;
  /**
   * کلاس‌های اضافی دکمه‌ی تریگر.
   *
   * ⚠️ برای بازنویسی رنگ استفاده می‌شود (مثلاً `text-inherit!` در نوار بالا،
   * تا رنگ متن نوار — سفید روی هیرو / تیره روی پس‌زمینه‌ی جامد — حفظ شود).
   */
  className?: string;
}

function Toggle({ id, icon, justBottom = false, className = "" }: ToggleProps) {
  const { openId, open, close, toggleRef } = useMenuContext();
  const isOpen = openId === id;

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();

    if (isOpen) {
      close();
    } else {
      open(id, { rect, justBottom });
    }
  }

  return (
    <button
      type="button"
      /* ثبت المان تریگر برای تشخیص «کلیک بیرون» (به‌جای `useOutsideClick`). */
      ref={(node) => {
        toggleRef.current = node;
      }}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      className={`text-text-gray hover:bg-primary-400/10 hover:text-primary-400 flex cursor-pointer items-center rounded-lg p-1.5 transition-colors duration-150 ${className}`}
      onClick={handleClick}
    >
      {icon || <MoreHorizontal className="size-5" />}
    </button>
  );
}

interface ListProps {
  id: string;
  children: ReactNode;
  /** کلاس‌های اضافی ظرف منو — برای عرض/فاصله‌ی سفارشی (مثلاً منوی پروفایل). */
  className?: string;
}

const GAP = 8;
const VIEWPORT_MARGIN = 8;

function List({ id, children, className = "" }: ListProps) {
  const { anchor, openId, toggleRef, close } = useMenuContext();
  const isOpen = openId === id;
  const [style, setStyle] = useState<CSSProperties>({ visibility: "hidden" });

  /**
   * بستن با کلیک بیرون.
   *
   * ⚠️ `toggleRef` نادیده گرفته می‌شود تا کلیک روی دکمه‌ی پروفایل منو را
   * نبندد؛ toggle را کامل به `onClick` خودِ دکمه می‌سپاریم.
   */
  const ref = useOutsideClick<HTMLUListElement>(close, {
    ignore: [toggleRef],
    event: "pointerdown",
    enabled: isOpen,
  });

  useLayoutEffect(() => {
    const info = anchor.current;
    const menuEl = ref.current;
    if (!isOpen || !info || !menuEl) return;

    const { rect, justBottom } = info;
    const menu = menuEl.getBoundingClientRect();

    let left = rect.right - menu.width;
    let top = rect.bottom + GAP;

    if (
      !justBottom &&
      top + menu.height > window.innerHeight - VIEWPORT_MARGIN
    ) {
      top = rect.top - menu.height - GAP;
    }

    left = Math.min(
      Math.max(left, VIEWPORT_MARGIN),
      window.innerWidth - menu.width - VIEWPORT_MARGIN,
    );

    setStyle({ position: "fixed", top, left, visibility: "visible" });
  }, [isOpen, anchor, ref]);

  if (!isOpen) return null;

  return createPortal(
    <ul
      ref={ref}
      role="menu"
      className={`menu-dropdown border-border-strong bg-surface shadow-shadow-soft fixed z-50 min-w-44 flex-col overflow-hidden rounded-xl border p-1 md:min-w-48 ${className}`}
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
  /** غیرفعال‌کردن آیتم — مثلاً وقتی گذار وضعیت مجاز نیست. */
  disabled?: boolean;
}

function Button({ children, onClick, icon, danger, disabled = false }: ButtonProps) {
  const { close } = useMenuContext();

  function handleClick() {
    if (disabled) return;
    onClick?.();
    close();
  }

  return (
    <li>
      <button
        type="button"
        role="menuitem"
        disabled={disabled}
        onClick={handleClick}
        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 ${
          disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"
        } ${
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
  return <li className="bg-border-strong my-1 h-px" />;
}

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

/**
 * سرصفحه‌ی غیرکلیکی منو — برای نمایش اطلاعات زمینه‌ای (مثلاً پروفایل کاربر)
 * بالای آیتم‌ها. کلیک روی آن منو را نمی‌بندد.
 */
function Header({ children, className = "" }: HeaderProps) {
  return (
    <li
      className={`border-border-strong/60 mb-1 border-b px-2.5 pt-1.5 pb-2.5 ${className}`}
    >
      {children}
    </li>
  );
}

Menus.Button = Button;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Divider = Divider;
Menus.Header = Header;

export default Menus;
