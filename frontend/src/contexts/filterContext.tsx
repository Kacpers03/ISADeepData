import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { MapFilterParams, FilterOptions, MapData, Station, BlockAnalytics, ContractorSummary } from '../types/filter-types';
import { apiService } from '../services/api-service';

interface FilterContextValue {
  // Filter state
  filters: MapFilterParams;
  setFilter: (key: keyof MapFilterParams, value: any) => void;
  resetFilters: () => void;
  
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
  
  // Main data loading logic - optimized to prevent unnecessary refreshes
  useEffect(() => {
    // On initial load, fetch data
    if (!initialDataLoaded) {
      console.log("Initial load - fetching data");
      refreshData();
    } 
    // When initial data is loaded and filters change, filter existing data
    else if (Object.keys(filters).length > 0 && originalMapData) {
      console.log("Filters changed, applying filters to data");
      filterExistingData();
    }
    // When filters are cleared, restore original data
    else if (Object.keys(filters).length === 0 && originalMapData) {
      console.log("No filters active, restoring original data");
      updateMapData(originalMapData);
    }
  }, [filters, initialDataLoaded, originalMapData, updateMapData]);

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
  
  // Apply filters to existing data in memory - COMPLETELY IMPROVED for better relationship management
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
      
      // STEP 1: Filter contractors based on applied filters
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
      if (filters.contractStatusId) {
        console.log(`Filtering by contractStatusId: ${filters.contractStatusId}`);
        filteredContractors = filteredContractors.filter(c => 
          c.contractStatusId === filters.contractStatusId
        );
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
      
      // Update the filtered contractors in the result
      filteredData.contractors = filteredContractors;
      
      // STEP 2: Get filtered contractor IDs for relationship filtering
      const filteredContractorIds = new Set(filteredContractors.map(c => c.contractorId));
      
      // STEP 3: Filter cruises - IMPROVED to maintain relationships
      // Get all cruises linked to filtered contractors
      let filteredCruises = filteredData.cruises.filter(cruise => 
        filteredContractorIds.has(cruise.contractorId)
      );
      
      // If specific cruise filter exists
      if (filters.cruiseId) {
        console.log(`Filtering by cruiseId: ${filters.cruiseId}`);
        filteredCruises = filteredCruises.filter(c => c.cruiseId === filters.cruiseId);
      }
      
      // Update the filtered cruises in the result
      filteredData.cruises = filteredCruises;
      
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
          // Set the new filter value
          newFilters[key] = value;
        }
        
        console.log(`Updated filters:`, newFilters);
        return newFilters;
      });
    } catch (error) {
      console.error("Error setting filter:", error);
    }
  }, []);
  
  const contextValue = useMemo(() => ({
    // Filter state
    filters,
    setFilter,
    resetFilters,
    
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
    refreshData
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