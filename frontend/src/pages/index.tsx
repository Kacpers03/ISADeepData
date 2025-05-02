// frontend/src/pages/index.tsx
import styles from '../styles/home.module.css'
import { useLanguage } from '../contexts/languageContext'

export default function Home() {
	const { t } = useLanguage()

	return (
		<div className={styles.homeContainer}>
			<video autoPlay muted loop className={styles.heroVideo}>
				<source src='/video/ocean.mp4' type='video/mp4' />
				Din nettleser støtter ikke videoavspilling.
			</video>
			<div className={styles.overlay}>
				<h2>{t('home.title')}</h2>
				<p>{t('home.subtitle')}</p>
			</div>
		</div>
	)
}
