import React, { useEffect, useState } from "react";
import FileFilter from "../../components/files/fileFilter";
import FileTable from "../../components/files/fileTable";
import stylestable from "../../styles/files/reports.module.css"; // Table styles
import stylesfilter from "../../styles/files/filefilter.module.css"; // Filter styles

export default function FilesPage() {
  const [filters, setFilters] = useState({
    country: "all",
    contractor: "all",
    year: "all",
    theme: "all",
    searchQuery: "",
  });

  const [contractors, setContractors] = useState<{ id: number; name: string }[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]); // Optional count display

  //  Fetch contractors
  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const res = await fetch("http://localhost:5062/api/library/contractors");
        const data = await res.json();
        console.log(" Raw contractor response:", data);

        const formattedContractors = Array.isArray(data.result)
          ? data.result.map((name: string, index: number) => ({
              id: index + 1,
              name,
            }))
          : [];

        console.log(" Formatted contractors:", formattedContractors);
        setContractors(formattedContractors);
      } catch (err) {
        console.error(" Error fetching contractors:", err);
      }
    };

    fetchContractors();
  }, []);

  //  Fetch themes
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await fetch("http://localhost:5062/api/library/themes");
        const data = await res.json();
        console.log(" Raw themes response:", data);

        const formattedThemes = Array.isArray(data.result) ? data.result : [];
        console.log(" Cleaned themes:", formattedThemes);

        setThemes(formattedThemes);
      } catch (err) {
        console.error(" Error fetching themes:", err);
      }
    };

    fetchThemes();
  }, []);

  //  Static test countries/years for now
  useEffect(() => {
    setCountries(["Norway", "USA", "Germany", "China"]);
    setYears(["2022", "2023", "2024", "2025"]);
  }, []);

  //  Handle single filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  //  Reset all filters
  const handleResetFilters = () => {
    setFilters({
      country: "all",
      contractor: "all",
      year: "all",
      theme: "all",
      searchQuery: "",
    });
  };

  return (
    <div className={stylestable.pageWrapper}>
      <div className={stylestable.headerSection}>
            <h1 className={stylestable.pageTitle}>File Management Library</h1>
            <p className={stylestable.pageDescription}>
              Browse and download official documents from contractors. Use filters to narrow down files by country, contractor, theme, or year.
            </p>
          </div>
      <div className={stylestable.mainContentRow}>
        {/* Filter Sidebar */}
        <div className={stylesfilter.filterContainer}>
          <FileFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            contractors={contractors}
            countries={countries}
            years={years}
            themes={themes}
            currentFilteredItems={filteredItems}
          />
        </div>
  
        {/* File Table */}
        <div className={stylestable.tableColumn}>
          <FileTable filters={filters} setFilteredItems={setFilteredItems} />
        </div>
      </div>
    </div>
  );
}
