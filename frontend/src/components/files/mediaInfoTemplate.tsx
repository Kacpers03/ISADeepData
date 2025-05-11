// components/files/mediaInfoTemplate.tsx
import React from 'react' // Import React
import { useRouter } from 'next/router' // Import Next.js router for navigation
import styles from '../../styles/files/mediaInfo.module.css' // Import CSS module for styling
import {
	ArrowLeft,
	Download,
	Calendar,
	User,
	FileText,
	Tag,
	AlertCircle,
	Shield,
	Map,
	Globe,
	Clock,
} from 'lucide-react' // Import Lucide icons for UI elements
import { FileInfo } from '../../types/fileTypes' // Import file information type
import { Contractor, ContractorArea, ContractorAreaBlock } from '../../types/filter-types' // Import related type definitions
import { useLanguage } from '../../contexts/languageContext' // Import language context for translations

// Interface defining the component props
interface FileInfoProps {
	fileInfo: FileInfo // File information object to display
}

const MediaInfoTemplate: React.FC<FileInfoProps> = ({ fileInfo }) => {
	const router = useRouter() // Initialize router for navigation
	const { t } = useLanguage() // Get translation function

	// Format the date properly (assuming date comes in as ISO string)
	const formatDate = (dateString: string) => {
		if (!dateString) return t('library.fileInfo.na') || 'N/A' // Handle missing dates

		try {
			const date = new Date(dateString)
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			}) // Format as "Month Day, Year"
		} catch (e) {
			// If date can't be parsed, return the original string or first part
			return dateString.split('T')[0] || dateString // Fallback to YYYY-MM-DD format
		}
	}

	return (
		<div className={styles.pageContainer}>
			{' '}
			{/* Main page container */}
			<div className={styles.header}>
				{' '}
				{/* Page header with back button */}
				<div className={styles.headerContent}>
					<button
						className={styles.backButton}
						onClick={() => router.back()} // Return to previous page
						aria-label={t('library.fileInfo.goBack') || 'Go back'}>
						<ArrowLeft size={20} />
						<span>{t('library.fileInfo.backToFiles') || 'Back to Files'}</span>
					</button>
					<h1 className={styles.pageTitle}>{t('library.fileInfo.title') || 'File Information'}</h1> {/* Page title */}
				</div>
			</div>
			<div className={styles.contentContainer}>
				{' '}
				{/* Main content container */}
				<div className={styles.mediaInfoCard}>
					{' '}
					{/* Card container for file information */}
					<div className={styles.titleSection}>
						{' '}
						{/* Title section with confidential badge if needed */}
						<h2 className={styles.fileTitle}>{fileInfo.title}</h2> {/* File title */}
						{fileInfo.isConfidential && (
							<div className={styles.confidentialBadge}>
								<Shield size={16} />
								<span>{t('library.fileInfo.confidential') || 'Confidential'}</span> {/* Confidential badge */}
							</div>
						)}
					</div>
					<div className={styles.divider}></div> {/* Visual divider */}
					<div className={styles.fileMetaGrid}>
						{' '}
						{/* Grid for file metadata items */}
						{/* File name info with download button */}
						<div className={styles.metaItem}>
							<div className={styles.metaLabel}>
								<FileText size={18} />
								<span>{t('library.fileInfo.fileName') || 'File Name'}</span>
							</div>
							<div className={styles.metaValue}>
								<span className={styles.fileNameValue}>{fileInfo.fileName.split('/').pop() || fileInfo.fileName}</span>
								<a
									href={fileInfo.fileName}
									download
									target='_blank'
									rel='noopener noreferrer'
									className={styles.downloadButton}
									aria-label={t('library.fileInfo.downloadFile') || 'Download file'}>
									<Download size={16} />
									<span>{t('library.fileInfo.download') || 'Download'}</span>
								</a>
							</div>
						</div>
						{/* Theme information */}
						<div className={styles.metaItem}>
							<div className={styles.metaLabel}>
								<Tag size={18} />
								<span>{t('library.fileInfo.theme') || 'Theme'}</span>
							</div>
							<div className={styles.metaValue}>{fileInfo.theme}</div>
						</div>
						{/* Contractor information */}
						<div className={styles.metaItem}>
							<div className={styles.metaLabel}>
								<User size={18} />
								<span>{t('library.fileInfo.contractor') || 'Contractor'}</span>
							</div>
							<div className={styles.metaValue}>
								{fileInfo.contractor}
								{fileInfo.contractorObj && (
									<span className={styles.metaExtra}>
										{t('library.fileInfo.contractType') || 'Contract Type'}: {fileInfo.contractorObj.contractType}
									</span>
								)}
							</div>
						</div>
						{/* Submission date */}
						<div className={styles.metaItem}>
							<div className={styles.metaLabel}>
								<Calendar size={18} />
								<span>{t('library.fileInfo.submissionDate') || 'Submission Date'}</span>
							</div>
							<div className={styles.metaValue}>{formatDate(fileInfo.submissionDate)}</div> {/* Formatted date */}
						</div>
						{/* Country information - conditionally rendered if available */}
						{fileInfo.country && (
							<div className={styles.metaItem}>
								<div className={styles.metaLabel}>
									<Globe size={18} />
									<span>{t('library.fileInfo.country') || 'Country'}</span>
								</div>
								<div className={styles.metaValue}>{fileInfo.country}</div>
							</div>
						)}
						{/* Year information - conditionally rendered if available */}
						{fileInfo.year && (
							<div className={styles.metaItem}>
								<div className={styles.metaLabel}>
									<Clock size={18} />
									<span>{t('library.fileInfo.year') || 'Year'}</span>
								</div>
								<div className={styles.metaValue}>{fileInfo.year}</div>
							</div>
						)}
						{/* Contractor area information - conditionally rendered if available */}
						{fileInfo.contractorArea && (
							<div className={styles.metaItem}>
								<div className={styles.metaLabel}>
									<Map size={18} />
									<span>{t('library.fileInfo.contractArea') || 'Contract Area'}</span>
								</div>
								<div className={styles.metaValue}>
									{fileInfo.contractorArea.areaName}
									{fileInfo.contractorArea.totalAreaSizeKm2 && (
										<span className={styles.metaExtra}>
											{t('library.fileInfo.size') || 'Size'}: {fileInfo.contractorArea.totalAreaSizeKm2} km²
										</span>
									)}
								</div>
							</div>
						)}
					</div>
					{/* Description section */}
					<div className={styles.descriptionSection}>
						<div className={styles.descriptionHeader}>
							<AlertCircle size={18} />
							<h3>{t('library.fileInfo.description') || 'Description'}</h3>
						</div>
						<p className={styles.descriptionText}>{fileInfo.description}</p>
					</div>
					{/* Block information section - conditionally rendered if available */}
					{fileInfo.contractorBlock && (
						<div className={styles.relatedInfoSection}>
							<div className={styles.sectionHeader}>
								<Map size={18} />
								<h3>{t('library.fileInfo.blockInformation') || 'Block Information'}</h3>
							</div>
							<div className={styles.blockInfo}>
								<div className={styles.blockInfoItem}>
									<span className={styles.blockInfoLabel}>{t('library.fileInfo.blockName') || 'Block Name'}:</span>
									<span className={styles.blockInfoValue}>{fileInfo.contractorBlock.blockName}</span>
								</div>
								{fileInfo.contractorBlock.status && (
									<div className={styles.blockInfoItem}>
										<span className={styles.blockInfoLabel}>{t('library.fileInfo.status') || 'Status'}:</span>
										<span className={styles.blockInfoValue}>{fileInfo.contractorBlock.status}</span>
									</div>
								)}
								{fileInfo.contractorBlock.areaSizeKm2 && (
									<div className={styles.blockInfoItem}>
										<span className={styles.blockInfoLabel}>{t('library.fileInfo.areaSize') || 'Area Size'}:</span>
										<span className={styles.blockInfoValue}>{fileInfo.contractorBlock.areaSizeKm2} km²</span>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default MediaInfoTemplate
