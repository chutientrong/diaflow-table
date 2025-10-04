"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowUpDown,
  ChevronDown,
  Download,
  Filter,
  Grid3X3,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Share2,
  Star,
} from "lucide-react";

interface DataTableToolbarProps {
  tableName?: string;
  onTableNameEdit?: () => void;
  onAddRow?: () => void;
  isAddingRow?: boolean;
  onFilter?: () => void;
  onSort?: () => void;
  onSearch?: () => void;
  onFields?: () => void;
  onRefresh?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
  onAction?: () => void;
  onAskAI?: () => void;
  hasActiveSort?: boolean;
  hasActiveFilters?: boolean;
  className?: string;
}

export function DataTableToolbar({
  tableName = "Table name",
  onTableNameEdit,
  onAddRow,
  isAddingRow = false,
  onFilter,
  onSort,
  onSearch,
  onFields,
  onRefresh,
  onDownload,
  onShare,
  onSettings,
  onAction,
  onAskAI,
  hasActiveSort = false,
  hasActiveFilters = false,
  className,
}: DataTableToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center border-b bg-background px-4 py-3",
        className,
      )}
    >
      {/* Left section - Navigation and table name */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {tableName}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onTableNameEdit}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Right section - All actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Primary actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2"
            onClick={onAddRow}
            disabled={isAddingRow}
          >
            <Plus className="h-4 w-4" />
            {isAddingRow ? "Adding..." : "Add row"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="relative h-8 gap-2"
            onClick={onFilter}
          >
            <div className="relative">
              <Filter className="h-4 w-4" />
              {hasActiveFilters && (
                <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </div>
            Filter
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="relative h-8 gap-2"
            onClick={onSort}
          >
            <div className="relative">
              <ArrowUpDown className="h-4 w-4" />
              {hasActiveSort && (
                <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </div>
            Sort
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2"
            onClick={onSearch}
          >
            <Search className="h-4 w-4" />
            Search
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2"
            onClick={onFields}
          >
            <Grid3X3 className="h-4 w-4" />
            Fields
          </Button>
        </div>

        {/* Secondary action icons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onRefresh}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onSettings}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Action dropdown */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2"
          onClick={onAction}
        >
          Action
          <ChevronDown className="h-4 w-4" />
        </Button>

        {/* Ask AI button */}
        <Button
          size="sm"
          className="h-8 gap-2 bg-orange-500 text-white hover:bg-orange-600"
          onClick={onAskAI}
        >
          <Star className="h-4 w-4" />
          Ask AI
        </Button>
      </div>
    </div>
  );
}
