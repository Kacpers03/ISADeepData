import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Map, { NavigationControl, Popup, ViewStateChangeEvent } from 'react-map-gl';

// Custom hooks
import useMapData from "./hooks/useMapData";
import useMapZoom from "./hooks/useMapZoom";
import useCluster from "./hooks/useCluster";

// Custom components
import AreaLayer from "./layers/areaLayer";
import BlockLayer from "./layers/blockLayer";
import StationLayer from "./layers/stationLayer";
import CruiseLayer from "./layers/cruiseLayer";

// UI Components
import 'mapbox-gl/dist/mapbox-gl.css';
import { useFilter } from "../../contexts/filterContext";
import styles from "../../styles/map/map.module.css";
import { DetailPanel } from "./ui/detailPanel";
import { BlockAnalyticsPanel } from "./ui/blockAnalyticsPanel";
import { ContractorSummaryPanel } from "./ui/contractorSummaryPanel";
import CompactLayerControls from "./ui/layerControls";
import SummaryPanel from "./ui/summaryPanel";

const EnhancedMapComponent = () => {
  // Context and state from filter context
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
    filters,
    setFilter,
    refreshData,
    resetFilters
  } = useFilter();

  // Local state for map functionality
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 1.8,
    bearing: 0,
    pitch: 0
  });
  
  // Reference to maintain current view state across rerenders
  const mapRef = useRef(null);
  const initialLoadRef = useRef(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Default to true to ensure cruises are always visible
  const [showCruises, setShowCruises] = useState(true);
  
  // Popup state
  const [popupInfo, setPopupInfo] = useState(null);
  
  // Layer visibility controls
  const [showAreas, setShowAreas] = useState(true);
  const [showBlocks, setShowBlocks] = useState(true);
  const [showStations, setShowStations] = useState(true);
  
  // UI state variables
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ latitude: 0, longitude: 0 });
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/outdoors-v11");

  // Summary panel state
  const [showSummaryPanel, setShowSummaryPanel] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  
  // Additional state for analytics
  const [selectedContractorInfo, setSelectedContractorInfo] = useState(null);
  const [blockAnalytics, setBlockAnalytics] = useState(null);
  const [contractorSummary, setContractorSummary] = useState(null);
  const [hoveredBlockId, setHoveredBlockId] = useState(null);

  // Smart zoom function - will be called when a new contractor is selected or filters are reset
  const [pendingZoomContractorId, setPendingZoomContractorId] = useState(null);
  
  // Use custom hooks
  const {
    allAreaLayers,
    setAllAreaLayers,
    localLoading,
    setLocalLoading,
    contractorSummaryCache,
    fetchContractorGeoJson,
    loadAllVisibleContractors,
    fetchContractorSummary,
    fetchBlockAnalytics,
    getAllStations
  } = useMapData(mapData, loading, filters, selectedContractorId);
  
  const {
    userHasSetView,
    setUserHasSetView,
    smartZoom,
    zoomToArea,
    zoomToBlock,
    zoomToCruise
  } = useMapZoom(mapRef, allAreaLayers, selectedContractorId, filters, pendingZoomContractorId, setPendingZoomContractorId);
  
  const {
    clusterIndex,
    clusters,
    updateClusters
  } = useCluster(mapData, filters, mapRef, getAllStations);
  
  // Get selected contractor/cruise
  const selectedContractor = mapData?.contractors.find(c => c.contractorId === selectedContractorId) || null;
  const selectedCruise = mapData?.cruises.find(c => c.cruiseId === selectedCruiseId) || null;

  // Memoize visible area layers
  const visibleAreaLayers = useMemo(() => {
    if (!allAreaLayers.length) return [];
    
    // If filters are reset but we have no layers loaded, reload them  
    if (Object.keys(filters).length === 0) {
      return allAreaLayers;
    }
    
    // Get IDs of contractors that match the current filters
    const contractorIds = mapData?.contractors.map(c => c.contractorId) || [];
    
    // Filter area layers to only those belonging to the filtered contractors
    return allAreaLayers.filter(area => {
      // If we have a specific contractorId filter, only show that one
      if (selectedContractorId) {
        return area.contractorId === selectedContractorId;
      }
      
      // Otherwise show all areas belonging to the filtered contractors
      return contractorIds.includes(area.contractorId);
    });
  }, [allAreaLayers, mapData, filters, selectedContractorId]);

  // Ensure cruises are visible when a cruise is selected
  useEffect(() => {
    if (selectedCruiseId) {
      // Always ensure cruises are visible when a cruise is selected
      setShowCruises(true);
      console.log("Cruise selected, ensuring cruise markers are visible");
    }
  }, [selectedCruiseId]);
  
  // Zoom to selected location boundary if a location filter is applied
  useEffect(() => {
    if (mapRef.current && filters.locationId && filters.locationId !== 'all') {
      smartZoom();
    }
  }, [filters.locationId, smartZoom]);
  
  // Effect for smart zooming when selection changes
  useEffect(() => {
    // When contractor selection changes, trigger smart zoom
    if (mapRef.current) {
      smartZoom();
    }
  }, [selectedContractorId, smartZoom]);
  
  // New effect for zooming to cruise when selected
  useEffect(() => {
    if (selectedCruiseId && mapData && mapRef.current) {
      // Find the selected cruise
      const selectedCruise = mapData.cruises.find(c => c.cruiseId === selectedCruiseId);
      if (selectedCruise) {
        // Make sure cruises are visible when selecting a cruise
        setShowCruises(true);
        
        // Zoom to the cruise
        zoomToCruise(selectedCruise, setShowCruises);
      }
    }
  }, [selectedCruiseId, mapData, zoomToCruise]);
  
  // Load GeoJSON when filters change
  useEffect(() => {
    // Only load if we have data and haven't loaded these contractors yet
    if (mapData?.contractors && initialLoadComplete) {
      const shouldReloadLayers = 
        // If we have no layers yet but have contractors
        (allAreaLayers.length === 0 && mapData.contractors.length > 0) || 
        // OR we have different contractor IDs than before
        (mapData.contractors.some(c => 
          !allAreaLayers.some(area => area.contractorId === c.contractorId)
        ));
        
      if (shouldReloadLayers) {
        loadAllVisibleContractors();
      }
    }
  }, [filters, mapData?.contractors, allAreaLayers, loadAllVisibleContractors, initialLoadComplete]);

  // Calculate summary data
  useEffect(() => {
    if (mapData) {
      // Helper function to safely calculate total area for a contractor
      const calculateContractorArea = (contractor) => {
        if (!contractor.areas || !Array.isArray(contractor.areas)) {
          return 0;
        }
        
        return contractor.areas.reduce((total, area) => {
          const areaSize = area.totalAreaSizeKm2;
          // Check if the area size is a valid number
          return total + (typeof areaSize === 'number' && !isNaN(areaSize) ? areaSize : 0);
        }, 0);
      };
      
      // Calculate summary statistics from the mapData
      const summary = {
        contractorCount: mapData.contractors.length,
        areaCount: 0,
        blockCount: 0,
        stationCount: 0,
        cruiseCount: mapData.cruises?.length || 0,
        totalAreaSizeKm2: 0,
        contractTypes: {},
        sponsoringStates: {}
      };
      
      // Calculate station count from cruises
      summary.stationCount = mapData.cruises.reduce((total, c) => 
        total + (c.stations?.length || 0), 0);
      
      // Process contractors based on selection
      mapData.contractors.forEach(contractor => {
        // If a specific contractor is selected, only process that one
        if (selectedContractorId && contractor.contractorId !== selectedContractorId) {
          return;
        }
        
        // Count areas
        const areasCount = contractor.areas?.length || 0;
        summary.areaCount += areasCount;
        
        // Count blocks
        const blocksCount = contractor.areas?.reduce((total, area) => {
          return total + (area.blocks?.length || 0);
        }, 0) || 0;
        summary.blockCount += blocksCount;
        
        // Calculate total area
        summary.totalAreaSizeKm2 += calculateContractorArea(contractor);
        
        // Count by contract type
        if (contractor.contractType) {
          summary.contractTypes[contractor.contractType] = 
            (summary.contractTypes[contractor.contractType] || 0) + 1;
        }
        
        // Count by sponsoring state
        if (contractor.sponsoringState) {
          summary.sponsoringStates[contractor.sponsoringState] = 
            (summary.sponsoringStates[contractor.sponsoringState] || 0) + 1;
        }
      });
      
      console.log("Updated summary data:", summary);
      setSummaryData(summary);
    }
  }, [mapData, selectedContractorId]);

  // Make map instance available globally for search function
  useEffect(() => {
    if (mapRef.current) {
      window.mapInstance = mapRef.current.getMap();
      
      // Function to control cruise visibility
      window.showCruises = (show) => {
        setShowCruises(show);
      };
      
      // Expose zoomToBlock and zoomToArea functions for search results
      window.showBlockAnalytics = (blockId) => {
        // Find the block first
        const block = visibleAreaLayers.flatMap(area => area.blocks || [])
          .find(b => b.blockId === blockId);
        
        if (block) {
          // Zoom to the block
          zoomToBlock(block);
          
          // Fetch analytics
          fetchBlockAnalytics(
            blockId, 
            setBlockAnalytics, 
            setDetailPanelType, 
            setShowDetailPanel, 
            zoomToBlock, 
            visibleAreaLayers, 
            setToastMessage, 
            setShowToast
          );
        }
      };
      
      // Modified showCruiseDetails function with optional details panel
      window.showCruiseDetails = (cruiseId, showDetails = false) => {
        // Find cruise
        const cruise = mapData?.cruises.find(c => c.cruiseId === cruiseId);
        if (cruise) {
          setSelectedCruiseId(cruiseId);
          
          // Show detail panel only if showDetails is true
          if (showDetails) {
            setDetailPanelType('cruise');
            setShowDetailPanel(true);
          }
          
          // Ensure cruises are visible and zoom
          setShowCruises(true);
          zoomToCruise(cruise, setShowCruises);
        }
      };
      
      // Function to show station information
      window.showStationDetails = (stationId) => {
        // Find the station first
        const station = getAllStations().find(s => s.stationId === stationId);
        if (station) {
          setSelectedStation(station);
          setDetailPanelType('station');
          setShowDetailPanel(true);
          
          // Zoom to the station's position
          if (mapRef.current && station.latitude && station.longitude) {
            mapRef.current.flyTo({
              center: [station.longitude, station.latitude],
              zoom: 12,
              duration: 1000
            });
          }
        }
      };
    }
    
    return () => {
      window.mapInstance = null;
      window.showBlockAnalytics = null;
      window.showCruiseDetails = null;
      window.showStationDetails = null;
      window.showCruises = null;
    };
  }, [mapRef.current, visibleAreaLayers, mapData, zoomToBlock, zoomToCruise, getAllStations, fetchBlockAnalytics, setSelectedStation, setSelectedCruiseId, setDetailPanelType, setShowDetailPanel]);

  // Handle view state change
  const handleViewStateChange = (evt) => {
    setViewState(evt.viewState);
    // User has manually changed the view
    setUserHasSetView(true);
    
    // Update view bounds for future API requests
    if (mapRef.current) {
      const bounds = mapRef.current.getMap().getBounds();
      setViewBounds({
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLon: bounds.getWest(),
        maxLon: bounds.getEast()
      });
    }
    
    // Update clusters when view changes
    updateClusters(evt.viewState);
  };
  
  const handleCruiseClick = (cruise) => {
    console.log("Cruise clicked:", cruise.cruiseName);
    setSelectedCruiseId(cruise.cruiseId);
    setDetailPanelType('cruise');
    setShowDetailPanel(true);
    setPopupInfo(null); // Close any open popups
    
    // Make sure cruises stay visible and zoom to the cruise
    setShowCruises(true);
    zoomToCruise(cruise, setShowCruises);
  };
  
  // Handle marker click
  const handleMarkerClick = (station) => {
    setSelectedStation(station);
    setDetailPanelType('station');
    setShowDetailPanel(true);
    setPopupInfo(null); // Close any open popup
    
    // Find cruise
    if (mapData) {
      const cruise = mapData.cruises.find(c => 
        c.stations?.some(s => s.stationId === station.stationId)
      );
      if (cruise) {
        setSelectedCruiseId(cruise.cruiseId);
      }
    }
  };
  
  // Handle panel close
  const handlePanelClose = () => {
    // Only reset the UI state, but keep the contractor summary data
    setShowDetailPanel(false);
    setDetailPanelType(null);
    
    // Only reset station selection, keep contractor selection and data
    setSelectedStation(null);
    
    // Only reset block analytics
    setBlockAnalytics(null);
  };

  const handleCloseAllPanels = useCallback(() => {
    // Close the detail panel
    setShowDetailPanel(false);
    setDetailPanelType(null);
    
    // Close the summary panel
    setShowSummaryPanel(false);
    
    // Reset selected items
    setSelectedStation(null);
    
    // Reset analytics data but don't clear selection
    setBlockAnalytics(null);
    setContractorSummary(null);
  }, [setShowDetailPanel, setDetailPanelType, setShowSummaryPanel, setSelectedStation]);

  // View contractor summary
  const handleViewContractorSummary = useCallback(() => {
    if (selectedContractorId && contractorSummary) {
      setDetailPanelType('contractorSummary');
      setShowDetailPanel(true);
    } else if (selectedContractorId) {
      // If we have the ID but no summary, fetch it first
      fetchContractorSummary(
        selectedContractorId, 
        setContractorSummary, 
        setToastMessage, 
        setShowToast
      ).then((summary) => {
        if (summary) {
          setDetailPanelType('contractorSummary');
          setShowDetailPanel(true);
        }
      });
    }
  }, [selectedContractorId, contractorSummary, fetchContractorSummary, setDetailPanelType, setShowDetailPanel]);
  
  // Handle reset filters with smart zooming
  const handleResetFilters = () => {
    resetFilters();
    setUserHasSetView(false); // Allow auto-zooming after reset
    // The global view zoom will be handled by the smartZoom effect
  };

  // Handle block click
  const handleBlockClick = (blockId) => {
    fetchBlockAnalytics(
      blockId, 
      setBlockAnalytics, 
      setDetailPanelType, 
      setShowDetailPanel, 
      zoomToBlock, 
      visibleAreaLayers, 
      setToastMessage, 
      setShowToast
    );
  };

  // Loading/error states
  if (loading && !mapData) {
    return <div className={styles.mapLoading}>Loading map data...</div>;
  }
  
  if (error) {
    return <div className={styles.mapError}>Error: {error}</div>;
  }

  return (
    <div className={styles.mapContainer}>
      {/* Summary Panel */}
      {showSummaryPanel && (
        <SummaryPanel 
          data={summaryData} 
          onClose={() => setShowSummaryPanel(false)}
          selectedContractorInfo={selectedContractorId ? selectedContractorInfo : null}
          contractorSummary={selectedContractorId ? contractorSummary : null}
          onViewContractorSummary={handleViewContractorSummary}
          mapData={mapData}
          setSelectedCruiseId={setSelectedCruiseId}
          setDetailPanelType={setDetailPanelType}
          setShowDetailPanel={setShowDetailPanel}
        />
      )}
      
      {/* Compact Layer Controls */}
      <CompactLayerControls 
        showAreas={showAreas}
        setShowAreas={setShowAreas}
        showBlocks={showBlocks}
        setShowBlocks={setShowBlocks}
        showStations={showStations}
        setShowStations={setShowStations}
        showCruises={showCruises}
        setShowCruises={setShowCruises}
        mapStyle={mapStyle}
        setMapStyle={setMapStyle}
        showSummary={showSummaryPanel}
        setShowSummary={setShowSummaryPanel}
      />

      {/* THE MAP */}
      <Map
        {...viewState}
        ref={mapRef}
        onMove={handleViewStateChange}
        onMouseMove={(evt) => {
          setCursorPosition({
            latitude: evt.lngLat.lat.toFixed(6),
            longitude: evt.lngLat.lng.toFixed(6)
          });
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        interactiveLayerIds={visibleAreaLayers.flatMap(area => 
          area.blocks?.map(block => `block-fill-${block.blockId}`) || []
        )}
        onLoad={() => {
          console.log("Map successfully loaded!");
          window.mapInstance = mapRef.current?.getMap();
          
          // Initial view on first load - only once
          if (!initialLoadComplete && mapRef.current) {
            setInitialLoadComplete(true);
            smartZoom();
          }
        }}
      >
        <NavigationControl 
          position="top-right" 
          showCompass={true}
          showZoom={true}
        />
        
        {/* Coordinates display */}
        <div className={styles.coordinateDisplay}>
          {cursorPosition.latitude}, {cursorPosition.longitude}
        </div>

        {/* Areas Layers */}
        {showAreas && visibleAreaLayers.map(area => (
          <AreaLayer key={`area-${area.areaId}`} area={area} />
        ))}
        
        {/* Blocks Layers */}
        {showBlocks && visibleAreaLayers.flatMap(area => 
          area.blocks ? area.blocks.map(block => (
            <BlockLayer 
              key={`block-${block.blockId}`} 
              block={block} 
              hoveredBlockId={hoveredBlockId}
              onBlockClick={handleBlockClick}
            />
          )) : []
        )}

        {/* Cruises Layer */}
        <CruiseLayer 
          cruises={mapData?.cruises || []} 
          showCruises={showCruises} 
          onCruiseClick={handleCruiseClick} 
        />
        
        {/* Stations Layer */}
        <StationLayer 
          clusters={clusters} 
          showStations={showStations} 
          clusterIndex={clusterIndex}
          mapRef={mapRef}
          onStationClick={handleMarkerClick}
        />

        {/* Popup for station info */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            className={styles.mapPopup}
            closeOnClick={false}
          >
            <div className={styles.popupContent}>
              <h3>{popupInfo.stationCode}</h3>
              <div className={styles.popupGrid}>
                <div className={styles.popupItem}>
                  <span className={styles.popupLabel}>Type</span>
                  <span>{popupInfo.stationType || 'Unknown'}</span>
                </div>
                <div className={styles.popupItem}>
                  <span className={styles.popupLabel}>Status</span>
                  <span>{popupInfo.contractorAreaBlockId ? 'Associated' : 'Unassociated'}</span>
                </div>
              </div>
              <button 
                className={styles.viewDetailsButton}
                onClick={() => handleMarkerClick(popupInfo)}
              >
                View Details
              </button>
            </div>
          </Popup>
        )}

        {/* Loading overlay */}
        {(loading || localLoading) && (
          <div className={styles.mapLoadingOverlay}>
            <div className={styles.spinnerContainer}>
              <div className={styles.spinner}></div>
            </div>
            <p className={styles.loadingText}>Loading map data...</p>
          </div>
        )}
      </Map>
      
      {/* Detail panels */}
      {showDetailPanel && detailPanelType === 'station' && (
        <DetailPanel
          type={'station'}
          station={selectedStation}
          contractor={null}
          cruise={null}
          onClose={handlePanelClose}
        />
      )}
      
      {showDetailPanel && detailPanelType === 'contractor' && (
        <DetailPanel
          type={'contractor'}
          station={null}
          contractor={selectedContractor}
          cruise={null}
          onClose={handlePanelClose}
        />
      )}
      
      {showDetailPanel && detailPanelType === 'cruise' && (
        <DetailPanel
          type={'cruise'}
          station={null}
          contractor={null}
          cruise={selectedCruise}
          onClose={handlePanelClose}
        />
      )}
      
      {showDetailPanel && detailPanelType === 'blockAnalytics' && blockAnalytics && (
        <BlockAnalyticsPanel
          data={blockAnalytics}
          onClose={handlePanelClose}
        />
      )}
      
      {showDetailPanel && detailPanelType === 'contractorSummary' && contractorSummary && (
        <ContractorSummaryPanel
          data={contractorSummary}
          onClose={handlePanelClose}
          onCloseAll={handleCloseAllPanels}
        />
      )}

      {/* Toast */}
      {showToast && (
        <div className={styles.toast}>
          <span>{toastMessage}</span>
          <button 
            onClick={() => setShowToast(false)}
            className={styles.toastCloseButton}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedMapComponent;