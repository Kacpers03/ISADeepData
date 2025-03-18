import { useState, useCallback, useEffect } from 'react';

const useMapData = (mapData, loading, filters, selectedContractorId) => {
  // Store all loaded GeoJSON data
  const [allAreaLayers, setAllAreaLayers] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
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
  
  // Get all stations
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
    } catch (error) {
      console.error('Error loading all contractor GeoJSON:', error);
    } finally {
      setLocalLoading(false);
    }
  }, [mapData?.contractors, fetchContractorGeoJson, loading, localLoading]);

  // Fetch contractor summary
  const fetchContractorSummary = async (contractorId, setContractorSummary, setToastMessage, setShowToast) => {
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
      if (setToastMessage && setShowToast) {
        setToastMessage('Error fetching contractor summary');
        setShowToast(true);
      }
      return null;
    } finally {
      setLocalLoading(false);
    }
  };

  // Block analytics fetch
  const fetchBlockAnalytics = async (blockId, setBlockAnalytics, setDetailPanelType, setShowDetailPanel, zoomToBlock, visibleAreaLayers, setToastMessage, setShowToast) => {
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
      
      return data;
    } catch (error) {
      console.error('Error fetching block analytics:', error);
      if (setToastMessage && setShowToast) {
        setToastMessage('Error fetching block data');
        setShowToast(true);
      }
      return null;
    }
  };

  return {
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
  };
};

export default useMapData;