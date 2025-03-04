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
import { ImprovedFilterPanel } from "../filters/filterPanel";
import CompactLayerControls from "./layerControls";

const EnhancedMapComponent = () => {
  // Debug logging for Mapbox token
  useEffect(() => {
    console.log('Mapbox Token on mount:', process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
  }, []);

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
    latitude: 0,
    zoom: 1.0,
    bearing: 0,
    pitch: 0
  });

  const mapRef = useRef(null);
  
  // Make map instance available globally for search function
  useEffect(() => {
    if (mapRef.current) {
      window.mapInstance = mapRef.current.getMap();
    }
    
    return () => {
      window.mapInstance = null;
    };
  }, [mapRef.current]);
  
  // --- GeoJSON for areas/blocks ---
  const [areaLayers, setAreaLayers] = useState([]);
  
  const [selectedContractorInfo, setSelectedContractorInfo] = useState(null);

  const [blockAnalytics, setBlockAnalytics] = useState(null);
  const [contractorSummary, setContractorSummary] = useState(null);

  // --- Vis/skjul lag ---
  const [showAreas, setShowAreas] = useState(true);
  const [showBlocks, setShowBlocks] = useState(true);
  const [showStations, setShowStations] = useState(true);

  // --- Samme for "associate stations" ---
  const [associating, setAssociating] = useState(false);

  // --- Toast notification ---
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // --- Koordinater til musen ---
  const [cursorPosition, setCursorPosition] = useState({ latitude: 0, longitude: 0 });

  // --- Map Style state ---
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/outdoors-v11");

  // --- Hent GeoJSON ved valg av kontraktør ---
  useEffect(() => {
    if (selectedContractorId) {
      fetchGeoJsonForContractor(selectedContractorId);
    } else {
      setAreaLayers([]);
      setSelectedContractorInfo(null);
      
      // Return to world view when contractor is deselected
      if (mapRef.current) {
        mapRef.current.fitBounds(
          [[-180, -60], [180, 85]],
          { padding: 20, duration: 1500, easing: (t) => t * (2 - t) }
        );
      }
    }
  }, [selectedContractorId, mapData?.contractors]);
  
  // --- Lytt til filter for contractorId ---
  useEffect(() => {
    if (filters.contractorId && filters.contractorId !== selectedContractorId) {
      setSelectedContractorId(filters.contractorId);
    } else if (!filters.contractorId && selectedContractorId) {
      setSelectedContractorId(null);
    }
  }, [filters.contractorId, selectedContractorId, setSelectedContractorId]);

  const fetchGeoJsonForContractor = async (contractorId) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api';
      const response = await fetch(`${API_BASE_URL}/MapFilter/contractor-areas-geojson/${contractorId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch area data');
      }
      
      const areasData = await response.json();
      
      const formattedLayers = areasData.map((area) => ({
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
      
      setAreaLayers(formattedLayers);
      
      // Oppdater info-boks for contractor
      if (mapData?.contractors) {
        const contractor = mapData.contractors.find(c => c.contractorId === contractorId);
        if (contractor) {
          setSelectedContractorInfo({
            name: contractor.contractorName,
            totalAreas: formattedLayers.length,
            totalBlocks: formattedLayers.reduce((acc, area) => acc + area.blocks.length, 0)
          });
        }
      }
      
      // Auto-zoom til områdene
      if (formattedLayers.length > 0 && mapRef.current) {
        let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
        
        formattedLayers.forEach(area => {
          if (area.geoJson.geometry && area.geoJson.geometry.coordinates) {
            // For polygon-lag
            const coordinates = area.geoJson.geometry.coordinates[0];
            coordinates.forEach(([lon, lat]) => {
              minLon = Math.min(minLon, lon);
              maxLon = Math.max(maxLon, lon);
              minLat = Math.min(minLat, lat);
              maxLat = Math.max(maxLat, lat);
            });
          }
        });
        
        // Add padding for better view
        const pad = 1;
        
        mapRef.current.fitBounds(
          [[minLon - pad, minLat - pad], [maxLon + pad, maxLat + pad]],
          { padding: 40, duration: 1500, easing: (t) => t * (2 - t) }
        );
      }
    } catch (error) {
      console.error('Error loading GeoJSON data:', error);
    }
  };

  // --- Hent block analytics ---
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

  // --- Hent contractor summary ---
  const fetchContractorSummary = async (contractorId) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api';
      const response = await fetch(`${API_BASE_URL}/Analytics/contractor/${contractorId}/summary`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch contractor summary: ${response.status}`);
      }
      
      const data = await response.json();
      setContractorSummary(data);
      setDetailPanelType('contractorSummary');
      setShowDetailPanel(true);
    } catch (error) {
      console.error('Error fetching contractor summary:', error);
      setToastMessage('Error fetching contractor summary');
      setShowToast(true);
    }
  };

  // --- Koble stasjoner til blokker ---
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

  // --- Farge for block status ---
  const getBlockStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return '#4CAF50';
      case 'pending': return '#FFC107';
      case 'inactive': return '#9E9E9E';
      case 'reserved': return '#2196F3';
      default: return '#4CAF50';
    }
  };

  // --- Hent stasjoner fra mapData ---
  const stations = mapData
    ? mapData.cruises.flatMap(c => c.stations || [])
    : [];
  
  // --- Velg contractor/cruise i data ---
  const selectedContractor = mapData?.contractors.find(c => c.contractorId === selectedContractorId) || null;
  const selectedCruise = mapData?.cruises.find(c => c.cruiseId === selectedCruiseId) || null;

  // --- Oppdater viewState ved pan/zoom ---
  const handleViewStateChange = (evt) => {
    setViewState(evt.viewState);
  };

  // Reset map to default view
  const resetMapView = () => {
    if (mapRef.current) {
      mapRef.current.fitBounds(
        [[-180, -60], [180, 85]],
        { padding: 20, duration: 1500, easing: (t) => t * (2 - t) }
      );
    }
  };

  // --- Klikk på stasjonsmarkør -> sidepanel ---
  const handleMarkerClick = (station) => {
    setSelectedStation(station);
    setDetailPanelType('station');
    setShowDetailPanel(true);
    
    // Finn cruise
    if (mapData) {
      const cruise = mapData.cruises.find(c => 
        c.stations?.some(s => s.stationId === station.stationId)
      );
      if (cruise) {
        setSelectedCruiseId(cruise.cruiseId);
      }
    }
  };

  // --- Loading/error ---
  if (loading) {
    return <div className={styles.mapLoading}>Loading map data...</div>;
  }
  if (error) {
    return <div className={styles.mapError}>Error: {error}</div>;
  }

  return (
    <div className={styles.mapContainer}>
      {/* Contractor info box */}
      {selectedContractorInfo && (
        <div className={styles.contractorInfoBox}>
          <h3>{selectedContractorInfo.name}</h3>
          <div className={styles.contractorStats}>
            <span>{selectedContractorInfo.totalAreas} area{selectedContractorInfo.totalAreas !== 1 ? 's' : ''}</span>
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
          // Only fit to world bounds if no contractor is selected
          if (mapRef.current && !selectedContractorId) {
            mapRef.current.fitBounds(
              [[-180, -60], [180, 85]],
              {  padding: 20, duration: 1500, easing: (t) => t * (2 - t) }
            );
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
        {showAreas && areaLayers.map(area => (
          <React.Fragment key={`area-${area.areaId}`}>
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
              style={{ 
                backgroundColor: station.contractorAreaBlockId ? '#4CAF50' : '#2196F3',
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

        {/* Popup for selected station (if sidebar not open) */}
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
      
      {/* Detail panels */}
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