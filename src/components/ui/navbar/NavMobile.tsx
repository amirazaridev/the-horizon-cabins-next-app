import { NAV_ITEMS } from "@/constants/navigation";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import NavbarItem from "./NavbarItem";
import { X } from "lucide-react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import Button from "../Button";
import Logo from "../Logo";

type Props = { handleCloseMenu: () => void; isOpen: boolean };

export default function NavMobile({
  handleCloseMenu,
  isOpen,
}: Props): ReactNode {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;

    const tl = gsap.timeline();

    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" },
    );

    tl.fromTo(
      panelRef.current,
      { x: "100%" },
      { x: "0%", duration: 0.4, ease: "power3.out" },
      0,
    );

    const items = panelRef.current?.querySelectorAll(".nav-item");
    if (items) {
      tl.fromTo(
        items,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: "power2.out" },
        0.2,
      );
    }
  }, [isOpen]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeMenu = () => {
    const tl = gsap.timeline({
      onComplete: handleCloseMenu,
    });

    tl.to(panelRef.current, {
      x: "100%",
      duration: 0.3,
      ease: "power3.in",
    });

    tl.to(
      overlayRef.current,
      { opacity: 0, duration: 0.2, ease: "power2.in" },
      0,
    );
  };

  return (
    <div className="fixed inset-0 z-60 md:hidden">
      <div
        ref={overlayRef}
        onClick={closeMenu}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        className="absolute top-0 right-0 h-full w-9/12 max-w-sm bg-slate-900 shadow-2xl"
      >
        <nav className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <Logo />

            <button
              onClick={closeMenu}
              className="flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white"
              aria-label="Close menu"
            >
              <X />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((link) => (
                <NavbarItem
                  active={pathname === link.href}
                  closeMenu={closeMenu}
                  forMobile={true}
                  href={link.href}
                  label={link.label}
                  key={link.href}
                />
              ))}
            </ul>
          </div>

          <div className="border-t border-white/10 p-5">
            <Button href="/" fullWidth>
              ورود | ثبت‌نام
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
