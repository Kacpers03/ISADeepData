// frontend/src/components/map/ui/summaryPanel.tsx - Enhanced SummaryPanel with improved toggle functionality
import React, { useState, useRef, useEffect } from 'react' // Import React and hooks for state, refs and side effects
import styles from '../../../styles/map/summary.module.css' // Import CSS module for summary panel styling
import panelStyles from '../../../styles/map/panels.module.css' // Import CSS module for general panel styling

// SummaryPanel component for displaying exploration data statistics
const SummaryPanel = ({
	data, // Global summary data for all displayed map entities
	selectedContractorInfo, // Information about the currently selected contractor
	contractorSummary, // Detailed summary for the selected contractor
	onClose, // Callback function to close the panel
	onViewContractorSummary, // Callback function to view detailed contractor summary
	mapData, // Complete map data for reference
	setSelectedCruiseId, // Function to set the selected cruise ID
	setDetailPanelType, // Function to set the detail panel type
	setShowDetailPanel, // Function to toggle the detail panel visibility
}) => {
	const [isCollapsed, setIsCollapsed] = useState(false) // State to track if panel is collapsed
	const contentRef = useRef(null) // Reference to the content container for height manipulation

	// State to track which sections are expanded
	const [expandedSections, setExpandedSections] = useState({
		contractTypes: false, // Contract types section initially collapsed
		sponsoringStates: false, // Sponsoring states section initially collapsed
	})

	// Helper function to format numbers with locale-specific formatting
	const formatNumber = num => {
		if (num === undefined || num === null || isNaN(num)) {
			return 'No data available' // Return placeholder text if number is invalid
		}
		return num.toLocaleString() // Format number with thousands separators based on locale
	}

	// Toggle section expansion state
	const toggleSection = section => {
		setExpandedSections(prev => ({
			...prev, // Keep existing section states
			[section]: !prev[section], // Toggle the specified section
		}))
	}

	// Toggle panel collapsed state with single click
	const togglePanel = () => {
		setIsCollapsed(!isCollapsed) // Toggle between collapsed and expanded states
	}

	// Set appropriate max-height on the summary content for scrolling
	useEffect(() => {
		if (contentRef.current) {
			// Make sure scrolling works properly with dynamic content
			contentRef.current.style.height = '300px' // Fixed height with scrolling for overflow
		}
	}, [data, selectedContractorInfo]) // Re-run when data or selected contractor changes

	return (
		<div className={`${styles.summaryPanel} ${isCollapsed ? styles.collapsed : ''}`}>
			{' '}
			{/* Main container with conditional collapsed class */}
			{/* Make the entire header clickable for toggling */}
			<div className={styles.summaryHeader} onClick={togglePanel}>
				{' '}
				{/* Header container with click handler */}
				<h3>Exploration Summary</h3> {/* Panel title */}
				<div className={styles.headerControls}>
					{' '}
					{/* Container for header control buttons */}
					<button
						className={styles.collapseButton} // Button for collapsing/expanding the panel
						onClick={e => {
							e.stopPropagation() // Prevent the header click from also firing
							togglePanel() // Toggle panel collapsed state
						}}
						title={isCollapsed ? 'Expand' : 'Collapse'}>
						{' '}
						{/* Tooltip text based on current state */}
						{isCollapsed ? '↓' : '↑'} {/* Arrow icon changes based on collapsed state */}
					</button>
					<button
						className={styles.closeButton} // Button for closing the panel
						onClick={e => {
							e.stopPropagation() // Prevent the header click from also firing
							onClose() // Call the onClose callback
						}}
						title='Close'>
						{' '}
						{/* Tooltip text */}× {/* Close (X) icon */}
					</button>
				</div>
			</div>
			<div ref={contentRef} className={styles.summaryContent}>
				{' '}
				{/* Content container with ref for height control */}
				{/* Selected Contractor View - shown when a contractor is selected */}
				{selectedContractorInfo && (
					<div className={styles.selectedContractorSection}>
						{' '}
						{/* Container for selected contractor info */}
						<h4>{selectedContractorInfo.name || 'Selected Contractor'}</h4> {/* Contractor name or default text */}
						<div className={styles.statsGrid}>
							{' '}
							{/* Grid layout for contractor statistics */}
							<div className={styles.statBox}>
								{' '}
								{/* Statistics box for areas */}
								<div className={styles.statValue}>{selectedContractorInfo.totalAreas || 0}</div> {/* Numeric value */}
								<div className={styles.statLabel}>Areas</div> {/* Label text */}
							</div>
							<div className={styles.statBox}>
								{' '}
								{/* Statistics box for blocks */}
								<div className={styles.statValue}>{selectedContractorInfo.totalBlocks || 0}</div> {/* Numeric value */}
								<div className={styles.statLabel}>Blocks</div> {/* Label text */}
							</div>
							{contractorSummary && ( // Only show these stats if contractor summary is available
								<>
									<div className={styles.statBox}>
										{' '}
										{/* Statistics box for total area */}
										<div className={styles.statValue}>
											{formatNumber(contractorSummary.summary.totalAreaKm2)} km²
										</div>{' '}
										{/* Formatted area value */}
										<div className={styles.statLabel}>Total Area</div> {/* Label text */}
									</div>
									<div className={styles.statBox}>
										{' '}
										{/* Statistics box for stations */}
										<div className={styles.statValue}>{formatNumber(contractorSummary.summary.totalStations)}</div>{' '}
										{/* Formatted station count */}
										<div className={styles.statLabel}>Stations</div> {/* Label text */}
									</div>
								</>
							)}
						</div>
						<button className={styles.viewDetailsButton} onClick={onViewContractorSummary}>
							{' '}
							{/* Button to view detailed summary */}
							View Detailed Summary
						</button>
					</div>
				)}
				{/* No contractor selected message or Overall Summary - shown when no contractor is selected */}
				{!selectedContractorInfo && (
					<div className={styles.globalSummarySection}>
						{' '}
						{/* Container for global summary or message */}
						{!data ? ( // Show message if no data is available
							<div className={styles.noContractorMessage}>
								{' '}
								{/* Container for no contractor message */}
								<p>No contractor selected</p> {/* Primary message */}
								<p className={styles.noContractorSubtext}>
									{' '}
									{/* Secondary instruction message */}
									Select a contractor from the filter panel to view detailed information.
								</p>
							</div>
						) : (
							// Show global statistics if data is available
							<>
								{/* Stats grid - 2x2 layout with bordered boxes */}
								<div className={styles.statsGrid}>
									{' '}
									{/* Grid layout for global statistics */}
									<div className={styles.statBox}>
										{' '}
										{/* Statistics box for contractors */}
										<div className={styles.statValue}>{data?.contractorCount || 0}</div>{' '}
										{/* Contractor count with fallback */}
										<div className={styles.statLabel}>Contractors</div> {/* Label text */}
									</div>
									<div className={styles.statBox}>
										{' '}
										{/* Statistics box for areas */}
										<div className={styles.statValue}>{data?.areaCount || 0}</div> {/* Area count with fallback */}
										<div className={styles.statLabel}>Areas</div> {/* Label text */}
									</div>
									<div className={styles.statBox}>
										{' '}
										{/* Statistics box for blocks */}
										<div className={styles.statValue}>{data?.blockCount || 0}</div> {/* Block count with fallback */}
										<div className={styles.statLabel}>Blocks</div> {/* Label text */}
									</div>
									<div className={styles.statBox}>
										{' '}
										{/* Statistics box for stations */}
										<div className={styles.statValue}>{data?.stationCount || 0}</div>{' '}
										{/* Station count with fallback */}
										<div className={styles.statLabel}>Stations</div> {/* Label text */}
									</div>
									<div className={styles.statBox}>
										{' '}
										{/* Statistics box for cruises */}
										<div className={styles.statValue}>{data?.cruiseCount || 0}</div> {/* Cruise count with fallback */}
										<div className={styles.statLabel}>Cruises</div> {/* Label text */}
									</div>
								</div>

								{/* Total Exploration Area - styled as a box */}
								<div className={styles.explorationAreaBox}>
									{' '}
									{/* Container for total area information */}
									<div className={styles.areaLabel}>Total Exploration Area:</div> {/* Label for total area */}
									<div className={styles.areaValue}>
										{' '}
										{/* Container for area value */}
										{data?.totalAreaSizeKm2 != null && !isNaN(data.totalAreaSizeKm2)
											? `${formatNumber(data.totalAreaSizeKm2)} km²` // Format area with units if valid
											: 'No data available'}{' '}
										{/* Fallback text if area is invalid */}
									</div>
								</div>

								{/* Contract Types section - with box styling */}
								<div className={styles.categoryBox}>
									{' '}
									{/* Container for contract types section */}
									<div className={styles.categoryHeader} onClick={() => toggleSection('contractTypes')}>
										{' '}
										{/* Clickable header to toggle */}
										<span>Mineral Types</span> {/* Section title */}
										<span className={styles.plusIcon}>{expandedSections.contractTypes ? '−' : '+'}</span>{' '}
										{/* Icon changes based on expansion state */}
									</div>
									{expandedSections.contractTypes && ( // Only show content if section is expanded
										<div className={styles.expandedContent}>
											{' '}
											{/* Container for expanded content */}
											{data &&
												Object.entries(data.contractTypes || {}).map(
													(
														[type, count] // Map contract types to list items
													) => (
														<div key={type} className={styles.expandedItem}>
															{' '}
															{/* List item with unique key */}
															<span>{type}</span> {/* Contract type name */}
															<span>{count}</span> {/* Contract type count */}
														</div>
													)
												)}
										</div>
									)}
								</div>

								{/* Sponsoring States section - with box styling */}
								<div className={styles.categoryBox}>
									{' '}
									{/* Container for sponsoring states section */}
									<div className={styles.categoryHeader} onClick={() => toggleSection('sponsoringStates')}>
										{' '}
										{/* Clickable header to toggle */}
										<span>Sponsoring States</span> {/* Section title */}
										<span className={styles.plusIcon}>{expandedSections.sponsoringStates ? '−' : '+'}</span>{' '}
										{/* Icon changes based on expansion state */}
									</div>
									{expandedSections.sponsoringStates && ( // Only show content if section is expanded
										<div className={styles.expandedContent}>
											{' '}
											{/* Container for expanded content */}
											{data &&
												Object.entries(data.sponsoringStates || {})
													.sort((a, b) => b[1] - a[1]) // Sort states by count in descending order
													.map(
														(
															[state, count] // Map sponsoring states to list items
														) => (
															<div key={state} className={styles.expandedItem}>
																{' '}
																{/* List item with unique key */}
																<span>{state}</span> {/* State name */}
																<span>{count}</span> {/* State count */}
															</div>
														)
													)}
										</div>
									)}
								</div>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default SummaryPanel
