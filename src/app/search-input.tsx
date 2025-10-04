"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  placeholder = "Search...",
  className,
}: SearchInputProps) {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });

  // Local state for immediate typing response
  const [inputValue, setInputValue] = useState(search || "");

  // Debounced value for URL updates
  const debouncedInputValue = useDebounce(inputValue, 300);

  // Update URL when debounced value changes
  useEffect(() => {
    setSearch(debouncedInputValue || "");
  }, [debouncedInputValue, setSearch]);

  // Update input when URL changes from external sources
  useEffect(() => {
    setInputValue(search || "");
  }, [search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
    setSearch("");
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        className="pl-10 pr-10"
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 transform p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
