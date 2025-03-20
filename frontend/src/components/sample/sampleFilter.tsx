import React, { useEffect, useState } from "react";
import styles from "../../styles/files/filefilter.module.css";

const SampleFilter = ({ filters, setFilters }) => {
  const [sampleTypes, setSampleTypes] = useState([]);
  const [matrixTypes, setMatrixTypes] = useState([]);
  const [habitatTypes, setHabitatTypes] = useState([]);

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [sampleTypeRes, matrixTypeRes, habitatTypeRes] = await Promise.all([
          fetch("http://localhost:5062/api/sample/sampletypes"),
          fetch("http://localhost:5062/api/sample/matrixtypes"),
          fetch("http://localhost:5062/api/sample/habitattypes"),
        ]);

        const sampleTypeData = await sampleTypeRes.json();
        const matrixTypeData = await matrixTypeRes.json();
        const habitatTypeData = await habitatTypeRes.json();

        setSampleTypes(sampleTypeData.result || []);
        setMatrixTypes(matrixTypeData.result || []);
        setHabitatTypes(habitatTypeData.result || []);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      sampleType: "all",
      matrixType: "all",
      habitatType: "all",
      searchQuery: "",
    });
  };

  return (
    <div className={styles.filterContainer}>
      <h3 className={styles.title}>Search Filters</h3>

      {/* Sample Type */}
      <div className={styles.filterGroup}>
        <label htmlFor="sampleType">Sample Type</label>
        <select name="sampleType" value={filters.sampleType} onChange={handleFilterChange}>
          <option value="all">All Sample Types</option>
          {sampleTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Matrix Type */}
      <div className={styles.filterGroup}>
        <label htmlFor="matrixType">Matrix Type</label>
        <select name="matrixType" value={filters.matrixType} onChange={handleFilterChange}>
          <option value="all">All Matrix Types</option>
          {matrixTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Habitat Type */}
      <div className={styles.filterGroup}>
        <label htmlFor="habitatType">Habitat Type</label>
        <select name="habitatType" value={filters.habitatType} onChange={handleFilterChange}>
          <option value="all">All Habitat Types</option>
          {habitatTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Search Query */}
      <div className={styles.filterGroup}>
        <label htmlFor="searchQuery">Search</label>
        <input
          type="text"
          name="searchQuery"
          value={filters.searchQuery || ""}
          onChange={handleFilterChange}
          placeholder="Search sample code or description..."
        />
      </div>

      <button className={styles.clearButton} onClick={handleClearFilters}>
        Clear Filters
      </button>
    </div>
  );
};

export default SampleFilter;
