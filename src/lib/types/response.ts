export interface PaginatedResponse {
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
