export interface FilterableColumn {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "number";
}

export interface SortableColumn {
  id: string;
  label: string;
}

export interface SearchableColumn {
  id: string;
  label: string;
  placeholder: string;
}

// Default filterable columns configuration
export const DEFAULT_FILTERABLE_COLUMNS: FilterableColumn[] = [
  {
    id: "name",
    label: "Name",
    placeholder: "Filter by name...",
    type: "text",
  },
  {
    id: "bio", 
    label: "Bio",
    placeholder: "Filter by bio...",
    type: "text",
  },
  {
    id: "language",
    label: "Language", 
    placeholder: "Filter by language...",
    type: "text",
  },
  {
    id: "state",
    label: "State",
    placeholder: "Filter by state...",
    type: "text",
  },
];

// Default sortable columns configuration
export const DEFAULT_SORTABLE_COLUMNS: SortableColumn[] = [
  { id: "name", label: "Name" },
  { id: "version", label: "Version" },
  { id: "createdDate", label: "Created Date" },
];

// Default searchable columns configuration
export const DEFAULT_SEARCHABLE_COLUMNS: SearchableColumn[] = [
  { id: "name", label: "Name", placeholder: "Search in name column..." },
  { id: "bio", label: "Bio", placeholder: "Search in bio column..." },
  { id: "id", label: "ID", placeholder: "Search in ID column..." },
  { id: "language", label: "Language", placeholder: "Search in language column..." },
  { id: "state", label: "State", placeholder: "Search in state column..." },
];
