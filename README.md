# Infinite Scroll Data Table

A modern, performant data table component built with React, TypeScript, and TanStack Table, featuring infinite scrolling, advanced filtering, sorting, and search capabilities.

## 🚀 Features

- **Infinite Scrolling**: Load data progressively as users scroll
- **Advanced Filtering**: Multi-column filtering with range and text filters
- **Smart Sorting**: Multi-column sorting with visual indicators
- **Global Search**: Search across all columns with debounced input
- **Column Management**: Show/hide columns with drag-and-drop reordering
- **Export Functionality**: Download data as CSV
- **Responsive Design**: Mobile-friendly with adaptive layouts
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Library**: Radix UI + Tailwind CSS
- **Table**: TanStack Table v8
- **State Management**: React Query + React State
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd infinite-scroll-table
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── data-table-infinite.tsx  # Main table component
│   ├── page.tsx                  # Home page
│   └── ...
├── components/
│   ├── data-table/              # Table-related components
│   │   ├── data-table-filter-panel.tsx
│   │   ├── data-table-sort-panel.tsx
│   │   ├── data-table-search-panel.tsx
│   │   ├── data-table-fields-panel.tsx
│   │   └── filter-input.tsx
│   ├── ui/                      # Reusable UI components
│   └── custom/                  # Custom components
├── constants/
│   └── table-config.ts          # Table configuration constants
├── hooks/                       # Custom React hooks
│   ├── use-data-table-actions.ts
│   └── use-data-table-handlers.ts
├── lib/                         # Utility functions
└── types/                       # TypeScript type definitions
```

## 🎯 Key Components

### DataTableInfinite
The main table component that orchestrates all functionality:
- Manages table state and data fetching
- Handles infinite scrolling logic
- Coordinates between different panels

### Panel Components
Modular components for different table features:
- **FilterPanel**: Column-based filtering with range support
- **SortPanel**: Multi-column sorting with visual feedback
- **SearchPanel**: Global and column-specific search
- **FieldsPanel**: Column visibility and ordering

### Custom Hooks
Reusable logic extraction:
- **useDataTableActions**: Panel state management
- **useDataTableHandlers**: Action handlers (download, share, etc.)

## ⚙️ Configuration

### Table Configuration
Configure table behavior through constants in `src/constants/table-config.ts`:

```typescript
export const DEFAULT_FILTERABLE_COLUMNS: FilterableColumn[] = [
  { id: "name", label: "Name", placeholder: "Filter by name...", type: "text" },
  { id: "bio", label: "Bio", placeholder: "Filter by bio...", type: "text" },
  // Add more columns as needed
];
```

### Customizing Columns
Each panel accepts configuration props for flexibility:

```typescript
<DataTableFilterPanel 
  table={table} 
  onClose={onClose}
  filterableColumns={CUSTOM_FILTERABLE_COLUMNS}
/>
```

## 🔧 Development Decisions & Trade-offs

### Architecture Decisions

#### 1. **Component Decomposition**
- **Decision**: Split large component into smaller, focused components
- **Trade-off**: More files but better maintainability and reusability
- **Benefit**: Each component has single responsibility, easier to test and modify

#### 2. **Custom Hooks for Logic**
- **Decision**: Extract business logic into custom hooks
- **Trade-off**: Additional abstraction layer
- **Benefit**: Reusable logic, cleaner components, easier testing

#### 3. **Configuration-Driven Approach**
- **Decision**: Use configuration objects instead of hardcoded values
- **Trade-off**: Slightly more complex setup
- **Benefit**: Highly flexible, easy to customize for different use cases

#### 4. **TypeScript Interfaces**
- **Decision**: Strong typing for all props and configurations
- **Trade-off**: More verbose code
- **Benefit**: Better developer experience, fewer runtime errors

### Performance Considerations

#### 1. **Infinite Scrolling**
- **Implementation**: Virtual scrolling with intersection observer
- **Trade-off**: Complex scroll management
- **Benefit**: Handles large datasets without performance issues

#### 2. **Memoized Components**
- **Decision**: Use React.memo for expensive row components
- **Trade-off**: Additional memory usage
- **Benefit**: Prevents unnecessary re-renders

#### 3. **Debounced Search**
- **Decision**: Debounce search input to reduce API calls
- **Trade-off**: Slight delay in search results
- **Benefit**: Better performance and user experience

### State Management

#### 1. **Local State vs Global State**
- **Decision**: Use local state for table-specific data
- **Trade-off**: State not shared across components
- **Benefit**: Simpler state management, better component isolation

#### 2. **URL State Synchronization**
- **Decision**: Sync filters and sorting with URL parameters
- **Trade-off**: Additional complexity
- **Benefit**: Bookmarkable states, browser back/forward support

## 🚀 Performance Optimizations

- **Virtual Scrolling**: Only render visible rows
- **Memoization**: Prevent unnecessary re-renders
- **Debounced Search**: Reduce API calls
- **Lazy Loading**: Load data on demand
- **Column Resizing**: Optimized resize calculations

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TanStack Table](https://tanstack.com/table) for the excellent table library
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Next.js](https://nextjs.org/) for the React framework