export interface FetchArgs {
  page: number;
  pageSize: number;
  keyword?: string;
  [key: string]: any;
}

export interface ServiceResponse<> {
  links: {
    previous: string | null;
    next: string | null;
  };
  page: number;
  page_size: number;
  num_pages: number;
  count: number;
  results: [];
}



 interface PaginatedResponse<T> {
  results: T[];
  page: number;
  num_pages: number;
  total_count: number;
}

interface GetAllResponse<T> {
  success: true;
  data: T[];
  pagination?: {
    current_page: number;
    total_page: number;
    total_count: number;
  };
}

 interface GetSingleResponse<T> {
  success: true;
  data: T;
}

 interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  message?: string;
}

// Union types cho các operations cụ thể
export type GetAllResult<T> = GetAllResponse<T> | ErrorResponse;
export type GetSingleResult<T> = GetSingleResponse<T> | ErrorResponse;
export type MutationResult<T> = GetSingleResponse<T> | ErrorResponse;
export type DeleteResult = { success: true; data: null } | ErrorResponse;