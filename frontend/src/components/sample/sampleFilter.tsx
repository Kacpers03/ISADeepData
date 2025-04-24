import React, { useEffect, useState, useRef } from "react";
import styles from "../../styles/samples/filter.module.css";

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
  const [loading, setLoading] = useState(true);

  // Refs for dropdown functionality
  const dropdownRefs = useRef({});
  const [openDropdown, setOpenDropdown] = useState(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && dropdownRefs.current[openDropdown] && 
          !dropdownRefs.current[openDropdown].contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
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
    setOpenDropdown(null);
  };
  
  const handleColumnToggle = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setVisibleColumns((prev) => [...prev, value]);
    } else {
      setVisibleColumns((prev) => prev.filter((col) => col !== value));
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Select option from dropdown
  const selectOption = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setOpenDropdown(null);
  };

  // Get display value for dropdown - truncate if needed
  const getDisplayValue = (name, value) => {
    if (value === 'all') {
      switch(name) {
        case 'contractor': return 'All Contractors';
        case 'station': return 'All Stations';
        case 'cruise': return 'All Cruises';
        case 'sampleType': return 'All Sample Types';
        case 'matrixType': return 'All Matrix Types';
        case 'habitatType': return 'All Habitat Types';
        case 'analysis': return 'All Analyses';
        default: return 'All';
      }
    }
    // No need to manually truncate as we're using CSS text-overflow now
    return value;
  };

  if (loading) {
    return (
      <div className={styles.filterContainer}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          padding: '20px'
        }}>
          Loading filters...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <h2>Sample Filters</h2>
        <button 
          className={styles.resetButton} 
          onClick={handleClearFilters}
          type="button"
        >
          Reset
        </button>
      </div>

      <div className={styles.filterContent}>
        <div className={styles.filtersGroup}>
          <h3>Filter By</h3>
          
          {/* Contractor Dropdown */}
          <label className={styles.filterLabel}>Contractor</label>
          <div className={styles.dropdownContainer} ref={el => dropdownRefs.current['contractor'] = el}>
            <button 
              className={styles.customSelect}
              onClick={() => toggleDropdown('contractor')}
              title={filters.contractor !== 'all' ? filters.contractor : 'All Contractors'}
              data-has-selection={filters.contractor !== 'all' ? "true" : "false"}
            >
              {getDisplayValue('contractor', filters.contractor)}
            </button>
            {openDropdown === 'contractor' && (
              <div className={styles.dropdownContent}>
                <div 
                  className={`${styles.dropdownOption} ${filters.contractor === 'all' ? styles.selectedOption : ''}`}
                  onClick={() => selectOption('contractor', 'all')}
                >
                  All Contractors
                </div>
                {contractorOptions.map((option, index) => (
                  <div 
                    key={index} 
                    className={`${styles.dropdownOption} ${filters.contractor === option ? styles.selectedOption : ''}`}
                    onClick={() => selectOption('contractor', option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Station Dropdown */}
          <label className={styles.filterLabel}>Station</label>
          <div className={styles.dropdownContainer} ref={el => dropdownRefs.current['station'] = el}>
            <button 
              className={styles.customSelect}
              onClick={() => toggleDropdown('station')}
              title={filters.station !== 'all' ? filters.station : 'All Stations'}
              data-has-selection={filters.station !== 'all' ? "true" : "false"}
            >
              {getDisplayValue('station', filters.station)}
            </button>
            {openDropdown === 'station' && (
              <div className={styles.dropdownContent}>
                <div 
                  className={`${styles.dropdownOption} ${filters.station === 'all' ? styles.selectedOption : ''}`}
                  onClick={() => selectOption('station', 'all')}
                >
                  All Stations
                </div>
                {stationOptions.map((option, index) => (
                  <div 
                    key={index} 
                    className={`${styles.dropdownOption} ${filters.station === option ? styles.selectedOption : ''}`}
                    onClick={() => selectOption('station', option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cruise Dropdown */}
          <label className={styles.filterLabel}>Cruise</label>
          <div className={styles.dropdownContainer} ref={el => dropdownRefs.current['cruise'] = el}>
            <button 
              className={styles.customSelect}
              onClick={() => toggleDropdown('cruise')}
              title={filters.cruise !== 'all' ? filters.cruise : 'All Cruises'}
              data-has-selection={filters.cruise !== 'all' ? "true" : "false"}
            >
              {getDisplayValue('cruise', filters.cruise)}
            </button>
            {openDropdown === 'cruise' && (
              <div className={styles.dropdownContent}>
                <div 
                  className={`${styles.dropdownOption} ${filters.cruise === 'all' ? styles.selectedOption : ''}`}
                  onClick={() => selectOption('cruise', 'all')}
                >
                  All Cruises
                </div>
                {cruiseOptions.map((option, index) => (
                  <div 
                    key={index} 
                    className={`${styles.dropdownOption} ${filters.cruise === option ? styles.selectedOption : ''}`}
                    onClick={() => selectOption('cruise', option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sample Type Dropdown */}
          <label className={styles.filterLabel}>Sample Type</label>
          <div className={styles.dropdownContainer} ref={el => dropdownRefs.current['sampleType'] = el}>
            <button 
              className={styles.customSelect}
              onClick={() => toggleDropdown('sampleType')}
              title={filters.sampleType !== 'all' ? filters.sampleType : 'All Sample Types'}
              data-has-selection={filters.sampleType !== 'all' ? "true" : "false"}
            >
              {getDisplayValue('sampleType', filters.sampleType)}
            </button>
            {openDropdown === 'sampleType' && (
              <div className={styles.dropdownContent}>
                <div 
                  className={`${styles.dropdownOption} ${filters.sampleType === 'all' ? styles.selectedOption : ''}`}
                  onClick={() => selectOption('sampleType', 'all')}
                >
                  All Sample Types
                </div>
                {sampleTypes.map((option, index) => (
                  <div 
                    key={index} 
                    className={`${styles.dropdownOption} ${filters.sampleType === option ? styles.selectedOption : ''}`}
                    onClick={() => selectOption('sampleType', option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Matrix Type Dropdown */}
          <label className={styles.filterLabel}>Matrix Type</label>
          <div className={styles.dropdownContainer} ref={el => dropdownRefs.current['matrixType'] = el}>
            <button 
              className={styles.customSelect}
              onClick={() => toggleDropdown('matrixType')}
              title={filters.matrixType !== 'all' ? filters.matrixType : 'All Matrix Types'}
              data-has-selection={filters.matrixType !== 'all' ? "true" : "false"}
            >
              {getDisplayValue('matrixType', filters.matrixType)}
            </button>
            {openDropdown === 'matrixType' && (
              <div className={styles.dropdownContent}>
                <div 
                  className={`${styles.dropdownOption} ${filters.matrixType === 'all' ? styles.selectedOption : ''}`}
                  onClick={() => selectOption('matrixType', 'all')}
                >
                  All Matrix Types
                </div>
                {matrixTypes.map((option, index) => (
                  <div 
                    key={index} 
                    className={`${styles.dropdownOption} ${filters.matrixType === option ? styles.selectedOption : ''}`}
                    onClick={() => selectOption('matrixType', option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Habitat Type Dropdown */}
          <label className={styles.filterLabel}>Habitat Type</label>
          <div className={styles.dropdownContainer} ref={el => dropdownRefs.current['habitatType'] = el}>
            <button 
              className={styles.customSelect}
              onClick={() => toggleDropdown('habitatType')}
              title={filters.habitatType !== 'all' ? filters.habitatType : 'All Habitat Types'}
              data-has-selection={filters.habitatType !== 'all' ? "true" : "false"}
            >
              {getDisplayValue('habitatType', filters.habitatType)}
            </button>
            {openDropdown === 'habitatType' && (
              <div className={styles.dropdownContent}>
                <div 
                  className={`${styles.dropdownOption} ${filters.habitatType === 'all' ? styles.selectedOption : ''}`}
                  onClick={() => selectOption('habitatType', 'all')}
                >
                  All Habitat Types
                </div>
                {habitatTypes.map((option, index) => (
                  <div 
                    key={index} 
                    className={`${styles.dropdownOption} ${filters.habitatType === option ? styles.selectedOption : ''}`}
                    onClick={() => selectOption('habitatType', option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Analysis Dropdown */}
          <label className={styles.filterLabel}>Analysis</label>
          <div className={styles.dropdownContainer} ref={el => dropdownRefs.current['analysis'] = el}>
            <button 
              className={styles.customSelect}
              onClick={() => toggleDropdown('analysis')}
              title={filters.analysis !== 'all' ? filters.analysis : 'All Analyses'}
              data-has-selection={filters.analysis !== 'all' ? "true" : "false"}
            >
              {getDisplayValue('analysis', filters.analysis)}
            </button>
            {openDropdown === 'analysis' && (
              <div className={styles.dropdownContent}>
                <div 
                  className={`${styles.dropdownOption} ${filters.analysis === 'all' ? styles.selectedOption : ''}`}
                  onClick={() => selectOption('analysis', 'all')}
                >
                  All Analyses
                </div>
                {analyses.map((option, index) => (
                  <div 
                    key={index} 
                    className={`${styles.dropdownOption} ${filters.analysis === option ? styles.selectedOption : ''}`}
                    onClick={() => selectOption('analysis', option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Filter */}
          <label className={styles.filterLabel}>Search</label>
          <input
            type="text"
            name="searchQuery"
            value={filters.searchQuery || ""}
            onChange={handleFilterChange}
            placeholder="Search sample code..."
            className={filters.searchQuery ? `${styles.searchInput} ${styles.hasValue}` : styles.searchInput}
          />
        </div>
      </div>

      {/* Column Visibility Section */}
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