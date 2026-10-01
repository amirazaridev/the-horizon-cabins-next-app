/* ==================================================================
   search — نمایه‌ی عمومی فیچر جستجوی یکپارچه
   ================================================================== */

export { default as Search } from "./components/Search";
export { default as HeroSearch } from "./components/HeroSearch";
export { default as SearchBar } from "./components/SearchBar";
export { default as SearchPreview } from "./components/preview/SearchPreview";
export { default as LastSearchChip } from "./components/LastSearchChip";

export { useSearchStore } from "./store/search.store";
export { useSearchPreview } from "./hooks/useSearchPreview";
export { useLandingSearchController } from "./hooks/useLandingSearchController";
export { useUrlSearchController } from "./hooks/useUrlSearchController";
export { useLastSearch, usePersistLastSearch } from "./hooks/useLastSearch";

export {
  CABIN_SEARCH_ENDPOINT,
  cabinSearchRepository,
  type CabinSearchRepository,
} from "./services/cabin-search.repository";

export {
  clearLastSearch,
  getLastSearchQuery,
  saveLastSearchQuery,
  subscribeLastSearch,
} from "./services/recent-search.storage";

export {
  SEARCH_PARAM_KEYS,
  hasAnySearchFilter,
  parseSearchFilters,
  searchFiltersToHref,
  searchFiltersToQueryString,
  serializeSearchFilters,
  serializeSearchFiltersForUpdate,
  toCabinSearchQuery,
} from "./utils/search-params";

export {
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
} from "./utils/search-summary";

export {
  SEARCH_PREVIEW_ID,
  scheduleScrollToSearchPreview,
  scrollToSearchPreview,
} from "./utils/scroll-to-preview";

export {
  CITY_VALUE_PREFIX,
  REGION_VALUE_PREFIX,
  decodeDestination,
  decodeDestinationWithName,
  encodeDestination,
} from "./utils/destination-value";

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
} from "./constants/regions";
export { groupCitiesByRegion } from "./utils/city-groups";

export type {
  BudgetRange,
  CabinSearchQuery,
  CabinSearchResult,
  Destination,
  Region,
  RegionId,
  SearchController,
  SearchFilters,
} from "./types/search.types";

export {
  BUDGET_MAX,
  BUDGET_MIN,
  BUDGET_STEP,
  EMPTY_SEARCH_FILTERS,
  GUESTS_MAX,
  GUESTS_MIN,
  SEARCH_PREVIEW_LIMIT,
} from "./types/search.types";
