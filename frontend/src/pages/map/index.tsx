// frontend/src/pages/map/index.tsx
import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { FilterProvider } from '../../components/map/context/filterContext'
import styles from '../../styles/map/mapPage.module.css'
import { ImprovedFilterPanel } from '../../components/map/filters/filterPanel'
import { useRouter } from 'next/router'
import { useLanguage } from '../../contexts/languageContext'

// Dynamically import MapComponent without SSR
const EnhancedMapComponent = dynamic(() => import('../../components/map/mapComponent'), { ssr: false })

export default function MapPage() {
	const router = useRouter()
	const { t } = useLanguage()

	// Main interaction handler - fixes navigation and footer clicks
	useEffect(() => {
		// Universal click handler for map interactions
		const handleNonMapClicks = e => {
			// Check if click is on navbar, dropdown, or footer
			const isNavbarClick =
				e.target.closest('.navbar') !== null ||
				e.target.classList.contains('dropdown-item') ||
				e.target.classList.contains('nav-link') ||
				e.target.closest('.navbar-brand') !== null ||
				e.target.classList.contains('home-link')

			// Add specific check for footer elements
			const isFooterClick =
				e.target.closest('footer') !== null ||
				e.target.closest('footer a') !== null ||
				(e.target.tagName === 'A' && e.target.closest('footer') !== null)

			if (isNavbarClick || isFooterClick) {
				// Stop event propagation before it reaches the map component
				e.stopPropagation()

				// For footer links, if they have href, use normal behavior
				if (isFooterClick && e.target.tagName === 'A' && e.target.href) {
					// Allow natural link behavior
					return
				}
			}
		}

		// Special handler for home/brand links
		const handleHomeClick = () => {
			const homeLinks = document.querySelectorAll('.navbar-brand, .home-link')

			homeLinks.forEach(link => {
				link.addEventListener('click', e => {
					e.preventDefault()
					e.stopPropagation()

					// Navigate to homepage
					window.location.href = '/'
				})
			})
		}

		// Add event listener in the capturing phase (true) - this is crucial
		document.addEventListener('click', handleNonMapClicks, true)

		// Add home link handler
		handleHomeClick()

		// Apply z-index to footer to ensure it's above the map
		const footer = document.querySelector('footer')
		if (footer) {
			footer.style.position = 'relative'
			footer.style.zIndex = '10000'

			// Make all footer links have high z-index too
			const footerLinks = footer.querySelectorAll('a')
			footerLinks.forEach(link => {
				link.style.position = 'relative'
				link.style.zIndex = '10001'
			})
		}

		// Initialize Bootstrap components
		if (typeof window !== 'undefined') {
			// Load Bootstrap JS
			require('bootstrap/dist/js/bootstrap.bundle.min.js')

			// Initialize dropdowns
			document.querySelectorAll('.dropdown-toggle').forEach(dropdownToggle => {
				const dropdownMenu = dropdownToggle.nextElementSibling

				// Add manual toggle functionality
				dropdownToggle.addEventListener('click', e => {
					e.preventDefault()
					e.stopPropagation()

					if (dropdownMenu && dropdownMenu.classList.contains('show')) {
						dropdownMenu.classList.remove('show')
					} else if (dropdownMenu) {
						// Close all other open dropdowns first
						document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
							if (menu !== dropdownMenu) menu.classList.remove('show')
						})

						dropdownMenu.classList.add('show')
					}
				})
			})
		}

		// Clean up event listeners when component unmounts
		return () => {
			document.removeEventListener('click', handleNonMapClicks, true)
		}
	}, [])

	// Mobile navigation support
	useEffect(() => {
		// Ensure navbar-collapse works properly on mobile
		const navbarToggler = document.querySelector('.navbar-toggler')
		const navbarCollapse = document.getElementById('navbarNav')

		if (navbarToggler && navbarCollapse) {
			navbarToggler.addEventListener('click', () => {
				navbarCollapse.classList.toggle('show')
			})
		}
	}, [])

	return (
		<FilterProvider>
			<Head>
				<title>ISA DeepData - Exploration Map</title>
				<meta
					name='description'
					content='Interactive map of deep seabed exploration contracts and areas regulated by the International Seabed Authority'
				/>
			</Head>

			<div className={styles.mapPageContainer}>
				<header className={styles.mapHeader}>
					<h1>{t('map.title') || 'ISA Exploration Areas'}</h1>
					<p className={styles.mapDescription}>
						{t('map.description') ||
							'Interactive map of deep seabed exploration contracts and areas regulated by the International Seabed Authority. Use the filters on the left to explore by mineral type, contract status, location, and sponsoring state. Click the map controls button (bottom right) to toggle visibility of areas, blocks, stations, and cruises. View the Info tab in map controls for a complete legend. Use the Display tab to show the summary panel with statistics about visible data. Click on any map element for detailed information and use the zoom controls to navigate the map'}
					</p>
				</header>

				{/* Map layout with filter panel and map side by side */}
				<div className={styles.mapLayout}>
					{/* Side filter panel with integrated search */}
					<div className={styles.sideFilterPanel}>
						<ImprovedFilterPanel />
					</div>

					{/* Map container */}
					<div className={styles.mapSection}>
						<EnhancedMapComponent />
					</div>
				</div>

				<div className={styles.mapInfoSection}>
					<div className={styles.infoCard}>
						<div className={styles.infoIcon}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'>
								<circle cx='11' cy='11' r='8'></circle>
								<line x1='21' y1='21' x2='16.65' y2='16.65'></line>
							</svg>
						</div>
						<h3>{t('map.infoCards.explore.title') || 'Explore Contract Areas'}</h3>
						<p>
							{t('map.infoCards.explore.description') ||
								'Use the search function to quickly find contractors, areas, blocks, and stations. Click on markers for detailed information.'}
						</p>
					</div>

					<div className={styles.infoCard}>
						<div className={styles.infoIcon}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'>
								<path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
								<circle cx='12' cy='10' r='3'></circle>
							</svg>
						</div>
						<h3>{t('map.infoCards.resources.title') || 'Deep Seabed Resources'}</h3>
						<p>
							{t('map.infoCards.resources.description') ||
								"The ISA regulates exploration of minerals in the international seabed area, which covers approximately 54% of the world's oceans."}
						</p>
					</div>

					<div className={styles.infoCard}>
						<div className={styles.infoIcon}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'>
								<path d='M3 3v18h18'></path>
								<path d='M18 17V9'></path>
								<path d='M13 17V5'></path>
								<path d='M8 17v-3'></path>
							</svg>
						</div>
						<h3>{t('map.infoCards.transparency.title') || 'Data Transparency'}</h3>
						<p>
							{t('map.infoCards.transparency.description') ||
								"All contract information is available as part of ISA's commitment to transparency in deep seabed activities and environmental protection."}
						</p>
					</div>
				</div>
			</div>
		</FilterProvider>
	)
}
