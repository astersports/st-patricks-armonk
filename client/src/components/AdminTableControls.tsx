/**
 * AdminTableControls — Reusable search, filter, and pagination for admin lists.
 * Wraps any list of items with client-side filtering and pagination.
 */
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface AdminTableControlsProps<T> {
  /** All items to filter/paginate */
  items: T[];
  /** Function to extract searchable text from an item */
  searchFn: (item: T) => string;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  /** Filter configuration */
  filters?: {
    key: string;
    label: string;
    options: FilterOption[];
    getItemValue: (item: T) => string;
  }[];
  /** Items per page (default: 15) */
  pageSize?: number;
  /** Render function for the filtered/paginated items */
  children: (items: T[], totalCount: number) => React.ReactNode;
}

export function AdminTableControls<T>({
  items,
  searchFn,
  searchPlaceholder = "Search...",
  filters = [],
  pageSize = 15,
  children,
}: AdminTableControlsProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Apply search and filters
  const filteredItems = useMemo(() => {
    let result = items;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) => searchFn(item).toLowerCase().includes(query));
    }

    // Category filters
    for (const filter of filters) {
      const activeValue = activeFilters[filter.key];
      if (activeValue && activeValue !== "all") {
        result = result.filter((item) => filter.getItemValue(item) === activeValue);
      }
    }

    return result;
  }, [items, searchQuery, activeFilters, searchFn, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Reset page when filters change
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {filters.map((filter) => (
          <div key={filter.key} className="flex gap-1.5 flex-wrap items-center">
            <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <div className="flex gap-1 flex-wrap">
              <Button
                size="sm"
                variant={!activeFilters[filter.key] || activeFilters[filter.key] === "all" ? "default" : "outline"}
                className="h-7 text-xs px-2"
                onClick={() => handleFilterChange(filter.key, "all")}
              >
                All
              </Button>
              {filter.options.map((opt) => (
                <Button
                  key={opt.value}
                  size="sm"
                  variant={activeFilters[filter.key] === opt.value ? "default" : "outline"}
                  className="h-7 text-xs px-2"
                  onClick={() => handleFilterChange(filter.key, opt.value)}
                >
                  {opt.label}
                  {opt.count !== undefined && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                      {opt.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredItems.length === items.length
            ? `${items.length} total`
            : `${filteredItems.length} of ${items.length} shown`}
        </span>
        {totalPages > 1 && (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {/* Content */}
      {children(paginatedItems, filteredItems.length)}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let page: number;
              if (totalPages <= 7) {
                page = i + 1;
              } else if (currentPage <= 4) {
                page = i + 1;
              } else if (currentPage >= totalPages - 3) {
                page = totalPages - 6 + i;
              } else {
                page = currentPage - 3 + i;
              }
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
