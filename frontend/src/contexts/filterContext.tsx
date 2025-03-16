import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { MapFilterParams, FilterOptions, MapData, Station, BlockAnalytics, ContractorSummary } from '../types/filter-types';
import { apiService } from '../services/api-service';
import { isPointInLocation, getLocationBoundaryById } from '../constants/locationBoundaries';

interface FilterContextValue {
  // Filter state
  filters: MapFilterParams;
  setFilter: (key: keyof MapFilterParams, value: any) => void;
  resetFilters: () => void;
  handleContractorSelect?: (contractorId: number | null) => void;
  // Options for filter dropdowns
  filterOptions: FilterOptions | null;
  
  // Map data
  mapData: MapData | null;
  originalMapData: MapData | null; 
  
  // Map view state
  viewBounds: { minLat: number; maxLat: number; minLon: number; maxLon: number } | null;
  setViewBounds: (bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number }) => void;
  
  // UI state
  loading: boolean;
  error: string | null;
  
  // Selected items
  selectedContractorId: number | null;
  setSelectedContractorId: (id: number | null) => void;
  selectedCruiseId: number | null;
  setSelectedCruiseId: (id: number | null) => void;
  selectedStation: Station | null;
  setSelectedStation: (station: Station | null) => void;
  
  // Detail panel state
  showDetailPanel: boolean;
  setShowDetailPanel: (show: boolean) => void;
  detailPanelType: 'contractor' | 'cruise' | 'station' | 'blockAnalytics' | 'contractorSummary' | null;
  setDetailPanelType: (type: 'contractor' | 'cruise' | 'station' | 'blockAnalytics' | 'contractorSummary' | null) => void;
  
  // Analytics data
  contractorSummary: ContractorSummary | null;
  setContractorSummary: (summary: ContractorSummary | null) => void;
  blockAnalytics: BlockAnalytics | null;
  setBlockAnalytics: (analytics: BlockAnalytics | null) => void;
  
  // Map actions
  refreshData: () => void;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Filter state
  const [filters, setFilters] = useState<MapFilterParams>({});
  const [userHasSetView, setUserHasSetView] = useState<boolean>(false);
  // Options for filter dropdowns
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  
  // Map data
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [originalMapData, setOriginalMapData] = useState<MapData | null>(null);
  
  // Flag to track when initial data is loaded
  const [initialDataLoaded, setInitialDataLoaded] = useState<boolean>(false);
  
  // Map view state
  const [viewBounds, setViewBounds] = useState<{ minLat: number; maxLat: number; minLon: number; maxLon: number } | null>(null);
  
  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Selected items
  const [selectedContractorId, setSelectedContractorId] = useState<number | null>(null);
  const [selectedCruiseId, setSelectedCruiseId] = useState<number | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  
  // Detail panel state
  const [showDetailPanel, setShowDetailPanel] = useState<boolean>(false);
  const [detailPanelType, setDetailPanelType] = useState<'contractor' | 'cruise' | 'station' | 'blockAnalytics' | 'contractorSummary' | null>(null);
  
  // Analytics data
  const [contractorSummary, setContractorSummary] = useState<ContractorSummary | null>(null);
  const [blockAnalytics, setBlockAnalytics] = useState<BlockAnalytics | null>(null);
  
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
  
// This is the complete filterExistingData function with fixes for the cruise visibility issue
// Place this in the filterContext.tsx file

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
    
    // STEP 1: Filter contractors based on ALL applied filters simultaneously
    let filteredContractors = [...filteredData.contractors];
    
    // Filter by contractor ID if specified
    if (filters.contractorId) {
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
    
    // STEP 2: Get filtered contractor IDs for relationship filtering
    const filteredContractorIds = new Set(filteredContractors.map(c => c.contractorId));
    
    // STEP 3: Filter cruises - IMPROVED to ensure selected cruises remain visible
    // Get all cruises that belong to filtered contractors
    let filteredCruises = filteredData.cruises.filter(cruise => 
      filteredContractorIds.has(cruise.contractorId)
    );
    
    // IMPORTANT FIX: If specific cruise is selected, make sure to include it no matter what
    if (filters.cruiseId) {
      console.log(`Ensuring selected cruiseId: ${filters.cruiseId} remains visible`);
      
      // Find the selected cruise from original data
      const selectedCruise = originalMapData.cruises.find(c => c.cruiseId === filters.cruiseId);
      
      if (selectedCruise) {
        // Check if it's already in the filtered results
        const alreadyIncluded = filteredCruises.some(c => c.cruiseId === filters.cruiseId);
        
        if (!alreadyIncluded) {
          console.log(`Adding selected cruise back to filtered results`);
          // If it's not already included, add it
          filteredCruises.push(selectedCruise);
          
          // Also make sure its contractor is included
          if (!filteredContractorIds.has(selectedCruise.contractorId)) {
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
    
    // Apply location filter to cruises if needed
    if (filters.locationId && filters.locationId !== 'all') {
      const locationBoundary = getLocationBoundaryById(filters.locationId);
      
      if (locationBoundary) {
        // Keep track of the selected cruise ID to make sure it's retained
        let selectedCruise = null;
        if (filters.cruiseId) {
          selectedCruise = filteredCruises.find(c => c.cruiseId === filters.cruiseId);
        }
        
        // Filter cruises by location
        filteredCruises = filteredCruises.filter(cruise => {
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
        if (selectedCruise && !filteredCruises.some(c => c.cruiseId === filters.cruiseId)) {
          filteredCruises.push(selectedCruise);
        }
        
        console.log(`Filtered to ${filteredCruises.length} cruises in location ${locationBoundary.name}`);
      }
    }
    
    // Update the filtered cruises in the result
    filteredData.cruises = filteredCruises;
    
    // STEP 4: Apply further filtering to stations within cruises based on location
    if (filters.locationId && filters.locationId !== 'all') {
      const locationBoundary = getLocationBoundaryById(filters.locationId);
      
      if (locationBoundary) {
        // Loop through each cruise to filter its stations
        filteredData.cruises.forEach(cruise => {
          if (cruise.stations && cruise.stations.length > 0) {
            // If this is the selected cruise, keep all its stations
            if (filters.cruiseId && cruise.cruiseId === filters.cruiseId) {
              // Keep all stations for the selected cruise
              console.log(`Keeping all stations for selected cruise: ${cruise.cruiseId}`);
            } else {
              // Filter stations by location for other cruises
              cruise.stations = cruise.stations.filter(station =>
                isPointInLocation(station.latitude, station.longitude, filters.locationId!)
              );
            }
          }
        });
        
        // Count total stations after filtering
        const totalStations = filteredData.cruises.reduce(
          (sum, cruise) => sum + (cruise.stations?.length || 0), 0
        );
        
        console.log(`Filtered to ${totalStations} stations in location ${locationBoundary.name}`);
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
  
  // Improved reset filters function
  const resetFilters = useCallback(() => {
    console.log("Resetting all filters");
    
    // Clear filters
    setFilters({});
    
    // Reset selection states
    setSelectedContractorId(null);
    setSelectedCruiseId(null);
    setSelectedStation(null);
    setShowDetailPanel(false);
    setDetailPanelType(null);
    setContractorSummary(null);
    setBlockAnalytics(null);
    
    // Restore original data if available
    if (originalMapData) {
      console.log("Restoring original data from cache");
      updateMapData(originalMapData);
    } else {
      // If no original data exists, fetch fresh data
      console.log("No original data cached, fetching fresh data");
      refreshData();
    }
    
    // Note: The map component will handle zooming after reset
  }, [originalMapData, refreshData, updateMapData]);
  
  // Improved set filter function - optimized to handle "All" selections efficiently
  const setFilter = useCallback((key: keyof MapFilterParams, value: any) => {
    try {
      console.log(`Setting filter: ${key} = ${value}`);
      
      setFilters(prev => {
        const newFilters = { ...prev };
        
        // Handle "All" selection specially
        if (value === undefined || value === null || value === '' || value === 'all') {
          console.log(`Removing filter: ${key}`);
          delete newFilters[key];
          
          // No need to trigger full refresh when removing a filter
          // We'll let the effect handle this more efficiently
        } else {
          // If we're already filtering on this key and it's the only active filter,
          // we should allow changing it directly without requiring a reset
          if (prev[key] !== undefined && Object.keys(prev).length === 1) {
            console.log(`Switching value for single filter ${key} from ${prev[key]} to ${value}`);
            
            // For single filter case, we'll update directly - this allows switching between options
            newFilters[key] = value;
          } else {
            // Multi-filter case or adding a new filter - set the new filter value normally
            newFilters[key] = value;
          }
        }
        
        console.log(`Updated filters:`, newFilters);
        return newFilters;
      });
    } catch (error) {
      console.error("Error setting filter:", error);
    }
  }, []);
  
  const handleContractorSelect = useCallback((contractorId: number | null) => {
    // Update the filter
    if (contractorId === null) {
      // Remove filter when null
      setFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters.contractorId;
        return newFilters;
      });
    } else {
      // Set filter when valid ID
      setFilters(prev => ({
        ...prev,
        contractorId: contractorId
      }));
    }
    
    // Update the selected contractor ID
    setSelectedContractorId(contractorId);
    
    // Always reset userHasSetView to allow the smart zoom to work
    setUserHasSetView(false);
    
    console.log(`Contractor selection changed to: ${contractorId}, enabling smart zoom`);
  }, [setSelectedContractorId]);

  // Main data loading logic - FIX: Optimize the dependencies and conditional logic
  useEffect(() => {
    const loadInitialData = async () => {
      if (!initialDataLoaded) {
        console.log("Initial load - fetching data");
        await refreshData();
      }
    };
    
    loadInitialData();
  }, [initialDataLoaded]); // Only depends on initialDataLoaded flag

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
  }, [filters, initialDataLoaded, originalMapData, filterExistingData]); // Removed updateMapData
  
  const contextValue = useMemo(() => ({
    // Filter state
    filters,
    setFilter,
    resetFilters,
    userHasSetView,
    setUserHasSetView,
    handleContractorSelect,
    // Options for filter dropdowns
    filterOptions,
    
    // Map data
    mapData,
    originalMapData,
    
    // Map view state
    viewBounds,
    setViewBounds,
    
    // UI state
    loading,
    error,
    
    // Selected items
    selectedContractorId,
    setSelectedContractorId,
    selectedCruiseId,
    setSelectedCruiseId,
    selectedStation,
    setSelectedStation,
    
    // Detail panel state
    showDetailPanel,
    setShowDetailPanel,
    detailPanelType,
    setDetailPanelType,
    
    // Analytics data
    contractorSummary,
    setContractorSummary,
    blockAnalytics,
    setBlockAnalytics,
    
    // Map actions
    refreshData
  }), [
    filters, setFilter, resetFilters, 
    filterOptions, 
    mapData, originalMapData, 
    viewBounds, setViewBounds, 
    loading, error, 
    selectedContractorId, setSelectedContractorId,
    selectedCruiseId, setSelectedCruiseId,
    selectedStation, setSelectedStation,
    showDetailPanel, setShowDetailPanel,
    detailPanelType, setDetailPanelType,
    contractorSummary, setContractorSummary,
    blockAnalytics, setBlockAnalytics,
    refreshData,  userHasSetView,
    setUserHasSetView,
    handleContractorSelect
  ]);
  
  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

// Custom hook to use the filter context
export const useFilter = (): FilterContextValue => {
  const context = useContext(FilterContext);
  
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  
  return context;
};