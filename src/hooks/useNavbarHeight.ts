"use client";

import { useEffect, useState } from "react";

/**
 * ارتفاع واقعی نوار بالا را می‌خواند و در CSS var می‌نویسد.
 *
 * چرا اندازه‌گیری زنده و نه یک عدد ثابت؟ چون ارتفاع Navbar به فونت،
 * شکستن خط و padding داخلی‌اش بستگی دارد و hardcode کردنش با هر تغییر
 * کوچک در نوار بالا، جای سکشن‌ها و نوار تب چسبان را به‌هم می‌ریزد.
 * مقدار پیش‌فرض در `globals.css` (`--hz-navbar-h`) رزرو شده است تا قبل
 * از اجرای این هوک هم چیدمان درست باشد.
 */
export default function useNavbarHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector<HTMLElement>("[data-navbar]");
    if (!navbar) return;

    const apply = () => {
      const next = Math.round(navbar.getBoundingClientRect().height);
      if (next <= 0) return;
      setHeight(next);
      document.documentElement.style.setProperty("--hz-navbar-h", `${next}px`);
    };

    apply();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", apply);
      return () => window.removeEventListener("resize", apply);
    }

    const observer = new ResizeObserver(apply);
    observer.observe(navbar);
    return () => observer.disconnect();
  }, []);

  return height;
}
