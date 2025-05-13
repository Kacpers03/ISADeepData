// frontend/src/pages/_app.tsx
// Main Next.js application wrapper component that provides global layout and imports global styles

import type { AppProps } from 'next/app'
import '@fortawesome/fontawesome-free/css/all.min.css' // Font Awesome icons
import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap CSS framework
import '../styles/layout.css' // Global CSS
import 'bootstrap-icons/font/bootstrap-icons.css' // Bootstrap icons

import Layout from '../shared/layout' // Global layout component with header, footer, etc.
import { useRouter } from 'next/router' // Next.js router for path-based component remounting
import { useEffect } from 'react' // React hook for side effects

export default function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter()

	useEffect(() => {
		// Import Bootstrap JS only on the client side
		// This avoids server-side rendering issues with browser-specific code
		import('bootstrap/dist/js/bootstrap.bundle.min.js')
	}, [])

	return (
		// Use key based on router.asPath to force remount of Layout (and header)
		// This ensures the layout refreshes when the route changes
		<Layout key={router.asPath}>
			<Component {...pageProps} />
		</Layout>
	)
}
