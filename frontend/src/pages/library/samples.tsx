import React, { useState } from "react";
import SampleFilter from "../../components/sample/sampleFilter";
import SampleTable from "../../components/sample/sampleTable";
import stylesTable from "../../styles/files/reports.module.css";
import stylesFilter from "../../styles/files/filefilter.module.css";

export default function SamplesPage() {
  const [filters, setFilters] = useState({
    sampleType: "all",
    matrixType: "all",
    habitatType: "all",
    searchQuery: "",
  });

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className={stylesTable.AllComponents}>
      {/* Sidebar Filter */}
      <div className={stylesFilter.filterContainer}>
        <SampleFilter filters={filters} setFilters={applyFilters} />
      </div>

      {/* Table */}
      <div className={stylesTable.tableContainer}>
        <SampleTable filters={filters} />
      </div>
    </div>
  );
}
