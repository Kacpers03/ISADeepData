// frontend/src/components/navigation/navdropdown.tsx
import { useState } from 'react' // Import React useState hook for managing dropdown state
import Link from 'next/link' // Import Next.js Link component for client-side navigation
import { useRouter } from 'next/router' // Import Next.js router for programmatic navigation

// Interface defining the dropdown item structure
type DropdownItem = {
	text: string // Display text for the dropdown item
	link: string // URL path for the dropdown item
}

// NavDropdown component for creating dropdown navigation menus
export default function NavDropdown({ title, items }: { title: string; items: DropdownItem[] }) {
	const [open, setOpen] = useState(false) // State to track if dropdown is open or closed
	const router = useRouter() // Initialize Next.js router for navigation control

	// Closes dropdown and mobile burger menu if open
	const handleItemClick = () => {
		setOpen(false) // Close this dropdown
		const navbarCollapse = document.getElementById('navbarNav') // Get reference to navbar collapse element
		if (navbarCollapse && navbarCollapse.classList.contains('show')) {
			navbarCollapse.classList.remove('show') // Close mobile menu if it's open
		}
	}

	// Handle click events on dropdown items with special navigation logic
	const handleDropdownItemClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
		// Stop event propagation to prevent unwanted side effects (important for map page)
		e.stopPropagation()

		if (router.pathname === link) {
			e.preventDefault() // Prevent default link behavior
			// Force page reload if we're already on the target page
			router.reload()
		} else {
			// Otherwise navigate directly with router to avoid map component issues
			e.preventDefault() // Prevent default link behavior
			router.push(link) // Use programmatic navigation
		}

		handleItemClick() // Close dropdown and mobile menu
	}

	// Toggle dropdown open/closed state when dropdown button is clicked
	const handleToggleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault() // Prevent default link behavior
		e.stopPropagation() // Stop event from propagating to parent elements
		setOpen(!open) // Toggle dropdown state
	}

	return (
		<li
			className={`nav-item dropdown ${open ? 'show' : ''}`} // Apply Bootstrap classes with conditional "show" class
			onMouseEnter={() => setOpen(true)} // Open dropdown on mouse hover
			onMouseLeave={() => setOpen(false)}>
			{' '}
			{/* Close dropdown when mouse leaves */}
			<a
				className='nav-link dropdown-toggle' // Bootstrap styling for dropdown toggle
				href='#' // Placeholder href (behavior controlled by JavaScript)
				role='button' // Accessibility role
				aria-expanded={open ? 'true' : 'false'} // Accessibility attribute for dropdown state
				onClick={handleToggleClick}>
				{' '}
				{/* Handle toggle click */}
				{title} {/* Display dropdown title */}
			</a>
			<ul className={`dropdown-menu ${open ? 'show' : ''}`} style={{ display: open ? 'block' : 'none' }}>
				{' '}
				{/* Dropdown menu with conditional display */}
				{items.map(
					(
						item,
						index // Map through items array to create dropdown options
					) => (
						<li key={index}>
							{' '}
							{/* List item with unique key */}
							{/* 
						  Note: Using legacyBehavior prop with Link to support using <a> as a child
						  This prevents the "Multiple children were passed to <Link>" error
						*/}
							<Link href={item.link} legacyBehavior>
								<a className='dropdown-item' onClick={e => handleDropdownItemClick(e, item.link)}>
									{item.text} {/* Display item text */}
								</a>
							</Link>
						</li>
					)
				)}
			</ul>
		</li>
	)
}
