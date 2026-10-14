"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

import NavbarItem from "@/components/ui/Navbar/NavbarItem";
import Logo from "@/components/ui/Logo";
import NavMenus from "@/components/ui/Navbar/NavMenus";
import NavMobile from "@/components/ui/Navbar/NavMobile";
import type { NavbarUser } from "@/components/ui/Navbar/types";
import { NAV_ITEMS } from "@/constants/navigation";
import { usePathname } from "next/navigation";
import {
  isAppReady,
  subscribeAppReady,
} from "@/libs/utils/app-ready";
import Container from "../Container";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Props = {
  user?: NavbarUser | null;
};

export default function Navbar({ user = null }: Props) {
  const navRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathName = usePathname();
  const isLandingPage = pathName === "/";

  const lastPathRef = useRef(pathName);
  useIsomorphicLayoutEffect(() => {
    if (lastPathRef.current === pathName) return;
    lastPathRef.current = pathName;
    document.documentElement.dataset.clientNav = "1";
  }, [pathName]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !isLandingPage) return;

    // اگر مراسم ورود قبلاً پخش شده، دوباره انیمیشن نمی‌زنیم
    if (isAppReady()) return;

    let timeline: gsap.core.Timeline | null = null;

    const play = () => {
      gsap.set(nav, { y: -100, opacity: 0 });
      timeline = gsap.timeline();
      timeline.to(nav, {
        y: 0,
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
      });
    };

    const unsubscribe = subscribeAppReady(play);

    return () => {
      unsubscribe();
      timeline?.kill();
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
        data-navbar=""
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

          <NavMenus user={user} onClickMenu={() => setIsOpen(true)} />
        </Container>
      </nav>

      {/* Navbar Android*/}
      {isOpen && (
        <NavMobile
          user={user}
          handleCloseMenu={() => setIsOpen(false)}
          isOpen={isOpen}
        />
      )}
    </>
  );
}
