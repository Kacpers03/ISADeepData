import React, { useState } from "react";
import FilterSearch from "../components/filter/fileFilter";
import FileTable from "../components/table/fileTable";
import stylestable from "../styles/reports.module.css"; // Import CSS Module
import stylesfilter from "../styles/filefilter.module.css"; // Import CSS Module


export default function FilesPage() {
  const [filters, setFilters] = useState({
    country: "All",
    contractor: "All",
    year: "All",
    category: "All",
  });

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className={stylestable.AllComponents}>
      {/* Sidebar filter */}
      <div className={stylesfilter.filterContainer}>
        <FilterSearch filters={filters} setFilters={applyFilters} />
      </div>

      {/* File Table */}
      <div className={stylestable.tableContainer}>
        <FileTable filters={filters} />
      </div>
    </div>
  );
}