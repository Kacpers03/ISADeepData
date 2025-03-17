import { useCallback, useState, useEffect } from 'react';
import { getLocationBoundaryById } from '../../../constants/locationBoundaries';

const useMapZoom = (mapRef, allAreaLayers, selectedContractorId, filters, pendingZoomContractorId, setPendingZoomContractorId) => {
  // User has manually set the view (to prevent auto-zooming when unwanted)
  const [userHasSetView, setUserHasSetView] = useState(false);

  // Smart zoom function to be more robust
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
  }, [selectedContractorId, allAreaLayers, filters, userHasSetView, pendingZoomContractorId, filters.locationId, setPendingZoomContractorId, mapRef]);

  // Zoom to specific area
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
  }, [mapRef]);

  // Zoom to specific block
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
  }, [mapRef]);

  // Zoom to specific cruise
  const zoomToCruise = useCallback((cruise, setShowCruises) => {
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
      if (cruise.contractorId && mapRef.current) {
        const map = mapRef.current.getMap();
        map.flyTo({
          center: [0, 0],
          zoom: 2,
          duration: 1000
        });
        console.log("Could not find specific position for cruise:", cruise.cruiseName);
      }
    }
  }, [mapRef]);

  // Effect for pendingZoom
  useEffect(() => {
    if (pendingZoomContractorId && allAreaLayers.length > 0) {
      console.log(`Attempting pending zoom for contractor ${pendingZoomContractorId}`);
      smartZoom();
    }
  }, [allAreaLayers, pendingZoomContractorId, smartZoom]);

  return {
    userHasSetView,
    setUserHasSetView,
    smartZoom,
    zoomToArea,
    zoomToBlock,
    zoomToCruise
  };
};

export default useMapZoom;