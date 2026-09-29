"use client";

import type { City } from "@/features/cabins/types/city.types";
import type { RawSearchParams } from "@/hooks/useUrlQuery";
import { usePersistLastSearch } from "../hooks/useLastSearch";
import { useUrlSearchController } from "../hooks/useUrlSearchController";
import Search from "./Search";

type Props = {
  cities: City[];
  /** searchParams خام سرور — منبع حقیقت این صفحه */
  searchParams: RawSearchParams;
};

/**
 * نوار جستجوی صفحه‌ی `/cabins`.
 *
 * عمداً «چسبان» (sticky) نیست: فقط FilterBar پیشرفته sticky می‌ماند تا
 * ویوپورت را اشغال نکند. در موبایل همین کامپوننت خودش خلاصه‌ی جستجو +
 * دکمه‌ی «تغییر جستجو» را به‌صورت باتم‌شیت نشان می‌دهد.
 */
export default function SearchBar({ cities, searchParams }: Props) {
  const controller = useUrlSearchController(searchParams);

  // جستجوی این صفحه هم به‌عنوان «آخرین جستجو» ذخیره می‌شود
  usePersistLastSearch(controller.applied);

  return (
    <div className="bg-background-2 border-foreground/10 border-b">
      <div className="mx-auto max-w-[1800px] px-3 py-3 sm:px-4 lg:px-6">
        <Search cities={cities} controller={controller} variant="results" />
      </div>
    </div>
  );
}
