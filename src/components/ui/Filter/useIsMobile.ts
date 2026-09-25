"use client";

import { useEffect, useState } from "react";

/** تشخیص موبایل با matchMedia — پیش‌فرض md (زیر ۷۶۸px). SSR-safe. */
export default function useIsMobile(query = "(max-width: 767.5px)") {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return isMobile;
}
