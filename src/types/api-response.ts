export type PaginationMeta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ErrorMapResponse = {
  field: string;
  code: string;
  message: string;
};

// ---- حالت عادی (بدون pagination) ----

type ApiSuccessData<T extends string, K> = {
  status: "success";
  data: { [P in T]: K };
};

// ---- حالت paginated ----
// data شامل کلید داینامیک (مثلاً cabins) به‌صورت آرایه + فیلد meta هم‌سطح با آن است
type ApiSuccessPaginatedData<T extends string, K> = {
  status: "success";
  data: { [P in T]: K[] } & { meta: PaginationMeta };
};

type ApiFailStatus = {
  status: "fail";
  message?: string;
  code?: string;
};

type ApiErrorStatus = {
  status: "error";
  message?: string;
  code?: string;
  errors?: ErrorMapResponse;
};

export type ApiResponse<T extends string, K> =
  ApiSuccessData<T, K> | ApiFailStatus | ApiErrorStatus;

export type ApiPaginatedResponse<T extends string, K> =
  ApiSuccessPaginatedData<T, K> | ApiFailStatus | ApiErrorStatus;



