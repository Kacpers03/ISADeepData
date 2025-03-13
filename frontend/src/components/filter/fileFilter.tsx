import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/filefilter.module.css"; // Import CSS file

const FilterSearch = ({ filters, setFilters }) => {
  const filterOptions = {
    country: ["Denmark", "USA", "Germany", "Sweden", "Canada", "Norway", "France"],
    contractor: ["Company X", "Company Y", "Company Z", "Company A", "Company B"],
    year: ["2024", "2023", "2022", "2021"],
    theme: ["Reports", "Contracts", "Biodiversity"],
  };

  const [dropdownOpen, setDropdownOpen] = useState({
    country: false,
    contractor: false,
    year: false,
    theme: false,
  });

  const dropdownRefs = useRef({});
  const menuRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach((theme) => {
        if (
          dropdownRefs.current[theme] &&
          !dropdownRefs.current[theme].contains(event.target) &&
          menuRefs.current[theme] &&
          !menuRefs.current[theme].contains(event.target)
        ) {
          setDropdownOpen((prev) => ({ ...prev, [theme]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (theme) => {
    setDropdownOpen((prev) => ({ ...prev, [theme]: !prev[theme] }));
  };

  const handleCheckboxChange = (theme, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (value === "All") {
        updatedFilters[theme] = "All";
      } else {
        if (updatedFilters[theme] === "All") {
          updatedFilters[theme] = [value];
        } else {
          updatedFilters[theme] = updatedFilters[theme].includes(value)
            ? updatedFilters[theme].filter((item) => item !== value)
            : [...updatedFilters[theme], value];

          if (updatedFilters[theme].length === 0) {
            updatedFilters[theme] = "All";
          }
        }
      }
      return updatedFilters;
    });
  };

  return (
    <div className={styles.filterContainer}>
      <h2 className={styles.filterTitle}>Search Filters</h2>
      <hr className={styles.filterDivider} />

      {Object.entries(filterOptions).map(([theme, options]) => (
        <div key={theme} className={styles.filterGroup} ref={(el) => (dropdownRefs.current[theme] = el)}>
          <button
            className={styles.dropdownButton}
            onClick={() => toggleDropdown(theme)}
          >
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
            <span className={dropdownOpen[theme] ? styles.arrowUp : styles.arrowDown}>▼</span>
          </button>

          {dropdownOpen[theme] && (
            <div className={styles.dropdownContent} ref={(el) => (menuRefs.current[theme] = el)}>
              <label className={styles.filterCheckbox}>
                <input
                  type="checkbox"
                  checked={filters[theme] === "All"}
                  onChange={() => handleCheckboxChange(theme, "All")}
                />
                All
              </label>

              {options.map((option) => (
                <label key={option} className={styles.filterCheckbox}>
                  <input
                    type="checkbox"
                    checked={
                      filters[theme] !== "All" &&
                      filters[theme]?.includes(option)
                    }
                    onChange={() => handleCheckboxChange(theme, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() =>
          setFilters({ country: "All", contractor: "All", year: "All", theme: "All" })
        }
        className={styles.clearFilterButton}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterSearch;