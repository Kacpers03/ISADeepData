import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

type DropdownItem = {
	text: string
	link: string
}

export default function NavDropdown({ title, items }: { title: string; items: DropdownItem[] }) {
	const [open, setOpen] = useState(false)
	const router = useRouter()

	// Lukker dropdown og eventuelt burgermenyen på mobil
	const handleItemClick = () => {
		setOpen(false)
		const navbarCollapse = document.getElementById('navbarNav')
		if (navbarCollapse && navbarCollapse.classList.contains('show')) {
			navbarCollapse.classList.remove('show')
		}
	}

	const handleDropdownItemClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
		// Stopp hendelsen fra å propagere videre (viktig for kartsiden)
		e.stopPropagation()

		if (router.pathname === link) {
			e.preventDefault()
			// Tving omlasting hvis vi allerede er på siden
			router.reload()
		} else {
			// Ellers naviger direkte med router for å unngå kartproblemer
			e.preventDefault()
			router.push(link)
		}

		handleItemClick()
	}

	// Når dropdown-knappen klikkes
	const handleToggleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault()
		e.stopPropagation() // Stopp hendelsen fra å propagerere
		setOpen(!open)
	}

	return (
		<li
			className={`nav-item dropdown ${open ? 'show' : ''}`}
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}>
			<a
				className='nav-link dropdown-toggle'
				href='#'
				role='button'
				aria-expanded={open ? 'true' : 'false'}
				onClick={handleToggleClick}>
				{title}
			</a>
			<ul className={`dropdown-menu ${open ? 'show' : ''}`} style={{ display: open ? 'block' : 'none' }}>
				{items.map((item, index) => (
					<li key={index}>
						<Link href={item.link} legacyBehavior>
							<a className='dropdown-item' onClick={e => handleDropdownItemClick(e, item.link)}>
								{item.text}
							</a>
						</Link>
					</li>
				))}
			</ul>
		</li>
	)
}
