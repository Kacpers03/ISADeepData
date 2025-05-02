// frontend/src/shared/header.tsx
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '../components/navigation/navigation'
import { useLanguage } from '../contexts/languageContext'

// Add custom styles to ensure the language dropdown works properly
const headerStyles = {
	languageSelector: {
		position: 'relative' as const, // Create new stacking context
		zIndex: 99999, // Extremely high z-index
		marginRight: '20px', // Add more space between language selector and burger menu
	},
	languageDropdown: {
		position: 'absolute' as const,
		top: '100%',
		right: 0,
		marginTop: '4px',
		backgroundColor: 'white',
		boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
		borderRadius: '4px',
		padding: '4px 0',
		zIndex: 99999, // Extremely high z-index
		minWidth: '120px',
		pointerEvents: 'auto' as const, // Ensure interactions work
	},
	dropdownItem: {
		display: 'block',
		width: '100%',
		padding: '8px 16px',
		textAlign: 'left' as const,
		border: 'none',
		backgroundColor: 'transparent',
		cursor: 'pointer',
		fontSize: '0.9rem',
		transition: 'background-color 0.2s',
	},
	dropdownItemHover: {
		backgroundColor: '#f8f9fa',
	},
	dropdownItemActive: {
		fontWeight: 'bold',
		backgroundColor: '#f1f8ff',
		color: '#0d6efd',
	},
}

export default function Header() {
	const router = useRouter()
	const [isNavOpen, setIsNavOpen] = useState(false)
	const [langMenuOpen, setLangMenuOpen] = useState(false)
	const [hoveredItem, setHoveredItem] = useState<string | null>(null)
	const langMenuRef = useRef<HTMLDivElement>(null)
	const { language, setLanguage, t } = useLanguage()

	// Close language menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
				setLangMenuOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// Explicitly close menu on route change
	useEffect(() => {
		console.log('Route changed to: ', router.asPath)
		// Bare ruller tilbake til toppen ved ruteendring, ingen header-endring nødvendig
		window.scrollTo(0, 0)
		setLangMenuOpen(false)
	}, [router.asPath])

	const handleNavToggle = () => {
		setIsNavOpen(prev => !prev)
	}

	const handleLanguageChange = (lang: 'en' | 'es' | 'fr') => {
		setLanguage(lang)
		setLangMenuOpen(false)
	}

	return (
		<header className='sticky-header'>
			<div className='container'>
				{/* Top row with logo, language selector, and burger button */}
				<div className='d-flex align-items-center justify-content-between py-2'>
					<Link href='/' passHref legacyBehavior>
						<a className='home-link d-flex align-items-center text-decoration-none'>
							<Image src='/image/image.png' alt='Logo' width={70} height={70} />
							<div className='ms-3'>
								<h1 className='h4 mb-0'>{t('header.home')}</h1>
								<p className='text-primary mb-0'>{t('header.subtitle')}</p>
							</div>
						</a>
					</Link>

					{/* Language selector and burger menu container */}
					<div className='d-flex align-items-center'>
						{/* Completely rewritten language selector with inline styles */}
						<div ref={langMenuRef} style={headerStyles.languageSelector}>
							<button
								className='btn btn-sm btn-outline-secondary d-flex align-items-center'
								onClick={() => setLangMenuOpen(!langMenuOpen)}
								aria-label='Select language'
								style={{ position: 'relative', zIndex: 99999 }} // Ensure button is clickable
							>
								<span className='me-1'>{language.toUpperCase()}</span>
								<i className={`fas fa-chevron-${langMenuOpen ? 'up' : 'down'} small`}></i>
							</button>

							{/* Dropdown with inline styles to ensure proper layering */}
							{langMenuOpen && (
								<div style={headerStyles.languageDropdown}>
									<button
										style={{
											...headerStyles.dropdownItem,
											...(hoveredItem === 'en' ? headerStyles.dropdownItemHover : {}),
											...(language === 'en' ? headerStyles.dropdownItemActive : {}),
										}}
										onClick={() => handleLanguageChange('en')}
										onMouseEnter={() => setHoveredItem('en')}
										onMouseLeave={() => setHoveredItem(null)}>
										{t('languages.en')}
									</button>
									<button
										style={{
											...headerStyles.dropdownItem,
											...(hoveredItem === 'es' ? headerStyles.dropdownItemHover : {}),
											...(language === 'es' ? headerStyles.dropdownItemActive : {}),
										}}
										onClick={() => handleLanguageChange('es')}
										onMouseEnter={() => setHoveredItem('es')}
										onMouseLeave={() => setHoveredItem(null)}>
										{t('languages.es')}
									</button>
									<button
										style={{
											...headerStyles.dropdownItem,
											...(hoveredItem === 'fr' ? headerStyles.dropdownItemHover : {}),
											...(language === 'fr' ? headerStyles.dropdownItemActive : {}),
										}}
										onClick={() => handleLanguageChange('fr')}
										onMouseEnter={() => setHoveredItem('fr')}
										onMouseLeave={() => setHoveredItem(null)}>
										{t('languages.fr')}
									</button>
								</div>
							)}
						</div>

						{/* Burger button - only shown on mobile */}
						<button
							className='navbar-toggler custom-toggler d-lg-none'
							type='button'
							data-bs-toggle='collapse'
							data-bs-target='#navbarNav'
							aria-controls='navbarNav'
							aria-expanded={isNavOpen}
							aria-label='Toggle navigation'
							onClick={handleNavToggle}>
							<span className='navbar-toggler-icon'></span>
						</button>
					</div>
				</div>
				{/* Navigation menu */}
				<Navigation />
			</div>
		</header>
	)
}
