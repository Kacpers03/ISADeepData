// frontend/src/contexts/filterContext/index.tsx
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { FilterContextValue } from '../filterHooks/types';
import { useFilterState } from '../filterHooks/useFilterState';
import { useFilterData } from '../filterHooks/useFilterData';
import { useFilterSelection } from '../filterHooks/useFilterSelection';
import { useFilterPanel } from '../filterHooks/useFilterPanel';
import { useCallback } from 'react';

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get the various pieces of state and functionality from custom hooks
  const filterState = useFilterState();
  const filterData = useFilterData(filterState);
  const selectionState = useFilterSelection(filterState, filterData);
  const panelState = useFilterPanel();
  
  // Create an enhanced reset function that combines all reset actions
  const combinedResetFilters = useCallback(() => {
    console.log("Performing complete reset of filters and state");
    
    // Clear filters (basic reset from filterState)
    filterState.resetFilters();
    
    // Reset selection states
    selectionState.setSelectedContractorId(null);
    selectionState.setSelectedCruiseId(null);
    selectionState.setSelectedStation(null);
    
    // Reset panel states
    panelState.setShowDetailPanel(false);
    panelState.setDetailPanelType(null);
    panelState.setContractorSummary(null);
    panelState.setBlockAnalytics(null);
    
    // Restore original data if available
    if (filterData.originalMapData) {
      console.log("Restoring original data from cache");
      filterData.updateMapData(filterData.originalMapData);
    } else {
      // If no original data exists, fetch fresh data
      console.log("No original data cached, fetching fresh data");
      filterData.refreshData();
    }
    
    // Note: The map component will handle zooming after reset
  }, [
    filterState, 
    selectionState, 
    panelState, 
    filterData
  ]);
  
  // Combine all the pieces into one context value
  const contextValue: FilterContextValue = useMemo(() => ({
    // Filter state
    filters: filterState.filters,
    setFilter: filterState.setFilter,
    resetFilters: combinedResetFilters, // Use our enhanced reset
    userHasSetView: filterState.userHasSetView,
    setUserHasSetView: filterState.setUserHasSetView,
    handleContractorSelect: selectionState.handleContractorSelect,
    
    // Options for filter dropdowns
    filterOptions: filterData.filterOptions,
    
    // Map data
    mapData: filterData.mapData,
    originalMapData: filterData.originalMapData,
    
    // Map view state
    viewBounds: filterState.viewBounds,
    setViewBounds: filterState.setViewBounds,
    
    // UI state
    loading: filterData.loading,
    error: filterData.error,
    
    // Selected items
    selectedContractorId: selectionState.selectedContractorId,
    setSelectedContractorId: selectionState.setSelectedContractorId,
    selectedCruiseId: selectionState.selectedCruiseId,
    setSelectedCruiseId: selectionState.setSelectedCruiseId,
    selectedStation: selectionState.selectedStation,
    setSelectedStation: selectionState.setSelectedStation,
    
    // Detail panel state
    showDetailPanel: panelState.showDetailPanel,
    setShowDetailPanel: panelState.setShowDetailPanel,
    detailPanelType: panelState.detailPanelType,
    setDetailPanelType: panelState.setDetailPanelType,
    
    // Analytics data
    contractorSummary: panelState.contractorSummary,
    setContractorSummary: panelState.setContractorSummary,
    blockAnalytics: panelState.blockAnalytics,
    setBlockAnalytics: panelState.setBlockAnalytics,
    
    // Map actions
    refreshData: filterData.refreshData
  }), [
    filterState, 
    filterData, 
    selectionState, 
    panelState, 
    combinedResetFilters
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