import React from 'react'
import styles from '../../styles/topics/ExplorationContracts.module.css'
import { FaFileContract, FaFlask, FaHandshake } from 'react-icons/fa'
import { useLanguage } from '../../contexts/languageContext'

const ExplorationContracts: React.FC = () => {
	const { t } = useLanguage()

	// Contract types booths data
	const contractBooths = [
		{
			id: 1,
			title: 'Polymetallic Nodules',
			image: '../image/nodules.jpg',
			url: 'https://www.isa.org.jm/exploration-contracts/polymetallic-nodules/',
		},
		{
			id: 2,
			title: 'Polymetallic Sulphides',
			image: '../image/sulphides.jpg',
			url: 'https://www.isa.org.jm/exploration-contracts/polymetallic-sulphides/',
		},
		{
			id: 3,
			title: 'Cobalt-rich Ferromanganese Crusts',
			image: '../image/crust.jpg',
			url: 'https://www.isa.org.jm/exploration-contracts/cobalt-rich-ferromanganese-crusts/',
		},
	]

	return (
		<div className={styles.container}>
			{/* HERO SECTION */}
			<section className={styles.hero}>
				<div className={styles.heroText}>
					<h1 className={styles.heroTitle}>{t('explorationContracts.hero.title')}</h1>
					<p className={styles.heroSubtitle}>{t('explorationContracts.hero.subtitle')}</p>
				</div>
			</section>

			{/* ABOUT SECTION */}
			<section className={styles.about}>
				<div className={styles.textBlock}>
					<h2>{t('explorationContracts.about.title')}</h2>
					<p>{t('explorationContracts.about.description')}</p>

					<div className={styles.features}>
						<div className={styles.feature}>
							<FaFileContract className={styles.icon} />
							<h3>{t('explorationContracts.about.features.legal.title')}</h3>
							<p>{t('explorationContracts.about.features.legal.description')}</p>
						</div>
						<div className={styles.feature}>
							<FaHandshake className={styles.icon} />
							<h3>{t('explorationContracts.about.features.environmental.title')}</h3>
							<p>{t('explorationContracts.about.features.environmental.description')}</p>
						</div>
						<div className={styles.feature}>
							<FaFlask className={styles.icon} />
							<h3>{t('explorationContracts.about.features.research.title')}</h3>
							<p>{t('explorationContracts.about.features.research.description')}</p>
						</div>
					</div>
				</div>

				<div className={styles.imageBlock}>
					<img
						src='../image/miningContract.jpg'
						alt={t('explorationContracts.about.imageAlt')}
						className={styles.image}
					/>
				</div>
			</section>

			{/* CONTRACT TYPES BOOTHS SECTION */}
			<section className={styles.contractTypesSection}>
				<h2 className={styles.sectionTitle}>{t('explorationContracts.typesSection.title')}</h2>

				<div className={styles.contractTypeBooths}>
					{contractBooths.map(booth => (
						<a key={booth.id} href={booth.url} className={styles.boothItem}>
							<div className={styles.boothImage}>
								<img src={booth.image} alt={booth.title} />
							</div>
							<h3 className={styles.boothTitle}>{booth.title}</h3>
						</a>
					))}
				</div>
			</section>

			{/* DETAILS SECTION */}
			<section className={styles.details}>
				<h2 className={styles.sectionTitle}>{t('explorationContracts.details.title')}</h2>
				<p>{t('explorationContracts.details.paragraph1')}</p>
				<p>{t('explorationContracts.details.paragraph2')}</p>
				<div className={styles.infoBox}>
					<h4>{t('explorationContracts.details.requirements.title')}</h4>
					<ul className={styles.requirementsList}>
						<li>{t('explorationContracts.details.requirements.item1')}</li>
						<li>{t('explorationContracts.details.requirements.item2')}</li>
						<li>{t('explorationContracts.details.requirements.item3')}</li>
						<li>{t('explorationContracts.details.requirements.item4')}</li>
						<li>{t('explorationContracts.details.requirements.item5')}</li>
					</ul>
				</div>
			</section>
		</div>
	)
}

export default ExplorationContracts
