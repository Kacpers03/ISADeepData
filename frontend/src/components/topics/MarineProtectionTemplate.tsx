import React from 'react' // Import React library
import styles from '../../styles/topics/MarineProtection.module.css' // Import CSS module for component styling
import { FaShieldAlt, FaChartLine, FaMicroscope } from 'react-icons/fa' // Import Font Awesome icons for feature sections
import { useLanguage } from '../../contexts/languageContext' // Import language context for translations

const MarineProtection: React.FC = () => {
	const { t } = useLanguage() // Get translation function from language context

	// Protection approach booths based on ISA.org.jm content - data array for the three approach types
	const approachBooths = [
		{
			id: 1,
			title: 'Environmental Management Plans', // First approach type
			description: 'Regional Environmental Management Plans for different areas of the seabed', // Short description
			image: '../image/emp.jpg', // Image path for EMPs
			url: '/marine-protection/environmental-management-plans', // Internal app route
		},
		{
			id: 2,
			title: 'Environmental Impact Assessments', // Second approach type
			description: 'Guidelines and procedures for assessing potential environmental impacts', // Short description
			image: '../image/eia.jpg', // Image path for EIAs
			url: '/marine-protection/environmental-impact-assessments', // Internal app route
		},
		{
			id: 3,
			title: 'Preservation Reference Zones', // Third approach type
			description: 'Areas set aside for monitoring the environmental impacts of activities in the Area', // Short description
			image: '../image/preservation.jpg', // Image path for PRZs
			url: '/marine-protection/preservation-reference-zones', // Internal app route
		},
	]

	return (
		<div className={styles.container}>
			{' '}
			{/* Main container for the entire page */}
			{/* HERO SECTION - Top banner with title and subtitle */}
			<section className={styles.hero}>
				<div className={styles.heroText}>
					<h1 className={styles.heroTitle}>Protection of the Marine Environment</h1>{' '}
					{/* Main page title - hardcoded English */}
					<p className={styles.heroSubtitle}>
						Ensuring the effective protection of the marine environment from harmful effects of deep-seabed mining
						activities
					</p>{' '}
					{/* Subtitle - hardcoded English (note: not using translation function) */}
				</div>
			</section>
			{/* ABOUT SECTION - Information about marine protection with features */}
			<section className={styles.about}>
				<div className={styles.textBlock}>
					<h2>About Marine Environmental Protection</h2> {/* Section title - hardcoded English */}
					<p>
						The International Seabed Authority is committed to ensuring that the marine environment is protected from
						any harmful effects which may arise during deep-seabed related activities. This commitment is embedded in
						the United Nations Convention on the Law of the Sea and the 1994 Agreement.
					</p>{' '}
					{/* Main description text - hardcoded English */}
					<div className={styles.features}>
						{' '}
						{/* Features grid with three feature boxes */}
						<div className={styles.feature}>
							{' '}
							{/* First feature - Protection & Preservation */}
							<FaShieldAlt className={styles.icon} /> {/* Shield icon */}
							<h3>Protection & Preservation</h3> {/* Feature title - hardcoded English */}
							<p>Safeguarding marine biodiversity and ecosystem functions in the international seabed area</p>{' '}
							{/* Feature description */}
						</div>
						<div className={styles.feature}>
							{' '}
							{/* Second feature - Environmental Assessment */}
							<FaChartLine className={styles.icon} /> {/* Chart line icon */}
							<h3>Environmental Assessment</h3> {/* Feature title - hardcoded English */}
							<p>
								Evaluating potential impacts of deep-seabed activities through scientific research and monitoring
							</p>{' '}
							{/* Feature description */}
						</div>
						<div className={styles.feature}>
							{' '}
							{/* Third feature - Scientific Research */}
							<FaMicroscope className={styles.icon} /> {/* Microscope icon */}
							<h3>Scientific Research</h3> {/* Feature title - hardcoded English */}
							<p>Advancing knowledge of deep-sea ecosystems to inform evidence-based protection measures</p>{' '}
							{/* Feature description */}
						</div>
					</div>
				</div>

				<div className={styles.imageBlock}>
					{' '}
					{/* Image container for the main section image */}
					<img
						src='../image/ProtectionMarineEnvironment.jpg' // Path to image file
						alt='Marine Environment Protection' // Accessible alt text - hardcoded English
						className={styles.image} // CSS class for styling
					/>
				</div>
			</section>
			{/* LEGAL FRAMEWORK SECTION - Information about legal basis for marine protection */}
			<section className={styles.frameworkSection}>
				<h2 className={styles.sectionTitle}>Legal Framework</h2> {/* Section title - hardcoded English */}
				<p>
					The legal regime for the protection and preservation of the marine environment in the Area is established by
					the Convention and the 1994 Agreement, and implemented through the rules, regulations and procedures adopted
					by the Authority. These include:
				</p>{' '}
				{/* Section description - hardcoded English */}
				<ul className={styles.frameworkList}>
					{' '}
					{/* List of framework components */}
					<li>Exploration regulations for the three mineral types</li> {/* First component */}
					<li>Environmental recommendations for contractors</li> {/* Second component */}
					<li>LTC recommendations for the guidance of contractors</li> {/* Third component */}
					<li>Strategic Plan and High-Level Action Plan</li> {/* Fourth component */}
				</ul>
			</section>
		</div>
	)
}

export default MarineProtection
