"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

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
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          "bg-white/10",
          "shadow-lg",
          "border-b",
          "border-white/10",
        );
      } else {
        nav.classList.remove(
          "backdrop-blur-xl",
          "bg-white/10",
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
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        gsap.fromTo(
          mobileMenuRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        );
      }
    }
  }, [isMobileMenuOpen]);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
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
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:text-primary-400 group relative text-sm font-medium text-white/70 transition-colors duration-300"
              >
                {link.label}
                <span className="bg-primary-400 absolute right-0 -bottom-1 h-0.5 w-0 transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full bg-primary-400 px-5 py-2.5 text-sm font-semibold text-black transition-colors duration-300 hover:bg-primary-400/70 md:inline-flex lg:px-6"
          >
            رزرو کنید
          </a>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center text-white md:hidden"
            aria-label="منو"
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-full right-0 left-0 border-b border-white/10 bg-slate-900/95 backdrop-blur-xl md:hidden"
        >
          <div className="space-y-4 px-4 py-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="block py-2 text-white/70 transition-colors hover:text-primary-400"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={handleLinkClick}
              className="mt-4 block w-full rounded-full bg-primary-400 px-6 py-3 text-center font-semibold text-black transition-colors hover:bg-primary-400/70"
            >
              رزرو کنید
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
