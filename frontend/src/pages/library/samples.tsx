import React, { useState } from "react";
import SampleFilter from "../../components/sample/sampleFilter";
import SampleTable from "../../components/sample/sampleTable";
import stylesTable from "../../styles/samples/table.module.css";
import stylesFilter from "../../styles/samples/filter.module.css";

export default function SamplesPage() {
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

  const [filters, setFilters] = useState(defaultFilters);
  

  const [visibleColumns, setVisibleColumns] = useState([
    "sampleCode",
    "sampleType",
    "matrixType",
    "sampleDescription"
  ]);



  return (
    <div className={stylesTable.pageWrapper}>
      <div className={stylesTable.headerSection}>
        <h1 className={stylesTable.pageTitle}>Sample Management</h1>
        <p className={stylesTable.pageDescription}>
          Explore all collected samples and their metadata. Filter by sample type, habitat, matrix, or analysis type.
        </p>
      </div>
  
      <div className={stylesTable.mainContentRow}>
        {/* Sidebar Filter */}
        <div className={stylesFilter.filterContainer}>
        <SampleFilter
        filters={filters}
        setFilters={setFilters}
        defaultFilters={defaultFilters}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      />
        </div>
  
        {/* Table */}
        <div className={stylesTable.tableColumn}>
          <SampleTable filters={filters} visibleColumns={visibleColumns} />
        </div>
      </div>
    </div>
  );
};
