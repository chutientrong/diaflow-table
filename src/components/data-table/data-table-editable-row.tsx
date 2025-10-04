"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

interface DataTableEditableRowProps<TData, TSchema = any> {
  onSave: (data: Partial<TData>) => void;
  onCancel: () => void;
  columns: ColumnDef<TData, any>[];
  schema: TSchema;
  initialData?: Partial<TData>;
  autoFocus?: boolean;
}

export function DataTableEditableRow<TData, TSchema = any>({
  onSave,
  onCancel,
  columns,
  schema,
  initialData = {},
  autoFocus = true,
}: DataTableEditableRowProps<TData, TSchema>) {
  // Get editable columns (exclude select column and other non-editable columns)
  const editableColumns = columns.filter(
    (col) =>
      col.id !== "select" &&
      "accessorKey" in col &&
      col.accessorKey &&
      typeof col.accessorKey === "string",
  );

  // Initialize form with React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<any>({
    resolver: zodResolver(schema as any),
    defaultValues: initialData,
    mode: "onChange",
  });

  const firstInputRef = useRef<HTMLInputElement>(null);
  const rowRef = useRef<HTMLTableRowElement>(null);

  // Auto-focus and scroll to the editable row
  useEffect(() => {
    if (autoFocus && firstInputRef.current) {
      // Scroll to the row first - position at top for better UX
      rowRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Focus the first input after a short delay
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  const onSubmit = (data: any) => {
    onSave(data as Partial<TData>);
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const getInputType = (accessorKey: string) => {
    // Determine input type based on field name or column meta
    if (accessorKey.includes("date") || accessorKey.includes("Date"))
      return "date";
    if (accessorKey.includes("version")) return "number";
    if (accessorKey.includes("email")) return "email";
    if (accessorKey.includes("url")) return "url";
    return "text";
  };

  const getPlaceholder = (accessorKey: string) => {
    return `Enter ${accessorKey.replace(/([A-Z])/g, " $1").toLowerCase()}`;
  };

  return (
    <tr
      ref={rowRef}
      tabIndex={0}
      data-state="editing"
      className={cn(
        "[&>:not(:last-child)]:border-r",
        "outline-1 -outline-offset-1 outline-primary transition-colors focus-visible:bg-muted/50 focus-visible:outline",
        "border-b bg-muted/30",
      )}
    >
      {/* Select column - always first */}
      <td className="align-middle">
        <div className="flex h-8 w-8 items-center justify-center">
          <div className="h-4 w-4 rounded border-2 border-dashed border-muted-foreground" />
        </div>
      </td>

      {/* Dynamic form fields based on columns */}
      {editableColumns.map((column, index) => {
        const accessorKey =
          "accessorKey" in column ? (column.accessorKey as string) : "";
        const inputType = getInputType(accessorKey);
        const placeholder = getPlaceholder(accessorKey);
        const isNameField = accessorKey === "name";
        const isFirstInput = index === 0;
        const hasError = errors?.[accessorKey];

        return (
          <td key={accessorKey} className="p-2 align-middle">
            <Controller
              name={accessorKey}
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    type={inputType}
                    {...field}
                    placeholder={placeholder}
                    className={cn(
                      "h-8 w-full",
                      isNameField && "font-bold",
                      hasError && "border-red-500 focus:border-red-500",
                    )}
                    ref={isFirstInput ? firstInputRef : undefined}
                  />
                  {hasError && (
                    <div className="absolute -bottom-5 left-0 text-xs text-red-500">
                      {String(hasError.message)}
                    </div>
                  )}
                </div>
              )}
            />
          </td>
        );
      })}

      {/* Actions column - always last */}
      <td className="p-2 align-middle">
        <div className="flex items-center gap-1">
          <Button
            onClick={handleSubmit(onSubmit)}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
            disabled={!isValid}
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button
            onClick={handleCancel}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
