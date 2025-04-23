import React, { useEffect, useState, useCallback } from "react";
import { CustomDropdown } from "./customDropdown";
import styles from "../../styles/files/reports.module.css"; // Using the same styles file

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
    <div className={styles.filterContainer}>
      <div className={styles.improvedFilterPanel}>
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

            <div className={styles.customSelectWrapper}>
              <label className={styles.filterLabel}>Contractor</label>
              <div 
                className={`${styles.customSelect} ${filters.contractor !== "all" ? styles.activeFilter : ""}`}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <select
                  value={filters.contractor}
                  onChange={(e) => onFilterChange("contractor", e.target.value)}
                  className={styles.selectInput}
                >
                  {contractorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.customSelectWrapper}>
              <label className={styles.filterLabel}>Country</label>
              <div 
                className={`${styles.customSelect} ${filters.country !== "all" ? styles.activeFilter : ""}`}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <select
                  value={filters.country}
                  onChange={(e) => onFilterChange("country", e.target.value)}
                  className={styles.selectInput}
                >
                  {countryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.customSelectWrapper}>
              <label className={styles.filterLabel}>Year</label>
              <div 
                className={`${styles.customSelect} ${filters.year !== "all" ? styles.activeFilter : ""}`}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <select
                  value={filters.year}
                  onChange={(e) => onFilterChange("year", e.target.value)}
                  className={styles.selectInput}
                >
                  {yearOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.customSelectWrapper}>
              <label className={styles.filterLabel}>Theme</label>
              <div 
                className={`${styles.customSelect} ${filters.theme !== "all" ? styles.activeFilter : ""}`}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <select
                  value={filters.theme}
                  onChange={(e) => onFilterChange("theme", e.target.value)}
                  className={styles.selectInput}
                >
                  {themeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.resultsInfo}>
          <span>{currentFilteredItems.length} items match your filters</span>
        </div>
      </div>
    </div>
  );
};

export default FileFilter;