import React, { useEffect, useState, useCallback } from "react";
import { CustomDropdown } from "./customDropdown";
import styles from "../../styles/files/reports.module.css";
import dropdownStyles from "../../styles/files/dropdown.module.css";

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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetElement = event.target as Element;
      if (!targetElement.closest(`.${dropdownStyles.customSelectWrapper}`)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleDropdownChange = (filterName: string) => (e: { target: { value: string } }) => {
    onFilterChange(filterName, e.target.value);
  };

  // Custom handler for dropdown toggling
  const handleDropdownToggle = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className={styles.filterContainer} style={{ overflow: "visible" }}>
      <div className={dropdownStyles.improvedFilterPanel}>
        <div className={dropdownStyles.filterContent}>
          <div className={dropdownStyles.filterHeader}>
            <h2>File Filters</h2>
            {countActiveFilters() > 0 && (
              <button className={dropdownStyles.resetButton} onClick={onResetFilters}>
                Reset ({countActiveFilters()})
              </button>
            )}
          </div>

          <div className={dropdownStyles.searchContainer}>
            <div className={dropdownStyles.searchInputWrapper}>
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={dropdownStyles.searchInput}
              />
              <button
                onClick={() => onFilterChange("searchQuery", searchQuery)}
                className={dropdownStyles.searchButton}
                aria-label="Search"
              >
                🔍
              </button>
            </div>
          </div>

          <div className={dropdownStyles.filtersGroup}>
            <h3>Filter By</h3>

            <div className={dropdownStyles.customSelectWrapper}>
              <label className={dropdownStyles.filterLabel}>Contractor</label>
              <div 
                className={`${dropdownStyles.customSelect} ${filters.contractor !== "all" ? dropdownStyles.activeFilter : ""}`}
                onClick={() => handleDropdownToggle("contractor")}
              >
                <span title={contractorOptions.find(option => option.value === filters.contractor)?.label}>
                  {contractorOptions.find(option => option.value === filters.contractor)?.label || "All Contractors"}
                </span>
                <span className={`${dropdownStyles.selectArrow} ${activeDropdown === "contractor" ? dropdownStyles.up : ""}`}>
                  ▼
                </span>
              </div>
              
              {activeDropdown === "contractor" && (
                <div className={dropdownStyles.optionsList}>
                  {contractorOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`${dropdownStyles.optionItem} ${
                        option.value === filters.contractor ? dropdownStyles.selected : ""
                      }`}
                      onClick={() => {
                        onFilterChange("contractor", option.value);
                        setActiveDropdown(null);
                      }}
                    >
                      {option.label}
                      {option.value === filters.contractor && (
                        <span className={dropdownStyles.selectedCheck}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={dropdownStyles.customSelectWrapper}>
              <label className={dropdownStyles.filterLabel}>Country</label>
              <div 
                className={`${dropdownStyles.customSelect} ${filters.country !== "all" ? dropdownStyles.activeFilter : ""}`}
                onClick={() => handleDropdownToggle("country")}
              >
                <span title={countryOptions.find(option => option.value === filters.country)?.label}>
                  {countryOptions.find(option => option.value === filters.country)?.label || "All Countries"}
                </span>
                <span className={`${dropdownStyles.selectArrow} ${activeDropdown === "country" ? dropdownStyles.up : ""}`}>
                  ▼
                </span>
              </div>
              
              {activeDropdown === "country" && (
                <div className={dropdownStyles.optionsList}>
                  {countryOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`${dropdownStyles.optionItem} ${
                        option.value === filters.country ? dropdownStyles.selected : ""
                      }`}
                      onClick={() => {
                        onFilterChange("country", option.value);
                        setActiveDropdown(null);
                      }}
                    >
                      {option.label}
                      {option.value === filters.country && (
                        <span className={dropdownStyles.selectedCheck}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={dropdownStyles.customSelectWrapper}>
              <label className={dropdownStyles.filterLabel}>Year</label>
              <div 
                className={`${dropdownStyles.customSelect} ${filters.year !== "all" ? dropdownStyles.activeFilter : ""}`}
                onClick={() => handleDropdownToggle("year")}
              >
                <span title={yearOptions.find(option => option.value === filters.year)?.label}>
                  {yearOptions.find(option => option.value === filters.year)?.label || "All Years"}
                </span>
                <span className={`${dropdownStyles.selectArrow} ${activeDropdown === "year" ? dropdownStyles.up : ""}`}>
                  ▼
                </span>
              </div>
              
              {activeDropdown === "year" && (
                <div className={dropdownStyles.optionsList}>
                  {yearOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`${dropdownStyles.optionItem} ${
                        option.value === filters.year ? dropdownStyles.selected : ""
                      }`}
                      onClick={() => {
                        onFilterChange("year", option.value);
                        setActiveDropdown(null);
                      }}
                    >
                      {option.label}
                      {option.value === filters.year && (
                        <span className={dropdownStyles.selectedCheck}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={dropdownStyles.customSelectWrapper}>
              <label className={dropdownStyles.filterLabel}>Theme</label>
              <div 
                className={`${dropdownStyles.customSelect} ${filters.theme !== "all" ? dropdownStyles.activeFilter : ""}`}
                onClick={() => handleDropdownToggle("theme")}
              >
                <span title={themeOptions.find(option => option.value === filters.theme)?.label}>
                  {themeOptions.find(option => option.value === filters.theme)?.label || "All Themes"}
                </span>
                <span className={`${dropdownStyles.selectArrow} ${activeDropdown === "theme" ? dropdownStyles.up : ""}`}>
                  ▼
                </span>
              </div>
              
              {activeDropdown === "theme" && (
                <div className={dropdownStyles.optionsList}>
                  {themeOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`${dropdownStyles.optionItem} ${
                        option.value === filters.theme ? dropdownStyles.selected : ""
                      }`}
                      onClick={() => {
                        onFilterChange("theme", option.value);
                        setActiveDropdown(null);
                      }}
                    >
                      {option.label}
                      {option.value === filters.theme && (
                        <span className={dropdownStyles.selectedCheck}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={dropdownStyles.resultsInfo}>
          <span>{currentFilteredItems.length} items match your filters</span>
        </div>
      </div>
    </div>
  );
};

export default FileFilter;