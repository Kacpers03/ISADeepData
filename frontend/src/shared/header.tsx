// frontend/src/shared/header.tsx
// Header component with logo, language selector and navigation menu

import { useState, useEffect, useRef } from 'react' // Import React hooks for state, effects and refs
import { useRouter } from 'next/router' // Import Next.js router for navigation information
import Image from 'next/image' // Import Next.js Image component for optimized images
import Link from 'next/link' // Import Next.js Link component for client-side navigation
import Navigation from '../components/navigation/navigation' // Import Navigation component
import { useLanguage } from '../contexts/languageContext' // Import language context for multilingual support

// Add custom styles to ensure the language dropdown works properly
const headerStyles = {
	languageSelector: {
		position: 'relative' as const, // Create new stacking context
		zIndex: 99999, // Extremely high z-index to prevent overlap issues
		marginRight: '20px', // Add more space between language selector and burger menu
	},
	languageDropdown: {
		position: 'absolute' as const, // Position dropdown absolutely
		top: '100%', // Position below the language button
		right: 0, // Align to the right edge
		marginTop: '4px', // Small gap between button and dropdown
		backgroundColor: 'white', // White background
		boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
		borderRadius: '4px', // Rounded corners
		padding: '4px 0', // Vertical padding
		zIndex: 99999, // Extremely high z-index
		minWidth: '120px', // Minimum width for dropdown
		pointerEvents: 'auto' as const, // Ensure interactions work
	},
	dropdownItem: {
		display: 'block', // Block display for full width
		width: '100%', // Full width of container
		padding: '8px 16px', // Padding for tap targets
		textAlign: 'left' as const, // Left-aligned text
		border: 'none', // No borders
		backgroundColor: 'transparent', // Transparent background
		cursor: 'pointer', // Pointer cursor on hover
		fontSize: '0.9rem', // Slightly smaller font size
		transition: 'background-color 0.2s', // Smooth transition for hover
	},
	dropdownItemHover: {
		backgroundColor: '#f8f9fa', // Light gray background on hover
	},
	dropdownItemActive: {
		fontWeight: 'bold', // Bold text for active language
		backgroundColor: '#f1f8ff', // Light blue background for active language
		color: '#0d6efd', // Blue text for active language
	},
}

// Header component for the application
export default function Header() {
	const router = useRouter() // Initialize Next.js router
	const [isNavOpen, setIsNavOpen] = useState(false) // State for mobile navigation menu
	const [langMenuOpen, setLangMenuOpen] = useState(false) // State for language dropdown
	const [hoveredItem, setHoveredItem] = useState<string | null>(null) // Track hovered language item
	const langMenuRef = useRef<HTMLDivElement>(null) // Reference to language menu for click outside detection
	const { language, setLanguage, t } = useLanguage() // Get language state and functions from context

	// Close language menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
				setLangMenuOpen(false) // Close menu if click is outside
			}
		}

		document.addEventListener('mousedown', handleClickOutside) // Add event listener
		return () => document.removeEventListener('mousedown', handleClickOutside) // Cleanup on unmount
	}, [])

	// Explicitly close menu on route change and scroll to top
	useEffect(() => {
		console.log('Route changed to: ', router.asPath) // Log route change for debugging
		// Scroll back to top when route changes
		window.scrollTo(0, 0)
		setLangMenuOpen(false) // Close language menu when route changes
	}, [router.asPath]) // Dependency on route path

	// Toggle mobile navigation menu
	const handleNavToggle = () => {
		setIsNavOpen(prev => !prev) // Toggle navigation state
	}

	// Handle language selection
	const handleLanguageChange = (lang: 'en' | 'es' | 'fr') => {
		setLanguage(lang) // Set the new language
		setLangMenuOpen(false) // Close the dropdown after selection
	}

	return (
		<header className='sticky-header'>
			{' '}
			{/* Main header container with sticky positioning */}
			<div className='container'>
				{' '}
				{/* Bootstrap container for consistent width */}
				{/* Top row with logo, language selector, and burger button */}
				<div className='d-flex align-items-center justify-content-between py-2'>
					{' '}
					{/* Flex container for layout */}
					{/* Home link with legacy behavior for Next.js */}
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
						{' '}
						{/* Flex container for right side elements */}
						{/* Language selector with ref for click detection */}
						<div ref={langMenuRef} style={headerStyles.languageSelector}>
							<button
								className='btn btn-sm btn-outline-secondary d-flex align-items-center' // Button styling
								onClick={() => setLangMenuOpen(!langMenuOpen)} // Toggle dropdown on click
								aria-label='Select language' // Accessibility label
								style={{ position: 'relative', zIndex: 99999 }}>
								{' '}
								{/* Ensure button is clickable */}
								<span className='me-1'>{language.toUpperCase()}</span> {/* Display current language code */}
								<i className={`fas fa-chevron-${langMenuOpen ? 'up' : 'down'} small`}></i>{' '}
								{/* Directional chevron icon */}
							</button>

							{/* Dropdown with inline styles to ensure proper layering */}
							{langMenuOpen && (
								<div style={headerStyles.languageDropdown}>
									{' '}
									{/* Language dropdown menu */}
									<button
										style={{
											...headerStyles.dropdownItem, // Base styles
											...(hoveredItem === 'en' ? headerStyles.dropdownItemHover : {}), // Hover styles if hovering
											...(language === 'en' ? headerStyles.dropdownItemActive : {}), // Active styles if selected
										}}
										onClick={() => handleLanguageChange('en')} // Set language to English
										onMouseEnter={() => setHoveredItem('en')} // Track hover state for styling
										onMouseLeave={() => setHoveredItem(null)}>
										{' '}
										{/* Clear hover state */}
										{t('languages.en')} {/* English label with translation */}
									</button>
									<button
										style={{
											...headerStyles.dropdownItem, // Base styles
											...(hoveredItem === 'es' ? headerStyles.dropdownItemHover : {}), // Hover styles if hovering
											...(language === 'es' ? headerStyles.dropdownItemActive : {}), // Active styles if selected
										}}
										onClick={() => handleLanguageChange('es')} // Set language to Spanish
										onMouseEnter={() => setHoveredItem('es')} // Track hover state for styling
										onMouseLeave={() => setHoveredItem(null)}>
										{' '}
										{/* Clear hover state */}
										{t('languages.es')} {/* Spanish label with translation */}
									</button>
									<button
										style={{
											...headerStyles.dropdownItem, // Base styles
											...(hoveredItem === 'fr' ? headerStyles.dropdownItemHover : {}), // Hover styles if hovering
											...(language === 'fr' ? headerStyles.dropdownItemActive : {}), // Active styles if selected
										}}
										onClick={() => handleLanguageChange('fr')} // Set language to French
										onMouseEnter={() => setHoveredItem('fr')} // Track hover state for styling
										onMouseLeave={() => setHoveredItem(null)}>
										{' '}
										{/* Clear hover state */}
										{t('languages.fr')} {/* French label with translation */}
									</button>
								</div>
							)}
						</div>
						{/* Burger button - only shown on mobile */}
						<button
							className='navbar-toggler custom-toggler d-lg-none' // Bootstrap toggler with custom styling, hidden on large screens
							type='button' // Button type
							data-bs-toggle='collapse' // Bootstrap data attribute for toggling
							data-bs-target='#navbarNav' // Target element to toggle
							aria-controls='navbarNav' // Accessibility attribute
							aria-expanded={isNavOpen} // Accessibility state
							aria-label='Toggle navigation' // Accessibility label
							onClick={handleNavToggle}>
							{' '}
							{/* Toggle navigation state */}
							<span className='navbar-toggler-icon'></span> {/* Burger icon */}
						</button>
					</div>
				</div>
				{/* Navigation menu */}
				<Navigation /> {/* Include the navigation component */}
			</div>
		</header>
	)
}
