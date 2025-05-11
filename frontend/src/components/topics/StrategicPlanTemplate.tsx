import React from 'react' // Import React library
import { useRouter } from 'next/router' // Import Next.js router for navigation
import styles from '../../styles/topics/StrategicPlan.module.css' // Import CSS module for component styling
import { FaBalanceScale, FaLeaf, FaGlobeAmericas } from 'react-icons/fa' // Import Font Awesome icons for feature sections
import { useLanguage } from '../../contexts/languageContext' // Import language context for translations

const StrategicPlan: React.FC = () => {
	const router = useRouter() // Initialize Next.js router
	const { t } = useLanguage() // Get translation function from language context

	// Handler for download button click - navigates to PDF page
	const handleDownloadClick = () => {
		router.push('/StrategicPlanPDF') // Navigate to the PDF page route
	}

	return (
		<div className={styles.container}>
			{' '}
			{/* Main container for the entire page */}
			{/* HERO SECTION - Top banner with title and subtitle */}
			<section className={styles.hero}>
				<div className={styles.heroText}>
					<h1 className={styles.heroTitle}>{t('strategicPlan.hero.title')}</h1> {/* Main page title - translated */}
					<p className={styles.heroSubtitle}>{t('strategicPlan.hero.subtitle')}</p> {/* Subtitle - translated */}
				</div>
			</section>
			{/* ABOUT SECTION - Information about strategic plan with features */}
			<section className={styles.about}>
				<div className={styles.aboutContent}>
					{' '}
					{/* Text content container */}
					<h2>{t('strategicPlan.about.title')}</h2> {/* Section title - translated */}
					<p>{t('strategicPlan.about.description')}</p> {/* Main description text - translated */}
					<div className={styles.features}>
						{' '}
						{/* Features container for the three strategic directions */}
						<div className={styles.feature}>
							{' '}
							{/* First feature - Regulatory Framework */}
							<div className={styles.featureHeader}>
								{' '}
								{/* Feature header with title and icon */}
								<h3>{t('strategicPlan.features.regulation.title')}</h3> {/* Feature title - translated */}
								<FaBalanceScale className={styles.icon} /> {/* Balance scale icon */}
							</div>
							<p className={styles.featureSummary}>{t('strategicPlan.features.regulation.description')}</p>{' '}
							{/* Brief summary - translated */}
							<p className={styles.featureDetails}>{t('strategicPlan.features.regulation.details')}</p>{' '}
							{/* Detailed description - translated */}
						</div>
						<div className={styles.feature}>
							{' '}
							{/* Second feature - Environmental Protection */}
							<div className={styles.featureHeader}>
								{' '}
								{/* Feature header with title and icon */}
								<h3>{t('strategicPlan.features.environment.title')}</h3> {/* Feature title - translated */}
								<FaLeaf className={styles.icon} /> {/* Leaf icon */}
							</div>
							<p className={styles.featureSummary}>{t('strategicPlan.features.environment.description')}</p>{' '}
							{/* Brief summary - translated */}
							<p className={styles.featureDetails}>{t('strategicPlan.features.environment.details')}</p>{' '}
							{/* Detailed description - translated */}
						</div>
						<div className={styles.feature}>
							{' '}
							{/* Third feature - International Collaboration */}
							<div className={styles.featureHeader}>
								{' '}
								{/* Feature header with title and icon */}
								<h3>{t('strategicPlan.features.collaboration.title')}</h3> {/* Feature title - translated */}
								<FaGlobeAmericas className={styles.icon} /> {/* Globe icon */}
							</div>
							<p className={styles.featureSummary}>{t('strategicPlan.features.collaboration.description')}</p>{' '}
							{/* Brief summary - translated */}
							<p className={styles.featureDetails}>{t('strategicPlan.features.collaboration.details')}</p>{' '}
							{/* Detailed description - translated */}
						</div>
					</div>
				</div>

				<div className={styles.aboutImage}>
					{' '}
					{/* Image container for the main section image */}
					<img src='../image/StrategicPicture.jpg' alt='ISA Strategic Directions' className={styles.image} />{' '}
					{/* Main section image */}
				</div>
			</section>
		</div>
	)
}

export default StrategicPlan
