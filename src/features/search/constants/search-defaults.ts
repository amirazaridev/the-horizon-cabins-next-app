import type { SearchFilters } from "@/features/search/types/search.types";

//* حالت خالی/پیش‌فرض فیلترهای جستجو — تنها منبع این مقدار.
//* ⚠️ عمداً در `constants` است نه `types`: فایل تایپ‌ها باید بدون خروجی زمان‌اجرا بماند تا `import type` واقعاً از باندل حذف شود.
export const EMPTY_SEARCH_FILTERS: SearchFilters = {
  destination: null,
  checkIn: null,
  checkOut: null,
  guests: null,
  budget: null,
};
