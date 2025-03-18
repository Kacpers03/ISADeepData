// frontend/src/contexts/filterContext/useFilterSelection.ts
import { useState, useCallback } from 'react';
import { Station } from '../../../types/filter-types';
import { FilterStateResult, FilterDataResult, FilterSelectionResult } from './types';

export const useFilterSelection = (
  filterState: FilterStateResult,
  filterData: FilterDataResult
): FilterSelectionResult => {
  const { setFilter, setUserHasSetView } = filterState;
  
  // Selected items
  const [selectedContractorId, setSelectedContractorId] = useState<number | null>(null);
  const [selectedCruiseId, setSelectedCruiseId] = useState<number | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  
  // Handle contractor selection with filter update
  const handleContractorSelect = useCallback((contractorId: number | null) => {
    // Update the filter
    if (contractorId === null) {
      // Remove filter when null
      setFilter('contractorId', null);
    } else {
      // Set filter when valid ID
      setFilter('contractorId', contractorId);
    }
    
    // Update the selected contractor ID
    setSelectedContractorId(contractorId);
    
    // Always reset userHasSetView to allow the smart zoom to work
    setUserHasSetView(false);
    
    console.log(`Contractor selection changed to: ${contractorId}, enabling smart zoom`);
  }, [setFilter, setSelectedContractorId, setUserHasSetView]);

  return {
    selectedContractorId,
    setSelectedContractorId,
    selectedCruiseId,
    setSelectedCruiseId,
    selectedStation,
    setSelectedStation,
    handleContractorSelect
  };
};