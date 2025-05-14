import React from 'react' // Import React library
import styles from '../../styles/information/terms.module.css' // Import CSS module for component styling

// Interface defining the component props - requires a translation function
interface TermsProps {
	t: (key: string) => string // Translation function that takes a key and returns the translated string
}

export const Terms: React.FC<TermsProps> = ({ t }) => {
	return (
		<div className={styles.container}>
			{' '}
			{/* Main container for the entire terms page */}
			{/* HERO SECTION - Top banner section with title and subtitle */}
			<section className={styles.hero}>
				<div className={styles.heroText}>
					<h1 className={styles.heroTitle}>{t('terms.title')}</h1> {/* Main page title - translated */}
					<p className={styles.heroSubtitle}>{t('terms.subtitle')}</p> {/* Subtitle text - translated */}
				</div>
			</section>
			{/* ABOUT SECTION - Brief overview and summary of terms content */}
			<section className={styles.about}>
				<div className={styles.textBlock}>
					<h2>{t('terms.overview.title')}</h2> {/* Overview section title */}
					<p>{t('terms.overview.paragraph1')}</p> {/* First overview paragraph */}
					<p>{t('terms.overview.paragraph2')}</p> {/* Second overview paragraph */}
					<div className={styles.features}>
						{' '}
						{/* Grid of feature boxes summarizing key sections */}
						<div className={styles.feature}>
							{' '}
							{/* First feature summary - Disclaimers */}
							<h3>{t('terms.toc.disclaimers')}</h3> {/* Disclaimers heading */}
							<p>{t('terms.disclaimers.paragraph1')}</p> {/* Brief disclaimer summary */}
						</div>
						<div className={styles.feature}>
							{' '}
							{/* Second feature summary - Immunities */}
							<h3>{t('terms.toc.immunities')}</h3> {/* Immunities heading */}
							<p>{t('terms.immunities.paragraph1')}</p> {/* Brief immunities summary */}
						</div>
						<div className={styles.feature}>
							{' '}
							{/* Third feature summary - General */}
							<h3>{t('terms.toc.general')}</h3> {/* General heading */}
							<p>{t('terms.general.paragraph1')}</p> {/* Brief general terms summary */}
						</div>
					</div>
				</div>
			</section>
			{/* DETAILS SECTION - Detailed terms sections */}
			<section className={styles.details}>
				{/* Disclaimers section - detailed legal disclaimers */}
				<div className={styles.infoBox} id='disclaimers'>
					{' '}
					{/* ID for direct linking/anchors */}
					<h3>
						<span className={styles.accordionIcon}>⚠️</span> {t('terms.disclaimers.title')} {/* Warning emoji icon */}
					</h3>
					<p>{t('terms.disclaimers.paragraph1')}</p> {/* First disclaimer paragraph */}
					<p>{t('terms.disclaimers.paragraph2')}</p> {/* Second disclaimer paragraph */}
				</div>

				{/* Preservation of Immunities section - legal immunities information */}
				<div className={styles.infoBox} id='immunities'>
					{' '}
					{/* ID for direct linking/anchors */}
					<h3>
						<span className={styles.accordionIcon}>🛡️</span> {t('terms.immunities.title')} {/* Shield emoji icon */}
					</h3>
					<p>{t('terms.immunities.paragraph1')}</p> {/* Immunities paragraph */}
				</div>

				{/* General Terms section - general legal terms */}
				<div className={styles.infoBox} id='general'>
					{' '}
					{/* ID for direct linking/anchors */}
					<h3>
						<span className={styles.accordionIcon}>⚙️</span> {t('terms.general.title')} {/* Gear emoji icon */}
					</h3>
					<p>{t('terms.general.paragraph1')}</p> {/* First general terms paragraph */}
					<p>{t('terms.general.paragraph2')}</p> {/* Second general terms paragraph */}
				</div>

				{/* Notification of Amendments section - how terms changes are handled */}
				<div className={styles.infoBox} id='amendments'>
					{' '}
					{/* ID for direct linking/anchors */}
					<h3>
						<span className={styles.accordionIcon}>✏️</span> {t('terms.amendments.title')} {/* Pencil emoji icon */}
					</h3>
					<p>{t('terms.amendments.paragraph1')}</p> {/* Amendments notification paragraph */}
				</div>
			</section>
		</div>
	)
}

export default Terms
