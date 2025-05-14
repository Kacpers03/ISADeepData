// frontend/src/components/map/ui/detailPanel.tsx
import React, { useState } from 'react' // Import React and useState hook for component state management
import { Station, Contractor, Cruise, Sample, Media } from '../../../types/filter-types' // Import type definitions for data models
import styles from '../../../styles/map/panels.module.css' // Import CSS module for panel styling
import uiStyles from '../../../styles/map/ui.module.css' // Import CSS module for UI element styling
import layerStyles from '../../../styles/map/layers.module.css' // Import CSS module for map layer styling
import { exportStationCSV, exportCruiseCSV, exportContractorCSV } from '../../../utils/detailExport' // Import CSV export utility functions
import { useLanguage } from '../../../contexts/languageContext' // Import language context for multilingual support

// Interface defining the props for the DetailPanel component
interface DetailPanelProps {
	type: 'contractor' | 'cruise' | 'station' | null // The type of entity to display
	station: Station | null // Station data (if type is 'station')
	contractor: Contractor | null // Contractor data (if type is 'contractor')
	cruise: Cruise | null // Cruise data (if type is 'cruise')
	onClose: () => void // Callback function to close the panel
	mapData?: any // Full map data for contractor exports (optional)
}

// Combine multiple style objects for easier access
const combinedStyles = { ...styles, ...uiStyles, ...layerStyles }

// DetailPanel component for displaying detailed information about map entities
export const DetailPanel: React.FC<DetailPanelProps> = ({ type, station, contractor, cruise, onClose, mapData }) => {
	// State for tracking export process status
	const [isExporting, setIsExporting] = useState(false) // Flag for export in progress
	const [exportStatus, setExportStatus] = useState<string | null>(null) // Status message during export
	const { t } = useLanguage() // Get translation function from language context

	// Helper function to format date strings consistently
	const formatDate = (dateString: string) => {
		if (!dateString) return 'N/A' // Handle empty dates
		return new Date(dateString).toLocaleDateString() // Format date using browser locale
	}

	// Generate media URL based on MediaId (following the pattern from GalleryController.cs)
	const getMediaUrl = (mediaId: number) => {
		// Map each MediaId to one of organism1.jpg through organism8.jpg (same logic as backend)
		const fileIndex = (mediaId % 8) + 1 // Calculate image index using modulo
		const mappedFileName = `organism${fileIndex}.jpg` // Generate filename based on index
		return `https://isagallerystorage.blob.core.windows.net/gallery/${mappedFileName}` // Construct full URL
	}

	// Handle CSV download based on panel type
	const handleDownloadCSV = () => {
		if (!mapData) {
			console.error('Missing mapData for export') // Log error if mapData is missing
			return // Exit early if data is missing
		}

		setIsExporting(true) // Set export flag to show loading state
		setExportStatus('Preparing data...') // Set initial status message

		try {
			let success = false // Initialize success flag

			// Call appropriate export function based on panel type
			if (type === 'station' && station) {
				success = exportStationCSV(station, mapData, 'station-data') // Export station data
			} else if (type === 'cruise' && cruise) {
				success = exportCruiseCSV(cruise, mapData, 'cruise-data') // Export cruise data
			} else if (type === 'contractor' && contractor) {
				success = exportContractorCSV(contractor, mapData, 'contractor-data') // Export contractor data
			}

			if (success) {
				setExportStatus('Download successful!') // Set success message
			} else {
				setExportStatus('Export failed. Try again.') // Set failure message
			}
		} catch (error) {
			console.error('Error during CSV export:', error) // Log any errors that occur
			setExportStatus('Error exporting data') // Set error message
		}

		// Reset status after a delay
		setTimeout(() => {
			setIsExporting(false) // Clear export flag
			setExportStatus(null) // Clear status message
		}, 2000) // Wait 2 seconds before clearing
	}

	return (
		// Main container with panel styling
		<div className={styles.detailPanel}>
			{/* Header with close button */}
			<div className={styles.detailHeader}>
				<h3>
					{type === 'contractor' && contractor
						? contractor.contractorName // Show contractor name for contractor type
						: type === 'cruise' && cruise
						? cruise.cruiseName // Show cruise name for cruise type
						: type === 'station' && station
						? `Station ${station.stationCode}` // Show station code for station type
						: 'Details'}{' '}
					{/* Default title if type is not recognized */}
				</h3>
				{/* Close button with X symbol */}
				<button className={styles.closeButton} onClick={onClose}>
					×
				</button>
			</div>

			{/* Content based on type */}
			<div className={styles.detailContent}>
				{/* Contractor Details */}
				{type === 'contractor' && contractor && (
					<div className={styles.contractorDetails}>
						{/* Field container with label and value */}
						<div className={styles.detailField}>
							{/* Field label */}
							<span className={styles.fieldLabel}>Contractor Name:</span>
							{/* Field value */}
							<span>{contractor.contractorName}</span>
						</div>

						<div className={styles.detailField}>
							<span className={styles.fieldLabel}>Contract Type:</span>
							<span>{contractor.contractType}</span>
						</div>

						<div className={styles.detailField}>
							<span className={styles.fieldLabel}>Contract Status:</span>
							<span>{contractor.contractStatus}</span>
						</div>

						<div className={styles.detailField}>
							<span className={styles.fieldLabel}>Contract Number:</span>
							<span>{contractor.contractNumber}</span>
						</div>

						<div className={styles.detailField}>
							<span className={styles.fieldLabel}>Sponsoring State:</span>
							<span>{contractor.sponsoringState}</span>
						</div>

						<div className={styles.detailField}>
							<span className={styles.fieldLabel}>Contractual Year:</span>
							<span>{contractor.contractualYear}</span>
						</div>

						{/* Only show remarks if they exist */}
						{contractor.remarks && (
							<div className={styles.detailField}>
								<span className={styles.fieldLabel}>Remarks:</span>
								<span>{contractor.remarks}</span>
							</div>
						)}

						{/* Areas */}
						{/* Only show areas section if areas exist */}
						{contractor.areas && contractor.areas.length > 0 && (
							<div className={styles.detailSection}>
								{/* Section header with count */}
								<h4>Areas ({contractor.areas.length})</h4>
								{/* Container for area items */}
								<div className={styles.areaList}>
									{/* Map through each area to create area items */}
									{contractor.areas.map(area => (
										<div key={area.areaId} className={styles.areaItem}>
											{/* Area name heading */}
											<h5>{area.areaName}</h5>
											{/* Area description paragraph */}
											<p>{area.areaDescription}</p>

											{/* Blocks */}
											{/* Only show blocks if they exist */}
											{area.blocks && area.blocks.length > 0 && (
												<div className={styles.blockList}>
													{/* Blocks header with count */}
													<h6>Blocks ({area.blocks.length})</h6>
													{/* Table for blocks data */}
													<table className={styles.dataTable}>
														<thead>
															<tr>
																{/* Table header for block name */}
																<th>Name</th>
																{/* Table header for block status */}
																<th>Status</th>
															</tr>
														</thead>
														<tbody>
															{/* Map through each block to create table rows */}
															{area.blocks.map(block => (
																<tr key={block.blockId}>
																	{/* Block name cell */}
																	<td>{block.blockName}</td>
																	{/* Block status cell */}
																	<td>{block.status}</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				{/* Cruise Details */}
				{type === 'cruise' && cruise && (
					<div className={styles.cruiseDetails}>
						<div className={styles.detailField}>
							<span className={styles.fieldLabel}>Cruise Name:</span>
							<span>{cruise.cruiseName}</span>
						</div>

						<div className={styles.detailField}>
							<span className={styles.fieldLabel}>Research Vessel:</span>
							<span>{cruise.researchVessel}</span>
						</div>

						<div className={styles.detailField}>
							<span className={styles.fieldLabel}>Start Date:</span>
							{/* Format date using helper function */}
							<span>{formatDate(cruise.startDate)}</span>
						</div>

						<div className={styles.detailField}>
							<span className={styles.fieldLabel}>End Date:</span>
							{/* Format date using helper function */}
							<span>{formatDate(cruise.endDate)}</span>
						</div>

						{/* Stations */}
						{/* Only show stations section if stations exist */}
						{cruise.stations && cruise.stations.length > 0 && (
							<div className={styles.detailSection}>
								{/* Section header with count */}
								<h4>Stations ({cruise.stations.length})</h4>
								{/* Card container with combined styling */}
								<div className={combinedStyles.card}>
									{/* Table for stations data */}
									<table className={combinedStyles.dataTable}>
										<thead>
											<tr>
												{/* Table header for station code */}
												<th>Code</th>
												{/* Table header for station type */}
												<th>Type</th>
												{/* Table header for latitude */}
												<th>Latitude</th>
												{/* Table header for longitude */}
												<th>Longitude</th>
											</tr>
										</thead>
										<tbody>
											{/* Map through each station to create table rows */}
											{cruise.stations.map(station => (
												<tr key={station.stationId}>
													{/* Station code cell */}
													<td>{station.stationCode}</td>
													{/* Station type cell */}
													<td>{station.stationType}</td>
													{/* Latitude cell with 4 decimal places */}
													<td>{station.latitude.toFixed(4)}</td>
													{/* Longitude cell with 4 decimal places */}
													<td>{station.longitude.toFixed(4)}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Station Details */}
				{type === 'station' && station && (
					<div className={styles.stationDetails}>
						<div className={styles.detailField}>
							<span className={styles.fieldLabel}>Station Code:</span>
							<span>{station.stationCode}</span>
						</div>

						<div className={styles.detailField}>
							<span className={styles.fieldLabel}>Station Type:</span>
							<span>{station.stationType}</span>
						</div>

						<div className={styles.detailField}>
							<span className={styles.fieldLabel}>Coordinates:</span>
							{/* Format coordinates with 6 decimal places */}
							<span>
								{station.latitude.toFixed(6)}, {station.longitude.toFixed(6)}
							</span>
						</div>

						{/* Samples */}
						{/* Only show samples section if samples exist */}
						{station.samples && station.samples.length > 0 && (
							<div className={styles.detailSection}>
								{/* Section header with count */}
								<h4>Samples ({station.samples.length})</h4>
								{/* Card container with combined styling */}
								<div className={combinedStyles.card}>
									{/* Accordion container for expandable items */}
									<div className={styles.accordionList}>
										{/* Map through each sample to create accordion items */}
										{station.samples.map(sample => (
											<div key={sample.sampleId} className={styles.accordionItem}>
												{/* Accordion header (always visible) */}
												<div className={styles.accordionHeader}>
													{/* Sample identifier display */}
													<span>
														{sample.sampleCode} - {sample.sampleType}
													</span>
												</div>
												{/* Accordion content (expanded area) */}
												<div className={styles.accordionContent}>
													<div className={styles.detailField}>
														<span className={styles.fieldLabel}>Matrix Type:</span>
														<span>{sample.matrixType}</span>
													</div>
													<div className={styles.detailField}>
														<span className={styles.fieldLabel}>Habitat Type:</span>
														<span>{sample.habitatType}</span>
													</div>
													<div className={styles.detailField}>
														<span className={styles.fieldLabel}>Sampling Device:</span>
														<span>{sample.samplingDevice}</span>
													</div>
													<div className={styles.detailField}>
														<span className={styles.fieldLabel}>Depth Range:</span>
														{/* Depth range with units */}
														<span>
															{sample.depthLower} - {sample.depthUpper} m
														</span>
													</div>

													{/* Media - Updated to display images */}
													{/* Only show media section if media exists */}
													{sample.photoVideos && sample.photoVideos.length > 0 && (
														<div className={styles.mediaList}>
															{/* Media section header with count */}
															<h5>Media ({sample.photoVideos.length})</h5>
															{/* Grid layout for media items */}
															<div className={styles.mediaGrid}>
																{/* Map through each media item */}
																{sample.photoVideos.map(media => (
																	<div key={media.mediaId} className={styles.mediaCard}>
																		{/* Add the image display */}
																		<div className={styles.mediaImage}>
																			<img
																				src={getMediaUrl(media.mediaId)}
																				alt={media.fileName || 'Sample media'}
																				style={{
																					width: '100%',
																					height: '120px',
																					objectFit: 'cover',
																					borderTopLeftRadius: '6px',
																					borderTopRightRadius: '6px',
																				}}
																			/>
																		</div>
																		{/* Container for media metadata */}
																		<div className={styles.mediaInfo}>
																			{/* Media filename with emphasis */}
																			<strong>{media.fileName}</strong>
																			{/* Media type */}
																			<span>{media.mediaType}</span>
																			{/* Capture date */}
																			<span>Captured: {formatDate(media.captureDate)}</span>
																		</div>
																	</div>
																))}
															</div>
														</div>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Action buttons */}
			<div className={styles.detailActions}>
				{/* Close button */}
				<button className={styles.actionButton} onClick={onClose}>
					{' '}
					{/* Translated text with fallback */}
					{t('map.detailPanel.close') || 'Close'}
				</button>

				{/* CSV Download button */}
				<button
					className={styles.downloadButton || styles.actionButton}
					onClick={handleDownloadCSV}
					disabled={isExporting}>
					{isExporting ? (
						<>
							{/* Loading spinner animation */}
							<span className={styles.buttonSpinner}></span>
							{/* Status message with fallback */}
							<span>{exportStatus || 'Exporting...'}</span>
						</>
					) : (
						<>{t('map.detailPanel.downloadCSV') || 'Download CSV'}</>
					)}
				</button>
			</div>
		</div>
	)
}
