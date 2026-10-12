//* نمایه‌ی سرویس‌های فیچر جستجو.

export {
  CABIN_SEARCH_ENDPOINT,
  cabinSearchRepository,
  type CabinSearchRepository,
} from "@/features/search/services/cabin-search.repository";

export {
  findCity,
  regionDestination,
  regionCitiesLabel,
  regionShortHint,
  searchDestinations,
  type DestinationSearchResult,
} from "@/features/search/services/destination.service";
