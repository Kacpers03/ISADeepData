import React, { useState } from 'react';
import styles from '../../styles/gallery/gallery.module.css';

interface FilterProps {
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

const GalleryFilter: React.FC<FilterProps> = ({
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
  const [expandedSections, setExpandedSections] = useState({
    mediaType: true,
    contractors: true,
    cruises: false,
    stations: false,
    years: false,
  });
  const [isDownloading, setIsDownloading] = useState(false);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('searchQuery', e.target.value);
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Count active filters for displaying count in reset button
  const countActiveFilters = () => {
    let count = 0;
    if (filters.mediaType !== 'all') count++;
    if (filters.contractorId !== 'all') count++;
    if (filters.cruiseId !== 'all') count++;
    if (filters.stationId !== 'all') count++;
    if (filters.year !== 'all') count++;
    if (filters.searchQuery.trim() !== '') count++;
    return count;
  };

  const activeFiltersCount = countActiveFilters();

  // Function to download all filtered images
  const handleDownloadAllImages = async () => {
    // Only proceed if there are items to download
    if (currentFilteredItems.length === 0) {
      alert('No items to download.');
      return;
    }

    try {
      setIsDownloading(true);

      // Filter only images if mediaType is set to "image"
      const itemsToDownload = filters.mediaType === 'image'
        ? currentFilteredItems.filter(item => 
            !item.mediaType?.toLowerCase().includes('video') && 
            !item.fileName.match(/\.(mp4|webm|avi|mov|wmv|flv)$/i))
        : filters.mediaType === 'video'
        ? currentFilteredItems.filter(item => 
            item.mediaType?.toLowerCase().includes('video') || 
            item.fileName.match(/\.(mp4|webm|avi|mov|wmv|flv)$/i))
        : currentFilteredItems;

      if (itemsToDownload.length === 0) {
        alert('No items match the current filter for download.');
        setIsDownloading(false);
        return;
      }

      // Create a download summary text
      let filterDescription = 'All Media';
      if (filters.mediaType !== 'all') filterDescription = filters.mediaType === 'image' ? 'Images' : 'Videos';
      if (filters.contractorId !== 'all') {
        const contractor = contractors.find(c => c.id.toString() === filters.contractorId);
        filterDescription += ` - ${contractor?.name || 'Selected Contractor'}`;
      }
      if (filters.stationId !== 'all') {
        const station = stations.find(s => s.id.toString() === filters.stationId);
        filterDescription += ` - Station ${station?.code || 'Selected'}`;
      }
      if (filters.year !== 'all') {
        filterDescription += ` - ${filters.year}`;
      }

      // Create a zip file with JSZip (Note: this would require adding JSZip to your project)
      // For this example, we'll simulate creating a download link for the first 5 items
      // In a real implementation, you would need to use a library like JSZip to bundle files

      // Simulate ZIP download
      // In a real implementation, you would:
      // 1. Use JSZip to create a zip file
      // 2. Add all images to the zip
      // 3. Generate a blob URL
      // 4. Create a download link

      // For now, we'll create a CSV with download links as a demonstration
      const csvContent = [
        ['File Name', 'Media Type', 'URL', 'Station', 'Contractor', 'Date'].join(','),
        ...itemsToDownload.map(item => [
          item.fileName,
          item.mediaType,
          item.fileUrl,
          item.stationCode || 'N/A',
          item.contractorName || 'N/A',
          item.captureDate ? new Date(item.captureDate).toLocaleDateString() : 'N/A'
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ISA_DeepData_${filterDescription.replace(/ /g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Note for future implementation:
      // For a true file download of all images:
      // 1. Send a request to your backend with the current filters
      // 2. Have the backend gather all matching files, create a ZIP, and provide a download link
      // 3. Or use a library like JSZip to download and zip files on the client side (works for smaller numbers of files)

    } catch (error) {
      console.error('Error downloading files:', error);
      alert('There was an error preparing your download. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`${styles.filterContainer} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.filterHeader}>
        <h2 className={styles.filterTitle}>Filters</h2>
        <button 
          className={styles.collapseButton}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand filters" : "Collapse filters"}
        >
          {isCollapsed ? '►' : '◄'}
        </button>
      </div>

      {!isCollapsed && (
        <div className={styles.filterContent}>
          {/* Search input */}
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search media..."
              value={filters.searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            {filters.searchQuery && (
              <button 
                className={styles.clearSearchButton}
                onClick={() => onFilterChange('searchQuery', '')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Media Type Filter */}
          <div className={styles.filterSection}>
            <div 
              className={styles.filterSectionHeader}
              onClick={() => toggleSection('mediaType')}
            >
              <h3 className={styles.filterSectionTitle}>Media Type</h3>
              <span className={styles.toggleIcon}>
                {expandedSections.mediaType ? '−' : '+'}
              </span>
            </div>
            
            {expandedSections.mediaType && (
              <div className={styles.filterOptions}>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="mediaType"
                    value="all"
                    checked={filters.mediaType === 'all'}
                    onChange={() => onFilterChange('mediaType', 'all')}
                  />
                  <span className={styles.optionLabel}>All</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="mediaType"
                    value="image"
                    checked={filters.mediaType === 'image'}
                    onChange={() => onFilterChange('mediaType', 'image')}
                  />
                  <span className={styles.optionLabel}>Images only</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="mediaType"
                    value="video"
                    checked={filters.mediaType === 'video'}
                    onChange={() => onFilterChange('mediaType', 'video')}
                  />
                  <span className={styles.optionLabel}>Videos only</span>
                </label>
              </div>
            )}
          </div>

          {/* Contractors Filter */}
          <div className={styles.filterSection}>
            <div 
              className={styles.filterSectionHeader}
              onClick={() => toggleSection('contractors')}
            >
              <h3 className={styles.filterSectionTitle}>Contractors</h3>
              <span className={styles.toggleIcon}>
                {expandedSections.contractors ? '−' : '+'}
              </span>
            </div>
            
            {expandedSections.contractors && (
              <div className={styles.filterOptions}>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="contractorId"
                    value="all"
                    checked={filters.contractorId === 'all'}
                    onChange={() => onFilterChange('contractorId', 'all')}
                  />
                  <span className={styles.optionLabel}>All</span>
                </label>
                {contractors.length > 0 ? (
                  contractors.map((contractor) => (
                    <label key={contractor.id} className={styles.filterOption}>
                      <input
                        type="radio"
                        name="contractorId"
                        value={contractor.id.toString()}
                        checked={filters.contractorId === contractor.id.toString()}
                        onChange={() => onFilterChange('contractorId', contractor.id.toString())}
                      />
                      <span className={styles.optionLabel}>{contractor.name}</span>
                    </label>
                  ))
                ) : (
                  <p className={styles.noOptions}>No options available</p>
                )}
              </div>
            )}
          </div>

          {/* Cruises Filter */}
          <div className={styles.filterSection}>
            <div 
              className={styles.filterSectionHeader}
              onClick={() => toggleSection('cruises')}
            >
              <h3 className={styles.filterSectionTitle}>Cruises</h3>
              <span className={styles.toggleIcon}>
                {expandedSections.cruises ? '−' : '+'}
              </span>
            </div>
            
            {expandedSections.cruises && (
              <div className={styles.filterOptions}>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="cruiseId"
                    value="all"
                    checked={filters.cruiseId === 'all'}
                    onChange={() => onFilterChange('cruiseId', 'all')}
                  />
                  <span className={styles.optionLabel}>All</span>
                </label>
                {cruises.length > 0 ? (
                  cruises.map((cruise) => (
                    <label key={cruise.id} className={styles.filterOption}>
                      <input
                        type="radio"
                        name="cruiseId"
                        value={cruise.id.toString()}
                        checked={filters.cruiseId === cruise.id.toString()}
                        onChange={() => onFilterChange('cruiseId', cruise.id.toString())}
                      />
                      <span className={styles.optionLabel}>{cruise.name}</span>
                    </label>
                  ))
                ) : (
                  <p className={styles.noOptions}>No options available</p>
                )}
              </div>
            )}
          </div>

          {/* Stations Filter */}
          <div className={styles.filterSection}>
            <div 
              className={styles.filterSectionHeader}
              onClick={() => toggleSection('stations')}
            >
              <h3 className={styles.filterSectionTitle}>Stations</h3>
              <span className={styles.toggleIcon}>
                {expandedSections.stations ? '−' : '+'}
              </span>
            </div>
            
            {expandedSections.stations && (
              <div className={styles.filterOptions}>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="stationId"
                    value="all"
                    checked={filters.stationId === 'all'}
                    onChange={() => onFilterChange('stationId', 'all')}
                  />
                  <span className={styles.optionLabel}>All</span>
                </label>
                {stations.length > 0 ? (
                  stations.map((station) => (
                    <label key={station.id} className={styles.filterOption}>
                      <input
                        type="radio"
                        name="stationId"
                        value={station.id.toString()}
                        checked={filters.stationId === station.id.toString()}
                        onChange={() => onFilterChange('stationId', station.id.toString())}
                      />
                      <span className={styles.optionLabel}>{station.code}</span>
                    </label>
                  ))
                ) : (
                  <p className={styles.noOptions}>No options available</p>
                )}
              </div>
            )}
          </div>

          {/* Years Filter */}
          <div className={styles.filterSection}>
            <div 
              className={styles.filterSectionHeader}
              onClick={() => toggleSection('years')}
            >
              <h3 className={styles.filterSectionTitle}>Years</h3>
              <span className={styles.toggleIcon}>
                {expandedSections.years ? '−' : '+'}
              </span>
            </div>
            
            {expandedSections.years && (
              <div className={styles.filterOptions}>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="year"
                    value="all"
                    checked={filters.year === 'all'}
                    onChange={() => onFilterChange('year', 'all')}
                  />
                  <span className={styles.optionLabel}>All</span>
                </label>
                {years.length > 0 ? (
                  years.map((year) => (
                    <label key={year} className={styles.filterOption}>
                      <input
                        type="radio"
                        name="year"
                        value={year}
                        checked={filters.year === year}
                        onChange={() => onFilterChange('year', year)}
                      />
                      <span className={styles.optionLabel}>{year}</span>
                    </label>
                  ))
                ) : (
                  <p className={styles.noOptions}>No options available</p>
                )}
              </div>
            )}
          </div>

          {/* Reset Button */}
          {activeFiltersCount > 0 && (
            <button
              className={styles.resetFiltersButton}
              onClick={onResetFilters}
              aria-label="Reset all filters"
            >
              Reset Filters ({activeFiltersCount})
            </button>
          )}

          {/* Download All Button */}
          <button
            className={styles.downloadAllButton}
            onClick={handleDownloadAllImages}
            disabled={isDownloading || currentFilteredItems.length === 0}
          >
            {isDownloading ? 'Preparing Download...' : `Download All (${currentFilteredItems.length})`}
          </button>
          
          {/* Display items count */}
          <div className={styles.itemsCount}>
            {currentFilteredItems.length} items match your filters
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryFilter;