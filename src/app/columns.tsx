"use client";

import { TextWithTooltip } from "@/components/custom/text-with-tooltip";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import type { ExtendedDataSchema } from "./shema";

export const columns: ColumnDef<ExtendedDataSchema>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const isAllSelected = table.getIsAllRowsSelected();
      const isSomeSelected = table.getIsSomeRowsSelected();

      return (
        <Checkbox
          checked={
            isAllSelected ? true : isSomeSelected ? "indeterminate" : false
          }
          onCheckedChange={(checked) => table.toggleAllRowsSelected(!!checked)}
          aria-label="Select all rows"
        />
      );
    },
    cell: ({ row }) => {
      const isSelected = row.getIsSelected();

      // Nếu row được selected thì hiển thị checkbox, ngược lại hiển thị row number
      if (isSelected) {
        return (
          <Checkbox
            key={`${row.id}-${isSelected}`}
            checked={isSelected}
            onCheckedChange={(checked) => row.toggleSelected(!!checked)}
            aria-label="Select row"
          />
        );
      }

      // Mặc định hiển thị row number
      return (
        <div
          className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => row.toggleSelected(true)}
        >
          {row.index + 1}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    // size: 30,
    minSize: 30,
    maxSize: 30,
    meta: {
      cellClassName: "w-3 min-w-3",
      headerClassName: "w-3 min-w-3",
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="A id"
        columnType="primary"
        showBadge={true}
        badgeText="Primary"
        badgeVariant="secondary"
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue<ExtendedDataSchema["id"]>("id");
      return <TextWithTooltip text={value} className="font-bold" />;
    },
    size: 120,
    minSize: 120,
    meta: {
      cellClassName: "font-mono w-[--col-id-size] max-w-[--col-id-size]",
      headerClassName: "min-w-[--header-id-size] w-[--header-id-size]",
    },
  },

  {
    accessorKey: "bio",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="A bio" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<ExtendedDataSchema["bio"]>("bio");
      return (
        <div className="max-w-[200px]">
          <TextWithTooltip text={value} />
        </div>
      );
    },
    size: 200,
    minSize: 200,
    meta: {
      cellClassName: "w-[--col-bio-size] max-w-[--col-bio-size]",
      headerClassName: "min-w-[--header-bio-size] w-[--header-bio-size]",
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="name" columnType="name" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<ExtendedDataSchema["name"]>("name");
      return (
        <div className="max-w-[200px] font-bold">
          <TextWithTooltip text={value} />
        </div>
      );
    },
    size: 150,
    minSize: 150,
    meta: {
      cellClassName: "font-medium w-[--col-name-size] max-w-[--col-name-size]",
      headerClassName: "min-w-[--header-name-size] w-[--header-name-size]",
    },
  },
  {
    accessorKey: "language",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="A language" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<ExtendedDataSchema["language"]>("language");
      return (
        <div className="text-sm">
          <TextWithTooltip text={value} />
        </div>
      );
    },
    size: 120,
    minSize: 120,
    meta: {
      cellClassName: "w-[--col-language-size] max-w-[--col-language-size]",
      headerClassName:
        "min-w-[--header-language-size] w-[--header-language-size]",
    },
  },
  {
    accessorKey: "version",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="version"
        columnType="version"
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue<ExtendedDataSchema["version"]>("version");
      const getVersionBadge = (version: number) => {
        if (version >= 7) {
          return { label: "new customer", variant: "destructive" as const };
        } else if (version >= 5) {
          return { label: "served", variant: "default" as const };
        } else if (version >= 3) {
          return { label: "to contact", variant: "secondary" as const };
        } else {
          return { label: "pause", variant: "outline" as const };
        }
      };

      const badge = getVersionBadge(value);
      return (
        <Badge variant={badge.variant} className="text-xs">
          {badge.label}
        </Badge>
      );
    },
    size: 120,
    minSize: 120,
    meta: {
      cellClassName: "w-[--col-version-size] max-w-[--col-version-size]",
      headerClassName:
        "min-w-[--header-version-size] w-[--header-version-size]",
    },
  },
  {
    accessorKey: "state",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="A State" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<ExtendedDataSchema["state"]>("state");
      return (
        <div className="font-mono text-sm">
          <TextWithTooltip text={value || "N/A"} />
        </div>
      );
    },
    size: 80,
    minSize: 80,
    meta: {
      cellClassName: "font-mono w-[--col-state-size] max-w-[--col-state-size]",
      headerClassName: "min-w-[--header-state-size] w-[--header-state-size]",
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created Date"
        columnType="date"
      />
    ),
    cell: ({ row }) => {
      const value =
        row.getValue<ExtendedDataSchema["createdDate"]>("createdDate");
      return (
        <div className="font-mono text-sm">
          {value ? format(value, "yyyy-MM-dd HH:mm:ss") : "N/A"}
        </div>
      );
    },
    size: 180,
    minSize: 180,
    meta: {
      cellClassName:
        "font-mono w-[--col-createdDate-size] max-w-[--col-createdDate-size]",
      headerClassName:
        "min-w-[--header-createdDate-size] w-[--header-createdDate-size]",
    },
  },
  {
    id: "addColumn",
    header: () => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log("Add column clicked");
            // TODO: Implement add column functionality
          }}
          className="h-8 px-3 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: () => (
      <div className="flex justify-center">
        {/* Empty cell for alignment */}
      </div>
    ),
    size: 128,
    minSize: 128,
    enableHiding: false,
    enableSorting: false,
    enableColumnFilter: false,
    meta: {
      cellClassName: "w-32",
      headerClassName: "w-32",
    },
  },
];
