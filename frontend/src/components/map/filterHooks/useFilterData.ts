// frontend/src/components/map/filterHooks/useFilterData.ts
import { useState, useEffect, useCallback } from 'react';
import { MapData, FilterOptions } from '../../../types/filter-types';
import { apiService } from '../../../services/api-service';
import { isPointInLocation, getLocationBoundaryById } from '../../../constants/locationBoundaries';
import { FilterStateResult, FilterDataResult } from './types';

export const useFilterData = (
  filterState: FilterStateResult
): FilterDataResult => {
  const { filters, resetFilters } = filterState;
  
  // Options for filter dropdowns
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  
  // Map data
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [originalMapData, setOriginalMapData] = useState<MapData | null>(null);
  
  // Flag to track when initial data is loaded
  const [initialDataLoaded, setInitialDataLoaded] = useState<boolean>(false);
  
  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Helper to ensure map data updates are reactive
  const updateMapData = useCallback((newData: MapData) => {
    // Create a new copy to ensure React detects the change
    setMapData({...newData});
  }, []);
  
  // Load filter options on mount - this stays the same
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await apiService.getFilterOptions();
        setFilterOptions(options);
      } catch (err) {
        console.error('Failed to load filter options:', err);
        setError('Failed to load filter options. Please try refreshing the page.');
      }
    };
    
    loadFilterOptions();
  }, []);
  
  // Check map data consistency (debugging)
  useEffect(() => {
    if (mapData) {
      console.log("Current MapData structure:", {
        contractorsCount: mapData.contractors?.length || 0,
        cruisesCount: mapData.cruises?.length || 0,
        cruisesWithStations: mapData.cruises?.filter(c => c.stations && c.stations.length > 0).length || 0,
        totalStations: mapData.cruises?.reduce((acc, c) => acc + (c.stations?.length || 0), 0) || 0
      });
    }
  }, [mapData]);
  
  // Fetch complete fresh data
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare filter params (don't include view bounds for regular filtering)
      const apiFilters = { ...filters };
      
      // Fix Issue #1: Map mineralTypeId to contractTypeId for API call
      if (apiFilters.mineralTypeId) {
        apiFilters.contractTypeId = apiFilters.mineralTypeId;
        delete apiFilters.mineralTypeId;
      }
      
      console.log("Fetching fresh map data with filters:", apiFilters);
      const data = await apiService.getMapData(apiFilters);
      
      // Log what we received for debugging
      console.log("Received data with:", {
        contractors: data?.contractors?.length || 0,
        cruises: data?.cruises?.length || 0,
        stations: data?.cruises?.flatMap(c => c.stations || []).length || 0
      });
      
      // Safety check - make sure data is in expected format
      if (data && typeof data === 'object') {
        if (!data.contractors) data.contractors = [];
        if (!data.cruises) data.cruises = [];
        
        // If this is a complete data load (no filters), save it as the original
        if (Object.keys(filters).length === 0) {
          console.log("Saving as original data");
          setOriginalMapData(data);
        }
        
        // Always set as current map data
        updateMapData(data);
        
        // Signal that initial data is loaded
        setInitialDataLoaded(true);
      } else {
        console.error("Received invalid data format:", data);
        setError("Received invalid data from server");
      }
    } catch (err) {
      console.error('Failed to load map data:', err);
      setError('Failed to load map data. Please try again later.');
      
      // Make sure mapData isn't left in an inconsistent state
      updateMapData({ contractors: [], cruises: [] });
    } finally {
      setLoading(false);
    }
  }, [filters, updateMapData]);
  
  // This is the completely revised filterExistingData function that fixes the relationship issues
  const filterExistingData = useCallback(() => {
    if (!originalMapData) {
      console.log("No original data available for filtering");
      return;
    }
    
    console.log("Filtering existing data with:", filters);
    
    try {
      // Create deep copies to avoid reference issues
      const filteredData = {
        contractors: JSON.parse(JSON.stringify(originalMapData.contractors)),
        cruises: JSON.parse(JSON.stringify(originalMapData.cruises))
      };
      
      // Check if contractor filter is active - this is important for relationship logic
      const contractorIdSpecified = !!filters.contractorId;
      
      // STEP 1: Filter contractors based on ALL applied filters simultaneously
      let filteredContractors = [...filteredData.contractors];
      
      // Filter by contractor ID if specified
      if (contractorIdSpecified) {
        console.log(`Filtering by contractorId: ${filters.contractorId}`);
        filteredContractors = filteredContractors.filter(c => c.contractorId === filters.contractorId);
      }
      
      // Filter by mineral/contract type if specified
      if (filters.mineralTypeId && filterOptions) {
        const selectedContractType = filterOptions.contractTypes.find(
          type => type.contractTypeId === filters.mineralTypeId
        );
        
        if (selectedContractType) {
          console.log(`Filtering by mineralType: ${selectedContractType.contractTypeName}`);
          filteredContractors = filteredContractors.filter(c => 
            c.contractType === selectedContractType.contractTypeName
          );
        }
      }
      
      // Filter by contract status if specified
      if (filters.contractStatusId && filterOptions) {
        console.log(`Filtering by contractStatusId: ${filters.contractStatusId}`);
        const selectedStatus = filterOptions.contractStatuses.find(
          status => status.contractStatusId === filters.contractStatusId
        );
        
        if (selectedStatus) {
          filteredContractors = filteredContractors.filter(c => 
            c.contractStatus === selectedStatus.contractStatusName
          );
        }
      }
      
      // Filter by sponsoring state if specified
      if (filters.sponsoringState) {
        console.log(`Filtering by sponsoringState: ${filters.sponsoringState}`);
        filteredContractors = filteredContractors.filter(c => 
          c.sponsoringState === filters.sponsoringState
        );
      }
      
      // Filter by year if specified
      if (filters.year) {
        console.log(`Filtering by year: ${filters.year}`);
        filteredContractors = filteredContractors.filter(c => 
          c.contractualYear === filters.year
        );
      }
      
      // Filter by location if specified
      if (filters.locationId && filters.locationId !== 'all') {
        console.log(`Filtering by locationId: ${filters.locationId}`);
        
        // Get the location boundary
        const locationBoundary = getLocationBoundaryById(filters.locationId);
        
        if (locationBoundary) {
          console.log(`Found location boundary: ${locationBoundary.name}`);
          
          // Filter contractors that have areas within this location boundary
          filteredContractors = filteredContractors.filter(contractor => {
            // Check if any of the contractor's areas are within the location boundary
            return contractor.areas?.some(area => {
              // If we have center coordinates for the area, use those
              if (area.centerLatitude !== undefined && area.centerLongitude !== undefined) {
                return isPointInLocation(area.centerLatitude, area.centerLongitude, filters.locationId!);
              }
              
              // If we have blocks with coordinates, check those
              if (area.blocks && area.blocks.length > 0) {
                return area.blocks.some(block => {
                  if (block.centerLatitude !== undefined && block.centerLongitude !== undefined) {
                    return isPointInLocation(block.centerLatitude, block.centerLongitude, filters.locationId!);
                  }
                  return false;
                });
              }
              
              return false;
            }) || false;
          });
          
          console.log(`Filtered to ${filteredContractors.length} contractors in location ${locationBoundary.name}`);
        }
      }
      
      // Update the filtered contractors in the result
      filteredData.contractors = filteredContractors;
      
      // STEP 2: CRITICAL FIX - Handle cruises based on contractor filter
      if (contractorIdSpecified) {
        // ALWAYS keep ALL cruises for the selected contractor
        filteredData.cruises = originalMapData.cruises.filter(cruise => 
          cruise.contractorId === filters.contractorId
        );
        console.log(`Keeping all ${filteredData.cruises.length} cruises for contractor ${filters.contractorId}`);
      } else {
        // For other filter combinations, filter cruises based on filtered contractors
        const filteredContractorIds = new Set(filteredContractors.map(c => c.contractorId));
        filteredData.cruises = filteredData.cruises.filter(cruise => 
          filteredContractorIds.has(cruise.contractorId)
        );
      }
      
      // IMPORTANT FIX: If specific cruise is selected, make sure to include it no matter what
      if (filters.cruiseId) {
        console.log(`Ensuring selected cruiseId: ${filters.cruiseId} remains visible`);
        
        // Find the selected cruise from original data
        const selectedCruise = originalMapData.cruises.find(c => c.cruiseId === filters.cruiseId);
        
        if (selectedCruise) {
          // Check if it's already in the filtered results
          const alreadyIncluded = filteredData.cruises.some(c => c.cruiseId === filters.cruiseId);
          
          if (!alreadyIncluded) {
            console.log(`Adding selected cruise back to filtered results`);
            // If it's not already included, add it
            filteredData.cruises.push(selectedCruise);
            
            // Also make sure its contractor is included
            if (!filteredContractors.some(c => c.contractorId === selectedCruise.contractorId)) {
              const cruiseContractor = originalMapData.contractors.find(
                c => c.contractorId === selectedCruise.contractorId
              );
              
              if (cruiseContractor) {
                console.log(`Adding cruise's contractor back to filtered results`);
                filteredData.contractors.push(cruiseContractor);
              }
            }
          }
        }
      }
      
      // Apply location filter to cruises if needed (only if no contractor is selected)
      if (filters.locationId && filters.locationId !== 'all' && !contractorIdSpecified) {
        const locationBoundary = getLocationBoundaryById(filters.locationId);
        
        if (locationBoundary) {
          // Keep track of the selected cruise ID to make sure it's retained
          let selectedCruise = null;
          if (filters.cruiseId) {
            selectedCruise = filteredData.cruises.find(c => c.cruiseId === filters.cruiseId);
          }
          
          // Filter cruises by location
          filteredData.cruises = filteredData.cruises.filter(cruise => {
            // Always keep the selected cruise
            if (filters.cruiseId && cruise.cruiseId === filters.cruiseId) {
              return true;
            }
            
            // If the cruise has stations, check if any of them are within the location
            if (cruise.stations && cruise.stations.length > 0) {
              return cruise.stations.some(station => 
                isPointInLocation(station.latitude, station.longitude, filters.locationId!)
              );
            }
            
            // If no stations but has center coordinates, use those
            if (cruise.centerLatitude !== undefined && cruise.centerLongitude !== undefined) {
              return isPointInLocation(cruise.centerLatitude, cruise.centerLongitude, filters.locationId!);
            }
            
            return false;
          });
          
          // If we have a selected cruise, ensure it's in the results
          if (selectedCruise && !filteredData.cruises.some(c => c.cruiseId === filters.cruiseId)) {
            filteredData.cruises.push(selectedCruise);
          }
          
          console.log(`Filtered to ${filteredData.cruises.length} cruises in location ${locationBoundary.name}`);
        }
      }
      
      // Log and set the resulting filtered data
      console.log("Filtered data results:", {
        contractors: filteredData.contractors.length,
        cruises: filteredData.cruises.length,
        stations: filteredData.cruises.flatMap(c => c.stations || []).length
      });
      
      updateMapData(filteredData);
    } catch (error) {
      console.error("Error during filtering:", error);
      // On error, use original data to avoid showing empty data
      if (originalMapData) {
        updateMapData(originalMapData);
      }
    }
  }, [filters, filterOptions, originalMapData, updateMapData]);

  // Enhanced resetFilters function
  const enhancedResetFilters = useCallback(() => {
    // Use basic reset from filterState first
    resetFilters();
    
    // Restore original data if available
    if (originalMapData) {
      console.log("Restoring original data from cache");
      updateMapData(originalMapData);
    } else {
      // If no original data exists, fetch fresh data
      console.log("No original data cached, fetching fresh data");
      refreshData();
    }
    
  }, [originalMapData, refreshData, resetFilters, updateMapData]);
  
  // Main data loading logic
  useEffect(() => {
    const loadInitialData = async () => {
      if (!initialDataLoaded) {
        console.log("Initial load - fetching data");
        await refreshData();
      }
    };
    
    loadInitialData();
  }, [initialDataLoaded, refreshData]); // Only depends on initialDataLoaded flag

  // Separate effect for handling filter changes
  useEffect(() => {
    // Skip on initial load before we have data
    if (!initialDataLoaded || !originalMapData) {
      return;
    }
    
    if (Object.keys(filters).length > 0) {
      console.log("Filters changed, applying filters to data");
      filterExistingData();
    } else {
      console.log("No filters active, restoring original data");
      // IMPORTANT: Only update if mapData is not already originalMapData
      // This prevents the infinite loop of updates
      if (mapData !== originalMapData) {
        updateMapData(originalMapData);
      }
    }
  }, [filters, initialDataLoaded, originalMapData, filterExistingData, mapData, updateMapData]);

  return {
    filterOptions,
    mapData,
    originalMapData,
    loading,
    error,
    refreshData,
    filterExistingData,
    updateMapData,
    initialDataLoaded
  };
};