import React, { useState, useEffect, useRef } from "react";
import Map, { 
  NavigationControl, 
  Marker, 
  Popup, 
  Source, 
  Layer,
  ViewStateChangeEvent 
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useFilter } from "../../contexts/filterContext";
import styles from "../../styles/map/map.module.css";
import { DetailPanel } from "./detailPanel";
import { BlockAnalyticsPanel } from "./blockAnalyticsPanel";
import { ContractorSummaryPanel } from "./contractorSummaryPanel";
import { Station, Contractor, Cruise, GeoJsonFeature } from "../../types/filter-types";

const EnhancedMapComponent: React.FC = () => {
  // Debug logging for Mapbox token
  useEffect(() => {
    console.log('Mapbox Token on mount:', process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
  }, []);
  
  console.log("Mapbox Token during render:", process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

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
    refreshData
  } = useFilter();

  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 1.5,
  });

  const mapRef = useRef(null);
  
  // State for GeoJSON layers
  const [areaLayers, setAreaLayers] = useState<{ 
    areaId: number;
    areaName: string;
    geoJson: GeoJsonFeature;
    centerLatitude: number;
    centerLongitude: number; 
    totalAreaSizeKm2: number;
    blocks: Array<{
      blockId: number;
      blockName: string;
      geoJson: GeoJsonFeature;
      status: string;
      centerLatitude: number;
      centerLongitude: number;
      areaSizeKm2: number;
    }>
  }[]>([]);
  
  // State for showing contractor info label
  const [selectedContractorInfo, setSelectedContractorInfo] = useState<{
    name: string;
    totalAreas: number;
    totalBlocks: number;
  } | null>(null);

  // State for block analytics
  const [blockAnalytics, setBlockAnalytics] = useState(null);
  
  // State for contractor summary
  const [contractorSummary, setContractorSummary] = useState(null);
  
  // State for layer visibility
  const [showAreas, setShowAreas] = useState(true);
  const [showBlocks, setShowBlocks] = useState(true);
  const [showStations, setShowStations] = useState(true);
  
  // State for associating stations with blocks
  const [associating, setAssociating] = useState(false);
  
  // State for toast notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // State for cursor coordinates
  const [cursorPosition, setCursorPosition] = useState({ latitude: 0, longitude: 0 });
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Fetch GeoJSON data when a contractor is selected
  useEffect(() => {
    if (selectedContractorId) {
      fetchGeoJsonForContractor(selectedContractorId);
    } else {
      setAreaLayers([]);
      setSelectedContractorInfo(null);
    }
  }, [selectedContractorId, mapData?.contractors]);
  
  // Monitor filter changes to update selectedContractorId
  useEffect(() => {
    if (filters.contractorId && filters.contractorId !== selectedContractorId) {
      setSelectedContractorId(filters.contractorId);
    } else if (!filters.contractorId && selectedContractorId) {
      setSelectedContractorId(null);
    }
  }, [filters.contractorId, setSelectedContractorId, selectedContractorId]);
  
  // Function to fetch GeoJSON data for a contractor
  const fetchGeoJsonForContractor = async (contractorId: number) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api';
      const response = await fetch(`${API_BASE_URL}/MapFilter/contractor-areas-geojson/${contractorId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch area data');
      }
      
      const areasData = await response.json();
      
      const formattedLayers = areasData.map((area: any) => ({
        areaId: area.areaId,
        areaName: area.areaName,
        geoJson: typeof area.geoJson === 'string' ? JSON.parse(area.geoJson) : area.geoJson,
        centerLatitude: area.centerLat,
        centerLongitude: area.centerLon,
        totalAreaSizeKm2: area.totalAreaSizeKm2,
        blocks: area.blocks.map((block: any) => ({
          blockId: block.blockId,
          blockName: block.blockName,
          status: block.status,
          geoJson: typeof block.geoJson === 'string' ? JSON.parse(block.geoJson) : block.geoJson,
          centerLatitude: block.centerLat,
          centerLongitude: block.centerLon,
          areaSizeKm2: block.areaSizeKm2
        }))
      }));
      
      setAreaLayers(formattedLayers);
      
      // Set contractor info for the label
      if (mapData?.contractors) {
        const contractor = mapData.contractors.find(c => c.contractorId === contractorId);
        if (contractor) {
          setSelectedContractorInfo({
            name: contractor.contractorName,
            totalAreas: formattedLayers.length,
            totalBlocks: formattedLayers.reduce((total, area) => total + area.blocks.length, 0)
          });
        }
      }
      
      // Auto-zoom to the contractor's areas if we have data
      if (formattedLayers.length > 0 && mapRef.current) {
        // Calculate bounds for all areas
        let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
        
        formattedLayers.forEach(area => {
          if (area.geoJson.geometry && area.geoJson.geometry.coordinates) {
            // For polygon geometries
            const coordinates = area.geoJson.geometry.coordinates[0];
            coordinates.forEach(coord => {
              const [lon, lat] = coord;
              minLon = Math.min(minLon, lon);
              maxLon = Math.max(maxLon, lon);
              minLat = Math.min(minLat, lat);
              maxLat = Math.max(maxLat, lat);
            });
          }
        });
        
        // Add some padding
        const pad = 1; // degrees
        const map = mapRef.current;
        
        // Fit bounds with padding
        map.fitBounds(
          [[minLon - pad, minLat - pad], [maxLon + pad, maxLat + pad]],
          { padding: 40, duration: 1000 }
        );
      }
    } catch (error) {
      console.error('Error loading GeoJSON data:', error);
    }
  };
  
  // Fetch block analytics data
  const fetchBlockAnalytics = async (blockId: number) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api';
      const response = await fetch(`${API_BASE_URL}/Analytics/block/${blockId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch block analytics: ${response.status}`);
      }
      
      const data = await response.json();
      setBlockAnalytics(data);
      
      // Open analytics panel with the data
      setDetailPanelType('blockAnalytics');
      setShowDetailPanel(true);
    } catch (error) {
      console.error('Error fetching block analytics:', error);
      setToastMessage('Error fetching block data');
      setShowToast(true);
    }
  };
  
  // Fetch contractor summary data
  const fetchContractorSummary = async (contractorId: number) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api';
      const response = await fetch(`${API_BASE_URL}/Analytics/contractor/${contractorId}/summary`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch contractor summary: ${response.status}`);
      }
      
      const data = await response.json();
      setContractorSummary(data);
      
      // Open summary panel with the data
      setDetailPanelType('contractorSummary');
      setShowDetailPanel(true);
    } catch (error) {
      console.error('Error fetching contractor summary:', error);
      setToastMessage('Error fetching contractor summary');
      setShowToast(true);
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
      
      // Show success message
      setToastMessage(result.message);
      setShowToast(true);
      
      // Refresh data
      refreshData();
    } catch (error) {
      console.error('Error:', error);
      setToastMessage('Error associating stations with blocks');
      setShowToast(true);
    } finally {
      setAssociating(false);
    }
  };
  
  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    
    // Search blocks
    const matchingBlocks = [];
    areaLayers.forEach(area => {
      area.blocks.forEach(block => {
        if (block.blockName.toLowerCase().includes(query)) {
          matchingBlocks.push({
            type: 'block',
            id: block.blockId,
            name: block.blockName,
            parent: area.areaName,
            centerLatitude: block.centerLatitude,
            centerLongitude: block.centerLongitude
          });
        }
      });
    });
    
    // Search stations
    const matchingStations = stations.filter(station => 
      station.stationCode.toLowerCase().includes(query)
    ).map(station => ({
      type: 'station',
      id: station.stationId,
      name: station.stationCode,
      latitude: station.latitude,
      longitude: station.longitude
    }));
    
    setSearchResults([...matchingBlocks, ...matchingStations]);
  };
  
  // Function to get color based on block status
  const getBlockStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active': return '#4CAF50';  // Green
      case 'pending': return '#FFC107'; // Yellow
      case 'inactive': return '#9E9E9E'; // Gray
      case 'reserved': return '#2196F3'; // Blue
      default: return '#4CAF50';
    }
  };
  
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
  };
  
  // Apply viewport filter
  const applyViewportFilter = () => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      
      // Update filter with current map bounds
      setFilter('minLat', bounds.getSouth());
      setFilter('maxLat', bounds.getNorth());
      setFilter('minLon', bounds.getWest());
      setFilter('maxLon', bounds.getEast());
      
      // Show toast notification
      setToastMessage('Map view filter applied');
      setShowToast(true);
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
      {/* Selected Contractor Info Box */}
      {selectedContractorInfo && (
        <div className={styles.contractorInfoBox}>
          <h3>{selectedContractorInfo.name}</h3>
          <div className={styles.contractorStats}>
            <span>{selectedContractorInfo.totalAreas} exploration area{selectedContractorInfo.totalAreas !== 1 ? 's' : ''}</span>
            <span>{selectedContractorInfo.totalBlocks} block{selectedContractorInfo.totalBlocks !== 1 ? 's' : ''}</span>
          </div>
          <button 
            className={styles.summaryButton}
            onClick={() => selectedContractorId && fetchContractorSummary(selectedContractorId)}
          >
            View Full Summary
          </button>
        </div>
      )}
      
      {/* Search Box */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search stations and blocks..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSearch()}
          className={styles.searchInput}
        />
        <button 
          onClick={handleSearch}
          className={styles.searchButton}
        >
          Search
        </button>
      </div>
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className={styles.searchResults}>
          <div className={styles.searchResultsHeader}>
            <h4>Search Results ({searchResults.length})</h4>
            <button 
              onClick={() => setSearchResults([])}
              className={styles.closeResultsButton}
            >
              ×
            </button>
          </div>
          <ul className={styles.resultsList}>
            {searchResults.map(result => (
              <li 
                key={`${result.type}-${result.id}`}
                onClick={() => {
                  // Fly to result location
                  if (mapRef.current) {
                    mapRef.current.flyTo({
                      center: [
                        result.type === 'block' ? result.centerLongitude : result.longitude,
                        result.type === 'block' ? result.centerLatitude : result.latitude
                      ],
                      zoom: result.type === 'block' ? 8 : 10
                    });
                  }
                  // Close search results
                  setSearchResults([]);
                }}
                className={styles.resultItem}
              >
                <span className={`${styles.resultType} ${styles[`resultType${result.type}`]}`}>
                  {result.type}
                </span>
                <span className={styles.resultName}>{result.name}</span>
                {result.parent && (
                  <span className={styles.resultParent}>in {result.parent}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Layer Controls */}
      <div className={styles.layerControls}>
        <div className={styles.layerControlsHeader}>
          <h4>Map Layers</h4>
        </div>
        <div className={styles.layerToggle}>
          <label>
            <input
              type="checkbox"
              checked={showAreas}
              onChange={() => setShowAreas(!showAreas)}
            />
            Areas
          </label>
        </div>
        <div className={styles.layerToggle}>
          <label>
            <input
              type="checkbox"
              checked={showBlocks}
              onChange={() => setShowBlocks(!showBlocks)}
            />
            Blocks
          </label>
        </div>
        <div className={styles.layerToggle}>
          <label>
            <input
              type="checkbox"
              checked={showStations}
              onChange={() => setShowStations(!showStations)}
            />
            Stations
          </label>
        </div>
        <button 
          className={styles.associateButton}
          onClick={associateStationsWithBlocks}
          disabled={associating}
        >
          {associating ? 'Processing...' : 'Associate Stations with Blocks'}
        </button>
      </div>
      
      {/* Main Map */}
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
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken="pk.eyJ1IjoiaGFzc2FuMjMwNSIsImEiOiJjbGg4em9ieHcwY2FiM2ZvY2s5ZTZ1aDVjIn0.Pv-if4_gkFEUq98oc07Xyw"
        onError={(e) => console.error('Mapbox Error:', e)}
        onLoad={() => console.log("Map successfully loaded!")}
      >
        <NavigationControl position="top-right" showCompass={true} />
        
        {/* Coordinate Display */}
        <div className={styles.coordinateDisplay}>
          Lat: {cursorPosition.latitude}, Lon: {cursorPosition.longitude}
        </div>
        
        {/* Legend */}
        <div className={styles.mapLegend}>
          <h3>Block Status</h3>
          <div className={styles.legendItems}>
            <div className={styles.legendItem}>
              <span className={styles.legendMarker} style={{ backgroundColor: '#4CAF50' }}></span>
              <span>Active</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendMarker} style={{ backgroundColor: '#FFC107' }}></span>
              <span>Pending</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendMarker} style={{ backgroundColor: '#9E9E9E' }}></span>
              <span>Inactive</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendMarker} style={{ backgroundColor: '#2196F3' }}></span>
              <span>Reserved</span>
            </div>
          </div>
          <hr className={styles.legendDivider} />
          <div className={styles.legendItems}>
            <div className={styles.legendItem}>
              <span className={styles.stationMarker}></span>
              <span>Station</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.associatedStationMarker}></span>
              <span>Associated Station</span>
            </div>
          </div>
        </div>
        
        {/* Visualization of areas and blocks */}
        {showAreas && areaLayers.map(area => (
          <React.Fragment key={`area-${area.areaId}`}>
            {/* Draw the area as polygon */}
            <Source id={`area-source-${area.areaId}`} type="geojson" data={area.geoJson}>
              <Layer
                id={`area-fill-${area.areaId}`}
                type="fill"
                paint={{
                  'fill-color': '#0277bd',
                  'fill-opacity': 0.2,
                }}
              />
              <Layer
                id={`area-line-${area.areaId}`}
                type="line"
                paint={{
                  'line-color': '#0277bd',
                  'line-width': 2,
                  'line-dasharray': [3, 2]
                }}
              />
              {/* Add area label */}
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
                  'text-color': '#0277bd',
                  'text-halo-color': 'rgba(255, 255, 255, 0.8)',
                  'text-halo-width': 1.5
                }}
              />
            </Source>
            
            {/* Draw the blocks with status-dependent colors */}
            {showBlocks && area.blocks.map(block => (
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
                    'fill-opacity': 0.4,
                  }}
                  onClick={() => fetchBlockAnalytics(block.blockId)}
                />
                <Layer
                  id={`block-line-${block.blockId}`}
                  type="line"
                  paint={{
                    'line-color': getBlockStatusColor(block.status),
                    'line-width': 1,
                  }}
                />
                {/* Add block label */}
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
                    'text-color': '#006400',
                    'text-halo-color': 'rgba(255, 255, 255, 0.8)',
                    'text-halo-width': 1.5
                  }}
                />
              </Source>
            ))}
          </React.Fragment>
        ))}
        
        {/* Markers for each station */}
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
              style={{ 
                backgroundColor: station.contractorAreaBlockId ? '#4CAF50' : '#2196F3',
                width: `30px`,
                height: `30px`
              }}
            >
              <div className={styles.markerPulse} 
                style={{ 
                  borderColor: station.contractorAreaBlockId ? '#4CAF50' : '#2196F3'
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
      {showDetailPanel && detailPanelType === 'station' && (
        <DetailPanel
          type={'station'}
          station={selectedStation}
          contractor={null}
          cruise={null}
          onClose={() => {
            setShowDetailPanel(false);
            setDetailPanelType(null);
          }}
        />
      )}
      
      {showDetailPanel && detailPanelType === 'contractor' && (
        <DetailPanel
          type={'contractor'}
          station={null}
          contractor={selectedContractor}
          cruise={null}
          onClose={() => {
            setShowDetailPanel(false);
            setDetailPanelType(null);
          }}
        />
      )}
      
      {showDetailPanel && detailPanelType === 'cruise' && (
        <DetailPanel
          type={'cruise'}
          station={null}
          contractor={null}
          cruise={selectedCruise}
          onClose={() => {
            setShowDetailPanel(false);
            setDetailPanelType(null);
          }}
        />
      )}
      
      {showDetailPanel && detailPanelType === 'blockAnalytics' && blockAnalytics && (
        <BlockAnalyticsPanel
          data={blockAnalytics}
          onClose={() => {
            setShowDetailPanel(false);
            setDetailPanelType(null);
            setBlockAnalytics(null);
          }}
        />
      )}
      
      {showDetailPanel && detailPanelType === 'contractorSummary' && contractorSummary && (
        <ContractorSummaryPanel
          data={contractorSummary}
          onClose={() => {
            setShowDetailPanel(false);
            setDetailPanelType(null);
            setContractorSummary(null);
          }}
        />
      )}
      
      {/* Toast Notification */}
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
      
      {/* Viewport Filter Button */}
      <button
        className={styles.viewportFilterButton}
        onClick={applyViewportFilter}
        disabled={loading}
      >
        {loading ? 'Filtering...' : 'Filter by Current View'}
      </button>
    </div>
  );
};

export default EnhancedMapComponent;