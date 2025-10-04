"use client";

import { useState } from "react";
import type { Table } from "@tanstack/react-table";

export function useDataTableActions<TData>(table: Table<TData>) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFieldsOpen, setIsFieldsOpen] = useState(false);

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    setIsSortOpen(false);
    setIsSearchOpen(false);
    setIsFieldsOpen(false);
  };

  const handleSort = () => {
    setIsSortOpen(!isSortOpen);
    setIsFilterOpen(false);
    setIsSearchOpen(false);
    setIsFieldsOpen(false);
  };

  const handleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsFilterOpen(false);
    setIsSortOpen(false);
    setIsFieldsOpen(false);
  };

  const handleFields = () => {
    setIsFieldsOpen(!isFieldsOpen);
    setIsFilterOpen(false);
    setIsSortOpen(false);
    setIsSearchOpen(false);
  };

  const closeAllPanels = () => {
    setIsFilterOpen(false);
    setIsSortOpen(false);
    setIsSearchOpen(false);
    setIsFieldsOpen(false);
  };

  return {
    isFilterOpen,
    isSortOpen,
    isSearchOpen,
    isFieldsOpen,
    handleFilter,
    handleSort,
    handleSearch,
    handleFields,
    closeAllPanels,
  };
}
