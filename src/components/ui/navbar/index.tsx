"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import NavbarItem from "@/components/ui/Navbar/NavbarItem";
import Logo from "@/components/ui/Logo";
import NavMenus from "@/components/ui/Navbar/NavMenus";
import NavMobile from "@/components/ui/Navbar/NavMobile";
import { NAV_ITEMS } from "@/constants/navigation";
import { usePathname } from "next/navigation";
import Container from "../Container";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathName = usePathname();
  const isLandingPage = pathName === "/";

  useEffect(() => {
    const nav = navRef.current;

    if (!nav || !isLandingPage) return;

    gsap.set(nav, { y: -100, opacity: 0 });

    gsap.to(nav, {
      y: 0,
      opacity: 1,
      duration: 0.2,
      ease: "power3.out",
      delay: 0.5,
    });

    return () => {
      gsap.set(nav, { clearProps: "transform,opacity" });
    };
  }, [isLandingPage]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hasSolidBackground = isScrolled || !isLandingPage;
  const textColor = isLandingPage && !isScrolled ? "text-white" : "text-text";

  return (
    <>
      <nav
        ref={navRef}
        className={`${isLandingPage ? "fixed" : "sticky"} ${textColor} ${
          hasSolidBackground
            ? "border-foreground/10 bg-background/80 border-b shadow-lg backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        } top-0 right-0 left-0 z-50 px-4 py-4 transition-all duration-300 md:px-6`}
      >
        <Container className="flex items-center justify-between">
          <Logo />

          <ul className="hidden items-center gap-6 md:flex lg:gap-8">
            {NAV_ITEMS.map((link) => (
              <NavbarItem
                active={pathName === link.href}
                key={link.href}
                href={link.href}
                label={link.label}
              />
            ))}
          </ul>

          <NavMenus onClickMenu={() => setIsOpen(true)} />
        </Container>
      </nav>

      {/* Navbar Android*/}
      {isOpen && (
        <NavMobile handleCloseMenu={() => setIsOpen(false)} isOpen={isOpen} />
      )}
    </>
  );
}
