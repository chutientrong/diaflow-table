import { infiniteQueryOptions, keepPreviousData } from "@tanstack/react-query";
import type { ExtendedDataSchema } from "./shema";

export type InfiniteQueryMeta = {
  totalRowCount: number;
  filterRowCount: number;
  chartData: any[];
  facets: Record<string, any>;
  metadata: Record<string, any>;
};

export type InfiniteQueryResponse = {
  data: ExtendedDataSchema[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalPages: number;
  };
  meta: InfiniteQueryMeta;
};

export const dataOptions = (search: {
  page?: number;
  search?: string | null;
}) => {
  return infiniteQueryOptions({
    queryKey: ["data-table", search],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        pageSize: "50",
        ...(search.search && { search: search.search }),
      });

      console.log("Fetching data with params:", params.toString());
      const url = `/api/local?${params}`;
      console.log("Fetching from URL:", url);

      const response = await fetch(url);
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`Failed to fetch local data: ${response.statusText}`);
      }

      const json = await response.json();
      console.log("Response data:", json);
      return json as InfiniteQueryResponse;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.pagination.hasPrevPage
        ? firstPage.pagination.page - 1
        : undefined;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
