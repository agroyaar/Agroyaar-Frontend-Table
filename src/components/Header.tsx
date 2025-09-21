import React, { useRef, useState } from "react";
import { Column, DataColumn, TableFilters, TableSort } from "../types";

interface ColumnsProps<T> {
  columns: Column<T>[];
  onFilterChange?: (_filters: TableFilters<T>) => void;
  onSortChange?: (_sort: TableSort<T>) => void;
}

export const Header = <T,>({
  columns,
  onFilterChange,
  onSortChange,
}: ColumnsProps<T>) => {
  const debounceRef = useRef<any>(null);
  const [visibleFilters, setVisibleFilters] = useState<{
    [key: string]: boolean;
  }>({});
  const [filters, setFilters] = useState<TableFilters<T>>({});
  const [sortConfig, setSortConfig] = useState<TableSort<T>>(null);

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    column: Column<T>
  ) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const value = event.target.value;
    const newFilters = { ...filters, [String((column as DataColumn<T>).accessor)]: value };
    setFilters(newFilters);

    debounceRef.current = setTimeout(() => {
      onFilterChange?.(newFilters);
    }, 1000);
  };

  const handleSelectFilterChange = (value: string, column: Column<T>) => {
    const newFilters = { ...filters, [String((column as DataColumn<T>).accessor)]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleRangeFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    column: Column<T>,
    type: "min" | "max"
  ) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    } 
    const key = (column as DataColumn<T>).accessor as keyof T;
    const current = (filters[key] as { min?: number; max?: number }) || {};
    const value = event.target.value ? Number(event.target.value) : undefined;
    const newRange = { ...current, [type]: value };
    const newFilters = { ...filters, [key]: newRange };
    setFilters(newFilters);
    debounceRef.current = setTimeout(() => {
      onFilterChange?.(newFilters);
    }, 1000);
  };

  const handleSort = (key: keyof T) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    const newSort = { key, direction };
    setSortConfig(newSort);
    onSortChange?.(newSort);
  };

  const clearFilter = (column: Column<T>) => {
    const key = (column as DataColumn<T>).accessor as keyof T;
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    setVisibleFilters((prev) => ({ ...prev, [key]: false }));
    onFilterChange?.(newFilters);
  };

  const SearchIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="search-icon"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  const FilterIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="filter-icon"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  );

  const CustomSelectFilter = ({ column }: { column: Column<T> }) => {
    const currentValue = (filters[(column as DataColumn<T>).accessor] as string) || "";
    const selectedOption = (column as DataColumn<T>).filterOptions?.find(opt => opt.value === currentValue);
    const selectedLabel = selectedOption?.label || "All";

    return (
      <details className="custom-select-filter">
        <summary>
          {selectedLabel}
          <span className="custom-chevron">▼</span>
        </summary>
        <div className="custom-select-options">
          <button
            type="button"
            className={!currentValue ? "active" : ""}
            onClick={() => handleSelectFilterChange("", column)}
          >
            All
          </button>
          {(column as DataColumn<T>).filterOptions?.map((option) => (
            <button
              type="button"
              key={option.value}
              className={currentValue === option.value ? "active" : ""}
              onClick={() => handleSelectFilterChange(option.value, column)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </details>
    );
  };

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th key={String((column as DataColumn<T>).accessor)} className="header-cell">
          <div className="header-content">
            {/* 👇 filter first */}
            {(column as DataColumn<T>).filterable && (
              <div className="filter-wrapper">
                <button
                  className="filter-toggle"
                  onClick={() =>
                    setVisibleFilters((prev) => ({
                      ...prev,
                      [String((column as DataColumn<T>).accessor)]: !prev[String((column as DataColumn<T>).accessor)],
                    }))
                  }
                >
                  {(column as DataColumn<T>).filterOptions ? <FilterIcon /> : <SearchIcon />}
                </button>
        
                {visibleFilters[String((column as DataColumn<T>).accessor)] && (
                  <div className="filter-dropdown">
                    {(column as DataColumn<T>).filterType === "range" ? (
                      <div className="range-filter">
                        <input
                          type="number"
                          placeholder="Min"
                          value={(filters[(column as DataColumn<T>).accessor] as any)?.min || ""}
                          onChange={(e) => handleRangeFilterChange(e, column, "min")}
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={(filters[(column as DataColumn<T>).accessor] as any)?.max || ""}
                          onChange={(e) => handleRangeFilterChange(e, column, "max")}
                        />
                      </div>
                    ) : (column as DataColumn<T>).filterOptions ? (
                      <CustomSelectFilter column={column} />
                    ) : (
                      <div className="text-filter">
                        <input
                          type="text"
                          placeholder="جستجو..."
                          value={(filters[(column as DataColumn<T>).accessor] as string) || ""}
                          onChange={(e) => handleFilterChange(e, column)}
                        />
                      </div>
                    )}
                    <button
                      className="filter-clear"
                      onClick={() => clearFilter(column)}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}
        
            {/* 👇 then column label */}
            <span className="header-label">{column.label}</span>
        
            {/* 👇 then sort button */}
            <div className="header-controls">
              {(column as DataColumn<T>).sortable && (
                <button
                  className={`sort-button ${
                    sortConfig?.key === (column as DataColumn<T>).accessor ? "active" : ""
                  }`}
                  onClick={() => handleSort((column as DataColumn<T>).accessor)}
                >
                  {sortConfig?.key === (column as DataColumn<T>).accessor
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : "⇅"}
                </button>
              )}
            </div>
          </div>
        </th>
        
        ))}
      </tr>
    </thead>
  );
};
