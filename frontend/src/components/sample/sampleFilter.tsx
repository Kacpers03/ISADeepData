import React, { useEffect, useState } from "react";
import styles from "../../styles/samples/filter.module.css"; // Updated to use new stylesheet

const SampleFilter = ({ filters, setFilters, visibleColumns, setVisibleColumns }) => {
  const [sampleTypes, setSampleTypes] = useState([]);
  const [matrixTypes, setMatrixTypes] = useState([]);
  const [habitatTypes, setHabitatTypes] = useState([]);
  const [analyses, setAnalyses] = useState([]);

  const allColumnOptions = [
    { key: "sampleCode", label: "Sample Code" },
    { key: "sampleType", label: "Sample Type" },
    { key: "matrixType", label: "Matrix Type" },
    { key: "habitatType", label: "Habitat Type" },
    { key: "analysis", label: "Analysis" },
    { key: "result", label: "Result" },
    { key: "sampleDescription", label: "Description" },
  ];

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [sampleTypeRes, matrixTypeRes, habitatTypeRes, analysisRes] = await Promise.all([
          fetch("http://localhost:5062/api/sample/sampletypes"),
          fetch("http://localhost:5062/api/sample/matrixtypes"),
          fetch("http://localhost:5062/api/sample/habitattypes"),
          fetch("http://localhost:5062/api/sample/analyses"),
        ]);

        const sampleTypeData = await sampleTypeRes.json();
        const matrixTypeData = await matrixTypeRes.json();
        const habitatTypeData = await habitatTypeRes.json();
        const analysisData = await analysisRes.json();

        setSampleTypes(sampleTypeData.result || []);
        setMatrixTypes(matrixTypeData.result || []);
        setHabitatTypes(habitatTypeData.result || []);
        setAnalyses(analysisData.result || []);
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
      analysis: "all",
      searchQuery: "",
    });
    setVisibleColumns(allColumnOptions.map(col => col.key)); // reset to all columns
  };

  const handleColumnToggle = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setVisibleColumns((prev) => [...prev, value]);
    } else {
      setVisibleColumns((prev) => prev.filter((col) => col !== value));
    }
  };

  return (
    <div className={styles.improvedFilterPanel}>
      <div className={styles.filterContent}>
        <div className={styles.filterHeader}>
          <h2>Sample Filters</h2>
          <button className={styles.resetButton} onClick={handleClearFilters}>
            Reset
          </button>
        </div>

        <div className={styles.filtersGroup}>
          <h3>Filter By</h3>

          <label className={styles.filterLabel} htmlFor="sampleType">Sample Type</label>
          <select name="sampleType" value={filters.sampleType} onChange={handleFilterChange} className={styles.customSelect}>
            <option value="all">All Sample Types</option>
            {sampleTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>

          <label className={styles.filterLabel} htmlFor="matrixType">Matrix Type</label>
          <select name="matrixType" value={filters.matrixType} onChange={handleFilterChange} className={styles.customSelect}>
            <option value="all">All Matrix Types</option>
            {matrixTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>

          <label className={styles.filterLabel} htmlFor="habitatType">Habitat Type</label>
          <select name="habitatType" value={filters.habitatType} onChange={handleFilterChange} className={styles.customSelect}>
            <option value="all">All Habitat Types</option>
            {habitatTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>

          <label className={styles.filterLabel} htmlFor="analysis">Analysis</label>
          <select name="analysis" value={filters.analysis} onChange={handleFilterChange} className={styles.customSelect}>
            <option value="all">All Analyses</option>
            {analyses.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>

          <label className={styles.filterLabel} htmlFor="searchQuery">Search</label>
          <input
            type="text"
            name="searchQuery"
            value={filters.searchQuery || ""}
            onChange={handleFilterChange}
            placeholder="Search sample code or description..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.resultsInfo}>
        <div className={styles.resultsInfoWrapper}>
          <span>Visible Columns</span>
        </div>
        <div className={styles.filtersGroup}>
          {allColumnOptions.map((col) => (
            <div key={col.key}>
              <input
                type="checkbox"
                value={col.key}
                checked={visibleColumns.includes(col.key)}
                onChange={handleColumnToggle}
              />
              <label>{col.label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SampleFilter;