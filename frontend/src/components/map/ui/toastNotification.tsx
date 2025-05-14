// frontend/src/components/map/ui/ToastNotification.tsx
import React from 'react' // Import React
import styles from '../../../styles/map/base.module.css' // Import CSS styles

// Interface defining toast notification properties
interface ToastNotificationProps {
	message: string // Text message to display
	onClose: () => void // Function to close the notification
	duration?: number // Auto-close duration in ms (optional)
}

// Component for displaying temporary notification messages
const ToastNotification: React.FC<ToastNotificationProps> = ({
	message,
	onClose,
	duration = 5000, // Default to 5 seconds
}) => {
	// Auto-close after duration
	React.useEffect(() => {
		if (duration > 0) {
			const timer = setTimeout(() => {
				onClose() // Close after specified duration
			}, duration)

			return () => clearTimeout(timer) // Clean up timer on unmount
		}
	}, [duration, onClose]) // Dependencies for effect

	return (
		<div className={styles.toast}>
			{' '}
			{/* Toast container */}
			<span>{message}</span> {/* Message text */}
			<button onClick={onClose} className={styles.toastCloseButton}>
				× {/* Close button */}
			</button>
		</div>
	)
}

export default ToastNotification
