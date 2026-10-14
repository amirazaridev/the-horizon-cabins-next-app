"use client";

import { useEffect, useState } from "react";

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
