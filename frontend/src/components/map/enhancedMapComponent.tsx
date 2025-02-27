import React, { useState, useEffect, useRef } from "react";
import Map, { NavigationControl, Marker, Popup, ViewStateChangeEvent } from "react-map-gl";
import { useFilter } from "../../contexts/filterContext";
import styles from "../../styles/map/map.module.css";
import { DetailPanel } from "./detailPanel";
import { FilterPanel } from "../filters/filterPanel";
import { Station, Contractor, Cruise } from "../../types/filter-types";

// You can keep your existing FILTER_OPTIONS or replace with API data

const getMarkerColor = (status: string) => {
  switch (status) {
    case "Active": return "#4CAF50"; // Green
    case "Pending": return "#FFC107"; // Yellow
    case "Expired": return "#9E9E9E"; // Gray
    case "Suspended": return "#F44336"; // Red
    default: return "#2196F3"; // Blue
  }
};

const EnhancedMapComponent: React.FC = () => {
  const {
    mapData,
    loading,
    error,
    viewBounds,
    setViewBounds,
    selectedStation,
    setSelectedStation,
    selectedContractorId,
    setSelectedContractorId,
    selectedCruiseId,
    setSelectedCruiseId,
    showDetailPanel,
    setShowDetailPanel,
    detailPanelType,
    setDetailPanelType,
  } = useFilter();

  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 1.5,
  });

  const [showFilters, setShowFilters] = useState(true);
  const mapRef = useRef(null);
  
  // Extract stations from map data
  const stations: Station[] = mapData
    ? mapData.cruises.flatMap(cruise => cruise.stations || [])
    : [];
    
  // Find selected items
  const selectedContractor = mapData?.contractors.find(c => c.contractorId === selectedContractorId) || null;
  const selectedCruise = mapData?.cruises.find(c => c.cruiseId === selectedCruiseId) || null;

  // Handle map view state change
  const handleViewStateChange = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
    
    // For performance reasons, don't update bounds on every tiny movement
    // Instead, we could add a "Apply View Bounds" button if needed
  };
  
  // Calculate bounds from current view for filtering
  const calculateBoundsFromView = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      const bounds = map.getBounds();
      
      setViewBounds({
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLon: bounds.getWest(),
        maxLon: bounds.getEast()
      });
    }
  };

  // Handle marker click - show detail panel
  const handleMarkerClick = (station: Station) => {
    setSelectedStation(station);
    setDetailPanelType('station');
    setShowDetailPanel(true);
    
    // Find corresponding cruise
    if (mapData) {
      const cruise = mapData.cruises.find(c => 
        c.stations?.some(s => s.stationId === station.stationId)
      );
      
      if (cruise) {
        setSelectedCruiseId(cruise.cruiseId);
      }
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render loading state
  if (loading) {
    return <div className={styles.mapLoading}>Loading map data...</div>;
  }

  // Render error state
  if (error) {
    return <div className={styles.mapError}>Error: {error}</div>;
  }

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
        <FilterPanel />
      </div>
      
      {/* Main Map */}
      <Map
        {...viewState}
        ref={mapRef}
        onMove={handleViewStateChange}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" showCompass={true} />
        
        {/* Markers for each station */}
        {stations.map(station => (
          <Marker
            key={station.stationId}
            longitude={station.longitude}
            latitude={station.latitude}
            onClick={e => {
              e.originalEvent.stopPropagation();
              handleMarkerClick(station);
            }}
          >
            <div 
              className={styles.mapMarker}
              style={{ 
                backgroundColor: getMarkerColor(
                  // Try to find status - you may need to adjust this based on your data structure
                  station.stationType === "POINT" ? "Active" : 
                  station.stationType === "TRAWL" ? "Pending" : "Active"
                ),
                width: `30px`,
                height: `30px`
              }}
            >
              <div className={styles.markerPulse} 
                style={{ 
                  borderColor: getMarkerColor(
                    station.stationType === "POINT" ? "Active" : 
                    station.stationType === "TRAWL" ? "Pending" : "Active"
                  ) 
                }}
              ></div>
            </div>
          </Marker>
        ))}
        
        {/* Popup for selected station - optional if you prefer all details in the side panel */}
        {selectedStation && !showDetailPanel && (
          <Popup
            longitude={selectedStation.longitude}
            latitude={selectedStation.latitude}
            anchor="bottom"
            onClose={() => setSelectedStation(null)}
            closeButton={true}
            closeOnClick={false}
            className={styles.mapPopup}
          >
            <div className={styles.popupContent}>
              <h3>{selectedStation.stationCode}</h3>
              
              <div className={styles.popupGrid}>
                <div className={styles.popupItem}>
                  <span className={styles.popupLabel}>Station Type:</span>
                  <span>{selectedStation.stationType}</span>
                </div>
                
                <div className={styles.popupItem}>
                  <span className={styles.popupLabel}>Coordinates:</span>
                  <span>{selectedStation.latitude.toFixed(4)}, {selectedStation.longitude.toFixed(4)}</span>
                </div>
              </div>
              
              <button 
                className={styles.viewDetailsButton}
                onClick={() => {
                  setDetailPanelType('station');
                  setShowDetailPanel(true);
                }}
              >
                View Complete Details
              </button>
            </div>
          </Popup>
        )}
      </Map>
      
      {/* Detail Panel - shown inside the map container */}
      {showDetailPanel && (
        <DetailPanel
          type={detailPanelType}
          station={selectedStation}
          contractor={selectedContractor}
          cruise={selectedCruise}
          onClose={() => {
            setShowDetailPanel(false);
            setDetailPanelType(null);
          }}
        />
      )}
      
      {/* Toggle Filter Panel Button */}
      <button 
        className={styles.toggleFilterButton} 
        onClick={() => setShowFilters(!showFilters)}
      >
        <span className={styles.filterIcon}>≡</span> Filters
      </button>
      
      {/* Viewport Filter Button - Optional */}
      <button
        className={styles.viewportFilterButton}
        onClick={calculateBoundsFromView}
      >
        Filter by Current View
      </button>
    </div>
  );
};

export default EnhancedMapComponent;