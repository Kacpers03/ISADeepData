// frontend/src/components/map/ui/layerControls.tsx
import React, { useState, useRef, useEffect } from 'react' // Import React and hooks for state and DOM manipulation
import styles from '../../../styles/map/controls.module.css' // Import CSS module for controls styling
import { useLanguage } from '../../../contexts/languageContext' // Import language context for multilingual support

// CompactLayerControls component for managing map layers and display settings
const CompactLayerControls = ({
	showAreas,
	setShowAreas, // Props for toggling areas layer visibility
	showBlocks,
	setShowBlocks, // Props for toggling blocks layer visibility
	showStations,
	setShowStations, // Props for toggling stations layer visibility
	showCruises, // Prop for cruises layer visibility state
	setShowCruises, // Prop for setting cruises layer visibility
	mapStyle,
	setMapStyle, // Props for changing the map base style
	showSummary,
	setShowSummary, // Props for toggling summary panel visibility
}) => {
	const [isOpen, setIsOpen] = useState(false) // State to track if controls panel is open
	const [activePanel, setActivePanel] = useState(null) // State to track which panel tab is active
	const controlsRef = useRef(null) // Reference to the controls container element
	const panelRef = useRef(null) // Reference to the panel element for positioning
	const { t } = useLanguage() // Get translation function from language context

	// Function to toggle the controls panel visibility
	const toggleControls = () => {
		setIsOpen(!isOpen) // Toggle open/closed state
		if (!isOpen) {
			setActivePanel('layers') // Default to layers panel when opening
		} else {
			setActivePanel(null) // Clear active panel when closing
		}
	}

	// Function to switch between panel tabs
	const switchPanel = panel => {
		setActivePanel(panel) // Set the active panel to the selected one
	}

	// Calculate fixed position for the controls panel to prevent it from moving when opened/closed
	useEffect(() => {
		if (controlsRef.current && panelRef.current && isOpen) {
			// This ensures the panel stays in a fixed position relative to the toggle button
			panelRef.current.style.position = 'absolute' // Set absolute positioning
			panelRef.current.style.right = '0' // Align to the right edge
			panelRef.current.style.bottom = '50px' // Position above the toggle button

			// Set max-height to ensure the panel doesn't overflow viewport
			const maxHeight = window.innerHeight - 100 // Keep some space from top/bottom edges
			panelRef.current.style.maxHeight = `${maxHeight}px` // Set maximum height
			panelRef.current.style.overflowY = 'auto' // Enable vertical scrolling if needed
		}
	}, [isOpen]) // Re-run effect when isOpen changes

	return (
		<div className={styles.compactControls} ref={controlsRef}>
			{' '}
			{/* Main container with reference for positioning */}
			{/* Main toggle button */}
			<button
				className={`${styles.controlsToggle} ${isOpen ? styles.controlsToggleActive : ''}`} // Apply active class when open
				onClick={toggleControls} // Toggle panel when clicked
				aria-expanded={isOpen} // Accessibility attribute for expanded state
				aria-label={t('map.controls.toggleMapControls') || 'Toggle map controls'}>
				{' '}
				{/* Accessible label with translation */}
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='20'
					height='20'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'>
					{' '}
					{/* Map icon SVG */}
					<polygon points='1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6'></polygon> {/* Map shape */}
					<line x1='8' y1='2' x2='8' y2='18'></line> {/* Map fold line */}
					<line x1='16' y1='6' x2='16' y2='22'></line> {/* Map fold line */}
				</svg>
				<span className={styles.controlsToggleLabel}>{t('map.controls.mapControls') || 'Map Controls'}</span>{' '}
				{/* Button text */}
			</button>
			{/* Controls panel - conditionally rendered when isOpen is true */}
			{isOpen && (
				<div className={styles.controlsPanel} ref={panelRef}>
					{' '}
					{/* Panel container with reference for positioning */}
					{/* Tabs navigation */}
					<div className={styles.controlsTabs}>
						{' '}
						{/* Container for tab buttons */}
						<button
							className={`${styles.controlsTab} ${activePanel === 'layers' ? styles.controlsTabActive : ''}`} // Apply active class when selected
							onClick={() => switchPanel('layers')}>
							{' '}
							{/* Set active panel to layers */}
							{t('map.controls.tabs.layers') || 'Layers'} {/* Tab text with translation */}
						</button>
						<button
							className={`${styles.controlsTab} ${activePanel === 'style' ? styles.controlsTabActive : ''}`} // Apply active class when selected
							onClick={() => switchPanel('style')}>
							{' '}
							{/* Set active panel to style */}
							{t('map.controls.tabs.style') || 'Style'} {/* Tab text with translation */}
						</button>
						<button
							className={`${styles.controlsTab} ${activePanel === 'display' ? styles.controlsTabActive : ''}`} // Apply active class when selected
							onClick={() => switchPanel('display')}>
							{' '}
							{/* Set active panel to display */}
							{t('map.controls.tabs.display') || 'Display'} {/* Tab text with translation */}
						</button>
						<button
							className={`${styles.controlsTab} ${activePanel === 'info' ? styles.controlsTabActive : ''}`} // Apply active class when selected
							onClick={() => switchPanel('info')}>
							{' '}
							{/* Set active panel to info */}
							{t('map.controls.tabs.info') || 'Info'} {/* Tab text with translation */}
						</button>
					</div>
					<div className={styles.controlsContent}>
						{' '}
						{/* Container for tab content */}
						{/* Layers panel content - shown when activePanel is 'layers' */}
						{activePanel === 'layers' && (
							<div className={styles.layersPanel}>
								{' '}
								{/* Container for layers panel */}
								<div className={styles.layerToggles}>
									{' '}
									{/* Container for layer toggle checkboxes */}
									<label className={styles.layerToggle}>
										{' '}
										{/* Checkbox label container */}
										<input type='checkbox' checked={showAreas} onChange={() => setShowAreas(!showAreas)} />{' '}
										{/* Areas checkbox */}
										<span className={styles.layerToggleLabel}>{t('map.controls.layers.areas') || 'Areas'}</span>{' '}
										{/* Checkbox label */}
									</label>
									<label className={styles.layerToggle}>
										{' '}
										{/* Checkbox label container */}
										<input type='checkbox' checked={showBlocks} onChange={() => setShowBlocks(!showBlocks)} />{' '}
										{/* Blocks checkbox */}
										<span className={styles.layerToggleLabel}>{t('map.controls.layers.blocks') || 'Blocks'}</span>{' '}
										{/* Checkbox label */}
									</label>
									<label className={styles.layerToggle}>
										{' '}
										{/* Checkbox label container */}
										<input
											type='checkbox'
											checked={showStations}
											onChange={() => setShowStations(!showStations)}
										/>{' '}
										{/* Stations checkbox */}
										<span className={styles.layerToggleLabel}>
											{t('map.controls.layers.stations') || 'Stations'}
										</span>{' '}
										{/* Checkbox label */}
									</label>
									<label className={styles.layerToggle}>
										{' '}
										{/* Checkbox label container */}
										<input type='checkbox' checked={showCruises} onChange={() => setShowCruises(!showCruises)} />{' '}
										{/* Cruises checkbox */}
										<span className={styles.layerToggleLabel}>
											{t('map.controls.layers.cruises') || 'Cruises'}
										</span>{' '}
										{/* Checkbox label */}
									</label>
								</div>
							</div>
						)}
						{/* Style panel content - shown when activePanel is 'style' */}
						{activePanel === 'style' && (
							<div className={styles.stylePanel}>
								{' '}
								{/* Container for style panel */}
								<label className={styles.styleSelectLabel}>
									{t('map.controls.style.mapStyle') || 'Map Style'}
								</label>{' '}
								{/* Select label */}
								<select className={styles.styleSelect} value={mapStyle} onChange={e => setMapStyle(e.target.value)}>
									{' '}
									{/* Style dropdown */}
									<option value='mapbox://styles/mapbox/streets-v11'>
										{t('map.controls.style.streets') || 'Streets'} {/* Streets style option */}
									</option>
									<option value='mapbox://styles/mapbox/outdoors-v11'>
										{t('map.controls.style.outdoors') || 'Outdoors'} {/* Outdoors style option */}
									</option>
									<option value='mapbox://styles/mapbox/satellite-v9'>
										{t('map.controls.style.satellite') || 'Satellite'} {/* Satellite style option */}
									</option>
									<option value='mapbox://styles/mapbox/light-v10'>{t('map.controls.style.light') || 'Light'}</option>{' '}
									{/* Light style option */}
									<option value='mapbox://styles/mapbox/dark-v10'>{t('map.controls.style.dark') || 'Dark'}</option>{' '}
									{/* Dark style option */}
								</select>
							</div>
						)}
						{/* Display panel content - shown when activePanel is 'display' */}
						{activePanel === 'display' && (
							<div className={styles.displayPanel}>
								{' '}
								{/* Container for display panel */}
								<button className={styles.toggleSummaryButton} onClick={() => setShowSummary(!showSummary)}>
									{' '}
									{/* Summary toggle button */}
									{showSummary
										? t('map.controls.display.hideSummary') || 'Hide Summary Panel' // Text when summary is visible
										: t('map.controls.display.showSummary') || 'Show Summary Panel'}{' '}
									{/* Text when summary is hidden */}
								</button>
								<div className={styles.infoText}>
									{' '}
									{/* Informational text container */}
									{t('map.controls.display.summaryDescription') ||
										'The summary panel displays statistics about currently visible exploration data.'}{' '}
									{/* Description text */}
								</div>
								<div className={styles.displayTip}>
									{' '}
									{/* Tip container */}
									<div className={styles.tipIcon}>💡</div> {/* Lightbulb icon */}
									<div className={styles.tipText}>
										{' '}
										{/* Tip text container */}
										{t('map.controls.display.tip') ||
											'When you select a contractor, the map will automatically zoom to its areas.'}{' '}
										{/* Tip text */}
									</div>
								</div>
							</div>
						)}
						{/* Info panel content - shown when activePanel is 'info' */}
						{activePanel === 'info' && (
							<div className={styles.infoPanel}>
								{' '}
								{/* Container for info panel */}
								<div className={styles.mapLegendCompact}>
									{' '}
									{/* Legend container */}
									<div className={styles.legendItem}>
										{' '}
										{/* Legend item for stations */}
										<div className={styles.stationMarkerIcon}></div> {/* Station icon */}
										<div>
											<strong>{t('map.controls.info.stations') || 'Stations'}</strong> {/* Item label */}
											<div className={styles.legendDescription}>
												{' '}
												{/* Description container */}
												{t('map.controls.info.stationsDesc') ||
													'Exploration or research sites with collected data'}{' '}
												{/* Description text */}
											</div>
										</div>
									</div>
									<div className={styles.legendItem}>
										{' '}
										{/* Legend item for blocks */}
										<div className={styles.blockIcon}></div> {/* Block icon */}
										<div>
											<strong>{t('map.controls.info.blocks') || 'Blocks'}</strong> {/* Item label */}
											<div className={styles.legendDescription}>
												{' '}
												{/* Description container */}
												{t('map.controls.info.blocksDesc') || 'Designated exploration areas by contractor'}{' '}
												{/* Description text */}
											</div>
										</div>
									</div>
									<div className={styles.legendItem}>
										{' '}
										{/* Legend item for areas */}
										<div className={styles.areaIcon}></div> {/* Area icon */}
										<div>
											<strong>{t('map.controls.info.areas') || 'Areas'}</strong> {/* Item label */}
											<div className={styles.legendDescription}>
												{' '}
												{/* Description container */}
												{t('map.controls.info.areasDesc') || 'Larger zones containing multiple blocks'}{' '}
												{/* Description text */}
											</div>
										</div>
									</div>
									<div className={styles.legendItem}>
										{' '}
										{/* Legend item for cruises */}
										<div className={styles.cruiseIcon}>
											{' '}
											{/* Cruise icon container */}
											<svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
												{' '}
												{/* Cruise SVG icon */}
												<path
													d='M12 8C14.2091 8 16 6.20914 16 4C16 1.79086 14.2091 0 12 0C9.79086 0 8 1.79086 8 4C8 6.20914 9.79086 8 12 8Z'
													fill='#8B4513' // Ship hull color
												/>
												<path d='M12 9V21' stroke='#8B4513' strokeWidth='3' strokeLinecap='round' /> {/* Ship mast */}
												<path
													d='M5 13.4V17.4C5 17.4 8 21.5 12 17.4C16 21.5 19 17.4 19 17.4V13.4'
													stroke='#8B4513'
													strokeWidth='3'
													strokeLinecap='round' // Ship sails
												/>
											</svg>
										</div>
										<div>
											<strong>{t('map.controls.info.cruises') || 'Cruises'}</strong> {/* Item label */}
											<div className={styles.legendDescription}>
												{' '}
												{/* Description container */}
												{t('map.controls.info.cruisesDesc') || 'Research voyages with connected stations'}{' '}
												{/* Description text */}
											</div>
										</div>
									</div>
								</div>
								<div className={styles.infoTip}>
									{' '}
									{/* Info tip container */}
									<div className={styles.tipIcon}>ℹ️</div> {/* Info icon */}
									<div className={styles.tipText}>
										{' '}
										{/* Tip text container */}
										{t('map.controls.info.filterTip') ||
											'Use filters on the left to search by contractor or region'}{' '}
										{/* Tip text */}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default CompactLayerControls 
