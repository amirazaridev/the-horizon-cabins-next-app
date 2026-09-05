type ErrorMapResponse = {
  field: string;
  code: string;
  message: string;
};
type ApiSuccess<T extends string, K> = {
  status: "success";
  data: { [P in T]: K };
};

type ApiFailOrError = {
  status: "fail" | "error";
  message?: string;
  code?: string;
  errors?: ErrorMapResponse;
};

export type ApiResponse<T extends string, K> = ApiSuccess<T, K> | ApiFailOrError;