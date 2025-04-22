import React, { useEffect, useState } from "react";
import styles from "../../styles/samples/filter.module.css"; // Updated to use new stylesheet

const SampleFilter = ({
  filters,
  setFilters,
  defaultFilters,
  visibleColumns,
  setVisibleColumns,
}) => {
  const [sampleTypes, setSampleTypes] = useState([]);
  const [matrixTypes, setMatrixTypes] = useState([]);
  const [habitatTypes, setHabitatTypes] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [stationOptions, setStationOptions] = useState([]);
  const [cruiseOptions, setCruiseOptions] = useState([]);
  const [contractorOptions, setContractorOptions] = useState([]);

  const allColumnOptions = [
    { key: "sampleCode", label: "Sample Code" },
    { key: "sampleType", label: "Sample Type" },
    { key: "matrixType", label: "Matrix Type" },
    { key: "habitatType", label: "Habitat Type" },
    { key: "analysis", label: "Analysis" },
    { key: "result", label: "Result" },
    { key: "contractor", label: "Contractor" },
    { key: "station", label: "Station" },
    { key: "cruise", label: "Cruise" },
    { key: "sampleDescription", label: "Description" },
  ];

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [
          sampleTypeRes,
          matrixTypeRes,
          habitatTypeRes,
          analysisRes,
          stationRes,
          cruiseRes,
          contractorRes
        ] = await Promise.all([
          fetch("http://localhost:5062/api/sample/sampletypes"),
          fetch("http://localhost:5062/api/sample/matrixtypes"),
          fetch("http://localhost:5062/api/sample/habitattypes"),
          fetch("http://localhost:5062/api/sample/analyses"),
          fetch("http://localhost:5062/api/sample/stations"),       
          fetch("http://localhost:5062/api/sample/cruises"),        
          fetch("http://localhost:5062/api/sample/contractors"),    
        ]);
  
        const sampleTypeData = await sampleTypeRes.json();
        const matrixTypeData = await matrixTypeRes.json();
        const habitatTypeData = await habitatTypeRes.json();
        const analysisData = await analysisRes.json();
        const stationData = await stationRes.json();
        const cruiseData = await cruiseRes.json();
        const contractorData = await contractorRes.json();
  
        setSampleTypes(sampleTypeData.result || []);
        setMatrixTypes(matrixTypeData.result || []);
        setHabitatTypes(habitatTypeData.result || []);
        setAnalyses(analysisData.result || []);
  
        setStationOptions(stationData.result || []);
        setCruiseOptions(cruiseData.result || []);
        setContractorOptions(contractorData.result || []);
  
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
    setFilters(defaultFilters);
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
          
          <label className={styles.filterLabel} htmlFor="station">Station</label>
          <select
            name="station"
            value={filters.station}
            onChange={handleFilterChange}
            className={styles.customSelect}
          >
            <option value="all">All Stations</option>
            {stationOptions.map((station, index) => (
              <option key={index} value={station}>{station}</option>
            ))}
          </select>

          <label className={styles.filterLabel} htmlFor="cruise">Cruise</label>
          <select
            name="cruise"
            value={filters.cruise}
            onChange={handleFilterChange}
            className={styles.customSelect}
          >
            <option value="all">All Cruises</option>
            {cruiseOptions.map((cruise, index) => (
              <option key={index} value={cruise}>{cruise}</option>
            ))}
          </select>

          <label className={styles.filterLabel} htmlFor="contractor">Contractor</label>
          <select
            name="contractor"
            value={filters.contractor}
            onChange={handleFilterChange}
            className={styles.customSelect}
          >
            <option value="all">All Contractors</option>
            {contractorOptions.map((contractor, index) => (
              <option key={index} value={contractor}>{contractor}</option>
            ))}
          </select>
          
          <label className={styles.filterLabel} htmlFor="sampleType">Sample Type</label>
          <select 
            name="sampleType" 
            value={filters.sampleType} 
            onChange={handleFilterChange} 
            className={styles.customSelect}
          >
            <option value="all">All Sample Types</option>
            {sampleTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>

          <label className={styles.filterLabel} htmlFor="matrixType">Matrix Type</label>
          <select 
            name="matrixType" 
            value={filters.matrixType} 
            onChange={handleFilterChange} 
            className={styles.customSelect}
          >
            <option value="all">All Matrix Types</option>
            {matrixTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>

          <label className={styles.filterLabel} htmlFor="habitatType">Habitat Type</label>
          <select 
            name="habitatType" 
            value={filters.habitatType} 
            onChange={handleFilterChange} 
            className={styles.customSelect}
          >
            <option value="all">All Habitat Types</option>
            {habitatTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>

          <label className={styles.filterLabel} htmlFor="analysis">Analysis</label>
          <select 
            name="analysis" 
            value={filters.analysis} 
            onChange={handleFilterChange} 
            className={styles.customSelect}
          >
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
            placeholder="Search sample code..."
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
                id={`col-${col.key}`}
                value={col.key}
                checked={visibleColumns.includes(col.key)}
                onChange={handleColumnToggle}
              />
              <label htmlFor={`col-${col.key}`}>{col.label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SampleFilter;