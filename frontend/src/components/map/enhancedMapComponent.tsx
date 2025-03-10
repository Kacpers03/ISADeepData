import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Map, { 
  NavigationControl, 
  Marker, 
  Popup, 
  Source, 
  Layer,
  ViewStateChangeEvent 
} from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useFilter } from "../../contexts/filterContext";
import styles from "../../styles/map/map.module.css";
import { DetailPanel } from "./detailPanel";
import { BlockAnalyticsPanel } from "./blockAnalyticsPanel";
import { ContractorSummaryPanel } from "./contractorSummaryPanel";
import { Station, Contractor, Cruise, GeoJsonFeature } from "../../types/filter-types";
import { ImprovedFilterPanel } from "../filters/filterPanel";
import CompactLayerControls from "./layerControls";
import SummaryPanel from "./summaryPanel";

const EnhancedMapComponent = () => {
  // Context and state
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

  // Store the initial view state
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 1.0,
    bearing: 0,
    pitch: 0
  });

  // Reference to maintain current view state across rerenders
  const mapRef = useRef(null);
  const initialLoadRef = useRef(true);
  const [localLoading, setLocalLoading] = useState(false);
  
  // User has manually set the view (to prevent auto-zooming when unwanted)
  const [userHasSetView, setUserHasSetView] = useState(false);
  
  // Store all loaded GeoJSON data
  const [allAreaLayers, setAllAreaLayers] = useState([]);
  
  // State variables
  const [selectedContractorInfo, setSelectedContractorInfo] = useState(null);
  const [blockAnalytics, setBlockAnalytics] = useState(null);
  const [contractorSummary, setContractorSummary] = useState(null);
  const [showAreas, setShowAreas] = useState(true);
  const [showBlocks, setShowBlocks] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [associating, setAssociating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ latitude: 0, longitude: 0 });
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/outdoors-v11");
  
  // New state for the summary panel
  const [showSummaryPanel, setShowSummaryPanel] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  // Helper function to fetch GeoJSON for a contractor
  const fetchContractorGeoJson = useCallback(async (contractorId) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api';
      const response = await fetch(`${API_BASE_URL}/MapFilter/contractor-areas-geojson/${contractorId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch area data');
      }
      
      const areasData = await response.json();
      
      // Add contractorId to each area for filtering later
      return areasData.map((area) => ({
        contractorId: contractorId,
        areaId: area.areaId,
        areaName: area.areaName,
        geoJson: typeof area.geoJson === 'string' ? JSON.parse(area.geoJson) : area.geoJson,
        centerLatitude: area.centerLat,
        centerLongitude: area.centerLon,
        totalAreaSizeKm2: area.totalAreaSizeKm2,
        blocks: area.blocks.map((block) => ({
          blockId: block.blockId,
          blockName: block.blockName,
          status: block.status,
          geoJson: typeof block.geoJson === 'string' ? JSON.parse(block.geoJson) : block.geoJson,
          centerLatitude: block.centerLat,
          centerLongitude: block.centerLon,
          areaSizeKm2: block.areaSizeKm2
        }))
      }));
    } catch (error) {
      console.error(`Error fetching GeoJSON for contractor ${contractorId}:`, error);
      return [];
    }
  }, []);
  
  // Smart zoom function - will be called when a new contractor is selected or filters are reset
  const smartZoom = useCallback(() => {
    if (!mapRef.current) return;
    
    // If user has manually panned or zoomed, don't auto-zoom unless filters are reset
    if (userHasSetView && Object.keys(filters).length > 0) {
      return;
    }
    
    // If a specific contractor is selected, zoom to their areas
    if (selectedContractorId && allAreaLayers.length > 0) {
      const contractorAreas = allAreaLayers.filter(area => 
        area.contractorId === selectedContractorId
      );
      
      if (contractorAreas.length > 0) {
        // Calculate bounds manually
        let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
        let boundsSet = false;
        
        contractorAreas.forEach(area => {
          if (area.geoJson && area.geoJson.geometry && area.geoJson.geometry.coordinates) {
            // For polygon types
            const coordinates = area.geoJson.geometry.coordinates[0];
            coordinates.forEach(([lon, lat]) => {
              minLon = Math.min(minLon, lon);
              maxLon = Math.max(maxLon, lon);
              minLat = Math.min(minLat, lat);
              maxLat = Math.max(maxLat, lat);
              boundsSet = true;
            });
          } else if (area.centerLongitude && area.centerLatitude) {
            // Fallback to center coordinates
            minLon = Math.min(minLon, area.centerLongitude);
            maxLon = Math.max(maxLon, area.centerLongitude);
            minLat = Math.min(minLat, area.centerLatitude);
            maxLat = Math.max(maxLat, area.centerLatitude);
            boundsSet = true;
          }
        });
        
        // Only zoom if we have valid bounds
        if (boundsSet && minLon < maxLon && minLat < maxLat) {
          // Add padding for better view
          const pad = 1;
          
          mapRef.current.fitBounds(
            [[minLon - pad, minLat - pad], [maxLon + pad, maxLat + pad]],
            { padding: 50, duration: 1000, maxZoom: 10 }
          );
          
          console.log("Smart zoomed to contractor areas");
          return;
        }
      }
    }
    
    // Reset to world view if no specific filters
    if (Object.keys(filters).length === 0 || !selectedContractorId) {
      mapRef.current.fitBounds(
        [[-180, -60], [180, 85]],
        { padding: 20, duration: 1000 }
      );
      console.log("Reset to world view");
    }
  }, [selectedContractorId, allAreaLayers, filters]);

  // Update summary data based on what's currently visible
 // Improved updateSummaryData function for EnhancedMapComponent

const updateSummaryData = useCallback(() => {
  if (!mapData) return;
  
  // Get visible contractors based on filters
  const visibleContractors = mapData.contractors || [];
  
  // Prepare summary data with safe defaults
  const summary = {
    contractorCount: visibleContractors.length,
    areaCount: 0,
    blockCount: 0,
    stationCount: 0,
    totalAreaSizeKm2: 0,
    contractTypes: {},
    sponsoringStates: {}
  };
  
  // Count areas and blocks from visible allAreaLayers
  if (allAreaLayers.length > 0) {
    const visibleContractorIds = visibleContractors.map(c => c.contractorId);
    const visibleAreas = allAreaLayers.filter(area => 
      visibleContractorIds.includes(area.contractorId)
    );
    
    summary.areaCount = visibleAreas.length;
    
    // Calculate blocks with a safe fallback
    summary.blockCount = visibleAreas.reduce((total, area) => 
      total + ((area.blocks && Array.isArray(area.blocks)) ? area.blocks.length : 0), 0);
    
    // Calculate total area with a safe fallback and sanitize
    summary.totalAreaSizeKm2 = visibleAreas.reduce((total, area) => {
      const areaSize = typeof area.totalAreaSizeKm2 === 'number' ? area.totalAreaSizeKm2 : 0;
      return total + areaSize;
    }, 0);
  }
  
  // Count stations from mapData with safe handling
  if (mapData.cruises && Array.isArray(mapData.cruises)) {
    summary.stationCount = mapData.cruises.reduce((total, cruise) => {
      if (cruise.stations && Array.isArray(cruise.stations)) {
        return total + cruise.stations.length;
      }
      return total;
    }, 0);
  }
  
  // Aggregate contract types and sponsoring states
  visibleContractors.forEach(contractor => {
    // Contract types
    if (contractor.contractType) {
      summary.contractTypes[contractor.contractType] = 
        (summary.contractTypes[contractor.contractType] || 0) + 1;
    }
    
    // Sponsoring states
    if (contractor.sponsoringState) {
      summary.sponsoringStates[contractor.sponsoringState] = 
        (summary.sponsoringStates[contractor.sponsoringState] || 0) + 1;
    }
  });
  
  // Set the summary data
  setSummaryData(summary);
}, [mapData, allAreaLayers]);

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
  
  // Make map instance available globally for search function
  useEffect(() => {
    if (mapRef.current) {
      window.mapInstance = mapRef.current.getMap();
    }
    
    return () => {
      window.mapInstance = null;
    };
  }, [mapRef.current]);
  
  // Load all visible contractors' GeoJSON
  const loadAllVisibleContractors = useCallback(async () => {
    if (!mapData?.contractors.length) return;
    
    try {
      setLocalLoading(true);
      
      // Load GeoJSON for each visible contractor
      const contractorIds = mapData.contractors.map(c => c.contractorId);
      console.log(`Loading GeoJSON for ${contractorIds.length} visible contractors`);
      
      const promises = contractorIds.map(id => fetchContractorGeoJson(id));
      
      // Wait for all to complete
      const results = await Promise.allSettled(promises);
      
      // Collect all successful results
      const allAreas = results
        .filter(result => result.status === 'fulfilled' && result.value)
        .flatMap(result => result.value);
      
      setAllAreaLayers(allAreas);
    } catch (error) {
      console.error('Error loading all contractor GeoJSON:', error);
    } finally {
      setLocalLoading(false);
    }
  }, [mapData?.contractors, fetchContractorGeoJson]);
  
  // Load GeoJSON when filters change
  useEffect(() => {
    if (mapData?.contractors && (!allAreaLayers.length || Object.keys(filters).length === 0)) {
      // Load all visible contractors if:
      // - We have no area layers loaded yet
      // - OR filters have been reset to empty
      loadAllVisibleContractors();
    }
  }, [filters, mapData?.contractors, allAreaLayers.length, loadAllVisibleContractors]);
  
  // Effect for smart zooming when selection changes
  useEffect(() => {
    // When contractor selection changes, trigger smart zoom
    if (mapRef.current) {
      smartZoom();
    }
  }, [selectedContractorId, smartZoom]);
  
  // Effect to update summary when relevant data changes
  useEffect(() => {
    updateSummaryData();
  }, [mapData, allAreaLayers, filters, selectedContractorId, updateSummaryData]);
  
  // Get all GeoJSON for a contractor and store it
  useEffect(() => {
    if (selectedContractorId) {
      fetchGeoJsonForContractor(selectedContractorId);
    } else if (mapData?.contractors) {
      loadAllVisibleContractors();
    } else {
      // Only reset view on initial load
      if (initialLoadRef.current && mapRef.current) {
        initialLoadRef.current = false;
        mapRef.current.fitBounds(
          [[-180, -60], [180, 85]],
          { padding: 20, duration: 1500, easing: (t) => t * (2 - t) }
        );
      }
    }
  }, [selectedContractorId, mapData?.contractors, loadAllVisibleContractors]);

  const fetchGeoJsonForContractor = useCallback(async (contractorId) => {
    try {
      const areas = await fetchContractorGeoJson(contractorId);
      
      if (areas && areas.length > 0) {
        // Store all areas in the allAreaLayers state
        setAllAreaLayers(prevLayers => {
          // Remove any existing areas for this contractor
          const filtered = prevLayers.filter(area => area.contractorId !== contractorId);
          // Add the new areas
          return [...filtered, ...areas];
        });
        
        // Update info-box for contractor
        if (mapData?.contractors) {
          const contractor = mapData.contractors.find(c => c.contractorId === contractorId);
          if (contractor) {
            setSelectedContractorInfo({
              name: contractor.contractorName,
              totalAreas: areas.length,
              totalBlocks: areas.reduce((acc, area) => acc + area.blocks.length, 0)
            });
          }
        }
        
        // Fetch contractor summary for the summary panel
        fetchContractorSummary(contractorId);
      }
    } catch (error) {
      console.error('Error loading GeoJSON data:', error);
    }
  }, [fetchContractorGeoJson, mapData?.contractors]);

  // Block analytics fetch
  const fetchBlockAnalytics = async (blockId) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api';
      const response = await fetch(`${API_BASE_URL}/Analytics/block/${blockId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch block analytics: ${response.status}`);
      }
      
      const data = await response.json();
      setBlockAnalytics(data);
      setDetailPanelType('blockAnalytics');
      setShowDetailPanel(true);
    } catch (error) {
      console.error('Error fetching block analytics:', error);
      setToastMessage('Error fetching block data');
      setShowToast(true);
    }
  };

// Improved fetchContractorSummary function with proper caching

// Add this state variable to cache summaries
const [contractorSummaryCache, setContractorSummaryCache] = useState({});

// Improved fetch function
const fetchContractorSummary = async (contractorId) => {
  // Check if we already have this data in cache
  if (contractorSummaryCache[contractorId]) {
    console.log(`Using cached summary for contractor ${contractorId}`);
    setContractorSummary(contractorSummaryCache[contractorId]);
    return contractorSummaryCache[contractorId];
  }
  
  try {
    console.log(`Fetching contractor summary for ${contractorId}`);
    setLocalLoading(true);
    
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api';
    const response = await fetch(`${API_BASE_URL}/Analytics/contractor/${contractorId}/summary`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch contractor summary: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update the cache
    setContractorSummaryCache(prev => ({
      ...prev,
      [contractorId]: data
    }));
    
    // Set the current summary
    setContractorSummary(data);
    
    // Return the data for chaining
    return data;
  } catch (error) {
    console.error('Error fetching contractor summary:', error);
    setToastMessage('Error fetching contractor summary');
    setShowToast(true);
    return null;
  } finally {
    setLocalLoading(false);
  }
};

  // Associate stations with blocks
  const associateStationsWithBlocks = async () => {
    try {
      setAssociating(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api';
      const response = await fetch(`${API_BASE_URL}/Analytics/associate-stations-blocks`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to associate stations with blocks');
      }
      
      const result = await response.json();
      setToastMessage(result.message || 'Stations associated with blocks successfully');
      setShowToast(true);
      refreshData();
    } catch (error) {
      console.error('Error:', error);
      setToastMessage('Error associating stations with blocks');
      setShowToast(true);
    } finally {
      setAssociating(false);
    }
  };

  // Color function for block status
  const getBlockStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return '#059669';    // Green
      case 'pending': return '#d97706';   // Amber
      case 'inactive': return '#6b7280';  // Gray
      case 'reserved': return '#3b82f6';  // Blue
      default: return '#059669';          // Default green
    }
  };

  // Get stations from mapData
  const stations = mapData ? mapData.cruises.flatMap(c => c.stations || []) : [];
  
  // Get selected contractor/cruise
  const selectedContractor = mapData?.contractors.find(c => c.contractorId === selectedContractorId) || null;
  const selectedCruise = mapData?.cruises.find(c => c.cruiseId === selectedCruiseId) || null;

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
  };

  // Handle marker click
  const handleMarkerClick = (station) => {
    setSelectedStation(station);
    setDetailPanelType('station');
    setShowDetailPanel(true);
    
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
    
    // Don't reset these when closing the panel:
    // setSelectedContractorId(null);
    // setContractorSummary(null);
    
    // Only reset block analytics
    setBlockAnalytics(null);
  };
  
  // Also add a handler for the View Detailed Summary button
  const handleViewContractorSummary = () => {
    if (selectedContractorId && contractorSummary) {
      setDetailPanelType('contractorSummary');
      setShowDetailPanel(true);
    } else if (selectedContractorId) {
      // If we have the ID but no summary, fetch it first
      fetchContractorSummary(selectedContractorId).then(() => {
        setDetailPanelType('contractorSummary');
        setShowDetailPanel(true);
      });
    }
  };
  
  // Handle reset filters with smart zooming
  const handleResetFilters = () => {
    resetFilters();
    setUserHasSetView(false); // Allow auto-zooming after reset
    // The global view zoom will be handled by the smartZoom effect
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
  {showSummaryPanel && summaryData && (
  <SummaryPanel 
    data={summaryData} 
    onClose={() => setShowSummaryPanel(false)}
    selectedContractorInfo={selectedContractorInfo}
    contractorSummary={contractorSummary}
    onViewContractorSummary={handleViewContractorSummary}
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
        mapStyle={mapStyle}
        setMapStyle={setMapStyle}
        associateStationsWithBlocks={associateStationsWithBlocks}
        associating={associating}
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
        onError={(e) => console.error('Mapbox Error:', e)}
        onLoad={() => {
          console.log("Map successfully loaded!");
          window.mapInstance = mapRef.current?.getMap();
          
          // Initial view on first load
          if (mapRef.current && initialLoadRef.current) {
            initialLoadRef.current = false;
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
          Lat: {cursorPosition.latitude}, Lon: {cursorPosition.longitude}
        </div>

        {/* Areas + blocks */}
        {showAreas && visibleAreaLayers.map(area => (
          <React.Fragment key={`area-${area.areaId}`}>
            <Source id={`area-source-${area.areaId}`} type="geojson" data={area.geoJson}>
              <Layer
                id={`area-fill-${area.areaId}`}
                type="fill"
                paint={{
                  'fill-color': '#0077b6',
                  'fill-opacity': 0.15,
                }}
              />
              <Layer
                id={`area-line-${area.areaId}`}
                type="line"
                paint={{
                  'line-color': '#0077b6',
                  'line-width': 2.5,
                  'line-dasharray': [3, 2]
                }}
              />
              <Layer
                id={`area-label-${area.areaId}`}
                type="symbol"
                layout={{
                  'text-field': area.areaName,
                  'text-size': 12,
                  'text-anchor': 'center',
                  'text-offset': [0, 0],
                  'text-allow-overlap': false
                }}
                paint={{
                  'text-color': '#0077b6',
                  'text-halo-color': 'rgba(255, 255, 255, 0.9)',
                  'text-halo-width': 2
                }}
              />
            </Source>
            
            {showBlocks && area.blocks && area.blocks.map(block => (
              <Source 
                key={`block-source-${block.blockId}`}
                id={`block-source-${block.blockId}`}
                type="geojson" 
                data={block.geoJson}
              >
                <Layer
                  id={`block-fill-${block.blockId}`}
                  type="fill"
                  paint={{
                    'fill-color': getBlockStatusColor(block.status),
                    'fill-opacity': 0.25,
                  }}
                  onClick={() => fetchBlockAnalytics(block.blockId)}
                />
                <Layer
                  id={`block-line-${block.blockId}`}
                  type="line"
                  paint={{
                    'line-color': getBlockStatusColor(block.status),
                    'line-width': 1.5,
                  }}
                />
                <Layer
                  id={`block-label-${block.blockId}`}
                  type="symbol"
                  layout={{
                    'text-field': block.blockName,
                    'text-size': 10,
                    'text-anchor': 'center',
                    'text-offset': [0, 0],
                    'text-allow-overlap': false
                  }}
                  paint={{
                    'text-color': '#1e3a8a',
                    'text-halo-color': 'rgba(255, 255, 255, 0.9)',
                    'text-halo-width': 2
                  }}
                />
              </Source>
            ))}
          </React.Fragment>
        ))}
        
        {/* Stations */}
        {showStations && stations.map(station => (
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
              className={`${styles.mapMarker} ${station.contractorAreaBlockId ? styles.associatedMarker : ''}`}
            />
          </Marker>
        ))}

        {/* Loading overlay */}
        {(loading || localLoading) && (
          <div className={styles.mapLoadingOverlay}>
            <div className={styles.spinner}></div>
            <p>Loading map data...</p>
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