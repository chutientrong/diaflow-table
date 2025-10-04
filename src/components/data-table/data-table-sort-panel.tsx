"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, X } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { SortableColumn, DEFAULT_SORTABLE_COLUMNS } from "@/constants/table-config";

interface DataTableSortPanelProps<TData> {
  table: Table<TData>;
  onClose: () => void;
  sortableColumns?: SortableColumn[];
}

export function DataTableSortPanel<TData>({
  table,
  onClose,
  sortableColumns = DEFAULT_SORTABLE_COLUMNS,
}: DataTableSortPanelProps<TData>) {
  return (
    <div className="rounded-lg border bg-muted/50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium">Sort Options</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onClose}
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
          <label className="text-sm font-medium">Column Sorting</label>

          {/* Name Column */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Name</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex-1"
                onClick={() => table.getColumn("name")?.toggleSorting(false)}
              >
                <ArrowUpDown className="mr-1 h-3 w-3" />
                Ascending
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex-1"
                onClick={() => table.getColumn("name")?.toggleSorting(true)}
              >
                <ArrowUpDown className="mr-1 h-3 w-3" />
                Descending
              </Button>
            </div>
          </div>

          {/* Version Column */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Version</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex-1"
                onClick={() => table.getColumn("version")?.toggleSorting(false)}
              >
                <ArrowUpDown className="mr-1 h-3 w-3" />
                Ascending
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex-1"
                onClick={() => table.getColumn("version")?.toggleSorting(true)}
              >
                <ArrowUpDown className="mr-1 h-3 w-3" />
                Descending
              </Button>
            </div>
          </div>

          {/* Created Date Column */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Created Date</label>
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
            <label className="text-sm font-medium">Active Sorts</label>
            <div className="space-y-1">
              {table.getState().sorting.map((sort) => (
                <div
                  key={sort.id}
                  className="flex items-center justify-between rounded bg-primary/10 px-3 py-2 text-sm text-primary"
                >
                  <span>
                    {sort.id}: {sort.desc ? "Descending" : "Ascending"}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-primary/20"
                    onClick={() => table.getColumn(sort.id)?.clearSorting()}
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
  );
}
