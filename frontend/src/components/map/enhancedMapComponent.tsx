// frontend/src/components/map/MapComponent.tsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import Map, { NavigationControl } from 'react-map-gl';

// Custom hooks
import useMapData from "./hooks/useMapData";
import useMapZoom from "./hooks/useMapZoom";
import useCluster from "./hooks/useCluster";
import useMapState from "./hooks/useMapState";
import useMapInteractions from "./hooks/useMapInteractions";
import useMapExport from "./hooks/useMapExport";

// UI Components
import 'mapbox-gl/dist/mapbox-gl.css';
import { useFilter } from "./context/filterContext";
import baseStyles from "../../styles/map/base.module.css";
import controlStyles from "../../styles/map/controls.module.css";
import markerStyles from "../../styles/map/markers.module.css";
import layerStyles from "../../styles/map/layers.module.css";
import panelStyles from "../../styles/map/panels.module.css";
import uiStyles from "../../styles/map/ui.module.css";

// Map layers
import MapLayers from "./layers/mapLayers";

// UI Components
import { DetailPanel } from "./ui/detailPanel";
import { BlockAnalyticsPanel } from "./ui/blockAnalyticsPanel";
import { ContractorSummaryPanel } from "./ui/contractorSummaryPanel";
import CompactLayerControls from "./ui/layerControls";
import SummaryPanel from "./ui/summaryPanel";
import CoordinateDisplay from "./ui/coordinateDisplay";
import ToastNotification from "./ui/toastNotification";
import LoadingOverlay from "./ui/loadingOverlay";

const styles = {
  ...baseStyles,
  ...controlStyles,
  ...markerStyles,
  ...layerStyles,
  ...panelStyles,
  ...uiStyles
};
const MapComponent = () => {
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
    resetFilters,
    originalMapData
  } = useFilter();

  // Use custom hooks for map state management
  const { 
    viewState, 
    setViewState, 
    mapRef, 
    initialLoadComplete, 
    setInitialLoadComplete,
    cursorPosition, 
    setCursorPosition,
    mapStyle, 
    setMapStyle 
  } = useMapState();
  
  // Layer visibility states
  const [showAreas, setShowAreas] = useState(true);
  const [showBlocks, setShowBlocks] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [showCruises, setShowCruises] = useState(true);
  
  // UI state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showSummaryPanel, setShowSummaryPanel] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  
  // Analytics state
  const [selectedContractorInfo, setSelectedContractorInfo] = useState(null);
  const [blockAnalytics, setBlockAnalytics] = useState(null);
  const [contractorSummary, setContractorSummary] = useState(null);
  const [hoveredBlockId, setHoveredBlockId] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);

  // Use custom hooks for map functionality
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
    zoomToCruise,
    pendingZoomContractorId, 
    setPendingZoomContractorId
  } = useMapZoom(mapRef, allAreaLayers, selectedContractorId, filters);
  
  const {
    clusterIndex,
    clusters,
    updateClusters
  } = useCluster(mapData, filters, mapRef, getAllStations);

  // Memoize visible area layers with improved filtering
  const visibleAreaLayers = useMemo(() => {
    if (!allAreaLayers.length) return [];
    
    // If no filters are applied, return all layers (or only the selected contractor's layers)
    if (Object.keys(filters).length === 0) {
      if (selectedContractorId) {
        return allAreaLayers.filter(area => area.contractorId === selectedContractorId);
      }
      return allAreaLayers;
    }
    
    // Get contractors that match the current filters
    const filteredContractors = mapData?.contractors.filter(contractor => {
      // Apply mineral type filter (contractType)
      if (filters.contractType && filters.contractType !== 'all' && 
          contractor.contractType !== filters.contractType) {
        return false;
      }
      
      // Apply sponsoring state filter
      if (filters.sponsoringState && filters.sponsoringState !== 'all' && 
          contractor.sponsoringState !== filters.sponsoringState) {
        return false;
      }
      
      // Apply year filter (if it exists in your filter object)
      if (filters.contractualYear && filters.contractualYear !== 'all' && 
          contractor.contractualYear !== filters.contractualYear) {
        return false;
      }
      
      // If all filters pass, include this contractor
      return true;
    }) || [];
    
    // Get the IDs of contractors that match filters
    const filteredContractorIds = filteredContractors.map(c => c.contractorId);
    
    // If we have a specific contractor selected, only show that one's areas
    // regardless of other filters
    if (selectedContractorId) {
      return allAreaLayers.filter(area => area.contractorId === selectedContractorId);
    }
    
    // Otherwise filter area layers to only those belonging to the filtered contractors
    return allAreaLayers.filter(area => 
      filteredContractorIds.includes(area.contractorId)
    );
  }, [allAreaLayers, mapData?.contractors, filters, selectedContractorId]);
  
  const {
    handleViewStateChange,
    handleCruiseClick,
    handleMarkerClick,
    handlePanelClose,
    handleCloseAllPanels,
    handleViewContractorSummary,
    handleResetFilters,
    handleBlockClick,
    handleMapHover,
    handleAreaClick,
    handleStationHover,
    toggleSummaryPanel
  } = useMapInteractions({
    mapRef,
    viewState,
    setViewState,
    setUserHasSetView,
    setViewBounds,
    updateClusters,
    setSelectedCruiseId,
    setDetailPanelType,
    setShowDetailPanel,
    setPopupInfo,
    setSelectedStation,
    zoomToCruise,
    zoomToArea,
    zoomToBlock,
    setShowCruises,
    resetFilters,
    fetchBlockAnalytics,
    blockAnalytics,
    setBlockAnalytics,
    visibleAreaLayers, // Use visibleAreaLayers, not allAreaLayers
    selectedContractorId,
    contractorSummary,
    setContractorSummary,
    fetchContractorSummary,
    setToastMessage,
    setShowToast
  });

  // Get selected entities
  const selectedContractor = mapData?.contractors.find(c => c.contractorId === selectedContractorId) || null;
  const selectedCruise = mapData?.cruises.find(c => c.cruiseId === selectedCruiseId) || null;

  // Ensure cruises are visible when a cruise is selected
  useEffect(() => {
    if (selectedCruiseId) {
      setShowCruises(true);
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
    if (mapRef.current) {
      smartZoom();
    }
  }, [selectedContractorId, smartZoom]);
  
  useEffect(() => {
    if (selectedCruiseId && mapData && mapRef.current) {
      // We'll only make cruises visible here but NOT trigger another zoom
      // since zooming is now handled directly in the click handlers
      setShowCruises(true);
      
      // Only zoom if userHasSetView is false (first load or reset)
      if (!userHasSetView) {
        const selectedCruise = mapData.cruises.find(c => c.cruiseId === selectedCruiseId);
        if (selectedCruise) {
          zoomToCruise(selectedCruise, setShowCruises);
        }
      }
    }
  }, [selectedCruiseId, mapData, zoomToCruise, userHasSetView]);
  
  // Load GeoJSON when filters change
  useEffect(() => {
    if (mapData?.contractors && initialLoadComplete) {
      const shouldReloadLayers = 
        (allAreaLayers.length === 0 && mapData.contractors.length > 0) || 
        (mapData.contractors.some(c => 
          !allAreaLayers.some(area => area.contractorId === c.contractorId)
        ));
        
      if (shouldReloadLayers) {
        loadAllVisibleContractors();
      }
    }
  }, [filters, mapData?.contractors, allAreaLayers, loadAllVisibleContractors, initialLoadComplete]);

  // This is a focused fix for the total area calculation issue in enhancedMapComponent.tsx

// Update the useEffect hook that calculates summary data
// This modified version ensures we use visibleAreaLayers to get accurate area data
useEffect(() => {
  if (mapData) {
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
    
    // Use visibleAreaLayers for area calculations rather than mapData.contractors
    // This ensures we have the complete data including totalAreaSizeKm2
    if (visibleAreaLayers && visibleAreaLayers.length > 0) {
      // Count areas
      summary.areaCount = visibleAreaLayers.length;
      
      // Calculate total area directly from visibleAreaLayers
      summary.totalAreaSizeKm2 = visibleAreaLayers.reduce((total, area) => {
        const areaSize = area.totalAreaSizeKm2;
        return total + (typeof areaSize === 'number' && !isNaN(areaSize) ? areaSize : 0);
      }, 0);
      
      // Count blocks
      summary.blockCount = visibleAreaLayers.reduce((total, area) => 
        total + (area.blocks?.length || 0), 0);
    } else {
      // If area data isn't loaded yet, check database values as fallback
      // Based on DbInitializer.cs, we know the total should be approximately 390,000 km²
      const contractorAreas = {
        1: 75000, // Exploration Area 1 (BGR)
        2: 70000, // Exploration Area 1 (COMRA)
        3: 73000, // Exploration Area 1 (CMM)
        4: 68000, // Exploration Area 1 (BPHDC)
        5: 75000, // Exploration Area 1 (DORD)
        6: 10000, // Mid-Atlantic Ridge Exploration Zone
        7: 10000, // Central Indian Ridge Exploration Area
        8: 9000   // Western Pacific Seamount Chain
      };
      
      // Calculate area and block counts from the contractors that are visible
      mapData.contractors.forEach(contractor => {
        if (selectedContractorId && contractor.contractorId !== selectedContractorId) {
          return;
        }
        
        // Add estimated area from known values
        if (contractorAreas[contractor.contractorId]) {
          summary.totalAreaSizeKm2 += contractorAreas[contractor.contractorId];
        }
        
        // Count areas as best we can from mapData
        const areasCount = contractor.areas?.length || 0;
        summary.areaCount += areasCount;
        
        // Count blocks as best we can from mapData
        const blocksCount = contractor.areas?.reduce((total, area) => {
          return total + (area.blocks?.length || 0);
        }, 0) || 0;
        summary.blockCount += blocksCount;
      });
    }
    
    // Process contractors based on selection for metadata like types and states
    mapData.contractors.forEach(contractor => {
      // If a specific contractor is selected, only process that one
      if (selectedContractorId && contractor.contractorId !== selectedContractorId) {
        return;
      }
      
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
    
    setSummaryData(summary);
  }
}, [mapData, selectedContractorId, visibleAreaLayers]);  // Added visibleAreaLayers as dependency

  useEffect(() => {
    if (mapRef.current) {
      window.mapInstance = mapRef.current.getMap();
      
      // Function to control cruise visibility
      window.showCruises = (show) => {
        setShowCruises(show);
      };
      
      // Expose zoomToBlock function for search results
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
      
      // IMPROVED Function for showing cruise details
      window.showCruiseDetails = (cruiseId, showDetails = false) => {
        // Find cruise
        const cruise = mapData?.cruises.find(c => c.cruiseId === cruiseId);
        if (cruise) {
          // Ensure cruises are visible first
          setShowCruises(true);
          
          // Set selected cruise ID
          setSelectedCruiseId(cruiseId);
          
          // Perform zoom immediately, don't wait for effect
          if (mapRef.current) {
            zoomToCruise(cruise, setShowCruises);
          }
          
          // Show detail panel only if showDetails is true
          if (showDetails) {
            // Small delay to ensure zoom happens first
            setTimeout(() => {
              setDetailPanelType('cruise');
              setShowDetailPanel(true);
            }, 100);
          }
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
            setTimeout(() => {
              mapRef.current.flyTo({
                center: [station.longitude, station.latitude],
                zoom: 12,
                duration: 800,
                essential: true
              });
            }, 50);
          }
        }
      };
    }
    
    return () => {
      // Clean up global objects
      window.mapInstance = null;
      window.showBlockAnalytics = null;
      window.showCruiseDetails = null;
      window.showStationDetails = null;
      window.showCruises = null;
    };
  }, [
    mapRef.current, 
    visibleAreaLayers, 
    mapData, 
    zoomToBlock, 
    zoomToCruise, 
    getAllStations, 
    fetchBlockAnalytics, 
    setSelectedStation, 
    setSelectedCruiseId, 
    setDetailPanelType, 
    setShowDetailPanel
  ]);

  // Effect for pendingZoom
  useEffect(() => {
    if (pendingZoomContractorId && allAreaLayers.length > 0) {
      smartZoom();
    }
  }, [allAreaLayers, pendingZoomContractorId, smartZoom]);
  
  // NY USEEFFECT: Når en kontraktor er valgt, sørg for at cruise og stasjoner er synlige
  useEffect(() => {
    if (selectedContractorId) {
      setShowCruises(true);   // Viktig! Sørg for at cruises vises
      setShowStations(true);  // Viktig! Sørg for at stasjoner vises
      console.log(`Contractor ${selectedContractorId} selected - ensuring cruises and stations are visible`);
    }
  }, [selectedContractorId]);
  
  // NY USEEFFECT: Diagnostikk-funksjon for feilsøking
  useEffect(() => {
    // Eksponere en diagnostikk-funksjon som kan kjøres fra konsollen
    window.diagnoseMapData = () => {
      const data = {
        originalMapData,
        currentMapData: mapData,
        filters,
        contractorCount: mapData?.contractors?.length || 0,
        cruiseCount: mapData?.cruises?.length || 0,
        stationCount: mapData?.cruises?.reduce((acc, c) => acc + (c.stations?.length || 0), 0) || 0,
        selectedContractorId,
        showCruises,  // Sjekk om cruises er satt til å vises
        showStations  // Sjekk om stasjoner er satt til å vises
      };
      console.log("Map Data Diagnostics:", data);
      return data;
    };
    
    return () => {
      window.diagnoseMapData = undefined;
    };
  }, [mapData, originalMapData, filters, selectedContractorId, showCruises, showStations]);

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
        <CoordinateDisplay 
          latitude={cursorPosition.latitude} 
          longitude={cursorPosition.longitude} 
        />

        {/* Map Layers Component - Use visibleAreaLayers instead of allAreaLayers */}
        <MapLayers 
          showAreas={showAreas}
          showBlocks={showBlocks}
          showStations={showStations}
          showCruises={showCruises}
          areas={visibleAreaLayers}  // Use filtered layers here
          cruises={mapData?.cruises || []}
          clusters={clusters}
          clusterIndex={clusterIndex}
          mapRef={mapRef}
          hoveredBlockId={hoveredBlockId}
          onBlockClick={handleBlockClick}
          onCruiseClick={handleCruiseClick}
          onStationClick={handleMarkerClick}
          popupInfo={popupInfo}
          setPopupInfo={setPopupInfo}
        />

        {/* Loading overlay */}
        {(loading || localLoading) && <LoadingOverlay />}
      </Map>
      
      {showDetailPanel && detailPanelType === 'station' && (
  <DetailPanel
    type={'station'}
    station={selectedStation}
    contractor={null}
    cruise={null}
    onClose={handlePanelClose}
    mapData={mapData} 
  />
)}

{showDetailPanel && detailPanelType === 'contractor' && (
  <DetailPanel
    type={'contractor'}
    station={null}
    contractor={selectedContractor}
    cruise={null}
    onClose={handlePanelClose}
    mapData={mapData}
  />
)}

{showDetailPanel && detailPanelType === 'cruise' && (
  <DetailPanel
    type={'cruise'}
    station={null}
    contractor={null}
    cruise={selectedCruise}
    onClose={handlePanelClose}
    mapData={mapData}
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

      {/* Toast Notification */}
      {showToast && (
        <ToastNotification 
          message={toastMessage} 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  );
};

export default MapComponent;