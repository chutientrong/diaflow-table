"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import type { Table } from "@tanstack/react-table";

interface DataTableFieldsPanelProps<TData> {
  table: Table<TData>;
  visibleColumns: string[];
  onClose: () => void;
}

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

export function DataTableFieldsPanel<TData>({
  table,
  visibleColumns,
  onClose,
}: DataTableFieldsPanelProps<TData>) {
  return (
    <div className="rounded-lg border bg-muted/50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium">Field Visibility</h3>
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
  );
}
