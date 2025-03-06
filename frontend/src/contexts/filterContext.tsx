import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  
  // Load filter options on mount
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
  
  // Load initial data on mount 
  useEffect(() => {
    if (!originalMapData) {
      console.log("Loading initial data...");
      refreshData();
    }
  }, []);
  
  // Filter existing data when filters change 
  useEffect(() => {
    if (originalMapData && Object.keys(filters).length > 0) {
      console.log("Applying filters to existing data:", filters);
      filterExistingData();
    }
  }, [filters]);
  
  // Apply filters to existing data in memory
  const filterExistingData = () => {
    if (!originalMapData) return;
    
    console.log("Filtering existing data with:", filters);
    
    // Start with a copy of the original data
    const filteredData: MapData = {
      contractors: [...originalMapData.contractors],
      cruises: [...originalMapData.cruises]
    };
    
    // Apply contractor filters
    if (filters.contractorId) {
      filteredData.contractors = filteredData.contractors.filter(c => c.contractorId === filters.contractorId);
      // Also filter cruises to match the selected contractor
      filteredData.cruises = filteredData.cruises.filter(c => c.contractorId === filters.contractorId);
    }
    
    // Fix for mineralTypeId filter - use ContractType (name) instead of contractTypeId
    if (filters.mineralTypeId && filterOptions) {
      // Get the contract type name for the selected mineralTypeId
      const selectedContractType = filterOptions.contractTypes.find(
        type => type.contractTypeId === filters.mineralTypeId
      );
      
      if (selectedContractType) {
        filteredData.contractors = filteredData.contractors.filter(
          c => c.contractType === selectedContractType.contractTypeName
        );
        
        // Filter cruises to match the remaining contractors
        const contractorIds = filteredData.contractors.map(c => c.contractorId);
        filteredData.cruises = filteredData.cruises.filter(c => contractorIds.includes(c.contractorId));
      }
    }
    
    if (filters.contractStatusId) {
      filteredData.contractors = filteredData.contractors.filter(c => c.contractStatusId === filters.contractStatusId);
      // Filter cruises to match the remaining contractors
      const contractorIds = filteredData.contractors.map(c => c.contractorId);
      filteredData.cruises = filteredData.cruises.filter(c => contractorIds.includes(c.contractorId));
    }
    
    if (filters.sponsoringState) {
      filteredData.contractors = filteredData.contractors.filter(c => c.sponsoringState === filters.sponsoringState);
      // Filter cruises to match the remaining contractors
      const contractorIds = filteredData.contractors.map(c => c.contractorId);
      filteredData.cruises = filteredData.cruises.filter(c => contractorIds.includes(c.contractorId));
    }
    
    if (filters.year) {
      filteredData.contractors = filteredData.contractors.filter(c => c.contractualYear === filters.year);
      // Filter cruises to match the remaining contractors
      const contractorIds = filteredData.contractors.map(c => c.contractorId);
      filteredData.cruises = filteredData.cruises.filter(c => contractorIds.includes(c.contractorId));
    }
    
    // Apply cruise filters
    if (filters.cruiseId) {
      filteredData.cruises = filteredData.cruises.filter(c => c.cruiseId === filters.cruiseId);
    }
    
    console.log("Filtered data:", {
      contractors: filteredData.contractors.length,
      cruises: filteredData.cruises.length,
      stations: filteredData.cruises.flatMap(c => c.stations || []).length
    });
    
    // Set the filtered data
    setMapData(filteredData);
  };
  
  // Fetch complete fresh data
  const refreshData = async () => {
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
        setMapData(data);
      } else {
        console.error("Received invalid data format:", data);
        setError("Received invalid data from server");
      }
    } catch (err) {
      console.error('Failed to load map data:', err);
      setError('Failed to load map data. Please try again later.');
      
      // Make sure mapData isn't left in an inconsistent state
      setMapData({ contractors: [], cruises: [] });
    } finally {
      setLoading(false);
    }
  };
  
  // Simple, clean filter setter
  const setFilter = (key: keyof MapFilterParams, value: any) => {
    try {
      setFilters(prev => {
        const newFilters = { ...prev };
        
        // Remove filter if value is empty
        if (value === undefined || value === null || value === '' || value === 'all') {
          delete newFilters[key];
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
  };
  
  // Reset all filters and restore original data
  const resetFilters = () => {
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
    
    // If we have original data, restore it
    if (originalMapData) {
      console.log("Restoring original data");
      setMapData(originalMapData);
    } else {
      // Otherwise fetch fresh data
      console.log("No original data to restore, fetching fresh data");
      refreshData();
    }
  };
  
  return (
    <FilterContext.Provider
      value={{
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
      }}
    >
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