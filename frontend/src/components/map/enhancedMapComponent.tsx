import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Map, { 
  NavigationControl, 
  Popup, 
  Source, 
  Layer,
  ViewStateChangeEvent 
} from 'react-map-gl';
import Supercluster from 'supercluster';

import ClusterMarker from './clusterMarker';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useFilter } from "../../contexts/filterContext";
import styles from "../../styles/map/map.module.css";
import { DetailPanel } from "./detailPanel";
import { BlockAnalyticsPanel } from "./blockAnalyticsPanel";
import { ContractorSummaryPanel } from "./contractorSummaryPanel";
import CompactLayerControls from "./layerControls";
import SummaryPanel from "./summaryPanel";
import CruiseMarker from './cruiseMarker';
import StationMarker from "./stationMarker";
import { getLocationBoundaryById } from '../../constants/locationBoundaries';

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
    latitude: 20, // Adjusted position
    zoom: 1.8,    // Better zoom level to match your Image 2
    bearing: 0,
    pitch: 0
  });
  // Reference to maintain current view state across rerenders
  const mapRef = useRef(null);
  const initialLoadRef = useRef(true);
  const [localLoading, setLocalLoading] = useState(false);
  // Default to true to ensure cruises are always visible
  const [showCruises, setShowCruises] = useState(true);

  // User has manually set the view (to prevent auto-zooming when unwanted)
  const [userHasSetView, setUserHasSetView] = useState(false);
  
  // Popup state
  const [popupInfo, setPopupInfo] = useState(null);
  
  // Store all loaded GeoJSON data
  const [allAreaLayers, setAllAreaLayers] = useState([]);
  
  // Layer visibility controls
  const [showAreas, setShowAreas] = useState(true);
  const [showBlocks, setShowBlocks] = useState(true);
  const [showStations, setShowStations] = useState(true);
  
  // Other UI state variables
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ latitude: 0, longitude: 0 });
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/outdoors-v11");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Summary panel state
  const [showSummaryPanel, setShowSummaryPanel] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  
  // Additional state for analytics
  const [selectedContractorInfo, setSelectedContractorInfo] = useState(null);
  const [blockAnalytics, setBlockAnalytics] = useState(null);
  const [contractorSummary, setContractorSummary] = useState(null);
  const [clusterIndex, setClusterIndex] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [clusterZoom, setClusterZoom] = useState(viewState.zoom);
  const [hoveredBlockId, setHoveredBlockId] = useState(null);

  // Smart zoom function - will be called when a new contractor is selected or filters are reset
  const [pendingZoomContractorId, setPendingZoomContractorId] = useState(null);
  
  // Contractor summary cache
  const [contractorSummaryCache, setContractorSummaryCache] = useState({});
  
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
  
  // Get appropriate icon based on station type
  const getBlockStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#059669';    // Green
      case 'pending': return '#d97706';   // Amber
      case 'inactive': return '#6b7280';  // Gray
      case 'reserved': return '#3b82f6';  // Blue
      default: return '#059669';          // Default green
    }
  };
  
  // Dynamically set layer paint properties based on zoom level
  const getAreaPaint = useMemo(() => ({
    'fill-color': '#0077b6',
    'fill-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      2, 0.08,   // Less opacity when zoomed out
      6, 0.15    // More opacity when zoomed in
    ],
    'fill-outline-color': '#0077b6'
  }), []);
  
  const getAreaLinePaint = useMemo(() => ({
    'line-color': '#0077b6',
    'line-width': [
      'interpolate',
      ['linear'],
      ['zoom'],
      2, 1.5,    // Thinner line when zoomed out
      6, 2.5     // Thicker line when zoomed in
    ],
    'line-dasharray': [3, 2]
  }), []);
  
  // Smart zoom function to be more robust
 // Complete smartZoom function with location filtering support
// Import the location utilities at the top of your file:
// import { getLocationBoundaryById } from '../constants/locationBoundaries';

const smartZoom = useCallback(() => {
  if (!mapRef.current) return;
  
  // If a location is selected, prioritize zooming to that location
  if (filters.locationId && filters.locationId !== 'all') {
    const locationBoundary = getLocationBoundaryById(filters.locationId);
    
    if (locationBoundary) {
      // Create a bounds object for the location
      const bounds = [
        [locationBoundary.bounds.minLon, locationBoundary.bounds.minLat], 
        [locationBoundary.bounds.maxLon, locationBoundary.bounds.maxLat]
      ];
      
      // Fit the map to these bounds with some padding
      mapRef.current.fitBounds(
        bounds as [[number, number], [number, number]],
        { padding: 80, duration: 1000 }
      );
      
      console.log(`Smart zoomed to location: ${locationBoundary.name}`);
      return; // Exit early since we've already zoomed
    }
  }
  
  // If a specific contractor is selected, always zoom to their areas regardless of userHasSetView
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
        const pad = 2; // Increased padding for a better view
        
        mapRef.current.fitBounds(
          [[minLon - pad, minLat - pad], [maxLon + pad, maxLat + pad]],
          { padding: 80, duration: 1000, maxZoom: 8 } // Added more padding and reduced maxZoom
        );
        
        console.log("Smart zoomed to contractor areas");
        
        // Clear pending zoom since we've successfully zoomed
        if (pendingZoomContractorId === selectedContractorId) {
          setPendingZoomContractorId(null);
          setLocalLoading(false);
        }
        
        return;
      }
    } else if (pendingZoomContractorId !== selectedContractorId) {
      // If we couldn't find any areas for this contractor, set it as pending
      // This will trigger another zoom attempt when the areas are loaded
      console.log(`Setting pending zoom for contractor ${selectedContractorId}`);
      setPendingZoomContractorId(selectedContractorId);
    }
  }
  
  // Only reset to world view if no specific filters and user hasn't manually set view
  // OR if filters have been completely reset
  if ((Object.keys(filters).length === 0 && !selectedContractorId) || !userHasSetView) {
    mapRef.current.fitBounds(
      [[-180, -60], [180, 85]],
      { padding: 20, duration: 1000 }
    );
    console.log("Reset to world view");
  }
}, [selectedContractorId, allAreaLayers, filters, userHasSetView, pendingZoomContractorId, filters.locationId]);
  
const getAllStations = useCallback(() => {
  if (!mapData) return [];
  
  // When no filters are applied, show ALL stations
  if (Object.keys(filters).length === 0) {
    return mapData.cruises.flatMap(c => c.stations || []);
  }
  
  // Get contractors that match current filters
  const filteredContractorIds = mapData.contractors.map(c => c.contractorId);
  
  // Only get stations from cruises that belong to filtered contractors
  return mapData.cruises
    .filter(cruise => {
      // Only include cruises from contractors that match the filter
      return filteredContractorIds.includes(cruise.contractorId);
    })
    .flatMap(c => c.stations || []);
}, [mapData, filters]);

// Cluster functionality for stations - IMPROVED to respect filters
useEffect(() => {
  if (!mapData || !mapData.cruises) return;
  
  // Important: Use getAllStations to get only filtered stations
  const stationsData = getAllStations();
  
  if (!stationsData.length) {
    // If no stations match filters, we should empty the cluster
    setClusters([]);
    return;
  }
  
  const supercluster = new Supercluster({
    radius: 40,
    maxZoom: 16
  });
  
  // Format points for supercluster
  const points = stationsData.map(station => ({
    type: 'Feature',
    properties: { 
      stationId: station.stationId,
      stationData: station 
    },
    geometry: {
      type: 'Point',
      coordinates: [station.longitude, station.latitude]
    }
  }));
  
  supercluster.load(points);
  setClusterIndex(supercluster);
  
  // Important: When filtering changes, immediately update the clusters
  if (mapRef.current) {
    const map = mapRef.current.getMap();
    const zoom = Math.round(map.getZoom());
    const bounds = map.getBounds();
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth()
    ];
    
    try {
      const clusterData = supercluster.getClusters(bbox, Math.floor(zoom));
      setClusters(clusterData);
    } catch (err) {
      console.warn('Error getting clusters after filter:', err.message);
      setClusters([]);
    }
  }
}, [mapData, filters]); // Add filters dependency to ensure reclustering on filter changes
  
  // New function to handle zooming to a specific area
  const zoomToArea = useCallback((area) => {
    if (!mapRef.current || !area) return;
    
    if (area.geoJson && area.geoJson.geometry && area.geoJson.geometry.coordinates) {
      // For polygon types, calculate bounds
      const coordinates = area.geoJson.geometry.coordinates[0];
      let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
      
      coordinates.forEach(([lon, lat]) => {
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      });
      
      const pad = 1; // Reasonable padding
      mapRef.current.fitBounds(
        [[minLon - pad, minLat - pad], [maxLon + pad, maxLat + pad]],
        { padding: 60, duration: 1000, maxZoom: 9 }
      );
      console.log("Zoomed to area:", area.areaName);
    } else if (area.centerLatitude && area.centerLongitude) {
      // Fallback to center coordinates
      mapRef.current.flyTo({
        center: [area.centerLongitude, area.centerLatitude],
        zoom: 7,
        duration: 1000
      });
      console.log("Zoomed to area center:", area.areaName);
    }
  }, []);

  // New function to handle zooming to a specific block
  const zoomToBlock = useCallback((block) => {
    if (!mapRef.current || !block) return;
    
    if (block.geoJson && block.geoJson.geometry && block.geoJson.geometry.coordinates) {
      // For polygon types, calculate bounds
      const coordinates = block.geoJson.geometry.coordinates[0];
      let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
      
      coordinates.forEach(([lon, lat]) => {
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      });
      
      const pad = 0.5; // Smaller padding for blocks
      mapRef.current.fitBounds(
        [[minLon - pad, minLat - pad], [maxLon + pad, maxLat + pad]],
        { padding: 60, duration: 1000, maxZoom: 10 }
      );
      console.log("Zoomed to block:", block.blockName);
    } else if (block.centerLatitude && block.centerLongitude) {
      // Fallback to center coordinates
      mapRef.current.flyTo({
        center: [block.centerLongitude, block.centerLatitude],
        zoom: 9,
        duration: 1000
      });
      console.log("Zoomed to block center:", block.blockName);
    }
  }, []);

  // New function to handle zooming to a specific cruise
  const zoomToCruise = useCallback((cruise) => {
    if (!mapRef.current || !cruise) return;
    
    // When zooming to a cruise, make sure cruises are visible
    setShowCruises(true);
    
    // Use the first station of the cruise for positioning if available
    if (cruise.stations && cruise.stations.length > 0) {
      const firstStation = cruise.stations[0];
      mapRef.current.flyTo({
        center: [firstStation.longitude, firstStation.latitude],
        zoom: 8,
        duration: 1000
      });
      console.log("Zoomed to first station of cruise:", cruise.cruiseName);
    } else if (cruise.centerLatitude && cruise.centerLongitude) {
      // Fallback to cruise center coordinates if available
      mapRef.current.flyTo({
        center: [cruise.centerLongitude, cruise.centerLatitude],
        zoom: 8,
        duration: 1000
      });
      console.log("Zoomed to cruise center:", cruise.cruiseName);
    } else {
      // If all else fails, try to find the contractor and zoom to their area
      if (cruise.contractorId && mapData) {
        const contractor = mapData.contractors.find(c => c.contractorId === cruise.contractorId);
        if (contractor && contractor.areas && contractor.areas.length > 0) {
          const area = contractor.areas[0];
          if (area.centerLatitude && area.centerLongitude) {
            mapRef.current.flyTo({
              center: [area.centerLongitude, area.centerLatitude],
              zoom: 7,
              duration: 1000
            });
            console.log("Zoomed to contractor area for cruise:", cruise.cruiseName);
          }
        }
      }
    }
  }, [mapData]);

  // Load all visible contractors' GeoJSON
  const loadAllVisibleContractors = useCallback(async () => {
    if (!mapData?.contractors.length) return;
    
    // Prevent loading if we're already loading
    if (loading || localLoading) {
      console.log("Already loading data, skipping redundant load");
      return;
    }
    
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
      
      // Only update if we got new data to prevent unnecessary re-renders
      if (allAreas.length > 0) {
        setAllAreaLayers(prevLayers => {
          // If layers are identical, don't update
          if (prevLayers.length === allAreas.length && 
              JSON.stringify(prevLayers.map(a => a.areaId).sort()) === 
              JSON.stringify(allAreas.map(a => a.areaId).sort())) {
            return prevLayers;
          }
          return allAreas;
        });
      }
      
      // Check if we have a pending zoom that needs to be applied after loading
      if (pendingZoomContractorId && mapRef.current) {
        console.log(`Areas loaded, executing pending zoom for contractor ${pendingZoomContractorId}`);
        // Small delay to ensure the map has updated with the new data
        setTimeout(() => smartZoom(), 100);
      }
    } catch (error) {
      console.error('Error loading all contractor GeoJSON:', error);
    } finally {
      setLocalLoading(false);
    }
  }, [mapData?.contractors, fetchContractorGeoJson, pendingZoomContractorId, smartZoom, loading, localLoading]);

  // Fetch contractor summary
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
      
      // Find the block and zoom to it
      const block = visibleAreaLayers.flatMap(area => area.blocks || [])
        .find(b => b.blockId === blockId);
        
      if (block) {
        zoomToBlock(block);
      }
      
    } catch (error) {
      console.error('Error fetching block analytics:', error);
      setToastMessage('Error fetching block data');
      setShowToast(true);
    }
  };

  // Get all stations
  const stations = getAllStations();
  
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

  // Add this near other useEffect hooks - especially after the one that zooms to cruises
useEffect(() => {
  if (selectedCruiseId) {
    // Always ensure cruises are visible when a cruise is selected
    setShowCruises(true);
    console.log("Cruise selected, ensuring cruise markers are visible");
  }
}, [selectedCruiseId]);
  useEffect(() => {
    // Zoom to selected location boundary if a location filter is applied
    if (mapRef.current && filters.locationId && filters.locationId !== 'all') {
      const locationBoundary = getLocationBoundaryById(filters.locationId);
      
      if (locationBoundary) {
        // Create a bounds object for the location
        const bounds = [
          [locationBoundary.bounds.minLon, locationBoundary.bounds.minLat], 
          [locationBoundary.bounds.maxLon, locationBoundary.bounds.maxLat]
        ];
        
        // Fit the map to these bounds with some padding
        mapRef.current.fitBounds(
          bounds as [[number, number], [number, number]],
          { padding: 80, duration: 1000 }
        );
        
        console.log(`Zoomed map to location: ${locationBoundary.name}`);
      }
    }
  }, [filters.locationId]);
  // Effect for pendingZoom
  useEffect(() => {
    if (pendingZoomContractorId && allAreaLayers.length > 0) {
      console.log(`Attempting pending zoom for contractor ${pendingZoomContractorId}`);
      smartZoom();
    }
  }, [allAreaLayers, pendingZoomContractorId, smartZoom]);
  
  const handleContractorSelect = useCallback((contractorId) => {
    setSelectedContractorId(contractorId);
    setUserHasSetView(false); // Allow zooming to the selected contractor
    
    // If contractor data isn't loaded yet, set pending zoom
    if (contractorId && allAreaLayers.length > 0) {
      const hasAreas = allAreaLayers.some(area => area.contractorId === contractorId);
      if (!hasAreas) {
        setPendingZoomContractorId(contractorId);
      }
    }
  }, [setSelectedContractorId, allAreaLayers]);

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
  
  const handleCruiseClick = (cruise) => {
    console.log("Cruise clicked:", cruise.cruiseName);
    setSelectedCruiseId(cruise.cruiseId);
    setDetailPanelType('cruise');
    setShowDetailPanel(true);
    setPopupInfo(null); // Close any open popups
    
    // Make sure cruises stay visible and zoom to the cruise
    setShowCruises(true);
    zoomToCruise(cruise);
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
      fetchContractorSummary(selectedContractorId).then((summary) => {
        if (summary) {
          setDetailPanelType('contractorSummary');
          setShowDetailPanel(true);
        }
      });
    }
  }, [selectedContractorId, contractorSummary, setDetailPanelType, setShowDetailPanel]);
  
  // Handle reset filters with smart zooming
  const handleResetFilters = () => {
    resetFilters();
    setUserHasSetView(false); // Allow auto-zooming after reset
    // The global view zoom will be handled by the smartZoom effect
  };

  // Make map instance available globally for search function
  useEffect(() => {
    if (mapRef.current) {
      window.mapInstance = mapRef.current.getMap();
      
      // Ny funksjon for å kontrollere visning av cruises
      window.showCruises = (show) => {
        setShowCruises(show);
      };
      
      // Expose zoomToBlock og zoomToArea funksjoner for søkeresultater
      window.showBlockAnalytics = (blockId) => {
        // Finn blokken først
        const block = visibleAreaLayers.flatMap(area => area.blocks || [])
          .find(b => b.blockId === blockId);
        
        if (block) {
          // Zoom til blokken
          zoomToBlock(block);
          
          // Hent analytics
          fetchBlockAnalytics(blockId);
        }
      };
      
      // Modifisert showCruiseDetails funksjon med valgfri detaljpanel
      window.showCruiseDetails = (cruiseId, showDetails = false) => {
        // Finn cruise
        const cruise = mapData?.cruises.find(c => c.cruiseId === cruiseId);
        if (cruise) {
          setSelectedCruiseId(cruiseId);
          
          // Vis detaljpanel kun hvis showDetails er true
          if (showDetails) {
            setDetailPanelType('cruise');
            setShowDetailPanel(true);
          }
          
          // Sørg for at cruises er synlige og zoom
          setShowCruises(true);
          zoomToCruise(cruise);
        }
      };
      
      // Funksjon for å vise stasjonsinformasjon
      window.showStationDetails = (stationId) => {
        // Finn stasjonen først
        const station = getAllStations().find(s => s.stationId === stationId);
        if (station) {
          setSelectedStation(station);
          setDetailPanelType('station');
          setShowDetailPanel(true);
          
          // Zoom til stasjonens posisjon
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
      window.showCruises = null; // Rydde opp ny funksjon
    };
  }, [mapRef.current, visibleAreaLayers, mapData, zoomToBlock, zoomToCruise, getAllStations, fetchBlockAnalytics, setSelectedStation, setSelectedCruiseId, setDetailPanelType, setShowDetailPanel]);



  // Update clusters when the map moves or zoom changes
  useEffect(() => {
    if (!clusterIndex || !mapRef.current) return;
    
    try {
      const map = mapRef.current.getMap();
      const zoom = Math.round(map.getZoom());
      
      // Only recalculate clusters if zoom has changed significantly
      if (Math.abs(zoom - clusterZoom) > 0.5) {
        setClusterZoom(zoom);
        
        const bounds = map.getBounds();
        const bbox = [
          bounds.getWest(),
          bounds.getSouth(),
          bounds.getEast(),
          bounds.getNorth()
        ];
        
        // Get clusters with error handling
        try {
          const clusterData = clusterIndex.getClusters(bbox, Math.floor(zoom));
          setClusters(clusterData);
        } catch (err) {
          console.warn('Error getting clusters:', err.message);
          // Keep existing clusters instead of setting empty
        }
      }
    } catch (err) {
      console.error('Error updating clusters:', err);
    }
  }, [viewState, clusterIndex, clusterZoom]);

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
        zoomToCruise(selectedCruise);
      }
    }
  }, [selectedCruiseId, mapData, zoomToCruise]);

  // Add this useEffect to calculate summary data
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
        cruiseCount: mapData.cruises?.length || 0,  // Explicitly count cruises
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
  }, [mapData, selectedContractorId]); // Loading/error states
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
          mapData={mapData}  // Make sure to pass mapData
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

        {/* Areas Layer - Rendered independently */}
        {showAreas && visibleAreaLayers.map(area => (
          <Source 
            key={`area-source-${area.areaId}`} 
            id={`area-source-${area.areaId}`} 
            type="geojson" 
            data={area.geoJson}
          >
            {/* Area Fill */}
            <Layer
              id={`area-fill-${area.areaId}`}
              type="fill"
              paint={getAreaPaint}
              beforeId="settlement-label"
            />
            
            {/* Area Outline */}
            <Layer
              id={`area-line-${area.areaId}`}
              type="line"
              paint={getAreaLinePaint}
              beforeId="settlement-label"
            />
            
            {/* Area Label */}
            <Layer
              id={`area-label-${area.areaId}`}
              type="symbol"
              layout={{
                'text-field': area.areaName,
                'text-size': [
                  'interpolate', ['linear'], ['zoom'],
                  2, 10,  // Smaller text when zoomed out
                  6, 14   // Larger text when zoomed in
                ],
                'text-anchor': 'center',
                'text-justify': 'center',
                'text-offset': [0, 0],
                'text-allow-overlap': false,
                'text-ignore-placement': false,
                'text-optional': true,
                'symbol-z-order': 'source'
              }}
              paint={{
                'text-color': '#0077b6',
                'text-halo-color': 'rgba(255, 255, 255, 0.9)',
                'text-halo-width': 1.5
              }}
              beforeId="settlement-label"
            />
          </Source>
        ))}
        
        {/* Blocks Layer - Rendered independently */}
        {showBlocks && visibleAreaLayers.flatMap(area => 
          area.blocks ? area.blocks.map(block => (
            <Source 
              key={`block-source-${block.blockId}`}
              id={`block-source-${block.blockId}`}
              type="geojson" 
              data={block.geoJson}
            >
              {/* Block Fill */}
              <Layer
                id={`block-fill-${block.blockId}`}
                type="fill"
                paint={{
                  'fill-color': getBlockStatusColor(block.status),
                  'fill-opacity': hoveredBlockId === block.blockId ? 0.6 : 0.3,
                  'fill-outline-color': getBlockStatusColor(block.status)
                }}
                beforeId="settlement-label"
                onClick={() => fetchBlockAnalytics(block.blockId)}
              />
              
              {/* Block Outline */}
              <Layer
                id={`block-line-${block.blockId}`}
                type="line"
                paint={{
                  'line-color': getBlockStatusColor(block.status),
                  'line-width': hoveredBlockId === block.blockId ? 2 : 1.5,
                }}
                beforeId="settlement-label"
              />
              
              {/* Block Label */}
              <Layer
                id={`block-label-${block.blockId}`}
                type="symbol"
                layout={{
                  'text-field': block.blockName,
                  'text-size': [
                    'interpolate', ['linear'], ['zoom'],
                    4, 0,    // Hide text when zoomed out
                    5, 10,   // Start showing small text
                    8, 12    // Larger text when zoomed in
                  ],
                  'text-anchor': 'center',
                  'text-justify': 'center',
                  'text-allow-overlap': false,
                  'text-ignore-placement': false,
                  'text-optional': true
                }}
                paint={{
                  'text-color': '#1e3a8a',
                  'text-halo-color': 'rgba(255, 255, 255, 0.9)',
                  'text-halo-width': 1.5
                }}
                beforeId="settlement-label"
              />
            </Source>
          )) : []
        )}

        {/* Cruises */}
        {showCruises && mapData && mapData.cruises && mapData.cruises.map(cruise => (
          <CruiseMarker
            key={`cruise-marker-${cruise.cruiseId}`}
            cruise={cruise}
            onClick={handleCruiseClick}
          />
        ))}
        
        {/* Stations */}
        {showStations && clusters.map(cluster => {
          // Is this a cluster?
          const isCluster = cluster.properties.cluster;
          const clusterId = isCluster ? `cluster-${cluster.properties.cluster_id}` : `station-${cluster.properties.stationId}`;
          
          if (isCluster) {
            return (
              <ClusterMarker
              key={clusterId}
              cluster={{
                id: clusterId,
                longitude: cluster.geometry.coordinates[0],
                latitude: cluster.geometry.coordinates[1],
                count: cluster.properties.point_count,
                // Add error handling for expansion zoom:
                expansionZoom: (() => {
                  try {
                    return clusterIndex.getClusterExpansionZoom(cluster.properties.cluster_id);
                  } catch (err) {
                    console.warn('Could not get expansion zoom for cluster:', cluster.properties.cluster_id);
                    return Math.min(mapRef.current?.getMap().getZoom() + 2 || 10, 16); // Default zoom increase
                  }
                })()
              }}
              onClick={() => {
                // Zoom in when cluster is clicked
                try {
                  const [longitude, latitude] = cluster.geometry.coordinates;
                  let expansionZoom;
                  
                  try {
                    expansionZoom = clusterIndex.getClusterExpansionZoom(cluster.properties.cluster_id);
                  } catch (err) {
                    console.warn('Could not get expansion zoom on click:', err.message);
                    // Use a default zoom increase as fallback
                    expansionZoom = Math.min(mapRef.current.getMap().getZoom() + 2, 16);
                  }
                  
                  mapRef.current.flyTo({
                    center: [longitude, latitude],
                    zoom: expansionZoom,
                    duration: 500
                  });
                } catch (err) {
                  console.error('Error handling cluster click:', err);
                }
              }}
            />
            );
          } else {
            // It's a single station
            const station = cluster.properties.stationData;
            return (
              <StationMarker
                key={clusterId}
                station={station}
                onClick={handleMarkerClick}
              />
            );
          }
        })}

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