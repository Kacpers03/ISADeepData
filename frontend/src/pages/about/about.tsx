// frontend/src/pages/about/about.tsx
// About page component that renders the main about section of the application

import AboutTemplate from '../../components/about/aboutTemplate' // Template component with all about page content

export default function About() {
	return (
		<div>
			{/* Main about page template component */}
			<AboutTemplate />

			{/* Empty div with padding to create bottom spacing */}
			<div style={{ padding: '2rem' }}></div>
		</div>
	)
}
