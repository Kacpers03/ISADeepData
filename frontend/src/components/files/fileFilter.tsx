import React, { useEffect, useState, useCallback, useMemo } from "react";
import styles from "../../styles/files/reports.module.css";
import dropdownStyles from "../../styles/files/dropdown.module.css";
import { useLanguage } from "../../contexts/languageContext"; 

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
  const { t } = useLanguage();
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

  // Calculate available options based on the filtered items
  const availableOptions = useMemo(() => {
    if (!currentFilteredItems.length) {
      return {
        contractors: contractors.map(c => c.name),
        countries: countries,
        years: years,
        themes: themes
      };
    }

    // Extract unique values from filtered items
    const uniqueContractors = [...new Set(currentFilteredItems.map(item => item.contractor).filter(Boolean))];
    const uniqueCountries = [...new Set(currentFilteredItems.map(item => item.country).filter(Boolean))];
    const uniqueYears = [...new Set(currentFilteredItems.map(item => item.year?.toString()).filter(Boolean))];
    const uniqueThemes = [...new Set(currentFilteredItems.map(item => item.theme).filter(Boolean))];

    // Only show filtered options for filters that aren't currently active
    return {
      contractors: filters.contractor !== 'all' ? contractors.map(c => c.name) : uniqueContractors,
      countries: filters.country !== 'all' ? countries : uniqueCountries,
      years: filters.year !== 'all' ? years : uniqueYears,
      themes: filters.theme !== 'all' ? themes : uniqueThemes
    };
  }, [
    currentFilteredItems, 
    filters.contractor, 
    filters.country, 
    filters.year, 
    filters.theme, 
    contractors, 
    countries, 
    years, 
    themes
  ]);

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

  // Custom handler for dropdown toggling
  const handleDropdownToggle = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

 // Get display value for dropdown
const getDisplayValue = (name: string, value: string) => {
  if (value === 'all') {
    switch(name) {
      case 'contractor': return t('library.filter.allContractors') || 'All Contractors';
      case 'country': return t('library.filter.allCountries') || 'All Countries';
      case 'year': return t('library.filter.allYears') || 'All Years';
      case 'theme': return t('library.filter.allThemes') || 'All Themes';
      default: return t('library.filter.all') || 'All';
    }
  }
  return value;
};

  return (
    <div className={styles.filterContainer} style={{ overflow: "visible" }}>
      <div className={dropdownStyles.improvedFilterPanel}>
        <div className={dropdownStyles.filterContent}>
          <div className={dropdownStyles.filterHeader}>
            <h2>{t('library.filter.title') || "File Filters"}</h2>
            {countActiveFilters() > 0 && (
              <button className={dropdownStyles.resetButton} onClick={onResetFilters}>
                 {t('library.filter.reset') || "Reset"} ({countActiveFilters()})
              </button>
            )}
          </div>

          <div className={dropdownStyles.searchContainer}>
            <div className={dropdownStyles.searchInputWrapper}>
              <input
                type="text"
                placeholder={t('library.filter.searchPlaceholder') || "Search files..."}
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
            <h3>{t('library.filter.filterBy') || "Filter By"}</h3>

            <div className={dropdownStyles.customSelectWrapper}>
            <label className={dropdownStyles.filterLabel}>{t('library.filter.contractor') || "Contractor"}</label>
              <div 
                className={`${dropdownStyles.customSelect} ${filters.contractor !== "all" ? dropdownStyles.activeFilter : ""}`}
                onClick={() => handleDropdownToggle("contractor")}
              >
                <span title={getDisplayValue('contractor', filters.contractor)}>
                  {getDisplayValue('contractor', filters.contractor)}
                </span>
                <span className={`${dropdownStyles.selectArrow} ${activeDropdown === "contractor" ? dropdownStyles.up : ""}`}>
                  ▼
                </span>
              </div>
              
              {activeDropdown === "contractor" && (
                <div className={dropdownStyles.optionsList}>
                  <div
                    className={`${dropdownStyles.optionItem} ${
                      filters.contractor === "all" ? dropdownStyles.selected : ""
                    }`}
                    onClick={() => {
                      onFilterChange("contractor", "all");
                      setActiveDropdown(null);
                    }}
                  >
                    All Contractors
                    {filters.contractor === "all" && (
                      <span className={dropdownStyles.selectedCheck}>✓</span>
                    )}
                  </div>
                  {availableOptions.contractors.map((option) => (
                    <div
                      key={option}
                      className={`${dropdownStyles.optionItem} ${
                        option === filters.contractor ? dropdownStyles.selected : ""
                      }`}
                      onClick={() => {
                        onFilterChange("contractor", option);
                        setActiveDropdown(null);
                      }}
                    >
                      {option}
                      {option === filters.contractor && (
                        <span className={dropdownStyles.selectedCheck}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={dropdownStyles.customSelectWrapper}>
            <label className={dropdownStyles.filterLabel}>{t('library.filter.country') || "Country"}</label>
              <div 
                className={`${dropdownStyles.customSelect} ${filters.country !== "all" ? dropdownStyles.activeFilter : ""}`}
                onClick={() => handleDropdownToggle("country")}
              >
                <span title={getDisplayValue('country', filters.country)}>
                  {getDisplayValue('country', filters.country)}
                </span>
                <span className={`${dropdownStyles.selectArrow} ${activeDropdown === "country" ? dropdownStyles.up : ""}`}>
                  ▼
                </span>
              </div>
              
              {activeDropdown === "country" && (
                <div className={dropdownStyles.optionsList}>
                  <div
                    className={`${dropdownStyles.optionItem} ${
                      filters.country === "all" ? dropdownStyles.selected : ""
                    }`}
                    onClick={() => {
                      onFilterChange("country", "all");
                      setActiveDropdown(null);
                    }}
                  >
                    All Countries
                    {filters.country === "all" && (
                      <span className={dropdownStyles.selectedCheck}>✓</span>
                    )}
                  </div>
                  {availableOptions.countries.map((option) => (
                    <div
                      key={option}
                      className={`${dropdownStyles.optionItem} ${
                        option === filters.country ? dropdownStyles.selected : ""
                      }`}
                      onClick={() => {
                        onFilterChange("country", option);
                        setActiveDropdown(null);
                      }}
                    >
                      {option}
                      {option === filters.country && (
                        <span className={dropdownStyles.selectedCheck}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={dropdownStyles.customSelectWrapper}>
            <label className={dropdownStyles.filterLabel}>{t('library.filter.year') || "Year"}</label>
              <div 
                className={`${dropdownStyles.customSelect} ${filters.year !== "all" ? dropdownStyles.activeFilter : ""}`}
                onClick={() => handleDropdownToggle("year")}
              >
                <span title={getDisplayValue('year', filters.year)}>
                  {getDisplayValue('year', filters.year)}
                </span>
                <span className={`${dropdownStyles.selectArrow} ${activeDropdown === "year" ? dropdownStyles.up : ""}`}>
                  ▼
                </span>
              </div>
              
              {activeDropdown === "year" && (
                <div className={dropdownStyles.optionsList}>
                  <div
                    className={`${dropdownStyles.optionItem} ${
                      filters.year === "all" ? dropdownStyles.selected : ""
                    }`}
                    onClick={() => {
                      onFilterChange("year", "all");
                      setActiveDropdown(null);
                    }}
                  >
                    All Years
                    {filters.year === "all" && (
                      <span className={dropdownStyles.selectedCheck}>✓</span>
                    )}
                  </div>
                  {availableOptions.years.map((option) => (
                    <div
                      key={option}
                      className={`${dropdownStyles.optionItem} ${
                        option === filters.year ? dropdownStyles.selected : ""
                      }`}
                      onClick={() => {
                        onFilterChange("year", option);
                        setActiveDropdown(null);
                      }}
                    >
                      {option}
                      {option === filters.year && (
                        <span className={dropdownStyles.selectedCheck}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={dropdownStyles.customSelectWrapper}>
            <label className={dropdownStyles.filterLabel}>{t('library.filter.theme') || "Theme"}</label>
              <div 
                className={`${dropdownStyles.customSelect} ${filters.theme !== "all" ? dropdownStyles.activeFilter : ""}`}
                onClick={() => handleDropdownToggle("theme")}
              >
                <span title={getDisplayValue('theme', filters.theme)}>
                  {getDisplayValue('theme', filters.theme)}
                </span>
                <span className={`${dropdownStyles.selectArrow} ${activeDropdown === "theme" ? dropdownStyles.up : ""}`}>
                  ▼
                </span>
              </div>
              
              {activeDropdown === "theme" && (
                <div className={dropdownStyles.optionsList}>
                  <div
                    className={`${dropdownStyles.optionItem} ${
                      filters.theme === "all" ? dropdownStyles.selected : ""
                    }`}
                    onClick={() => {
                      onFilterChange("theme", "all");
                      setActiveDropdown(null);
                    }}
                  >
                    All Themes
                    {filters.theme === "all" && (
                      <span className={dropdownStyles.selectedCheck}>✓</span>
                    )}
                  </div>
                  {availableOptions.themes.map((option) => (
                    <div
                      key={option}
                      className={`${dropdownStyles.optionItem} ${
                        option === filters.theme ? dropdownStyles.selected : ""
                      }`}
                      onClick={() => {
                        onFilterChange("theme", option);
                        setActiveDropdown(null);
                      }}
                    >
                      {option}
                      {option === filters.theme && (
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
        <span>{currentFilteredItems.length} {t('library.filter.itemsMatch') || "items match your filters"}</span>
        </div>
      </div>
    </div>
  );
};

export default FileFilter;