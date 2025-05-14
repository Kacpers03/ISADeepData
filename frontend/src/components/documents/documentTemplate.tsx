// frontend/src/components/documents/documentTemplate.tsx
import React, { ReactNode } from 'react' // Imports React and ReactNode type for children prop
import { useLanguage } from '../../contexts/languageContext' // Imports language context for translations
import styles from '../../styles/document/document.module.css' // Imports CSS modules for component styling

// Interface defining the prop types for this component
interface DocumentTemplateProps {
	children?: ReactNode // Optional children prop that can be any valid React node
}

export default function DocumentTemplate({ children }: DocumentTemplateProps) {
	const { t } = useLanguage() // Gets translation function from language context

	return (
		<div className={styles.documentPage}>
			{' '}
			{/* Main container with page styling from CSS module */}
			<div className={styles.documentContainer}>
				{' '}
				{/* Inner container with specific document styling */}
				<h1 className={styles.documentTitle}>{t('documents.title')}</h1> {/* Main document title - translated */}
				<p className={styles.documentDescription}>{t('documents.userManual.description')}</p>{' '}
				{/* Document description text */}
				<div className={styles.contentsSection}>
					{' '}
					{/* Section for table of contents */}
					<h2 className={styles.contentsTitle}>{t('documents.userManual.contents.title')}</h2>{' '}
					{/* Contents section title */}
					<ul className={styles.contentsList}>
						{' '}
						{/* Unordered list for table of contents items */}
						<li>{t('documents.userManual.contents.item1')}</li> {/* First content item - translated */}
						<li>{t('documents.userManual.contents.item2')}</li> {/* Second content item - translated */}
						<li>{t('documents.userManual.contents.item3')}</li> {/* Third content item - translated */}
						<li>{t('documents.userManual.contents.item4')}</li> {/* Fourth content item - translated */}
						<li>{t('documents.userManual.contents.item5')}</li> {/* Fifth content item - translated */}
					</ul>
				</div>
				<div className={styles.buttonContainer}>
					{' '}
					{/* Container for the document download/open button */}
					<a href='/docs/UserManualISA.pdf' target='_blank' rel='noopener noreferrer' className={styles.documentButton}>
						{/* Link to PDF file, opening in new tab with security attributes */}
						<span>{t('documents.userManual.openManual')}</span> {/* Button text - translated */}
						<svg className={styles.buttonIcon} viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
							{/* Document/PDF icon SVG */}
							<path
								d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
								fill='none'
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
							/>
						</svg>
					</a>
				</div>
				{children} {/* Renders any child components passed to this template */}
			</div>
		</div>
	)
}
