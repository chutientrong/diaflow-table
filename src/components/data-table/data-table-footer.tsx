"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface DataTableFooterProps {
  onAddRow?: () => void;
  isAddingRow?: boolean;
  className?: string;
}

export function DataTableFooter({
  onAddRow,
  isAddingRow,
  className,
}: DataTableFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-t bg-background px-4 py-3",
        className,
      )}
    >
      {/* Left side - Add Row button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onAddRow}
          size="sm"
          className="h-8 gap-2"
          disabled={isAddingRow}
        >
          <Plus className="h-4 w-4" />
          {isAddingRow ? "Adding..." : "Add Row"}
        </Button>
      </div>

      {/* Right side - Additional actions can be added here */}
      <div className="flex items-center gap-2">
        {/* Placeholder for future actions */}
      </div>
    </div>
  );
}
