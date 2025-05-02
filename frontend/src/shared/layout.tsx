import { useRouter } from 'next/router'
import Header from './header'
import Footer from './footer'
import { LanguageProvider } from '../contexts/languageContext'

export default function Layout({ children }: { children: React.ReactNode }) {
	const { pathname } = useRouter()
	const mainClass = pathname === '/' ? 'homeMain' : 'container mt-4'

	return (
		<LanguageProvider>
			<div className='layout'>
				<Header />
				<main className={mainClass}>{children}</main>
				<Footer />
			</div>
		</LanguageProvider>
	)
}
