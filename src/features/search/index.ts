/* ==================================================================
   search — نمایه‌ی عمومی فیچر جستجوی یکپارچه
   ================================================================== */

export { default as Search } from "./components/Search";
export { default as HeroSearch } from "./components/HeroSearch";
export { default as SearchBar } from "./components/SearchBar";
export { default as SearchPreview } from "./components/preview/SearchPreview";

export { useSearchStore } from "./store/search.store";
export { useSearchPreview } from "./hooks/useSearchPreview";
export { useLandingSearchController } from "./hooks/useLandingSearchController";
export { useUrlSearchController } from "./hooks/useUrlSearchController";

export {
  cabinSearchRepository,
  mockCabinSearchRepository,
  type CabinSearchRepository,
} from "./services/cabin-search.repository";

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
  formatBudgetLabel,
  formatDateRangeSummary,
  formatGuestsLabel,
  formatNightsLabel,
} from "./utils/search-summary";

export { REGIONS, getRegion, regionAllCitiesLabel } from "./constants/regions";
export { groupCitiesByRegion, regionOfCityName } from "./data/destinations.mock";

export type {
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
