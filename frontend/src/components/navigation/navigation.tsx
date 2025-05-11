// frontend/src/components/navigation/navigation.tsx
import NavItem from './navitem' // Import NavItem component for regular navigation links
import NavDropdown from './navdropdown' // Import NavDropdown component for dropdown menus
import { useLanguage } from '../../contexts/languageContext' // Import language context for multilingual support

// Main Navigation component that assembles the site's navigation bar
export default function Navigation() {
	const { t } = useLanguage() // Get translation function from language context

	return (
		<nav className='navbar navbar-expand-lg'>
			{' '}
			{/* Main navigation container with Bootstrap styling */}
			<div className='container'>
				{' '}
				{/* Bootstrap container for consistent spacing and width */}
				<div className='collapse navbar-collapse justify-content-start' id='navbarNav'>
					{' '}
					{/* Collapsible navbar section with left alignment */}
					<ul className='navbar-nav d-flex gap-3'>
						{' '}
						{/* Navigation list with flexbox and gap spacing */}
						<NavDropdown
							title={t('nav.about')} // Translated "About" dropdown title
							items={[
								// Array of dropdown items with translations
								{ text: t('nav.aboutSubItems.about'), link: '/about/about' }, // About page link
								{ text: t('nav.aboutSubItems.missions'), link: '/about/mission' }, // Mission page link
							]}
						/>
						<NavItem text={t('nav.map')} link='/map' /> {/* Map navigation item */}
						<NavDropdown
							title={t('nav.library')} // Translated "Library" dropdown title
							items={[
								// Array of dropdown items with translations
								{ text: t('nav.librarySubItems.reports'), link: '/library/reports' }, // Reports page link
								{ text: t('nav.librarySubItems.samples'), link: '/library/samples' }, // Samples page link
							]}
						/>
						<NavItem text={t('nav.gallery')} link='/gallery' /> {/* Gallery navigation item */}
						<NavItem text={t('nav.documents')} link='/document/documents' /> {/* Documents navigation item */}
					</ul>
				</div>
			</div>
		</nav>
	)
}
