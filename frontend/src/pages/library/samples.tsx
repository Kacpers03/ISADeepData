import React, { useState } from "react";
import SampleFilter from "../../components/sample/sampleFilter";
import SampleTable from "../../components/sample/sampleTable";
import styles from "../../styles/samples/table.module.css";

export default function SamplesPage() {
  // Default filter values
  const defaultFilters = {
    sampleType: "all",
    matrixType: "all",
    habitatType: "all",
    analysis: "all",
    station: "all",
    cruise: "all",
    contractor: "all",
    searchQuery: ""
  };

  // State for filters and visible columns
  const [filters, setFilters] = useState(defaultFilters);
  const [visibleColumns, setVisibleColumns] = useState([
    "sampleCode",
    "sampleType",
    "matrixType",
    "habitatType",
    "analysis",
    "result",
    "contractor",
    "station",
    "sampleDescription"
  ]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>Sample Management</h1>
        <p className={styles.pageDescription}>
          Explore all collected samples and their metadata. Filter by sample type, habitat, matrix, or analysis type.
        </p>
      </div>
  
      <div className={styles.mainContentRow}>
        {/* Sidebar Filter - Fixed visibility and dropdown issues */}
        <SampleFilter
          filters={filters}
          setFilters={setFilters}
          defaultFilters={defaultFilters}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />
  
        {/* Table Column - Improved responsiveness */}
        <div className={styles.tableColumn}>
          <SampleTable 
            filters={filters} 
            visibleColumns={visibleColumns} 
          />
        </div>
      </div>
    </div>
  );
};