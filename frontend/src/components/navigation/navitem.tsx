// frontend/src/components/navigation/navitem.tsx
import { useRouter } from 'next/router' // Import Next.js router for programmatic navigation
import Link from 'next/link' // Import Next.js Link component for client-side navigation

// NavItem component for regular (non-dropdown) navigation links
export default function NavItem({ text, link }: { text: string; link: string }) {
	const router = useRouter() // Initialize Next.js router for navigation control

	// Handle click events on navigation items with special navigation logic
	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		// Stop event propagation to prevent interference with map components
		e.stopPropagation()

		// If we're already on the same page, force a reload instead of navigation
		if (router.pathname === link) {
			e.preventDefault() // Prevent default link behavior
			router.reload() // Force page reload
			return
		} else {
			// If we're on the map page, use programmatic navigation to avoid map issues
			if (router.pathname.includes('/map')) {
				e.preventDefault() // Prevent default link behavior
				router.push(link) // Use programmatic navigation
				return
			}
		}

		// Close the mobile burger menu if it's open
		const navbarCollapse = document.getElementById('navbarNav') // Get reference to navbar collapse element
		if (navbarCollapse && navbarCollapse.classList.contains('show')) {
			navbarCollapse.classList.remove('show') // Remove 'show' class to close mobile menu
		}
	}

	return (
		<li className='nav-item'>
			{' '}
			{/* List item with Bootstrap nav-item class */}
			{/* 
			  Note: Using legacyBehavior prop with Link to support using <a> as a child
			  This prevents the "Multiple children were passed to <Link>" error
			  In newer Next.js versions, we should use onClick directly on the Link component
			*/}
			<Link href={link} legacyBehavior>
				<a className='nav-link' onClick={handleClick}>
					{text} {/* Display the navigation item text */}
				</a>
			</Link>
		</li>
	)
}
