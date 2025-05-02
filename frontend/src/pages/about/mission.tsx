// frontend/src/pages/about/mission.tsx
import MissionTemplate from '../../components/about/missionTemplate'
import { useLanguage } from '../../contexts/languageContext'

export default function Mission() {
	const { t } = useLanguage()

	return (
		<div>
			<MissionTemplate t={t} />
		</div>
	)
}
