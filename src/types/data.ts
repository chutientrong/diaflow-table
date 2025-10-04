export interface DataItem {
  id: string;
  name: string;
  email: string;
  bio: string;
  language: string;
  version: number;
  state: string;
  createdDate: string;
}

export interface ApiResponse {
  data: DataItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalPages: number;
  };
}
