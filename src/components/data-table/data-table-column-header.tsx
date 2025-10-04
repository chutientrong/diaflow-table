import { Badge } from "@/components/ui/badge";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Column } from "@tanstack/react-table";
import { Calendar, ChevronDown, ChevronUp, Hash, List } from "lucide-react";

type ColumnType = "text" | "number" | "date" | "version" | "primary" | "name";

interface DataTableColumnHeaderProps<TData, TValue>
  extends Omit<ButtonProps, "type"> {
  column: Column<TData, TValue>;
  title: string;
  columnType?: ColumnType;
  showBadge?: boolean;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  columnType = "text",
  showBadge = false,
  badgeText = "Primary",
  badgeVariant = "secondary",
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const renderIcon = () => {
    switch (columnType) {
      case "date":
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
      case "version":
        return <List className="h-4 w-4 text-muted-foreground" />;
      case "name":
        return <Hash className="h-3 w-3 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const renderBadge = () => {
    if (!showBadge) return null;
    return (
      <Badge variant={badgeVariant} className="text-xs">
        {badgeText}
      </Badge>
    );
  };

  const renderContent = () => (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {renderIcon()}
        <span className={cn(columnType === "name" && "font-bold")}>
          {title}
        </span>
      </div>
      {renderBadge()}
    </div>
  );

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{renderContent()}</div>;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        column.toggleSorting(undefined);
      }}
      className={cn(
        "flex h-7 w-full items-center justify-between gap-2 px-0 py-0 hover:bg-transparent",
        className,
      )}
      {...props}
    >
      {renderContent()}
      <span className="flex flex-col">
        <ChevronUp
          className={cn(
            "-mb-0.5 h-3 w-3",
            column.getIsSorted() === "asc"
              ? "text-accent-foreground"
              : "opacity-0",
          )}
        />
        <ChevronDown
          className={cn(
            "-mt-0.5 h-3 w-3",
            column.getIsSorted() === "desc"
              ? "text-accent-foreground"
              : "opacity-0",
          )}
        />
      </span>
    </Button>
  );
}
