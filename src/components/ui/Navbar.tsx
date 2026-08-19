"use client";

import Link from "next/link";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { TextAlignJustify, X } from "lucide-react";
import NavbarItem from "./NavbarItem";

const navLinks = [
  { label: "خانه", href: "/" },
  { label: "درباره ما", href: "/about" },
  { label: "کابین‌ها", href: "/cabins" },
  { label: "امکانات", href: "/amenities" },
  { label: "گالری", href: "/gallery" },
  { label: "تماس", href: "/contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  const closeMenu = () => {
    const tl = gsap.timeline({
      onComplete: () => setIsOpen(false),
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
    <>
      <nav
        ref={navRef}
        className="fixed top-0 right-0 left-0 z-50 px-4 py-4 transition-all duration-300 md:px-6"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white md:text-2xl"
          >
            هورایزن
            <span className="text-primary-400">.</span>
          </Link>

          <ul className="hidden items-center gap-6 md:flex lg:gap-8">
            {navLinks.map((link) => (
              <NavbarItem key={link.href} href={link.href} label={link.label} />
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="bg-primary-500 hover:bg-primary-400 hidden rounded-full px-5 py-2.5 text-sm font-semibold text-black transition-colors duration-300 md:inline-flex lg:px-6"
            >
              رزرو کنید
            </Link>

            <button
              onClick={() => setIsOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-white md:hidden"
              aria-label="Open menu"
            >
              <TextAlignJustify />
            </button>
          </div>
        </div>
      </nav>

        {/* Navbar Android*/}
      {isOpen && (
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
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="text-xl font-bold text-white"
                >
                  هورایزن
                  <span className="text-primary-400">.</span>
                </Link>

                <button
                  onClick={closeMenu}
                  className="flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white"
                  aria-label="Close menu"
                >
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className="nav-item hover:text-primary-400 rounded-lg px-4 py-3 text-lg font-medium text-white/80 transition-colors hover:bg-white/5"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 p-5">
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="nav-item bg-primary-500 hover:bg-primary-400 block w-full rounded-full px-6 py-3 text-center font-semibold text-black transition-colors"
                >
                  رزرو کنید
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
