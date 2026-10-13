//* نمایه‌ی عمومی فیچر جستجوی یکپارچه — تنها نقطه‌ی ورود مصرف‌کننده‌های بیرونی.

export { default as Search } from "@/features/search/components/Search";
export { default as HeroSearch } from "@/features/search/components/HeroSearch";
export { default as SearchBar } from "@/features/search/components/SearchBar";
export { default as SearchPreview } from "@/features/search/components/preview/SearchPreview";
export { default as LastSearchChip } from "@/features/search/components/LastSearchChip";

export { useSearchStore } from "@/features/search/store/search.store";
export { useSearchPreview } from "@/features/search/hooks/useSearchPreview";
export { useLandingSearchController } from "@/features/search/hooks/useLandingSearchController";
export { useUrlSearchController } from "@/features/search/hooks/useUrlSearchController";
export {
  useLastSearch,
  usePersistLastSearch,
} from "@/features/search/hooks/useLastSearch";

export {
  CABIN_SEARCH_ENDPOINT,
  cabinSearchRepository,
  type CabinSearchRepository,
} from "@/features/search/services/cabin-search.repository";

export {
  clearLastSearch,
  getLastSearchQuery,
  saveLastSearchQuery,
  subscribeLastSearch,
} from "@/features/search/services/recent-search.storage";

export {
  SEARCH_PARAM_KEYS,
  hasAnySearchFilter,
  parseSearchFilters,
  searchFiltersToHref,
  searchFiltersToQueryString,
  serializeSearchFilters,
  serializeSearchFiltersForUpdate,
  toCabinSearchQuery,
} from "@/features/search/utils/search-params";

export {
  budgetFieldLabel,
  buildPreviewCtaLabel,
  buildPreviewHeading,
  buildSearchSummary,
  buildSearchSummaryParts,
  destinationLabel,
  formatBudgetRangeLabel,
  formatBudgetRangeLabelCompact,
  formatBudgetRangeValue,
  formatDateRangeSummary,
  formatGuestsLabel,
  formatNightsLabel,
} from "@/features/search/utils/search-summary";

export {
  budgetBoundsFor,
  budgetModeFor,
  nightsBetween,
  rescaleBudgetBetween,
  rescaleBudgetOnDateChange,
  type BudgetMode,
} from "@/features/search/utils/budget";

export {
  SEARCH_PREVIEW_ID,
  scheduleScrollToSearchPreview,
  scrollToSearchPreview,
} from "@/features/search/utils/scroll-to-preview";

export {
  CITY_VALUE_PREFIX,
  REGION_VALUE_PREFIX,
  decodeDestination,
  decodeDestinationWithName,
  encodeDestination,
} from "@/features/search/utils/destination-value";

export {
  REGION_HINTS,
  REGION_IDS,
  REGION_NAMES,
  isRegionId,
  regionAllCitiesLabel,
  regionHint,
  regionIdFromSlug,
  regionName,
  regionSlugFromId,
  toSearchRegions,
} from "@/features/search/constants/regions";
export { groupCitiesByRegion } from "@/features/search/utils/city-groups";

export type {
  BudgetRange,
  CabinSearchQuery,
  CabinSearchResult,
  Destination,
  Region,
  RegionId,
  SearchController,
  SearchFilters,
} from "@/features/search/types/search.types";

export {
  BUDGET_MAX,
  BUDGET_MIN,
  BUDGET_STEP,
  GUESTS_MAX,
  GUESTS_MIN,
  SEARCH_PREVIEW_LIMIT,
} from "@/features/search/constants/search-limits";

export { EMPTY_SEARCH_FILTERS } from "@/features/search/constants/search-defaults";

export {
  MOBILE_SEARCH_CHANGE_LABEL,
  MOBILE_SEARCH_EMPTY_HINT,
  MOBILE_SEARCH_HERO_TITLE,
  MOBILE_SEARCH_RESULTS_LABEL,
  MOBILE_SEARCH_TITLE,
  SEARCH_CLEAR_LABEL,
} from "@/features/search/constants/search-mobile-texts";
