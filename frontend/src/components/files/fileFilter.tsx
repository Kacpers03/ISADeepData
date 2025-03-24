import React, { useEffect, useState, useCallback } from "react";
import { CustomDropdown } from "../map/filters/CustomDropdown";
import styles from "../../styles/files/filefilter.module.css"; // Using the new CSS module

interface FileFilterProps {
  filters: {
    contractor: string;
    country: string;
    year: string;
    theme: string;
    searchQuery: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
  onResetFilters: () => void;
  contractors: { id: number; name: string }[];
  countries: string[];
  years: string[];
  themes: string[];
  currentFilteredItems: any[];
}

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const FileFilter: React.FC<FileFilterProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  contractors,
  countries,
  years,
  themes,
  currentFilteredItems,
}) => {
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedFilterChange("searchQuery", query);
  };

  const debouncedFilterChange = useCallback(
    debounce((key: string, value: string) => {
      onFilterChange(key, value);
    }, 300),
    [onFilterChange]
  );

  const countActiveFilters = () => {
    let count = 0;
    if (filters.contractor !== "all") count++;
    if (filters.country !== "all") count++;
    if (filters.year !== "all") count++;
    if (filters.theme !== "all") count++;
    if (filters.searchQuery.trim() !== "") count++;
    return count;
  };

  const contractorOptions = [
    { value: "all", label: "All Contractors" },
    ...contractors.map((c) => ({ value: c.name, label: c.name })),
  ];

  const countryOptions = [
    { value: "all", label: "All Countries" },
    ...countries.map((country) => ({ value: country, label: country })),
  ];

  const yearOptions = [
    { value: "all", label: "All Years" },
    ...years.map((year) => ({ value: year, label: year })),
  ];

  const themeOptions = [
    { value: "all", label: "All Themes" },
    ...themes.map((theme) => ({ value: theme, label: theme })),
  ];

  return (
    <div className={`${styles.improvedFilterPanel}`}>
      <div className={styles.filterContent}>
        <div className={styles.filterHeader}>
          <h2>File Filters</h2>
          {countActiveFilters() > 0 && (
            <button className={styles.resetButton} onClick={onResetFilters}>
              Reset ({countActiveFilters()})
            </button>
          )}
        </div>

        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <button
              onClick={() => onFilterChange("searchQuery", searchQuery)}
              className={styles.searchButton}
              aria-label="Search"
            >
              🔍
            </button>
          </div>
        </div>

        <div className={styles.filtersGroup}>
          <h3>Filter By</h3>

          <CustomDropdown
            id="contractor"
            label="Contractor"
            options={contractorOptions}
            value={filters.contractor}
            onChange={(e) => onFilterChange("contractor", e.target.value)}
            isActive={filters.contractor !== "all"}
          />

          <CustomDropdown
            id="country"
            label="Country"
            options={countryOptions}
            value={filters.country}
            onChange={(e) => onFilterChange("country", e.target.value)}
            isActive={filters.country !== "all"}
          />

          <CustomDropdown
            id="year"
            label="Year"
            options={yearOptions}
            value={filters.year}
            onChange={(e) => onFilterChange("year", e.target.value)}
            isActive={filters.year !== "all"}
          />

          <CustomDropdown
            id="theme"
            label="Theme"
            options={themeOptions}
            value={filters.theme}
            onChange={(e) => onFilterChange("theme", e.target.value)}
            isActive={filters.theme !== "all"}
          />
        </div>
      </div>

      <div className={styles.resultsInfo}>
        <span>{currentFilteredItems.length} items match your filters</span>
      </div>
    </div>
  );
};

export default FileFilter;
