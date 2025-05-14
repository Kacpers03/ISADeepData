// frontend/src/contexts/filterContext/useFilterPanel.ts
import { useState, useCallback } from 'react' // Import React hooks
import { BlockAnalytics, ContractorSummary } from '../../../types/filter-types' // Import analytics type definitions
import { FilterPanelResult } from './types' // Import result interface

// Custom hook for managing the detail panel state
// This hook handles the UI state for the detail panel that shows information about selected map items
export const useFilterPanel = (): FilterPanelResult => {
	// Detail panel visibility state
	const [showDetailPanel, setShowDetailPanel] = useState<boolean>(false) // Controls panel visibility

	// Detail panel content type
	// This determines what kind of data is shown in the panel
	const [detailPanelType, setDetailPanelType] = useState<
		'contractor' | 'cruise' | 'station' | 'blockAnalytics' | 'contractorSummary' | null
	>(null) // Initialize as null (no panel type selected)

	// Analytics data for special panel types
	const [contractorSummary, setContractorSummary] = useState<ContractorSummary | null>(null) // Data for contractor summary panel
	const [blockAnalytics, setBlockAnalytics] = useState<BlockAnalytics | null>(null) // Data for block analytics panel

	// Return all state and functions needed for panel management
	return {
		showDetailPanel,
		setShowDetailPanel,
		detailPanelType,
		setDetailPanelType,
		contractorSummary,
		setContractorSummary,
		blockAnalytics,
		setBlockAnalytics,
	}
}
