"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { FilterInput } from "./filter-input";
import { FilterableColumn, DEFAULT_FILTERABLE_COLUMNS } from "@/constants/table-config";

interface DataTableFilterPanelProps<TData> {
  table: Table<TData>;
  onClose: () => void;
  filterableColumns?: FilterableColumn[];
}

export function DataTableFilterPanel<TData>({
  table,
  onClose,
  filterableColumns = DEFAULT_FILTERABLE_COLUMNS,
}: DataTableFilterPanelProps<TData>) {
  return (
    <div className="rounded-lg border bg-muted/50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium">Filter Options</h3>
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
        {/* Quick Filters */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quick Filters</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Clear all column filters
                table.getAllColumns().forEach((column) => {
                  column.setFilterValue(undefined);
                });
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
          <label className="text-sm font-medium">Column Filters</label>

          {/* Render filterable columns using configuration */}
          {filterableColumns.map((column) => (
            <FilterInput
              key={column.id}
              table={table}
              columnId={column.id}
              label={column.label}
              placeholder={column.placeholder}
              type={column.type}
            />
          ))}

          {/* Version Range Filter - Special case for number range */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Version Range</label>
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
                    ?.getFilterValue() as [number, number] | undefined;
                  const max = currentFilter?.[1];
                  table.getColumn("version")?.setFilterValue([min, max]);
                }}
              />
              <span className="text-xs text-muted-foreground">to</span>
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
                    ?.getFilterValue() as [number, number] | undefined;
                  const min = currentFilter?.[0];
                  table.getColumn("version")?.setFilterValue([min, max]);
                }}
              />
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {table.getState().columnFilters.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Active Filters</label>
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
                      table.getColumn(filter.id)?.setFilterValue(undefined)
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
  );
}
