// frontend/src/contexts/filterContext/useFilterPanel.ts
import { useState, useCallback } from 'react';
import { BlockAnalytics, ContractorSummary } from '../../../types/filter-types';
import { FilterPanelResult } from './types';

export const useFilterPanel = (): FilterPanelResult => {
  // Detail panel state
  const [showDetailPanel, setShowDetailPanel] = useState<boolean>(false);
  const [detailPanelType, setDetailPanelType] = useState<
    'contractor' | 'cruise' | 'station' | 'blockAnalytics' | 'contractorSummary' | null
  >(null);
  
  // Analytics data
  const [contractorSummary, setContractorSummary] = useState<ContractorSummary | null>(null);
  const [blockAnalytics, setBlockAnalytics] = useState<BlockAnalytics | null>(null);

  return {
    showDetailPanel,
    setShowDetailPanel,
    detailPanelType,
    setDetailPanelType,
    contractorSummary,
    setContractorSummary,
    blockAnalytics,
    setBlockAnalytics
  };
};