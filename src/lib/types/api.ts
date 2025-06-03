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
