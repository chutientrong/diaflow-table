"use client";

import { Input } from "@/components/ui/input";
import type { Table } from "@tanstack/react-table";

interface FilterInputProps<TData> {
  table: Table<TData>;
  columnId: string;
  label: string;
  placeholder: string;
  type?: "text" | "number";
}

export function FilterInput<TData>({
  table,
  columnId,
  label,
  placeholder,
  type = "text",
}: FilterInputProps<TData>) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground">{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        value={
          (table.getColumn(columnId)?.getFilterValue() as string) ?? ""
        }
        onChange={(event) =>
          table.getColumn(columnId)?.setFilterValue(event.target.value)
        }
        className="h-8"
      />
    </div>
  );
}
