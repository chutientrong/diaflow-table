"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/custom/table";
import { DataTableEditableRow } from "@/components/data-table/data-table-editable-row";
import { DataTableFooter } from "@/components/data-table/data-table-footer";
import { DataTableProvider } from "@/components/data-table/data-table-provider";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type { DataTableFilterField } from "@/components/data-table/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useHotKey } from "@/hooks/use-hot-key";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { formatCompactNumber } from "@/lib/format";
import { arrSome, inDateRange } from "@/lib/table/filterfns";
import { cn } from "@/lib/utils";
import {
  FetchPreviousPageOptions,
  RefetchOptions,
  type FetchNextPageOptions,
} from "@tanstack/react-query";
import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  RowSelectionState,
  SortingState,
  TableOptions,
  Table as TTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedMinMaxValues as getTTableFacetedMinMaxValues,
  getFacetedUniqueValues as getTTableFacetedUniqueValues,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, LoaderCircle, X } from "lucide-react";
import { useQueryStates, type SingleParserBuilder } from "nuqs";
import * as React from "react";
import { SearchInput } from "./search-input";
import { editableRowSchema } from "./shema";

// TODO: add a possible chartGroupBy
export interface DataTableInfiniteProps<TData, TValue, TMeta> {
  columns: ColumnDef<TData, TValue>[];
  getRowClassName?: (row: Row<TData>) => string;
  // REMINDER: make sure to pass the correct id to access the rows
  getRowId?: TableOptions<TData>["getRowId"];
  data: TData[];
  defaultColumnFilters?: ColumnFiltersState;
  defaultColumnSorting?: SortingState;
  defaultRowSelection?: RowSelectionState;
  defaultColumnVisibility?: VisibilityState;
  filterFields?: DataTableFilterField<TData>[];
  // REMINDER: close to the same signature as the `getFacetedUniqueValues` of the `useReactTable`
  getFacetedUniqueValues?: (
    table: TTable<TData>,
    columnId: string,
  ) => Map<string, number>;
  getFacetedMinMaxValues?: (
    table: TTable<TData>,
    columnId: string,
  ) => undefined | [number, number];
  totalRows?: number;
  filterRows?: number;
  totalRowsFetched?: number;
  meta: TMeta;
  isFetching?: boolean;
  isLoading?: boolean;
  hasNextPage?: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<unknown>;
  fetchPreviousPage?: (
    options?: FetchPreviousPageOptions | undefined,
  ) => Promise<unknown>;
  refetch: (options?: RefetchOptions | undefined) => void;
  searchParamsParser: Record<string, SingleParserBuilder<any>>;
}

export function DataTableInfinite<TData, TValue, TMeta>({
  columns,
  getRowClassName,
  getRowId,
  data,
  defaultColumnFilters = [],
  defaultColumnSorting = [],
  defaultRowSelection = {},
  defaultColumnVisibility = {},
  filterFields = [],
  isFetching,
  isLoading,
  fetchNextPage,
  hasNextPage,
  fetchPreviousPage,
  refetch,
  totalRows = 0,
  filterRows = 0,
  totalRowsFetched = 0,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  meta,
  searchParamsParser,
}: DataTableInfiniteProps<TData, TValue, TMeta>) {
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(defaultColumnFilters);
  const [sorting, setSorting] =
    React.useState<SortingState>(defaultColumnSorting);
  const [rowSelection, setRowSelection] =
    React.useState<RowSelectionState>(defaultRowSelection);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [recordsPerPage, setRecordsPerPage] = React.useState(20);
  const [isAddingRow, setIsAddingRow] = React.useState(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isSortOpen, setIsSortOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isFieldsOpen, setIsFieldsOpen] = React.useState(false);
  const [tableName, setTableName] = React.useState("Table name");
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>([]);
  const [isSharing, setIsSharing] = React.useState(false);
  const [columnOrder, setColumnOrder] = useLocalStorage<string[]>(
    "data-table-column-order",
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<VisibilityState>(
      "data-table-visibility",
      defaultColumnVisibility,
    );

  // Toolbar action handlers
  const handleTableNameEdit = () => {
    const newName = prompt("Enter new table name:", tableName);
    if (newName && newName.trim()) {
      setTableName(newName.trim());
    }
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    setIsSortOpen(false);
    setIsSearchOpen(false);
    setIsFieldsOpen(false);
  };

  const handleSort = () => {
    setIsSortOpen(!isSortOpen);
    setIsFilterOpen(false);
    setIsSearchOpen(false);
    setIsFieldsOpen(false);
  };

  const handleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsFilterOpen(false);
    setIsSortOpen(false);
    setIsFieldsOpen(false);
  };

  const handleFields = () => {
    setIsFieldsOpen(!isFieldsOpen);
    setIsFilterOpen(false);
    setIsSortOpen(false);
    setIsSearchOpen(false);
  };

  const handleDownload = () => {
    // Export data as CSV
    const csvData = table
      .getRowModel()
      .rows.map((row) =>
        row
          .getVisibleCells()
          .map((cell) => cell.getValue())
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tableName.toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (isSharing) return; // Prevent multiple simultaneous shares

    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: tableName,
          text: `Check out this ${tableName} table`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      // Handle share cancellation or errors silently
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Share failed:", error);
        // Fallback to clipboard if share fails
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert("Link copied to clipboard!");
        } catch (clipboardError) {
          console.error("Clipboard fallback failed:", clipboardError);
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleSettings = () => {
    console.log("Settings clicked - could open settings modal");
  };

  const handleAction = () => {
    console.log("Action dropdown clicked - could show action menu");
  };

  const handleAskAI = () => {
    console.log("Ask AI clicked - could open AI assistant");
  };

  // Helper function to get column display name
  const getColumnDisplayName = (column: any) => {
    const columnId = column.id;

    // Map column IDs to display names
    const displayNames: Record<string, string> = {
      select: "Select",
      id: "ID",
      name: "Name",
      language: "Language",
      bio: "Bio",
      version: "Version",
      state: "State",
      createdDate: "Created Date",
      primary: "Primary",
    };

    return displayNames[columnId] || columnId;
  };

  const topBarRef = React.useRef<HTMLDivElement>(null);
  const tableRef = React.useRef<HTMLTableElement>(null);
  const [topBarHeight, setTopBarHeight] = React.useState(0);
  // FIXME: searchParamsParser needs to be passed as property
  const [_, setSearch] = useQueryStates(searchParamsParser);

  const onScroll = React.useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      const onPageBottom =
        Math.ceil(e.currentTarget.scrollTop + e.currentTarget.clientHeight) >=
        e.currentTarget.scrollHeight;

      if (onPageBottom && !isFetching && totalRowsFetched < filterRows) {
        fetchNextPage();
      }
    },
    [fetchNextPage, isFetching, filterRows, totalRowsFetched],
  );

  React.useEffect(() => {
    const observer = new ResizeObserver(() => {
      const rect = topBarRef.current?.getBoundingClientRect();
      if (rect) {
        setTopBarHeight(rect.height);
      }
    });

    const topBar = topBarRef.current;
    if (!topBar) return;

    observer.observe(topBar);
    return () => observer.unobserve(topBar);
  }, [topBarRef]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      columnVisibility,
      rowSelection,
      columnOrder,
    },
    enableRowSelection: true,
    columnResizeMode: "onChange",
    // enableColumnResizing: false,
    getRowId,
    onColumnVisibilityChange: (updater) => {
      console.log("Column visibility change:", updater);
      setColumnVisibility(updater);
    },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getTTableFacetedUniqueValues(),
    getFacetedMinMaxValues: getTTableFacetedMinMaxValues(),
    filterFns: { inDateRange, arrSome },
    debugAll: process.env.NEXT_PUBLIC_TABLE_DEBUG === "true",
    meta: { getRowClassName },
  });

  // Sync visible columns with table state
  React.useEffect(() => {
    const visible = table
      .getAllColumns()
      .filter((column) => column.getIsVisible())
      .map((column) => column.id);
    console.log("Visible columns:", visible);
    console.log("Column visibility state:", table.getState().columnVisibility);
    setVisibleColumns(visible);
  }, [table.getState().columnVisibility]);

  React.useEffect(() => {
    const columnFiltersWithNullable = filterFields.map((field) => {
      const filterValue = columnFilters.find(
        (filter) => filter.id === field.value,
      );
      if (!filterValue) return { id: field.value, value: null };
      return { id: field.value, value: filterValue.value };
    });

    const search = columnFiltersWithNullable.reduce(
      (prev, curr) => {
        prev[curr.id as string] = curr.value;
        return prev;
      },
      {} as Record<string, unknown>,
    );

    setSearch(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters]);

  React.useEffect(() => {
    setSearch({ sort: sorting?.[0] || null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  const selectedRow = React.useMemo(() => {
    if ((isLoading || isFetching) && !data.length) return;
    const selectedRowKey = Object.keys(rowSelection)?.[0];
    return table
      .getCoreRowModel()
      .flatRows.find((row) => row.id === selectedRowKey);
  }, [rowSelection, table, isLoading, isFetching, data]);

  // TODO: can only share uuid within the first batch
  React.useEffect(() => {
    if (isLoading || isFetching) return;
    if (Object.keys(rowSelection)?.length && !selectedRow) {
      setSearch({ uuid: null });
      setRowSelection({});
    } else {
      setSearch({ uuid: Object.keys(rowSelection)?.[0] || null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection, selectedRow, isLoading, isFetching]);

  /**
   * https://tanstack.com/table/v8/docs/guide/column-sizing#advanced-column-resizing-performance
   * Instead of calling `column.getSize()` on every render for every header
   * and especially every data cell (very expensive),
   * we will calculate all column sizes at once at the root table level in a useMemo
   * and pass the column sizes down as CSS variables to the <table> element.
   */
  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: string } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      // REMINDER: replace "." with "-" to avoid invalid CSS variable name (e.g. "timing.dns" -> "timing-dns")
      colSizes[`--header-${header.id.replace(".", "-")}-size`] =
        `${header.getSize()}px`;
      colSizes[`--col-${header.column.id.replace(".", "-")}-size`] =
        `${header.column.getSize()}px`;
    }
    return colSizes;
  }, [
    table.getState().columnSizingInfo,
    table.getState().columnSizing,
    table.getState().columnVisibility,
  ]);

  useHotKey(() => {
    setColumnOrder([]);
    setColumnVisibility(defaultColumnVisibility);
  }, "u");

  return (
    <DataTableProvider
      table={table}
      columns={columns}
      filterFields={filterFields}
      columnFilters={columnFilters}
      sorting={sorting}
      rowSelection={rowSelection}
      columnOrder={columnOrder}
      columnVisibility={columnVisibility}
      enableColumnOrdering={true}
      isLoading={isFetching || isLoading}
      getFacetedUniqueValues={getFacetedUniqueValues}
      getFacetedMinMaxValues={getFacetedMinMaxValues}
    >
      <div
        className="flex h-full min-h-screen w-full flex-col sm:flex-row"
        style={
          {
            "--top-bar-height": `${topBarHeight}px`,
            ...columnSizeVars,
          } as React.CSSProperties
        }
      >
        <div
          className={cn(
            "flex max-w-full flex-1 flex-col border-border sm:border-l",
            // Chrome issue
            "group-data-[expanded=true]/controls:sm:max-w-[calc(100vw_-_208px)] group-data-[expanded=true]/controls:md:max-w-[calc(100vw_-_288px)]",
          )}
        >
          <div
            ref={topBarRef}
            className={cn(
              "flex flex-col gap-4 bg-background p-2",
              "sticky top-0 z-10 pb-4",
            )}
          >
            {/* New Toolbar */}
            <DataTableToolbar
              tableName={tableName}
              onTableNameEdit={handleTableNameEdit}
              onAddRow={() => setIsAddingRow(true)}
              isAddingRow={isAddingRow}
              onFilter={handleFilter}
              onSort={handleSort}
              onSearch={handleSearch}
              onFields={handleFields}
              onRefresh={() => refetch()}
              onDownload={handleDownload}
              onShare={handleShare}
              onSettings={handleSettings}
              onAction={handleAction}
              onAskAI={handleAskAI}
              hasActiveSort={sorting.length > 0}
              hasActiveFilters={table.getState().columnFilters.length > 0}
            />

            {/* Action Panels */}
            {isFilterOpen && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium">Filter Options</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Quick Filters */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quick Filters</label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          table.getColumn("name")?.setFilterValue("");
                          table.getColumn("bio")?.setFilterValue("");
                        }}
                      >
                        Clear All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          table.getColumn("name")?.setFilterValue("John");
                        }}
                      >
                        Name: John
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          table.getColumn("version")?.setFilterValue([1, 5]);
                        }}
                      >
                        Version: 1-5
                      </Button>
                    </div>
                  </div>

                  {/* Column Filters */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Column Filters
                    </label>

                    {/* Name Filter */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Name
                      </label>
                      <Input
                        placeholder="Filter by name..."
                        value={
                          (table
                            .getColumn("name")
                            ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                          table
                            .getColumn("name")
                            ?.setFilterValue(event.target.value)
                        }
                        className="h-8"
                      />
                    </div>

                    {/* Bio Filter */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Bio
                      </label>
                      <Input
                        placeholder="Filter by bio..."
                        value={
                          (table
                            .getColumn("bio")
                            ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                          table
                            .getColumn("bio")
                            ?.setFilterValue(event.target.value)
                        }
                        className="h-8"
                      />
                    </div>

                    {/* Version Range Filter */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Version Range
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          className="h-8"
                          onChange={(event) => {
                            const min = event.target.value
                              ? Number(event.target.value)
                              : undefined;
                            const currentFilter = table
                              .getColumn("version")
                              ?.getFilterValue() as
                              | [number, number]
                              | undefined;
                            const max = currentFilter?.[1];
                            table
                              .getColumn("version")
                              ?.setFilterValue([min, max]);
                          }}
                        />
                        <span className="text-xs text-muted-foreground">
                          to
                        </span>
                        <Input
                          type="number"
                          placeholder="Max"
                          className="h-8"
                          onChange={(event) => {
                            const max = event.target.value
                              ? Number(event.target.value)
                              : undefined;
                            const currentFilter = table
                              .getColumn("version")
                              ?.getFilterValue() as
                              | [number, number]
                              | undefined;
                            const min = currentFilter?.[0];
                            table
                              .getColumn("version")
                              ?.setFilterValue([min, max]);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Active Filters */}
                  {table.getState().columnFilters.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Active Filters
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {table.getState().columnFilters.map((filter) => (
                          <div
                            key={filter.id}
                            className="flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-xs text-primary"
                          >
                            <span>
                              {filter.id}: {String(filter.value)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-primary/20"
                              onClick={() =>
                                table
                                  .getColumn(filter.id)
                                  ?.setFilterValue(undefined)
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isSortOpen && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium">Sort Options</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setIsSortOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Quick Sort Options */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quick Sort</label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          table.getColumn("name")?.toggleSorting(false);
                        }}
                      >
                        Name A-Z
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          table.getColumn("name")?.toggleSorting(true);
                        }}
                      >
                        Name Z-A
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          table.getColumn("version")?.toggleSorting(false);
                        }}
                      >
                        Version Low-High
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          table.getColumn("version")?.toggleSorting(true);
                        }}
                      >
                        Version High-Low
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          table.getColumn("createdDate")?.toggleSorting(false);
                        }}
                      >
                        Date Old-New
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          table.getColumn("createdDate")?.toggleSorting(true);
                        }}
                      >
                        Date New-Old
                      </Button>
                    </div>
                  </div>

                  {/* Column Sort Options */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Column Sorting
                    </label>

                    {/* Name Column */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Name
                      </label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 flex-1"
                          onClick={() =>
                            table.getColumn("name")?.toggleSorting(false)
                          }
                        >
                          <ArrowUpDown className="mr-1 h-3 w-3" />
                          Ascending
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 flex-1"
                          onClick={() =>
                            table.getColumn("name")?.toggleSorting(true)
                          }
                        >
                          <ArrowUpDown className="mr-1 h-3 w-3" />
                          Descending
                        </Button>
                      </div>
                    </div>

                    {/* Version Column */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Version
                      </label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 flex-1"
                          onClick={() =>
                            table.getColumn("version")?.toggleSorting(false)
                          }
                        >
                          <ArrowUpDown className="mr-1 h-3 w-3" />
                          Ascending
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 flex-1"
                          onClick={() =>
                            table.getColumn("version")?.toggleSorting(true)
                          }
                        >
                          <ArrowUpDown className="mr-1 h-3 w-3" />
                          Descending
                        </Button>
                      </div>
                    </div>

                    {/* Created Date Column */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Created Date
                      </label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 flex-1"
                          onClick={() =>
                            table.getColumn("createdDate")?.toggleSorting(false)
                          }
                        >
                          <ArrowUpDown className="mr-1 h-3 w-3" />
                          Ascending
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 flex-1"
                          onClick={() =>
                            table.getColumn("createdDate")?.toggleSorting(true)
                          }
                        >
                          <ArrowUpDown className="mr-1 h-3 w-3" />
                          Descending
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Clear Sort */}
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        table.resetSorting();
                      }}
                      className="w-full"
                    >
                      Clear All Sorting
                    </Button>
                  </div>

                  {/* Active Sorts */}
                  {table.getState().sorting.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Active Sorts
                      </label>
                      <div className="space-y-1">
                        {table.getState().sorting.map((sort) => (
                          <div
                            key={sort.id}
                            className="flex items-center justify-between rounded bg-primary/10 px-3 py-2 text-sm text-primary"
                          >
                            <span>
                              {sort.id}:{" "}
                              {sort.desc ? "Descending" : "Ascending"}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-primary/20"
                              onClick={() =>
                                table.getColumn(sort.id)?.clearSorting()
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isSearchOpen && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium">Search</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Global Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Global Search</label>
                    <SearchInput
                      placeholder="Search across all columns..."
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Search across all visible columns in the table
                    </p>
                  </div>

                  {/* Column-specific Search */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Column Search</label>

                    {/* Name Search */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Name
                      </label>
                      <Input
                        placeholder="Search in name column..."
                        value={
                          (table
                            .getColumn("name")
                            ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                          table
                            .getColumn("name")
                            ?.setFilterValue(event.target.value)
                        }
                        className="h-8"
                      />
                    </div>

                    {/* Bio Search */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Bio
                      </label>
                      <Input
                        placeholder="Search in bio column..."
                        value={
                          (table
                            .getColumn("bio")
                            ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                          table
                            .getColumn("bio")
                            ?.setFilterValue(event.target.value)
                        }
                        className="h-8"
                      />
                    </div>

                    {/* ID Search */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        ID
                      </label>
                      <Input
                        placeholder="Search in ID column..."
                        value={
                          (table.getColumn("id")?.getFilterValue() as string) ??
                          ""
                        }
                        onChange={(event) =>
                          table
                            .getColumn("id")
                            ?.setFilterValue(event.target.value)
                        }
                        className="h-8"
                      />
                    </div>

                    {/* Language Search */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Language
                      </label>
                      <Input
                        placeholder="Search in language column..."
                        value={
                          (table
                            .getColumn("language")
                            ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                          table
                            .getColumn("language")
                            ?.setFilterValue(event.target.value)
                        }
                        className="h-8"
                      />
                    </div>

                    {/* State Search */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        State
                      </label>
                      <Input
                        placeholder="Search in state column..."
                        value={
                          (table
                            .getColumn("state")
                            ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                          table
                            .getColumn("state")
                            ?.setFilterValue(event.target.value)
                        }
                        className="h-8"
                      />
                    </div>
                  </div>

                  {/* Search Tips */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search Tips</label>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>• Use partial matches for flexible searching</p>
                      <p>• Search is case-insensitive</p>
                      <p>• Clear individual column filters to reset</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isFieldsOpen && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium">Field Visibility</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setIsFieldsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.toggleAllColumnsVisible(true)}
                      className="h-8"
                    >
                      Show All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.toggleAllColumnsVisible(false)}
                      className="h-8"
                    >
                      Hide All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Reset to default visible columns
                        table.getAllColumns().forEach((column) => {
                          if (
                            column.id === "select" ||
                            column.id === "name" ||
                            column.id === "language" ||
                            column.id === "bio"
                          ) {
                            column.toggleVisibility(true);
                          } else {
                            column.toggleVisibility(false);
                          }
                        });
                      }}
                      className="h-8"
                    >
                      Reset
                    </Button>
                  </div>

                  {/* Column Visibility Controls */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Columns</label>
                      <span className="text-xs text-muted-foreground">
                        {visibleColumns.length} of{" "}
                        {
                          table
                            .getAllColumns()
                            .filter((col) => col.getCanHide()).length
                        }{" "}
                        visible
                      </span>
                    </div>
                    <div className="max-h-60 space-y-2 overflow-y-auto">
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => (
                          <div
                            key={column.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`column-${column.id}`}
                              checked={column.getIsVisible()}
                              onCheckedChange={(checked) => {
                                console.log(
                                  `Toggling column ${column.id} to ${checked}`,
                                );
                                // Use column.toggleVisibility to trigger proper callbacks
                                column.toggleVisibility(checked === true);
                              }}
                            />
                            <label
                              htmlFor={`column-${column.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {getColumnDisplayName(column)}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Column Order */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Column Order</label>
                    <p className="text-xs text-muted-foreground">
                      Drag and drop to reorder columns (coming soon)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* <DataTableFilterCommand searchParamsParser={searchParamsParser} /> */}
          </div>
          <div className="z-0">
            <Table
              ref={tableRef}
              onScroll={onScroll}
              className="border-separate border-spacing-0"
              containerClassName="max-h-[calc(100vh_-_var(--top-bar-height))]"
            >
              <TableHeader className={cn("sticky top-0 z-20 bg-background")}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className={cn(
                      "bg-muted/50 hover:bg-muted/50",
                      "[&>*]:border-t [&>:not(:last-child)]:border-r",
                    )}
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className={cn(
                            "relative select-none truncate border-b border-border [&>.cursor-col-resize]:last:opacity-0",
                            header.column.columnDef.meta?.headerClassName,
                          )}
                          aria-sort={
                            header.column.getIsSorted() === "asc"
                              ? "ascending"
                              : header.column.getIsSorted() === "desc"
                                ? "descending"
                                : "none"
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                          {header.column.getCanResize() && (
                            <div
                              onDoubleClick={() => header.column.resetSize()}
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                              className={cn(
                                "user-select-none absolute -right-2 top-0 z-10 flex h-full w-4 cursor-col-resize touch-none justify-center",
                                "before:absolute before:inset-y-0 before:w-px before:translate-x-px before:bg-border",
                              )}
                            />
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody
                id="content"
                tabIndex={-1}
                className="outline-1 -outline-offset-1 outline-primary transition-colors focus-visible:outline"
                // REMINDER: avoids scroll (skipping the table header) when using skip to content
                style={{
                  scrollMarginTop: "calc(var(--top-bar-height) + 40px)",
                }}
              >
                {table.getRowModel().rows?.length ? (
                  <>
                    {/* Editable row for adding new data - positioned at the top */}
                    {isAddingRow && (
                      <DataTableEditableRow
                        onSave={(newData) => {
                          console.log("Saving new row:", newData);
                          // TODO: Implement actual save logic
                          setIsAddingRow(false);
                        }}
                        onCancel={() => setIsAddingRow(false)}
                        columns={columns}
                        schema={editableRowSchema}
                        initialData={{}}
                        autoFocus={true}
                      />
                    )}
                    {table.getRowModel().rows.map((row) => (
                      // REMINDER: if we want to add arrow navigation https://github.com/TanStack/table/discussions/2752#discussioncomment-192558
                      <React.Fragment key={row.id}>
                        <MemoizedRow
                          key={`${row.id}-${JSON.stringify(table.getState().columnVisibility)}`}
                          row={row}
                          table={table}
                          selected={row.getIsSelected()}
                        />
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <React.Fragment>
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                )}
                <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent">
                  <TableCell colSpan={columns.length} className="text-center">
                    {hasNextPage || isFetching || isLoading ? (
                      <Button
                        disabled={isFetching || isLoading}
                        onClick={() => fetchNextPage()}
                        size="sm"
                        variant="outline"
                      >
                        {isFetching ? (
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Load More
                      </Button>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No more data to load (
                        <span className="font-mono font-medium">
                          {formatCompactNumber(filterRows)}
                        </span>{" "}
                        of{" "}
                        <span className="font-mono font-medium">
                          {formatCompactNumber(totalRows)}
                        </span>{" "}
                        rows)
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Table Footer */}
      <DataTableFooter
        onAddRow={() => setIsAddingRow(true)}
        isAddingRow={isAddingRow}
      />

      {/* Pagination */}
      {/* <DataTablePagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalRows / recordsPerPage)}
        totalRecords={totalRows}
        recordsPerPage={recordsPerPage}
        onPageChange={setCurrentPage}
        onRecordsPerPageChange={setRecordsPerPage}
        recordsPerPageOptions={[10, 20, 50, 100]}
      /> */}
    </DataTableProvider>
  );
}

function Row<TData>({
  row,
  table,
  selected,
}: {
  row: Row<TData>;
  table: TTable<TData>;
  selected?: boolean;
}) {
  return (
    <TableRow
      id={row.id}
      tabIndex={0}
      data-state={selected && "selected"}
      onClick={() => {
        row.toggleSelected();
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLTableRowElement>) => {
        if (event.key === "Enter") {
          event.preventDefault();
          row.toggleSelected();
        }
      }}
      className={cn(
        "[&>:not(:last-child)]:border-r",
        "outline-1 -outline-offset-1 outline-primary transition-colors focus-visible:bg-muted/50 focus-visible:outline data-[state=selected]:outline",
        table.options.meta?.getRowClassName?.(row),
      )}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={cn(
            "truncate border-b border-border",
            cell.column.columnDef.meta?.cellClassName,
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

const MemoizedRow = React.memo(
  Row,
  (prev, next) =>
    prev.row.id === next.row.id &&
    prev.selected === next.selected &&
    prev.table.getState().columnVisibility ===
      next.table.getState().columnVisibility,
) as typeof Row;
