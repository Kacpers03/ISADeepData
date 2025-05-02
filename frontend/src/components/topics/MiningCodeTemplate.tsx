import React from 'react'
import styles from '../../styles/topics/MiningCode.module.css'
import { FaBook, FaFileContract, FaTools } from 'react-icons/fa'
import { useLanguage } from '../../contexts/languageContext'

const MiningCode: React.FC = () => {
	const { t } = useLanguage()

	// Mining code components based on ISA.org.jm content
	const codeComponents = [
		{
			id: 1,
			title: 'Exploration Regulations',
			description: 'Regulations on prospecting and exploration for mineral resources',
			image: '../image/exploration.jpg',
			url: '/mining-code/exploration-regulations',
		},
		{
			id: 2,
			title: 'Exploitation Regulations',
			description: 'Draft regulations on exploitation of mineral resources in the Area',
			image: '../image/exploitation.jpg',
			url: '/mining-code/exploitation-regulations',
		},
		{
			id: 3,
			title: 'Recommendations & Guidelines',
			description: 'Environmental assessments and technical guidance for contractors',
			image: '../image/recommendations.jpg',
			url: '/mining-code/recommendations',
		},
	]

	return (
		<div className={styles.container}>
			{/* HERO SECTION */}
			<section className={styles.hero}>
				<div className={styles.heroText}>
					<h1 className={styles.heroTitle}>The Mining Code</h1>
					<p className={styles.heroSubtitle}>
						The comprehensive set of rules, regulations and procedures that regulate prospecting, exploration and
						exploitation of marine minerals in the international seabed Area
					</p>
				</div>
			</section>

			{/* ABOUT SECTION */}
			<section className={styles.about}>
				<div className={styles.textBlock}>
					<h2>About the Mining Code</h2>
					<p>
						The "Mining Code" refers to the whole of the comprehensive set of rules, regulations and procedures issued
						by the International Seabed Authority to regulate prospecting, exploration and exploitation of marine
						minerals in the international seabed Area.
					</p>

					<div className={styles.features}>
						<div className={styles.feature}>
							<FaBook className={styles.icon} />
							<h3>Regulations</h3>
							<p>Rules governing exploration and exploitation activities in the Area</p>
						</div>
						<div className={styles.feature}>
							<FaFileContract className={styles.icon} />
							<h3>Contracts</h3>
							<p>Legal instruments governing the relationship between ISA and contractors</p>
						</div>
						<div className={styles.feature}>
							<FaTools className={styles.icon} />
							<h3>Standards & Guidelines</h3>
							<p>Technical and environmental guidance for deep-seabed mining operations</p>
						</div>
					</div>
				</div>

				<div className={styles.imageBlock}>
					<img src='../image/MiningCode.jpg' alt='Mining Code overview' className={styles.image} />
				</div>
			</section>

			{/* DEVELOPMENT SECTION */}
			<section className={styles.developmentSection}>
				<h2 className={styles.sectionTitle}>Development of the Mining Code</h2>
				<p>
					The development of the Mining Code takes place in several phases. The first phase focused on exploration for
					polymetallic nodules. This was followed by regulations on prospecting and exploration for polymetallic
					sulphides (2010) and cobalt-rich ferromanganese crusts (2012).
				</p>
				<p>
					The Authority is currently working on the next phase: the development of regulations to govern the
					exploitation of mineral resources in the Area. This includes provisions to ensure effective protection of the
					marine environment and equitable sharing of financial and other economic benefits derived from activities in
					the Area.
				</p>
			</section>

			{/* LEGAL SECTION */}
			<section className={styles.legalSection}>
				<h2 className={styles.sectionTitle}>Legal Framework</h2>
				<p>
					The Mining Code is issued within the legal framework established by the United Nations Convention on the Law
					of the Sea of 10 December 1982 and the 1994 Agreement relating to the Implementation of Part XI of the United
					Nations Convention on the Law of the Sea.
				</p>
				<div className={styles.frameworkBox}>
					<h4>Current Exploration Regulations Cover:</h4>
					<ul className={styles.regulationsList}>
						<li>Polymetallic nodules (adopted 13 July 2000; updated 25 July 2013)</li>
						<li>Polymetallic sulphides (adopted 7 May 2010)</li>
						<li>Cobalt-rich ferromanganese crusts (adopted 27 July 2012)</li>
					</ul>
				</div>
			</section>
		</div>
	)
}

export default MiningCode
