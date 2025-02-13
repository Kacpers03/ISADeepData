import React, { useState, useEffect, useRef } from "react";
import "../../styles/filefilter.module.css"; // Import CSS file

const FilterSearch = ({ filters, setFilters }) => {
  const filterOptions = {
    country: ["Denmark", "USA", "Germany", "Sweden", "Canada", "Norway", "France"],
    contractor: ["Company X", "Company Y", "Company Z", "Company A", "Company B"],
    year: ["2024", "2023", "2022", "2021"],
    category: ["Reports", "Contracts", "Environmental Data"],
  };

  const [dropdownOpen, setDropdownOpen] = useState({
    country: false,
    contractor: false,
    year: false,
    category: false,
  });

  const dropdownRefs = useRef({});
  const menuRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach((category) => {
        if (
          dropdownRefs.current[category] &&
          !dropdownRefs.current[category].contains(event.target) &&
          menuRefs.current[category] &&
          !menuRefs.current[category].contains(event.target)
        ) {
          setDropdownOpen((prev) => ({ ...prev, [category]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (category) => {
    setDropdownOpen((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleCheckboxChange = (category, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (value === "All") {
        updatedFilters[category] = "All";
      } else {
        if (updatedFilters[category] === "All") {
          updatedFilters[category] = [value];
        } else {
          updatedFilters[category] = updatedFilters[category].includes(value)
            ? updatedFilters[category].filter((item) => item !== value)
            : [...updatedFilters[category], value];

          if (updatedFilters[category].length === 0) {
            updatedFilters[category] = "All";
          }
        }
      }
      return updatedFilters;
    });
  };

  return (
    <div className="filter-container">
      <h2 className="filter-title">Search Filters</h2>
      <hr className="filter-divider" />

      {Object.entries(filterOptions).map(([category, options]) => (
        <div key={category} className="filter-group" ref={(el) => (dropdownRefs.current[category] = el)}>
          <button
            className="dropdown-button"
            onClick={() => toggleDropdown(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
            <span className={`arrow ${dropdownOpen[category] ? "up" : "down"}`}>▼</span>
          </button>

          {dropdownOpen[category] && (
            <div className="dropdown-content" ref={(el) => (menuRefs.current[category] = el)}>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters[category] === "All"}
                  onChange={() => handleCheckboxChange(category, "All")}
                />
                All
              </label>

              {options.map((option) => (
                <label key={option} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={
                      filters[category] !== "All" &&
                      filters[category]?.includes(option)
                    }
                    onChange={() => handleCheckboxChange(category, option)}
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
          setFilters({ country: "All", contractor: "All", year: "All", category: "All" })
        }
        className="clear-filter-button"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterSearch;
