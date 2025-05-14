import React from 'react' // Import React library
import styles from '../../styles/topics/ExplorationContracts.module.css' // Import CSS module for component styling
import { FaFileContract, FaFlask, FaHandshake } from 'react-icons/fa' // Import Font Awesome icons for feature sections
import { useLanguage } from '../../contexts/languageContext' // Import language context for translations

const ExplorationContracts: React.FC = () => {
	const { t } = useLanguage() // Get translation function from language context

	// Contract types booths data - array of objects for the three mineral contract types
	const contractBooths = [
		{
			id: 1,
			title: 'Polymetallic Nodules', // First contract type
			image: '../image/nodules.jpg', // Image path for nodules
			url: 'https://www.isa.org.jm/exploration-contracts/polymetallic-nodules/', // External link to ISA website
		},
		{
			id: 2,
			title: 'Polymetallic Sulphides', // Second contract type
			image: '../image/sulphides.jpg', // Image path for sulphides
			url: 'https://www.isa.org.jm/exploration-contracts/polymetallic-sulphides/', // External link to ISA website
		},
		{
			id: 3,
			title: 'Cobalt-rich Ferromanganese Crusts', // Third contract type
			image: '../image/crust.jpg', // Image path for crusts
			url: 'https://www.isa.org.jm/exploration-contracts/cobalt-rich-ferromanganese-crusts/', // External link to ISA website
		},
	]

	return (
		<div className={styles.container}>
			{' '}
			{/* Main container for the entire page */}
			{/* HERO SECTION - Top banner with title and subtitle */}
			<section className={styles.hero}>
				<div className={styles.heroText}>
					<h1 className={styles.heroTitle}>{t('explorationContracts.hero.title')}</h1>{' '}
					{/* Main page title - translated */}
					<p className={styles.heroSubtitle}>{t('explorationContracts.hero.subtitle')}</p> {/* Subtitle - translated */}
				</div>
			</section>
			{/* ABOUT SECTION - Information about exploration contracts with features */}
			<section className={styles.about}>
				<div className={styles.textBlock}>
					<h2>{t('explorationContracts.about.title')}</h2> {/* Section title - translated */}
					<p>{t('explorationContracts.about.description')}</p> {/* Main description text - translated */}
					<div className={styles.features}>
						{' '}
						{/* Features grid with three feature boxes */}
						<div className={styles.feature}>
							{' '}
							{/* First feature - Legal Framework */}
							<FaFileContract className={styles.icon} /> {/* Contract document icon */}
							<h3>{t('explorationContracts.about.features.legal.title')}</h3> {/* Feature title - translated */}
							<p>{t('explorationContracts.about.features.legal.description')}</p>{' '}
							{/* Feature description - translated */}
						</div>
						<div className={styles.feature}>
							{' '}
							{/* Second feature - Environmental Responsibilities */}
							<FaHandshake className={styles.icon} /> {/* Handshake icon */}
							<h3>{t('explorationContracts.about.features.environmental.title')}</h3> {/* Feature title - translated */}
							<p>{t('explorationContracts.about.features.environmental.description')}</p>{' '}
							{/* Feature description - translated */}
						</div>
						<div className={styles.feature}>
							{' '}
							{/* Third feature - Research and Development */}
							<FaFlask className={styles.icon} /> {/* Laboratory flask icon */}
							<h3>{t('explorationContracts.about.features.research.title')}</h3> {/* Feature title - translated */}
							<p>{t('explorationContracts.about.features.research.description')}</p>{' '}
							{/* Feature description - translated */}
						</div>
					</div>
				</div>

				<div className={styles.imageBlock}>
					{' '}
					{/* Image container for the main section image */}
					<img
						src='../image/miningContract.jpg' // Path to image file
						alt={t('explorationContracts.about.imageAlt')} // Accessible alt text - translated
						className={styles.image} // CSS class for styling
					/>
				</div>
			</section>
			{/* CONTRACT TYPES BOOTHS SECTION - Visual links to different contract types */}
			<section className={styles.contractTypesSection}>
				<h2 className={styles.sectionTitle}>{t('explorationContracts.typesSection.title')}</h2>{' '}
				{/* Section title - translated */}
				<div className={styles.contractTypeBooths}>
					{' '}
					{/* Grid container for contract type "booths" */}
					{contractBooths.map(
						(
							booth // Map through the contract types array to create each booth
						) => (
							<a key={booth.id} href={booth.url} className={styles.boothItem}>
								{' '}
								{/* Link to external ISA page */}
								<div className={styles.boothImage}>
									<img src={booth.image} alt={booth.title} /> {/* Contract type image */}
								</div>
								<h3 className={styles.boothTitle}>{booth.title}</h3> {/* Contract type title */}
							</a>
						)
					)}
				</div>
			</section>
			{/* DETAILS SECTION - Additional information and requirements */}
			<section className={styles.details}>
				<h2 className={styles.sectionTitle}>{t('explorationContracts.details.title')}</h2>{' '}
				{/* Section title - translated */}
				<p>{t('explorationContracts.details.paragraph1')}</p> {/* First paragraph - translated */}
				<p>{t('explorationContracts.details.paragraph2')}</p> {/* Second paragraph - translated */}
				<div className={styles.infoBox}>
					{' '}
					{/* Highlighted information box */}
					<h4>{t('explorationContracts.details.requirements.title')}</h4> {/* Requirements title - translated */}
					<ul className={styles.requirementsList}>
						{' '}
						{/* List of requirements */}
						<li>{t('explorationContracts.details.requirements.item1')}</li> {/* First requirement - translated */}
						<li>{t('explorationContracts.details.requirements.item2')}</li> {/* Second requirement - translated */}
						<li>{t('explorationContracts.details.requirements.item3')}</li> {/* Third requirement - translated */}
						<li>{t('explorationContracts.details.requirements.item4')}</li> {/* Fourth requirement - translated */}
						<li>{t('explorationContracts.details.requirements.item5')}</li> {/* Fifth requirement - translated */}
					</ul>
				</div>
			</section>
		</div>
	)
}

export default ExplorationContracts
