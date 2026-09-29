"use client";

import type { City } from "@/features/cabins/types/city.types";
import { useLandingSearchController } from "../hooks/useLandingSearchController";
import Search from "./Search";

/**
 * سرچ هیرو لندینگ.
 *
 * این لایه‌ی نازک لازم است چون `Hero` یک Server Component است و
 * نمی‌تواند مستقیماً به استور کلاینت (Zustand) وصل شود.
 */
export default function HeroSearch({ cities }: { cities: City[] }) {
  const controller = useLandingSearchController();

  return <Search cities={cities} controller={controller} variant="hero" />;
}
