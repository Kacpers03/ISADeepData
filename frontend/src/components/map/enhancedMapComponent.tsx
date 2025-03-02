import React, { useState, useEffect, useRef } from "react";
import Map, { NavigationControl, Marker, Popup, Source, Layer, ViewStateChangeEvent } from "react-map-gl";
import { useFilter } from "../../contexts/filterContext";
import styles from "../../styles/map/map.module.css";
import { DetailPanel } from "./detailPanel";
import { Station, Contractor, Cruise, GeoJsonFeature } from "../../types/filter-types";

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
    filters
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
    blocks: Array<{
      blockId: number;
      blockName: string;
      geoJson: GeoJsonFeature;
      status: string;
    }>
  }[]>([]);
  
  // State for showing contractor info label
  const [selectedContractorInfo, setSelectedContractorInfo] = useState<{
    name: string;
    totalAreas: number;
    totalBlocks: number;
  } | null>(null);
  
  // Fetch GeoJSON data when a contractor is selected
  useEffect(() => {
    if (selectedContractorId) {
      const fetchGeoJson = async () => {
        try {
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api';
          const response = await fetch(`${API_BASE_URL}/MapFilter/contractor-areas-geojson/${selectedContractorId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch area data');
          }
          
          const areasData = await response.json();
          
          const formattedLayers = areasData.map((area: any) => ({
            areaId: area.areaId,
            areaName: area.areaName,
            geoJson: JSON.parse(area.geoJson),
            blocks: area.blocks.map((block: any) => ({
              blockId: block.blockId,
              blockName: block.blockName,
              status: block.status,
              geoJson: JSON.parse(block.geoJson)
            }))
          }));
          
          setAreaLayers(formattedLayers);
          
          // Set contractor info for the label
          if (mapData?.contractors) {
            const contractor = mapData.contractors.find(c => c.contractorId === selectedContractorId);
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
      
      fetchGeoJson();
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
      {/* Selected Contractor Info Box */}
      {selectedContractorInfo && (
        <div className={styles.contractorInfoBox}>
          <h3>{selectedContractorInfo.name}</h3>
          <div className={styles.contractorStats}>
            <span>{selectedContractorInfo.totalAreas} exploration area{selectedContractorInfo.totalAreas !== 1 ? 's' : ''}</span>
            <span>{selectedContractorInfo.totalBlocks} block{selectedContractorInfo.totalBlocks !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
      
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
        
        {/* Visualization of areas and blocks */}
        {areaLayers.map(area => (
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
            {area.blocks.map(block => (
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
                    'fill-color': '#4CAF50',
                    'fill-opacity': 0.4,
                  }}
                />
                <Layer
                  id={`block-line-${block.blockId}`}
                  type="line"
                  paint={{
                    'line-color': '#4CAF50',
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
                backgroundColor: '#2196F3',
                width: `30px`,
                height: `30px`
              }}
            >
              <div className={styles.markerPulse} 
                style={{ 
                  borderColor: '#2196F3'
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
      
      {/* Viewport Filter Button */}
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