"use client";

import { useHotKey } from "@/hooks/use-hot-key";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import * as React from "react";
import { columns } from "./columns";
import { DataTableInfinite } from "./data-table-infinite";
import { dataOptions } from "./query-options";
import { searchParamsParser } from "./search-params";

export function Client() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "0" });

  // Reset page when search changes
  React.useEffect(() => {
    if (search) {
      setPage("0");
    }
  }, [search, setPage]);

  console.log("Client render - search:", search, "page:", page);

  const {
    data,
    isFetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
    fetchPreviousPage,
    refetch,
    error,
  } = useInfiniteQuery(
    dataOptions({
      page: parseInt(page || "0"),
      search: search || "",
    })
  );

  console.log("Query state:", { data, isLoading, isFetching, error });

  useResetFocus();

  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page.data ?? []) ?? [],
    [data?.pages],
  );

  // Get metadata from the last page
  const lastPage = data?.pages?.[data?.pages.length - 1];
  const totalDBRowCount = lastPage?.meta?.totalRowCount || 0;
  const filterDBRowCount = lastPage?.meta?.filterRowCount || 0;
  const totalFetched = flatData?.length || 0;

  return (
    <DataTableInfinite
      columns={columns}
      data={flatData}
      totalRows={totalDBRowCount}
      filterRows={filterDBRowCount}
      totalRowsFetched={totalFetched}
      defaultColumnFilters={[]}
      defaultColumnSorting={[]}
      defaultRowSelection={{}}
      defaultColumnVisibility={{}}
      meta={lastPage?.meta?.metadata || {}}
      filterFields={[]}
      isFetching={isFetching}
      isLoading={isLoading}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      fetchPreviousPage={fetchPreviousPage}
      refetch={refetch}
      getRowClassName={(row) => {
        return "hover:bg-muted/50";
      }}
      getRowId={(row) => row.id}
      getFacetedUniqueValues={() => new Map()}
      getFacetedMinMaxValues={() => undefined}
      searchParamsParser={searchParamsParser}
    />
  );
}

function useResetFocus() {
  useHotKey(() => {
    // Reset focus to body
    document.body.setAttribute("tabindex", "0");
    document.body.focus();
    document.body.removeAttribute("tabindex");
  }, ".");
}
