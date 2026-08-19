"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import NavbarItem from "@/components/ui/navbar/NavbarItem";
import Logo from "@/components/ui/Logo";
import NavMenus from "@/components/ui/navbar/NavMenus";
import NavMobile from "@/components/ui/navbar/NavMobile";
import { NAV_ITEMS } from "@/constants/navigation";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    gsap.set(nav, { y: -100, opacity: 0 });

    gsap.to(nav, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      delay: 0.5,
    });

    const handleScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add(
          "backdrop-blur-xl",
          "bg-black/20",
          "shadow-lg",
          "border-b",
          "border-white/10",
        );
      } else {
        nav.classList.remove(
          "backdrop-blur-xl",
          "bg-black/20",
          "shadow-lg",
          "border-b",
          "border-white/10",
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 right-0 left-0 z-50 px-4 py-4 transition-all duration-300 md:px-6"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Logo />

          <ul className="hidden items-center gap-6 md:flex lg:gap-8">
            {NAV_ITEMS.map((link) => (
              <NavbarItem key={link.href} href={link.href} label={link.label} />
            ))}
          </ul>

          <NavMenus onClickMenu={() => setIsOpen(true)} />
        </div>
      </nav>

      {/* Navbar Android*/}
      {isOpen && (
        <NavMobile handleCloseMenu={() => setIsOpen(false)} isOpen={isOpen} />
      )}
    </>
  );
}
