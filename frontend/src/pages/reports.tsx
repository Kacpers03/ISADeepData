import React, { useState } from "react";
import FilterSearch from "../components/filter/fileFilter";
import FileTable from "../components/table/fileTable";

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
    <div className="container mx-auto p-6 flex gap-6">
      {/* Sidebar filter */}
      <div className="w-1/4 min-w-[250px]">
        <FilterSearch filters={filters} setFilters={applyFilters} />
      </div>

      {/* File Table */}
      <div className="w-3/4">
        <FileTable filters={filters} />
      </div>
    </div>
  );
}