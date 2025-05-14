// frontend/src/pages/about/mission.tsx
// Mission page component displaying the organization's mission statement and goals

import MissionTemplate from '../../components/about/missionTemplate' // Template component with mission content
import { useLanguage } from '../../contexts/languageContext' // Language context for internationalization

export default function Mission() {
	// Get translation function from language context
	// This enables displaying the mission content in different languages
	const { t } = useLanguage()

	return (
		<div>
			{/* Pass translation function to the mission template for internationalized content */}
			<MissionTemplate t={t} />
		</div>
	)
}
