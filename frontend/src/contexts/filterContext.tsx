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
  
  // Load map data when filters change
  useEffect(() => {
    refreshData();
  }, [filters]);
  
  // Ensure selectedContractorId and filters.contractorId stay in sync
  useEffect(() => {
    if (filters.contractorId !== undefined && filters.contractorId !== selectedContractorId) {
      setSelectedContractorId(filters.contractorId);
    } else if (selectedContractorId && filters.contractorId === undefined) {
      setSelectedContractorId(null);
    }
  }, [filters.contractorId, selectedContractorId]);
  
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
        
        // Log the new filters for debugging
        console.log(`Updated filters:`, newFilters);
        
        return newFilters;
      });
    } catch (error) {
      console.error("Error setting filter:", error);
      // Don't crash the app, just log the error
    }
  };
  
  // Reset all filters
  // Reset all filters
const resetFilters = () => {
  console.log("Resetting all filters");
  
  // Sett filters til null først for å sikre at useEffect trigger
  setFilters({});
  
  // Nullstill alle andre tilstander
  setSelectedContractorId(null);
  setSelectedCruiseId(null);
  setSelectedStation(null);
  setShowDetailPanel(false);
  setDetailPanelType(null);
  setContractorSummary(null);
  setBlockAnalytics(null);
  
  // Kall refreshData direkte for å sikre ny data lastes
  setTimeout(() => {
    console.log("Calling refreshData after reset");
    refreshData();
  }, 10);
};
  // Refresh map data
  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Combine filters with view bounds if available
      const combinedFilters = { ...filters };
      
      if (viewBounds) {
        combinedFilters.minLat = viewBounds.minLat;
        combinedFilters.maxLat = viewBounds.maxLat;
        combinedFilters.minLon = viewBounds.minLon;
        combinedFilters.maxLon = viewBounds.maxLon;
      }
      
      console.log("Fetching map data with filters:", combinedFilters);
      const data = await apiService.getMapData(combinedFilters);
      
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
        
        // Set the data even if empty - the UI will handle showing appropriate messages
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