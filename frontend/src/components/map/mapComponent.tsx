import React, { useState, useEffect } from "react";
import Map, { NavigationControl, Marker, Popup } from "react-map-gl";
import maplibregl from "maplibre-gl";
import styles from "../../styles/map/map.module.css";

// Filter options for dropdown selects
const FILTER_OPTIONS = {
  mineralTypes: [
    "All Minerals",
    "Polymetallic Nodules",
    "Polymetallic Sulfides",
    "Cobalt-rich Crusts",
    "Rare Earth Elements",
    "Manganese Nodules"
  ],
  contractStatus: [
    "All Statuses",
    "Active",
    "Pending",
    "Expired",
    "Suspended"
  ],
  sponsoringStates: [
    "All States",
    "China",
    "Japan",
    "Russia",
    "Korea",
    "France",
    "Germany",
    "India",
    "UK",
    "Belgium",
    "Singapore"
  ],
  locations: [
    "All Regions",
    "Clarion-Clipperton Zone",
    "Mid-Atlantic Ridge",
    "Indian Ocean",
    "Western Pacific",
    "South Atlantic"
  ]
};

// Sample data - this would be replaced with your actual data
const SAMPLE_EXPLORATION_AREAS = [
  {
    id: 1,
    name: "CCZ Block A",
    location: "Clarion-Clipperton Zone",
    coordinates: [-140, 15],
    mineralType: "Polymetallic Nodules",
    contractStatus: "Active",
    sponsoringState: "Japan",
    areaSize: "75,000 km²",
    startDate: "2015-03-25",
    endDate: "2030-03-25",
    description: "Exploration area for polymetallic nodules rich in manganese, nickel, copper, and cobalt."
  },
  {
    id: 2,
    name: "Mid-Atlantic Section 103",
    location: "Mid-Atlantic Ridge",
    coordinates: [-45, 5],
    mineralType: "Polymetallic Sulfides",
    contractStatus: "Active",
    sponsoringState: "France",
    areaSize: "10,000 km²",
    startDate: "2018-06-12",
    endDate: "2033-06-12",
    description: "Hydrothermal vent exploration focusing on copper, zinc, gold, and silver deposits."
  },
  {
    id: 3,
    name: "Indian Ocean Basin",
    location: "Indian Ocean",
    coordinates: [70, -10],
    mineralType: "Polymetallic Nodules",
    contractStatus: "Pending",
    sponsoringState: "India",
    areaSize: "70,000 km²",
    startDate: "2023-01-20",
    endDate: "2038-01-20",
    description: "Proposed exploration area targeting deep-sea manganese nodules."
  },
  {
    id: 4,
    name: "Western Pacific Ridge",
    location: "Western Pacific",
    coordinates: [150, 10],
    mineralType: "Cobalt-rich Crusts",
    contractStatus: "Active",
    sponsoringState: "China",
    areaSize: "15,000 km²",
    startDate: "2019-09-08",
    endDate: "2034-09-08",
    description: "Seamount exploration focusing on cobalt, nickel, and platinum group metals."
  },
  {
    id: 5,
    name: "South Atlantic Basin",
    location: "South Atlantic",
    coordinates: [-20, -30],
    mineralType: "Rare Earth Elements",
    contractStatus: "Expired",
    sponsoringState: "Germany",
    areaSize: "50,000 km²",
    startDate: "2010-05-17",
    endDate: "2025-05-17",
    description: "Former exploration area focusing on rare earth elements in deep sea sediments."
  }
];

// Get marker color based on contract status
const getMarkerColor = (status) => {
  switch (status) {
    case "Active": return "#4CAF50"; // Green
    case "Pending": return "#FFC107"; // Yellow
    case "Expired": return "#9E9E9E"; // Gray
    case "Suspended": return "#F44336"; // Red
    default: return "#2196F3"; // Blue
  }
};

// Get marker size based on area size (simplified for example)
const getMarkerSize = (areaSize) => {
  const size = parseInt(areaSize.replace(/,/g, ''));
  return Math.max(30, Math.min(60, size / 5000));
};

export default function MapComponent() {
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 1.5,
  });
  
  // Filter states
  const [mineralTypeFilter, setMineralTypeFilter] = useState("All Minerals");
  const [contractStatusFilter, setContractStatusFilter] = useState("All Statuses");
  const [sponsoringStateFilter, setSponsoringStateFilter] = useState("All States");
  const [locationFilter, setLocationFilter] = useState("All Regions");
  
  // Popup state
  const [selectedArea, setSelectedArea] = useState(null);
  
  // Filtered data
  const [filteredAreas, setFilteredAreas] = useState(SAMPLE_EXPLORATION_AREAS);
  
  // Active filter count to show in UI
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  
  // Filter panel visibility state
  const [showFilters, setShowFilters] = useState(true);
  
  // Reset all filters
  const resetFilters = () => {
    setMineralTypeFilter("All Minerals");
    setContractStatusFilter("All Statuses");
    setSponsoringStateFilter("All States");
    setLocationFilter("All Regions");
  };
  
  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = SAMPLE_EXPLORATION_AREAS;
    
    // Count active filters
    let count = 0;
    
    if (mineralTypeFilter !== "All Minerals") {
      result = result.filter(area => area.mineralType === mineralTypeFilter);
      count++;
    }
    
    if (contractStatusFilter !== "All Statuses") {
      result = result.filter(area => area.contractStatus === contractStatusFilter);
      count++;
    }
    
    if (sponsoringStateFilter !== "All States") {
      result = result.filter(area => area.sponsoringState === sponsoringStateFilter);
      count++;
    }
    
    if (locationFilter !== "All Regions") {
      result = result.filter(area => area.location === locationFilter);
      count++;
    }
    
    setActiveFilterCount(count);
    setFilteredAreas(result);
  }, [mineralTypeFilter, contractStatusFilter, sponsoringStateFilter, locationFilter]);
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.mapContainer}>
      {/* Map Legend */}
      <div className={styles.mapLegend}>
        <h3>Contract Status</h3>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <span className={styles.legendMarker} style={{ backgroundColor: "#4CAF50" }}></span>
            <span>Active</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendMarker} style={{ backgroundColor: "#FFC107" }}></span>
            <span>Pending</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendMarker} style={{ backgroundColor: "#9E9E9E" }}></span>
            <span>Expired</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendMarker} style={{ backgroundColor: "#F44336" }}></span>
            <span>Suspended</span>
          </div>
        </div>
        <p className={styles.legendNote}>Marker size indicates area size</p>
      </div>
      
      {/* Filter panel with toggle functionality */}
      <div 
        className={styles.filterPanel} 
        style={{ 
          transform: showFilters ? 'translateX(0)' : 'translateX(-120%)',
          opacity: showFilters ? 1 : 0
        }}
      >
        <div className={styles.filterHeader}>
          <h2>Exploration Filters</h2>
          {activeFilterCount > 0 && (
            <button className={styles.resetButton} onClick={resetFilters}>
              Reset Filters ({activeFilterCount})
            </button>
          )}
        </div>
        
        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label htmlFor="mineralType">Mineral Type</label>
            <select
              id="mineralType"
              value={mineralTypeFilter}
              onChange={(e) => setMineralTypeFilter(e.target.value)}
              className={mineralTypeFilter !== "All Minerals" ? styles.activeFilter : ""}
            >
              {FILTER_OPTIONS.mineralTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="contractStatus">Contract Status</label>
            <select
              id="contractStatus"
              value={contractStatusFilter}
              onChange={(e) => setContractStatusFilter(e.target.value)}
              className={contractStatusFilter !== "All Statuses" ? styles.activeFilter : ""}
            >
              {FILTER_OPTIONS.contractStatus.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="sponsoringState">Sponsoring State</label>
            <select
              id="sponsoringState"
              value={sponsoringStateFilter}
              onChange={(e) => setSponsoringStateFilter(e.target.value)}
              className={sponsoringStateFilter !== "All States" ? styles.activeFilter : ""}
            >
              {FILTER_OPTIONS.sponsoringStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="location">Location</label>
            <select
              id="location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className={locationFilter !== "All Regions" ? styles.activeFilter : ""}
            >
              {FILTER_OPTIONS.locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className={styles.resultsInfo}>
          <span>
            Showing {filteredAreas.length} exploration {filteredAreas.length === 1 ? 'area' : 'areas'}
          </span>
        </div>
      </div>
      
      {/* Main Map */}
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapLib={maplibregl}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass={true} />
        
        {/* Markers for each exploration area */}
        {filteredAreas.map(area => (
          <Marker
            key={area.id}
            longitude={area.coordinates[0]}
            latitude={area.coordinates[1]}
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedArea(area);
            }}
          >
            <div 
              className={styles.mapMarker}
              style={{ 
                backgroundColor: getMarkerColor(area.contractStatus),
                width: `${getMarkerSize(area.areaSize)}px`,
                height: `${getMarkerSize(area.areaSize)}px`
              }}
            >
              <div className={styles.markerPulse} style={{ borderColor: getMarkerColor(area.contractStatus) }}></div>
            </div>
          </Marker>
        ))}
        
        {/* Popup for selected area */}
        {selectedArea && (
          <Popup
            longitude={selectedArea.coordinates[0]}
            latitude={selectedArea.coordinates[1]}
            anchor="bottom"
            onClose={() => setSelectedArea(null)}
            closeButton={true}
            closeOnClick={false}
            className={styles.mapPopup}
          >
            <div className={styles.popupContent}>
              <h3>{selectedArea.name}</h3>
              
              <div className={styles.popupGrid}>
                <div className={styles.popupItem}>
                  <span className={styles.popupLabel}>Mineral Type:</span>
                  <span>{selectedArea.mineralType}</span>
                </div>
                
                <div className={styles.popupItem}>
                  <span className={styles.popupLabel}>Location:</span>
                  <span>{selectedArea.location}</span>
                </div>
                
                <div className={styles.popupItem}>
                  <span className={styles.popupLabel}>Status:</span>
                  <span className={styles.statusBadge} style={{ backgroundColor: getMarkerColor(selectedArea.contractStatus) }}>
                    {selectedArea.contractStatus}
                  </span>
                </div>
                
                <div className={styles.popupItem}>
                  <span className={styles.popupLabel}>Sponsoring State:</span>
                  <span>{selectedArea.sponsoringState}</span>
                </div>
                
                <div className={styles.popupItem}>
                  <span className={styles.popupLabel}>Area Size:</span>
                  <span>{selectedArea.areaSize}</span>
                </div>
                
                <div className={styles.popupItem}>
                  <span className={styles.popupLabel}>Contract Period:</span>
                  <span>{formatDate(selectedArea.startDate)} - {formatDate(selectedArea.endDate)}</span>
                </div>
              </div>
              
              <p className={styles.popupDescription}>{selectedArea.description}</p>
              
              <button className={styles.viewDetailsButton}>
                View Complete Details
              </button>
            </div>
          </Popup>
        )}
      </Map>
      
      {/* Minimize/Maximize Filter Panel Button with toggle functionality */}
      <button 
        className={styles.toggleFilterButton} 
        onClick={() => setShowFilters(!showFilters)}
      >
        <span className={styles.filterIcon}>≡</span> Filters
      </button>
    </div>
  );
}