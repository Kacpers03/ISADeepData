import React from 'react' // Import React library
import styles from '../../styles/topics/Workshops.module.css' // Import CSS module for component styling
import { useLanguage } from '../../contexts/languageContext' // Import language context for translations

const WorkshopsTemplate: React.FC = () => {
	const { t } = useLanguage() // Get translation function from language context

	// Workshop data from the ISA website image - array of upcoming and recent workshops
	const workshops = [
		{
			id: 1,
			title:
				'Advancing marine spatial planning in Areas Beyond National Jurisdiction for sustainable deep-sea stewardship: best practices and key insights from the REMP process',
			date: '23 April 2025 - 27 April 2025', // Workshop dates
			url: 'https://www.isa.org.jm/events/advancing-marine-spatial-planning-in-areas-beyond-national-jurisdiction-for-sustainable-deep-sea-stewardship-best-practices-and-key-insights-from-the-remp-process/',
			// External URL to ISA website
		},
		{
			id: 2,
			title: 'Advancing Caribbean Blue Economy through Deep Sea Research',
			date: '26 November 2024 - 28 November 2024', // Workshop dates
			url: 'https://www.isa.org.jm/events/advancing-caribbean-blue-economy-through-deep-sea-research/',
			// External URL to ISA website
		},
		{
			id: 3,
			title: 'Technical workshop | Scientific and legal aspects of Test Mining',
			date: '16 December 2024 - 17 December 2024', // Workshop dates
			url: 'https://www.isa.org.jm/events/technical-workshop-scientific-and-legal-aspects-of-test-mining/',
			// External URL to ISA website
		},
		{
			id: 4,
			title:
				'Workshop on the development of a Regional Environmental Management Plan for the Area of the Indian Ocean, with a focus on the Mid-Ocean Ridges and Central Indian Ocean Basin',
			date: '27 April 2025 - 1 May 2025', // Workshop dates
			url: 'https://www.isa.org.jm/events/workshop-on-the-development-of-a-remp-for-the-area-of-the-indian-ocean/',
			// External URL to ISA website
		},
		{
			id: 5,
			title:
				'Workshop on the Development of a Regional Environmental Management Plan for the Area of the Northwest Pacific',
			date: '19 February 2024 - 23 February 2024', // Workshop dates
			url: 'https://www.isa.org.jm/events/workshop-on-the-development-of-a-regional-environmental-management-plan-for-the-area-of-the-northwest-pacific-2/',
			// External URL to ISA website
		},
		{
			id: 6,
			title:
				'Workshop on the development of a scientific approach to identifying key deep-sea taxa in support of the protection of the marine environment in the Area',
			date: '3 June 2024 - 6 June 2024', // Workshop dates
			url: 'https://www.isa.org.jm/events/workshop-on-the-development-of-a-scientific-approach-to-identifying-key-deep-sea-taxa-in-support-of-the-protection-of-the-marine-environment-in-the-area/',
			// External URL to ISA website
		},
		{
			id: 7,
			title:
				'Expert scoping workshop on charting future horizons: harnessing advanced technologies for the protection and sustainable use of the international seabed area',
			date: '3 April 2024 - 5 April 2024', // Workshop dates
			url: 'https://www.isa.org.jm/events/expert-scoping-workshop-on-charting-future-horizons-harnessing-advanced-technologies-for-the-protection-and-sustainable-use-of-the-international-seabed-area/',
			// External URL to ISA website
		},
		{
			id: 8,
			title: 'ISA-Philippines National Capacity Development Workshop on deep-sea related matters',
			date: '9 October 2023 - 11 October 2023', // Workshop dates
			url: 'https://www.isa.org.jm/events/isa-philippines-national-capacity-development-workshop-on-deep-sea-related-matters/',
			// External URL to ISA website
		},
		{
			id: 9,
			title:
				'Workshop on the Development of a Regional Environmental Management Plan for the Area of the Northwest Pacific',
			date: '19 February 2024 - 23 February 2024', // Workshop dates (duplicate entry in original image)
			url: 'https://www.isa.org.jm/events/workshop-on-the-development-of-a-regional-environmental-management-plan-for-the-area-of-the-northwest-pacific-2/',
			// External URL to ISA website
		},
		{
			id: 10,
			title: 'Workshop on Enhancing Biological Data Sharing to Advance Deep-Sea Taxonomy',
			date: '3 October 2023 - 6 October 2023', // Workshop dates
			url: 'https://www.isa.org.jm/events/workshop-on-enhancing-biological-data-sharing-to-advance-deep-sea-taxonomy/',
			// External URL to ISA website
		},
	]

	// For the yearly archive counts (from the image) - array of workshop counts by year
	const yearlyWorkshops = [
		{ year: '2025', count: 2 }, // 2025 workshops count
		{ year: '2024', count: 6 }, // 2024 workshops count
		{ year: '2023', count: 3 }, // 2023 workshops count
		{ year: '2022', count: 5 }, // 2022 workshops count
		{ year: '2021', count: 8 }, // 2021 workshops count
	]

	// For all events (not just workshops) by year - array of event counts by year
	const yearlyEvents = [
		{ year: '2025', count: 2 }, // 2025 events count
		{ year: '2024', count: 15 }, // 2024 events count
		{ year: '2023', count: 8 }, // 2023 events count
		{ year: '2022', count: 17 }, // 2022 events count
		{ year: '2021', count: 9 }, // 2021 events count
	]

	// Redirect to specific workshop page - opens URL in new tab
	const redirectToWorkshop = (url: string) => {
		window.open(url, '_blank') // Open in new browser tab
	}

	return (
		<div className={styles.container}>
			{' '}
			{/* Main container for the entire page */}
			{/* Hero Section - Top banner with title and subtitle */}
			<section className={styles.hero}>
				<div className={styles.heroText}>
					<h1 className={styles.heroTitle}>{t('workshops.hero.title')}</h1> {/* Main page title - translated */}
					<p className={styles.heroSubtitle}>{t('workshops.hero.subtitle')}</p> {/* Subtitle - translated */}
				</div>
			</section>
			{/* Workshops List - Similar to ISA site layout with main content and sidebar */}
			<section className={styles.workshopsList}>
				<div className={styles.mainContent}>
					{' '}
					{/* Main content area with workshop items */}
					{workshops.map(workshop => (
						<div key={workshop.id} className={styles.workshopItem} onClick={() => redirectToWorkshop(workshop.url)}>
							{' '}
							{/* Workshop item - clickable */}
							<div className={styles.workshopDate}>{workshop.date}</div> {/* Workshop date display */}
							<h3 className={styles.workshopTitle}>{workshop.title}</h3> {/* Workshop title */}
						</div>
					))}
				</div>

				{/* Sidebar with yearly archives - right side column */}
				<div className={styles.sidebar}>
					<div className={styles.archiveSection}>
						{' '}
						{/* Workshops by year section */}
						<h2 className={styles.archiveTitle}>WORKSHOPS BY YEAR</h2> {/* Section heading */}
						<ul className={styles.archiveList}>
							{' '}
							{/* List of yearly workshop counts */}
							{yearlyWorkshops.map(item => (
								<li key={item.year} className={styles.archiveItem}>
									{' '}
									{/* Year list item */}
									<span className={styles.archiveYear}>{item.year}</span> {/* Year */}
									<span className={styles.archiveCount}>({item.count})</span> {/* Count in parentheses */}
								</li>
							))}
						</ul>
					</div>

					<div className={styles.archiveSection}>
						{' '}
						{/* Events by year section */}
						<h2 className={styles.archiveTitle}>EVENTS BY YEAR</h2> {/* Section heading */}
						<ul className={styles.archiveList}>
							{' '}
							{/* List of yearly event counts */}
							{yearlyEvents.map(item => (
								<li key={item.year} className={styles.archiveItem}>
									{' '}
									{/* Year list item */}
									<span className={styles.archiveYear}>{item.year}</span> {/* Year */}
									<span className={styles.archiveCount}>({item.count})</span> {/* Count in parentheses */}
								</li>
							))}
						</ul>
					</div>

					<div className={styles.viewAllSection}>
						{' '}
						{/* View all archived events section */}
						<a
							href='https://www.isa.org.jm/events-archive/'
							target='_blank'
							rel='noopener noreferrer'
							className={styles.viewAllButton}>
							{' '}
							{/* External link to ISA archive */}
							All Archived Events → {/* Button text with arrow */}
						</a>
					</div>
				</div>
			</section>
		</div>
	)
}

export default WorkshopsTemplate
