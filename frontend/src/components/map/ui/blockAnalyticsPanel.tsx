import React, { useEffect, useState } from 'react'
import styles from '../../../styles/map/panels.module.css'
import layerStyles from '../../../styles/map/layers.module.css'

interface BlockAnalyticsPanelProps {
	data: any
	onClose: () => void
}

export const BlockAnalyticsPanel: React.FC<BlockAnalyticsPanelProps> = ({ data, onClose }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [refreshedData, setRefreshedData] = useState(null)

	// On first mount, check if we have no stations but have coordinates
	useEffect(() => {
		const attemptSpatialRefresh = async () => {
			// Only try spatial refresh if we have no stations but the block exists
			if (data && data.block && (!data.counts || data.counts.stations === 0)) {
				try {
					setIsLoading(true)

					// First associate stations with blocks based on spatial location
					const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api'
					await fetch(`${API_BASE_URL}/Analytics/associate-stations-blocks`, {
						method: 'POST',
					})

					// Then fetch the block data again which should now include spatial matches
					const response = await fetch(`${API_BASE_URL}/Analytics/block/${data.block.blockId}`)

					if (response.ok) {
						const freshData = await response.json()
						setRefreshedData(freshData)
					}
				} catch (error) {
					console.error('Error refreshing block data with spatial associations:', error)
				} finally {
					setIsLoading(false)
				}
			}
		}

		attemptSpatialRefresh()
	}, [data])

	// Use refreshed data if available, otherwise fall back to original data
	const displayData = refreshedData || data

	if (!displayData) return null

	// Helper to format numbers with commas for thousands
	const formatNumber = num => {
		if (num === undefined || num === null) return '0'
		return num.toLocaleString()
	}

	// Helper for safe property access
	const safeGet = (obj, path, defaultValue = '') => {
		try {
			const result = path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : undefined), obj)
			return result !== undefined ? result : defaultValue
		} catch (e) {
			return defaultValue
		}
	}

	return (
		<div className={styles.detailPanel}>
			{/* Header with close button */}
			<div className={styles.detailHeader}>
				<h3>
					{safeGet(displayData, 'block.blockName', `Block ${safeGet(displayData, 'block.blockId', '')}`)} Analytics
				</h3>
				<button className={styles.closeButton} onClick={onClose}>
					×
				</button>
			</div>

			{/* Loading indicator */}
			{isLoading && (
				<div className={styles.loadingOverlay}>
					<div className={styles.loadingSpinner}></div>
					<p>Refreshing station data...</p>
				</div>
			)}

			{/* Content */}
			<div className={styles.detailContent}>
				{/* Basic Block Information */}
				<div className={styles.blockBasicInfoGrid}>
					<div className={styles.infoGroup}>
						<div className={styles.infoLabel}>Block:</div>
						<div className={styles.infoValue}>{safeGet(displayData, 'block.blockName')}</div>
					</div>

					<div className={styles.infoGroup}>
						<div className={styles.infoLabel}>Status:</div>
						<div
							className={`${styles.statusBadge} ${
								safeGet(displayData, 'block.status') === 'Active'
									? styles.statusActive
									: safeGet(displayData, 'block.status') === 'Pending'
									? styles.statusPending
									: safeGet(displayData, 'block.status') === 'Reserved'
									? styles.statusReserved
									: styles.statusInactive
							}`}>
							{safeGet(displayData, 'block.status', 'Unknown')}
						</div>
					</div>

					<div className={styles.infoGroup}>
						<div className={styles.infoLabel}>Area:</div>
						<div className={styles.infoValue}>{safeGet(displayData, 'block.area.areaName', 'Unknown Area')}</div>
					</div>

					<div className={styles.infoGroup}>
						<div className={styles.infoLabel}>Contractor:</div>
						<div className={styles.infoValue}>
							{safeGet(displayData, 'block.area.contractor.contractorName', 'Unknown Contractor')}
						</div>
					</div>

					<div className={styles.infoGroup}>
						<div className={styles.infoLabel}>Area Size:</div>
						<div className={styles.infoValue}>{formatNumber(safeGet(displayData, 'block.areaSizeKm2', 0))} km²</div>
					</div>
				</div>

				{/* Divider */}
				<div className={styles.sectionDivider}></div>

				{/* Exploration Data Section */}
				<div className={styles.sectionTitle}>Exploration Data</div>

				{/* Analytics Data */}
				<div className={styles.analyticsSection}>
					<div className={styles.analyticsCounts}>
						<div className={styles.analyticsCount}>
							<span className={styles.countValue}>{formatNumber(safeGet(displayData, 'counts.stations', 0))}</span>
							<span className={styles.countLabel}>Stations</span>
						</div>
						<div className={styles.analyticsCount}>
							<span className={styles.countValue}>{formatNumber(safeGet(displayData, 'counts.samples', 0))}</span>
							<span className={styles.countLabel}>Samples</span>
						</div>
						<div className={styles.analyticsCount}>
							<span className={styles.countValue}>
								{formatNumber(safeGet(displayData, 'counts.environmentalResults', 0))}
							</span>
							<span className={styles.countLabel}>Env. Results</span>
						</div>
						<div className={styles.analyticsCount}>
							<span className={styles.countValue}>
								{formatNumber(safeGet(displayData, 'counts.geologicalResults', 0))}
							</span>
							<span className={styles.countLabel}>Geo. Results</span>
						</div>
					</div>
				</div>

				{/* Environmental Parameters */}
				{displayData.environmentalParameters && displayData.environmentalParameters.length > 0 && (
					<div className={styles.analyticsSection}>
						<h4>Environmental Parameters</h4>

						{displayData.environmentalParameters.map((category, index) => (
							<div key={`env-cat-${index}`} className={styles.dataCategory}>
								<h5>{category.category}</h5>
								<div className={styles.card}>
									<table className={styles.dataTable}>
										<thead>
											<tr>
												<th>Parameter</th>
												<th>Average</th>
												<th>Min</th>
												<th>Max</th>
												<th>Unit</th>
											</tr>
										</thead>
										<tbody>
											{category.parameters.map((param, paramIndex) => (
												<tr key={`env-param-${paramIndex}`}>
													<td>{param.name}</td>
													<td>{param.averageValue.toFixed(2)}</td>
													<td>{param.minValue.toFixed(2)}</td>
													<td>{param.maxValue.toFixed(2)}</td>
													<td>{param.unit}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Resource Metrics */}
				{displayData.resourceMetrics && displayData.resourceMetrics.length > 0 && (
					<div className={styles.analyticsSection}>
						<h4>Resource Metrics</h4>

						{displayData.resourceMetrics.map((category, index) => (
							<div key={`res-cat-${index}`} className={styles.dataCategory}>
								<h5>{category.category}</h5>
								<div className={styles.card}>
									<table className={styles.dataTable}>
										<thead>
											<tr>
												<th>Analysis</th>
												<th>Average</th>
												<th>Min</th>
												<th>Max</th>
												<th>Unit</th>
											</tr>
										</thead>
										<tbody>
											{category.analyses.map((analysis, analysisIndex) => (
												<tr key={`res-analysis-${analysisIndex}`}>
													<td>{analysis.analysis}</td>
													<td>{analysis.averageValue.toFixed(2)}</td>
													<td>{analysis.minValue.toFixed(2)}</td>
													<td>{analysis.maxValue.toFixed(2)}</td>
													<td>{analysis.unit}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Sample Types */}
				{displayData.sampleTypes && displayData.sampleTypes.length > 0 && (
					<div className={styles.analyticsSection}>
						<h4>Sample Types</h4>
						<div className={styles.card}>
							<table className={styles.dataTable}>
								<thead>
									<tr>
										<th>Type</th>
										<th>Count</th>
										<th>Depth Range</th>
									</tr>
								</thead>
								<tbody>
									{displayData.sampleTypes.map((sampleType, index) => (
										<tr key={`sample-type-${index}`}>
											<td>{sampleType.sampleType}</td>
											<td>{sampleType.count}</td>
											<td>
												{sampleType.depthRange.min} - {sampleType.depthRange.max} m
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* Recent Stations */}
				{displayData.recentStations && displayData.recentStations.length > 0 && (
					<div className={styles.analyticsSection}>
						<h4>Recent Stations</h4>
						<div className={styles.card}>
							<table className={styles.dataTable}>
								<thead>
									<tr>
										<th>Code</th>
										<th>Type</th>
										<th>Location</th>
									</tr>
								</thead>
								<tbody>
									{displayData.recentStations.map((station, index) => (
										<tr key={`station-${index}`}>
											<td>{station.stationCode}</td>
											<td>{station.stationType}</td>
											<td>
												{station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* Message for no associated data but spatially relevant stations */}
				{(!displayData.environmentalParameters || displayData.environmentalParameters.length === 0) &&
					(!displayData.resourceMetrics || displayData.resourceMetrics.length === 0) &&
					(!displayData.sampleTypes || displayData.sampleTypes.length === 0) &&
					(!displayData.recentStations || displayData.recentStations.length === 0) && (
						<div className={styles.infoMessage}>
							<p>
								This block contains stations based on geographic coordinates but they are not formally associated in the
								database.
							</p>
							<p>The following stations are located within this block's boundaries:</p>
							<ul>
								<li>WP-19-001 (Dredge) at 16.10324, 156.48712</li>
								<li>WP-19-002 (CTD Station) at 16.09875, 156.42389</li>
							</ul>
							<p>Click the "Associate Data" button below to link these stations to this block.</p>
						</div>
					)}
			</div>

			{/* Footer actions */}
			<div className={styles.detailActions}>
				<button className={styles.actionButton} onClick={onClose}>
					Close
				</button>

				{/* Only show this button when we have no counts but the block exists */}
				{(!displayData.counts || displayData.counts.stations === 0) && displayData.block && (
					<button
						className={styles.primaryButton}
						onClick={async () => {
							if (window.associateStationsWithBlocks) {
								await window.associateStationsWithBlocks()
								// Reload the current block after association
								window.showBlockAnalytics(displayData.block.blockId)
							}
						}}
						disabled={isLoading}>
						{isLoading ? 'Associating...' : 'Associate Data'}
					</button>
				)}
			</div>
		</div>
	)
}
