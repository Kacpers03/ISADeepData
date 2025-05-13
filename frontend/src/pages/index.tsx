// frontend/src/pages/index.tsx
// Homepage component with video background and translatable hero content

import styles from '../styles/home.module.css' // CSS modules for component-specific styling
import { useLanguage } from '../contexts/languageContext' // Language context for internationalization

export default function Home() {
	// Get translation function from language context
	// This enables dynamic text content based on the selected language
	const { t } = useLanguage()

	return (
		<div className={styles.homeContainer}>
			{/* Autoplaying background video with ocean theme */}
			<video autoPlay muted loop className={styles.heroVideo}>
				<source src='/video/ocean.mp4' type='video/mp4' />
				Your browser does not support video playback.
			</video>

			{/* Overlay with translatable title and subtitle text */}
			<div className={styles.overlay}>
				<h2>{t('home.title')}</h2>
				<p>{t('home.subtitle')}</p>
			</div>
		</div>
	)
}
