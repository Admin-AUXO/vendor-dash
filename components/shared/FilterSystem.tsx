import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/sheet';
import { AdvancedFilterPanel, type FilterGroup } from './AdvancedFilterPanel';
import { FilterBar } from './FilterBar';
import { SearchBar } from './SearchBar';
import { cn } from '../ui/utils';

export interface FilterSystemProps {
  filters: FilterGroup[];
  filterValues: Record<string, string | string[]>;
  onFilterChange: (filters: Record<string, string | string[]>) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount?: number;
  totalCount?: number;
  searchPlaceholder?: string;
  className?: string;
  showSearchBar?: boolean;
  showFilterBar?: boolean;
}

export function FilterSystem({
  filters,
  filterValues,
  onFilterChange,
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
  searchPlaceholder = 'Search...',
  className,
  showSearchBar = true,
  showFilterBar = true,
}: FilterSystemProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Get active filters for display
  const activeFilters = useMemo(() => {
    const active: Array<{
      groupId: string;
      groupLabel: string;
      value: string;
      label: string;
    }> = [];

    filters.forEach((group) => {
      const value = filterValues[group.id];
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((val) => {
          const option = group.options.find((opt) => opt.value === val);
          if (option) {
            active.push({
              groupId: group.id,
              groupLabel: group.label,
              value: val,
              label: option.label,
            });
          }
        });
      } else if (value && typeof value === 'string') {
        const option = group.options.find((opt) => opt.value === value);
        if (option) {
          active.push({
            groupId: group.id,
            groupLabel: group.label,
            value: value,
            label: option.label,
          });
        }
      }
    });

    return active;
  }, [filters, filterValues]);

  const handleRemoveFilter = (groupId: string, value: string) => {
    const currentValue = filterValues[groupId];
    if (Array.isArray(currentValue)) {
      const newValue = currentValue.filter((v) => v !== value);
      onFilterChange({ ...filterValues, [groupId]: newValue });
    } else {
      onFilterChange({ ...filterValues, [groupId]: '' });
    }
  };

  const handleClearAll = () => {
    const defaultValues = Object.fromEntries(
      filters.map((f) => [f.id, f.type === 'checkbox' ? [] : ''])
    );
    onFilterChange(defaultValues);
    onSearchChange('');
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Search Bar and Mobile Filter Button */}
      {showSearchBar && (
        <div className="flex gap-3">
          <div className="flex-1">
            <SearchBar
              placeholder={searchPlaceholder}
              onSearch={onSearchChange}
              value={searchQuery}
              onChange={onSearchChange}
            />
          </div>
          <Drawer open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="default" className="lg:hidden">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFilters.length > 0 && (
                  <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh]">
              <DrawerHeader className="border-b">
                <DrawerTitle>Filters</DrawerTitle>
              </DrawerHeader>
              <AdvancedFilterPanel
                filters={filters}
                filterValues={filterValues}
                onFilterChange={(newFilters) => {
                  onFilterChange(newFilters);
                  // Optionally close drawer after applying filters on mobile
                  // setMobileDrawerOpen(false);
                }}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                resultCount={resultCount}
                totalCount={totalCount}
                variant="drawer"
              />
            </DrawerContent>
          </Drawer>
        </div>
      )}

      {/* Active Filters Bar */}
      {showFilterBar && (
        <FilterBar
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAll}
          resultCount={resultCount}
          totalCount={totalCount}
          onToggleFilters={() => setMobileDrawerOpen(true)}
        />
      )}
    </div>
  );
}

// Separate component for desktop sidebar
export function FilterSidebar({
  filters,
  filterValues,
  onFilterChange,
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
  className,
}: Omit<FilterSystemProps, 'showSearchBar' | 'showFilterBar' | 'searchPlaceholder'>) {
  return (
    <div className={cn('sticky top-4', className)}>
      <AdvancedFilterPanel
        filters={filters}
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        resultCount={resultCount}
        totalCount={totalCount}
        variant="sidebar"
        className="border border-border rounded-lg shadow-sm"
      />
    </div>
  );
}

