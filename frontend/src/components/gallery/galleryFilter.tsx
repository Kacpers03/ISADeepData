import React, { useState, useRef, useEffect, useCallback } from "react";
import { CustomDropdown } from "../map/filters/CustomDropdown";
import styles from "../../styles/gallery/gallery.module.css";
import mapStyles from "../../styles/map/filter.module.css";

interface GalleryFilterProps {
  filters: {
    mediaType: string;
    contractorId: string;
    cruiseId: string;
    stationId: string;
    year: string;
    searchQuery: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
  onResetFilters: () => void;
  contractors: { id: number; name: string }[];
  cruises: { id: number; name: string }[];
  stations: { id: number; code: string }[];
  years: string[];
  currentFilteredItems: any[]; // Array of currently filtered media items
}

// Create a simple debounce function instead of importing from lodash
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const ImprovedGalleryFilter: React.FC<GalleryFilterProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  contractors,
  cruises,
  stations,
  years,
  currentFilteredItems,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Handle click outside search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);

    if (e.target.value.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      onFilterChange("searchQuery", "");
    } else {
      debouncedSearch(e.target.value);
    }
  };

  // Perform search
  const performSearch = useCallback(
    (query: string) => {
      if (query.trim() === "") {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      const lowercaseQuery = query.toLowerCase();

      // Search through currentFilteredItems
      const results = currentFilteredItems
        .filter(
          (item) =>
            item.fileName.toLowerCase().includes(lowercaseQuery) ||
            (item.description &&
              item.description.toLowerCase().includes(lowercaseQuery)) ||
            (item.stationCode &&
              item.stationCode.toLowerCase().includes(lowercaseQuery)) ||
            (item.contractorName &&
              item.contractorName.toLowerCase().includes(lowercaseQuery)) ||
            (item.cruiseName &&
              item.cruiseName.toLowerCase().includes(lowercaseQuery))
        )
        .slice(0, 10); // Limit to 10 results for performance

      setSearchResults(results);
      setShowResults(results.length > 0);
      onFilterChange("searchQuery", query);
    },
    [currentFilteredItems, onFilterChange]
  );

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      performSearch(query);
    }, 300),
    [performSearch]
  );

  // Handle search on Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch(searchQuery);
    }
  };

  // Count active filters for displaying count in reset button
  const countActiveFilters = () => {
    let count = 0;
    if (filters.mediaType !== "all") count++;
    if (filters.contractorId !== "all") count++;
    if (filters.cruiseId !== "all") count++;
    if (filters.stationId !== "all") count++;
    if (filters.year !== "all") count++;
    if (filters.searchQuery.trim() !== "") count++;
    return count;
  };

  const activeFiltersCount = countActiveFilters();

  // Debounced filter change handler
  const debouncedFilterChange = useCallback(
    debounce((key: string, value: string) => {
      onFilterChange(key, value);
    }, 300),
    [onFilterChange]
  );

  // Handle dropdown change
  const handleSelectChange = (key: string, value: any) => {
    if (value === "all") {
      debouncedFilterChange(key, "all");
    } else {
      debouncedFilterChange(key, value);
    }
  };

  // Handle search result click
  const handleResultClick = (item: any) => {
    // Navigate to the item detail or apply specific filters
    setShowResults(false);

    // Set filters based on the clicked item
    onFilterChange("searchQuery", item.fileName || item.stationCode || "");

    if (item.contractorId) {
      onFilterChange("contractorId", item.contractorId.toString());
    }

    if (item.cruiseId) {
      onFilterChange("cruiseId", item.cruiseId.toString());
    }

    if (item.stationId) {
      onFilterChange("stationId", item.stationId.toString());
    }
  };

  // Function to download all filtered images
  const handleDownloadAllImages = async () => {
    if (currentFilteredItems.length === 0) {
      alert("No items to download.");
      return;
    }

    try {
      setIsDownloading(true);

      // Filter items based on mediaType
      const itemsToDownload =
        filters.mediaType === "image"
          ? currentFilteredItems.filter(
              (item) =>
                !item.mediaType?.toLowerCase().includes("video") &&
                !item.fileName.match(/\.(mp4|webm|avi|mov|wmv|flv)$/i)
            )
          : filters.mediaType === "video"
          ? currentFilteredItems.filter(
              (item) =>
                item.mediaType?.toLowerCase().includes("video") ||
                item.fileName.match(/\.(mp4|webm|avi|mov|wmv|flv)$/i)
            )
          : currentFilteredItems;

      if (itemsToDownload.length === 0) {
        alert("No items match the current filter for download.");
        setIsDownloading(false);
        return;
      }

      // Create download description
      let filterDescription = "All Media";
      if (filters.mediaType !== "all")
        filterDescription = filters.mediaType === "image" ? "Images" : "Videos";
      if (filters.contractorId !== "all") {
        const contractor = contractors.find(
          (c) => c.id.toString() === filters.contractorId
        );
        filterDescription += ` - ${contractor?.name || "Selected Contractor"}`;
      }
      if (filters.stationId !== "all") {
        const station = stations.find(
          (s) => s.id.toString() === filters.stationId
        );
        filterDescription += ` - Station ${station?.code || "Selected"}`;
      }
      if (filters.year !== "all") {
        filterDescription += ` - ${filters.year}`;
      }

      // Create CSV with download links
      const csvContent = [
        [
          "File Name",
          "Media Type",
          "URL",
          "Station",
          "Contractor",
          "Date",
        ].join(","),
        ...itemsToDownload.map((item) =>
          [
            item.fileName,
            item.mediaType,
            item.fileUrl,
            item.stationCode || "N/A",
            item.contractorName || "N/A",
            item.captureDate
              ? new Date(item.captureDate).toLocaleDateString()
              : "N/A",
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `ISA_DeepData_${filterDescription.replace(/ /g, "_")}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading files:", error);
      alert("There was an error preparing your download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Prepare dropdown options
  const prepareDropdownOptions = (
    items: any[],
    valueKey: string,
    labelKey: string
  ) => {
    return [
      { value: "all", label: "All" },
      ...items.map((item) => ({
        value: item[valueKey].toString(),
        label: item[labelKey],
      })),
    ];
  };

  // Create dropdown options
  const mediaTypeOptions = [
    { value: "all", label: "All Media Types" },
    { value: "image", label: "Images only" },
    { value: "video", label: "Videos only" },
  ];

  const contractorOptions = prepareDropdownOptions(contractors, "id", "name");
  const cruiseOptions = prepareDropdownOptions(cruises, "id", "name");
  const stationOptions = prepareDropdownOptions(stations, "id", "code");
  const yearOptions = [
    { value: "all", label: "All Years" },
    ...years.map((year) => ({ value: year, label: year })),
  ];

  return (
    <div
      className={`${mapStyles.improvedFilterPanel} ${styles.filterContainer} ${
        isCollapsed ? styles.collapsed : ""
      }`}
    >
      <div className={mapStyles.filterContent}>
        <div className={mapStyles.filterHeader}>
          <h2>Media Filters</h2>
          {activeFiltersCount > 0 && (
            <button className={mapStyles.resetButton} onClick={onResetFilters}>
              Reset ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Search Container */}
        <div className={mapStyles.searchContainer}>
          <div className={mapStyles.searchInputWrapper}>
            <input
              ref={searchInputRef}
              type="text"
              id="mediaSearch" // Added ID attribute
              name="mediaSearch" // Added name attribute
              placeholder="Search media..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              className={mapStyles.searchInput}
              aria-label="Search media" // Added aria-label
            />
            <button
              onClick={() => performSearch(searchQuery)}
              className={mapStyles.searchButton}
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          {/* Search Results */}
          {showResults && (
            <div ref={resultsRef} className={mapStyles.searchResultsList}>
              <div className={mapStyles.searchResultsHeader}>
                <span>Search Results ({searchResults.length})</span>
                <button
                  className={mapStyles.closeResultsButton}
                  onClick={() => setShowResults(false)}
                >
                  ×
                </button>
              </div>

              <div className={mapStyles.searchResultsContent}>
                {searchResults.length === 0 ? (
                  <div className={mapStyles.noResults}>
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  <ul>
                    {searchResults.map((result, index) => (
                      <li
                        key={`result-${result.mediaId || index}`}
                        onClick={() => handleResultClick(result)}
                      >
                        <div className={mapStyles.resultType}>
                          {result.mediaType?.toLowerCase().includes("video") ||
                          result.fileName.match(
                            /\.(mp4|webm|avi|mov|wmv|flv)$/i
                          ) ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                              </svg>
                              Video
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect
                                  x="3"
                                  y="3"
                                  width="18"
                                  height="18"
                                  rx="2"
                                  ry="2"
                                ></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                              </svg>
                              Image
                            </>
                          )}
                        </div>
                        <div className={mapStyles.resultName}>
                          {result.fileName}
                        </div>
                        {result.stationCode && (
                          <div className={mapStyles.resultParent}>
                            Station: {result.stationCode}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={mapStyles.filtersGroup}>
          <h3>Filter By</h3>

          <CustomDropdown
            id="mediaType"
            label="Media Type"
            options={mediaTypeOptions}
            value={filters.mediaType}
            onChange={(e) => handleSelectChange("mediaType", e.target.value)}
            isActive={filters.mediaType !== "all"}
          />

          <CustomDropdown
            id="contractorId"
            label="Contractor"
            options={contractorOptions}
            value={filters.contractorId}
            onChange={(e) => handleSelectChange("contractorId", e.target.value)}
            isActive={filters.contractorId !== "all"}
          />

          <CustomDropdown
            id="cruiseId"
            label="Cruise"
            options={cruiseOptions}
            value={filters.cruiseId}
            onChange={(e) => handleSelectChange("cruiseId", e.target.value)}
            isActive={filters.cruiseId !== "all"}
          />

          <CustomDropdown
            id="stationId"
            label="Station"
            options={stationOptions}
            value={filters.stationId}
            onChange={(e) => handleSelectChange("stationId", e.target.value)}
            isActive={filters.stationId !== "all"}
          />

          <CustomDropdown
            id="year"
            label="Year"
            options={yearOptions}
            value={filters.year}
            onChange={(e) => handleSelectChange("year", e.target.value)}
            isActive={filters.year !== "all"}
          />

          {/* Download All Button */}
          <button
            className={`${styles.downloadAllButton} ${mapStyles.actionButton}`}
            onClick={handleDownloadAllImages}
            disabled={isDownloading || currentFilteredItems.length === 0}
          >
            {isDownloading
              ? "Preparing Download..."
              : `Download All (${currentFilteredItems.length})`}
          </button>
        </div>
      </div>

      <div className={mapStyles.resultsInfo}>
        <span>{currentFilteredItems.length} items match your filters</span>
      </div>
    </div>
  );
};

export default ImprovedGalleryFilter;
