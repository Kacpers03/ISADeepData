// frontend/src/components/navigation/navigation.tsx
import NavItem from './navitem'
import NavDropdown from './navdropdown'
import { useLanguage } from '../../contexts/languageContext'

export default function Navigation() {
	const { t } = useLanguage()

	return (
		<nav className='navbar navbar-expand-lg'>
			<div className='container'>
				<div className='collapse navbar-collapse justify-content-start' id='navbarNav'>
					<ul className='navbar-nav d-flex gap-3'>
						<NavDropdown
							title={t('nav.about')}
							items={[
								{ text: t('nav.aboutSubItems.about'), link: '/about/about' },
								{ text: t('nav.aboutSubItems.missions'), link: '/about/mission' },
							]}
						/>
						<NavItem text={t('nav.map')} link='/map' />
						<NavDropdown
							title={t('nav.library')}
							items={[
								{ text: t('nav.librarySubItems.reports'), link: '/library/reports' },
								{ text: t('nav.librarySubItems.samples'), link: '/library/samples' },
							]}
						/>
						<NavItem text={t('nav.gallery')} link='/gallery' />
						<NavItem text={t('nav.documents')} link='/document/documents' />{' '}
					</ul>
				</div>
			</div>
		</nav>
	)
}
