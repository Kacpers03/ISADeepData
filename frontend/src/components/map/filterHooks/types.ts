// frontend/src/contexts/filterContext/types.ts
import { MapFilterParams, FilterOptions, MapData, Station, BlockAnalytics, ContractorSummary } from '../../types/filter-types';

export interface FilterContextValue {
  // Filter state
  filters: MapFilterParams;
  setFilter: (key: keyof MapFilterParams, value: any) => void;
  resetFilters: () => void;
  userHasSetView?: boolean;
  setUserHasSetView?: (value: boolean) => void;
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

export interface FilterStateResult {
  filters: MapFilterParams;
  setFilter: (key: keyof MapFilterParams, value: any) => void;
  resetFilters: () => void;
  userHasSetView: boolean;
  setUserHasSetView: (value: boolean) => void;
  viewBounds: { minLat: number; maxLat: number; minLon: number; maxLon: number } | null;
  setViewBounds: (bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number }) => void;
}

export interface FilterDataResult {
  filterOptions: FilterOptions | null;
  mapData: MapData | null;
  originalMapData: MapData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  filterExistingData: () => void;
  updateMapData: (newData: MapData) => void;
  initialDataLoaded: boolean;
}

export interface FilterSelectionResult {
  selectedContractorId: number | null;
  setSelectedContractorId: (id: number | null) => void;
  selectedCruiseId: number | null;
  setSelectedCruiseId: (id: number | null) => void;
  selectedStation: Station | null;
  setSelectedStation: (station: Station | null) => void;
  handleContractorSelect: (contractorId: number | null) => void;
}

export interface FilterPanelResult {
  showDetailPanel: boolean;
  setShowDetailPanel: (show: boolean) => void;
  detailPanelType: 'contractor' | 'cruise' | 'station' | 'blockAnalytics' | 'contractorSummary' | null;
  setDetailPanelType: (type: 'contractor' | 'cruise' | 'station' | 'blockAnalytics' | 'contractorSummary' | null) => void;
  contractorSummary: ContractorSummary | null;
  setContractorSummary: (summary: ContractorSummary | null) => void;
  blockAnalytics: BlockAnalytics | null;
  setBlockAnalytics: (analytics: BlockAnalytics | null) => void;
}