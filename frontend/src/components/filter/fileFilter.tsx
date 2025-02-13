import React from "react";

const FilterSearch = ({ filters, setFilters }) => {
  const filterOptions = {
    country: ["Denmark", "USA", "Germany", "Sweden", "Canada", "Norway", "France"],
    contractor: ["Company X", "Company Y", "Company Z", "Company A", "Company B"],
    year: ["2024", "2023", "2022", "2021"],
    category: ["Reports", "Contracts", "Environmental Data"],
  };

  const handleCheckboxChange = (category, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (value === "All") {
        updatedFilters[category] = "All"; // Reset to All
      } else {
        if (updatedFilters[category] === "All") {
          updatedFilters[category] = [value]; // Change from "All" to specific selection
        } else {
          updatedFilters[category] = updatedFilters[category].includes(value)
            ? updatedFilters[category].filter((item) => item !== value) // Remove if exists
            : [...updatedFilters[category], value]; // Add if not exists

          // If no items are selected, revert to "All"
          if (updatedFilters[category].length === 0) {
            updatedFilters[category] = "All";
          }
        }
      }
      return updatedFilters;
    });
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg w-64">
      <h2 className="text-lg font-semibold">Search Filters</h2>
      <hr className="my-2" />

      {Object.entries(filterOptions).map(([category, options]) => (
        <div key={category} className="mb-4">
          <h3 className="font-medium capitalize">{category}</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters[category] === "All"}
                onChange={() => handleCheckboxChange(category, "All")}
              />
              All
            </label>

            {options.map((option) => (
              <label key={option} className="flex items-center gap-2">
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
        </div>
      ))}

      <button
        onClick={() =>
          setFilters({ country: "All", contractor: "All", year: "All", category: "All" })
        }
        className="w-full bg-gray-500 text-white py-2 rounded mt-2"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterSearch;
