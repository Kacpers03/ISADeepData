import type { AppProps } from 'next/app'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/layout.css' // Global CSS
import 'bootstrap-icons/font/bootstrap-icons.css'

import Layout from '../shared/layout'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter()

	useEffect(() => {
		// Importer Bootstrap JS kun på klientsiden
		import('bootstrap/dist/js/bootstrap.bundle.min.js')
	}, [])

	return (
		// Bruk key basert på router.asPath for å tvinge remount av Layout (og header)
		<Layout key={router.asPath}>
			<Component {...pageProps} />
		</Layout>
	)
}
