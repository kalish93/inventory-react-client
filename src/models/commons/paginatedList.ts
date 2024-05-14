export interface PaginatedList<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface List<T> {
  items: T[];
}
