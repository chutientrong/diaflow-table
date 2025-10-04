"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { SearchInput } from "@/app/search-input";
import { SearchableColumn, DEFAULT_SEARCHABLE_COLUMNS } from "@/constants/table-config";

interface DataTableSearchPanelProps<TData> {
  table: Table<TData>;
  onClose: () => void;
  searchableColumns?: SearchableColumn[];
}

export function DataTableSearchPanel<TData>({
  table,
  onClose,
  searchableColumns = DEFAULT_SEARCHABLE_COLUMNS,
}: DataTableSearchPanelProps<TData>) {
  return (
    <div className="rounded-lg border bg-muted/50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium">Search</h3>
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

          {/* Render searchable columns using configuration */}
          {searchableColumns.map((column) => (
            <div key={column.id} className="space-y-1">
              <label className="text-xs text-muted-foreground">
                {column.label}
              </label>
              <Input
                placeholder={column.placeholder}
                value={
                  (table.getColumn(column.id)?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn(column.id)?.setFilterValue(event.target.value)
                }
                className="h-8"
              />
            </div>
          ))}
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
  );
}
