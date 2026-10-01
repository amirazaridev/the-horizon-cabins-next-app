"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

import NavbarItem from "@/components/ui/Navbar/NavbarItem";
import Logo from "@/components/ui/Logo";
import NavMenus from "@/components/ui/Navbar/NavMenus";
import NavMobile from "@/components/ui/Navbar/NavMobile";
import { NAV_ITEMS } from "@/constants/navigation";
import { usePathname } from "next/navigation";
import {
  isLandingReady,
  subscribeLandingReady,
} from "@/libs/utils/landing-ready";
import Container from "../Container";

/**
 * `useLayoutEffect` روی سرور هشدار می‌دهد؛ این نسخه در SSR به `useEffect`
 * برمی‌گردد. (الگوی شناخته‌شده‌ی isomorphic layout effect)
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathName = usePathname();
  const isLandingPage = pathName === "/";

  /**
   * ثبت ناوبری کلاینتی.
   *
   * پیش‌لودر لندینگ فقط در «بارگذاری سرد/رفرش» باید پخش شود. اولین مسیری که
   * این کامپوننت با آن mount می‌شود همان بارگذاری سخت است؛ هر تغییرِ بعدیِ
   * مسیر یعنی کاربر بدون رفرش جابه‌جا شده. صفت را روی `<html>` می‌گذاریم (نه
   * state ری‌اکت) تا CSS پیش‌لودر را قبل از اولین paint پنهان کند و هیچ
   * mismatch هیدریشنی هم پیش نیاید.
   */
  const lastPathRef = useRef(pathName);
  useIsomorphicLayoutEffect(() => {
    if (lastPathRef.current === pathName) return;
    lastPathRef.current = pathName;
    document.documentElement.dataset.clientNav = "1";
  }, [pathName]);

  /**
   * ورود نوار بالا — هم‌زمان با ورود هیرو.
   *
   * قبلاً یک `delay` ثابتِ ۰.۵ ثانیه‌ای داشت و از پیش‌لودر جدا بود، پس نوار
   * دیرتر از هیرو ظاهر می‌شد. حالا به سیگنالِ «لندینگ آماده است» وصل است.
   *
   * نکته‌ی مهم برای graceful degradation: پنهان‌کردن نوار (`gsap.set`) فقط
   * داخل `play()` انجام می‌شود. اگر سیگنال هرگز نرسد (خطای JS/GSAP)، نوار
   * دست‌نخورده و دیده‌شدنی می‌ماند.
   */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !isLandingPage) return;

    // اگر مراسم ورود قبلاً پخش شده، دوباره انیمیشن نمی‌زنیم
    if (isLandingReady()) return;

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

    const unsubscribe = subscribeLandingReady(play);

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
