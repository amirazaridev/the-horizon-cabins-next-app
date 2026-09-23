"use client";

import { useEffect, useState } from "react";

/** بررسی زنده‌ی یک media query (مثلاً برای انتخاب تعداد ماه‌های تقویم) */
export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handleChange = () => setMatches(mql.matches);

    handleChange();
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}
