"use client";

import { useState } from "react";
import type { Table } from "@tanstack/react-table";

export function useDataTableHandlers<TData>(table: Table<TData>) {
  const [tableName, setTableName] = useState("Table name");
  const [isSharing, setIsSharing] = useState(false);

  const handleTableNameEdit = () => {
    const newName = prompt("Enter new table name:", tableName);
    if (newName && newName.trim()) {
      setTableName(newName.trim());
    }
  };

  const handleDownload = () => {
    // Export data as CSV
    const csvData = table
      .getRowModel()
      .rows.map((row) =>
        row
          .getVisibleCells()
          .map((cell) => cell.getValue())
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tableName.toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (isSharing) return; // Prevent multiple simultaneous shares

    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: tableName,
          text: `Check out this ${tableName} table`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      // Handle share cancellation or errors silently
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Share failed:", error);
        // Fallback to clipboard if share fails
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert("Link copied to clipboard!");
        } catch (clipboardError) {
          console.error("Clipboard fallback failed:", clipboardError);
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleSettings = () => {
    console.log("Settings clicked - could open settings modal");
  };

  const handleAction = () => {
    console.log("Action dropdown clicked - could show action menu");
  };

  const handleAskAI = () => {
    console.log("Ask AI clicked - could open AI assistant");
  };

  return {
    tableName,
    isSharing,
    handleTableNameEdit,
    handleDownload,
    handleShare,
    handleSettings,
    handleAction,
    handleAskAI,
  };
}
