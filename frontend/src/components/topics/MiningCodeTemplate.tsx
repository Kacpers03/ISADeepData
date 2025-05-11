import React from 'react' // Import React library
import styles from '../../styles/topics/MiningCode.module.css' // Import CSS module for component styling
import { FaBook, FaFileContract, FaTools } from 'react-icons/fa' // Import Font Awesome icons for feature sections
import { useLanguage } from '../../contexts/languageContext' // Import language context for translations

const MiningCode: React.FC = () => {
	const { t } = useLanguage() // Get translation function from language context

	// Mining code components based on ISA.org.jm content - data array for the three code components
	const codeComponents = [
		{
			id: 1,
			title: 'Exploration Regulations', // First component
			description: 'Regulations on prospecting and exploration for mineral resources', // Short description
			image: '../image/exploration.jpg', // Image path
			url: '/mining-code/exploration-regulations', // Internal app route
		},
		{
			id: 2,
			title: 'Exploitation Regulations', // Second component
			description: 'Draft regulations on exploitation of mineral resources in the Area', // Short description
			image: '../image/exploitation.jpg', // Image path
			url: '/mining-code/exploitation-regulations', // Internal app route
		},
		{
			id: 3,
			title: 'Recommendations & Guidelines', // Third component
			description: 'Environmental assessments and technical guidance for contractors', // Short description
			image: '../image/recommendations.jpg', // Image path
			url: '/mining-code/recommendations', // Internal app route
		},
	]

	return (
		<div className={styles.container}>
			{' '}
			{/* Main container for the entire page */}
			{/* HERO SECTION - Top banner with title and subtitle */}
			<section className={styles.hero}>
				<div className={styles.heroText}>
					<h1 className={styles.heroTitle}>The Mining Code</h1> {/* Main page title - hardcoded English */}
					<p className={styles.heroSubtitle}>
						The comprehensive set of rules, regulations and procedures that regulate prospecting, exploration and
						exploitation of marine minerals in the international seabed Area
					</p>{' '}
					{/* Subtitle - hardcoded English (note: not using translation function) */}
				</div>
			</section>
			{/* ABOUT SECTION - Information about mining code with features */}
			<section className={styles.about}>
				<div className={styles.textBlock}>
					<h2>About the Mining Code</h2> {/* Section title - hardcoded English */}
					<p>
						The "Mining Code" refers to the whole of the comprehensive set of rules, regulations and procedures issued
						by the International Seabed Authority to regulate prospecting, exploration and exploitation of marine
						minerals in the international seabed Area.
					</p>{' '}
					{/* Main description text - hardcoded English */}
					<div className={styles.features}>
						{' '}
						{/* Features grid with three feature boxes */}
						<div className={styles.feature}>
							{' '}
							{/* First feature - Regulations */}
							<FaBook className={styles.icon} /> {/* Book icon */}
							<h3>Regulations</h3> {/* Feature title - hardcoded English */}
							<p>Rules governing exploration and exploitation activities in the Area</p> {/* Feature description */}
						</div>
						<div className={styles.feature}>
							{' '}
							{/* Second feature - Contracts */}
							<FaFileContract className={styles.icon} /> {/* Contract document icon */}
							<h3>Contracts</h3> {/* Feature title - hardcoded English */}
							<p>Legal instruments governing the relationship between ISA and contractors</p>{' '}
							{/* Feature description */}
						</div>
						<div className={styles.feature}>
							{' '}
							{/* Third feature - Standards & Guidelines */}
							<FaTools className={styles.icon} /> {/* Tools icon */}
							<h3>Standards & Guidelines</h3> {/* Feature title - hardcoded English */}
							<p>Technical and environmental guidance for deep-seabed mining operations</p> {/* Feature description */}
						</div>
					</div>
				</div>

				<div className={styles.imageBlock}>
					{' '}
					{/* Image container for the main section image */}
					<img src='../image/MiningCode.jpg' alt='Mining Code overview' className={styles.image} />{' '}
					{/* Main section image */}
				</div>
			</section>
			{/* DEVELOPMENT SECTION - Information about the development process of the Mining Code */}
			<section className={styles.developmentSection}>
				<h2 className={styles.sectionTitle}>Development of the Mining Code</h2>{' '}
				{/* Section title - hardcoded English */}
				<p>
					The development of the Mining Code takes place in several phases. The first phase focused on exploration for
					polymetallic nodules. This was followed by regulations on prospecting and exploration for polymetallic
					sulphides (2010) and cobalt-rich ferromanganese crusts (2012).
				</p>{' '}
				{/* First paragraph - hardcoded English */}
				<p>
					The Authority is currently working on the next phase: the development of regulations to govern the
					exploitation of mineral resources in the Area. This includes provisions to ensure effective protection of the
					marine environment and equitable sharing of financial and other economic benefits derived from activities in
					the Area.
				</p>{' '}
				{/* Second paragraph - hardcoded English */}
			</section>
			{/* LEGAL SECTION - Information about the legal basis for the Mining Code */}
			<section className={styles.legalSection}>
				<h2 className={styles.sectionTitle}>Legal Framework</h2> {/* Section title - hardcoded English */}
				<p>
					The Mining Code is issued within the legal framework established by the United Nations Convention on the Law
					of the Sea of 10 December 1982 and the 1994 Agreement relating to the Implementation of Part XI of the United
					Nations Convention on the Law of the Sea.
				</p>{' '}
				{/* Section description - hardcoded English */}
				<div className={styles.frameworkBox}>
					{' '}
					{/* Highlighted information box */}
					<h4>Current Exploration Regulations Cover:</h4> {/* Box title - hardcoded English */}
					<ul className={styles.regulationsList}>
						{' '}
						{/* List of regulations */}
						<li>Polymetallic nodules (adopted 13 July 2000; updated 25 July 2013)</li> {/* First regulation */}
						<li>Polymetallic sulphides (adopted 7 May 2010)</li> {/* Second regulation */}
						<li>Cobalt-rich ferromanganese crusts (adopted 27 July 2012)</li> {/* Third regulation */}
					</ul>
				</div>
			</section>
		</div>
	)
}

export default MiningCode
