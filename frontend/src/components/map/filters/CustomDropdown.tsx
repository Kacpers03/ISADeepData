// frontend/src/components/map/filters/CustomDropdown.tsx
import React, { useState, useRef, useEffect } from 'react' // Import React and hooks for state and ref management
import styles from '../../../styles/map/filter.module.css' // Import CSS module for component styling

// Interface defining props for the CustomDropdown component
interface CustomDropdownProps {
	id: string // Unique identifier for the dropdown
	label: string // Display label for the dropdown
	options: { value: string; label: string; disabled?: boolean }[] // Array of dropdown options with optional disabled state
	value: string // Currently selected value
	onChange: (e: { target: { value: string } }) => void // Change handler that mimics native select behavior
	isActive?: boolean // Optional flag to indicate if the dropdown is actively filtering (for styling)
	disabled?: boolean // Optional flag to disable the entire dropdown
}

// CustomDropdown component for styled select elements with enhanced functionality
export const CustomDropdown: React.FC<CustomDropdownProps> = ({
	id,
	label,
	options,
	value,
	onChange,
	isActive = false, // Default to not active
	disabled = false, // Default to enabled
}) => {
	const [isOpen, setIsOpen] = useState(false) // State to track if dropdown is open
	const dropdownRef = useRef<HTMLDivElement>(null) // Reference to dropdown DOM element for click outside detection

	// Effect to close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false) // Close dropdown if click is outside
			}
		}

		// Add event listener when component mounts
		document.addEventListener('mousedown', handleClickOutside)
		// Clean up event listener when component unmounts
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, []) // Empty dependency array means this runs once on mount

	// Toggle dropdown open/closed state
	const handleToggle = () => {
		if (!disabled) {
			setIsOpen(!isOpen) // Toggle only if not disabled
		}
	}

	// Handle option selection
	const handleSelect = (selectedValue: string, optionDisabled?: boolean) => {
		// Don't allow selecting disabled options
		if (optionDisabled) {
			return // Exit without doing anything if option is disabled
		}

		// Trigger onChange with an event-like object that mimics a native select change
		onChange({ target: { value: selectedValue } })
		setIsOpen(false) // Close dropdown after selection
	}

	// Find the currently selected option for display
	const selectedOption = options.find(option => option.value === value)

	// Generate a unique ID for the hidden select element for accessibility
	const selectId = `${id}-select`

	return (
		<div className={styles.customSelectWrapper} ref={dropdownRef}>
			{/* Label for the dropdown that references the hidden select for accessibility */}
			<label htmlFor={selectId} className={styles.filterLabel}>
				{label}
			</label>

			{/* Hidden native select element for accessibility and form association */}
			<select
				id={selectId}
				name={id}
				value={value}
				onChange={e => onChange(e)}
				style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }} // Visually hidden but accessible
				aria-hidden='true' // Hidden from screen readers as we have custom controls
				tabIndex={-1}>
				{' '}
				{/* Exclude from tab order */}
				{options.map(option => (
					<option key={option.value} value={option.value} disabled={option.disabled}>
						{option.label}
					</option>
				))}
			</select>

			{/* Custom styled dropdown button */}
			<div
				className={`${styles.customSelect} ${isActive ? styles.activeFilter : ''}`}
				onClick={handleToggle}
				style={{
					opacity: disabled ? 0.6 : 1, // Reduce opacity when disabled
					cursor: disabled ? 'not-allowed' : 'pointer', // Change cursor to indicate interactivity
				}}
				role='button' // ARIA role for accessibility
				aria-haspopup='listbox' // Indicates this button opens a listbox
				aria-expanded={isOpen} // Accessibility state for screen readers
				aria-labelledby={`${id}-label`}>
				{' '}
				{/* Associates with label for accessibility */}
				<span>{selectedOption?.label || 'Select...'}</span> {/* Display selected option or placeholder */}
				<span className={`${styles.selectArrow} ${isOpen ? styles.up : ''}`}>▼</span>{' '}
				{/* Dropdown arrow that rotates when open */}
			</div>

			{/* Dropdown options panel - only rendered when open and not disabled */}
			{isOpen && !disabled && (
				<div className={styles.optionsList} role='listbox' aria-labelledby={`${id}-label`}>
					{options.map(option => (
						<div
							key={option.value}
							className={`${styles.optionItem} ${option.value === value ? styles.selected : ''} ${
								option.disabled ? styles.disabledOption : ''
							}`}
							onClick={() => handleSelect(option.value, option.disabled)}
							title={option.disabled ? 'No results with current filters' : ''} // Tooltip for disabled options
							role='option' // ARIA role for accessibility
							aria-selected={option.value === value} // Accessibility state for current selection
							aria-disabled={option.disabled} // Accessibility state for disabled options
							// Add appropriate cursor style based on disabled state
							style={{ cursor: option.disabled ? 'not-allowed' : 'pointer' }}>
							{option.label} {/* Option display text */}
							{option.value === value && <span className={styles.selectedCheck}>✓</span>}{' '}
							{/* Checkmark for selected option */}
							{option.disabled && (
								<span className={styles.disabledIndicator}>
									<span className={styles.disabledText}>(0)</span>{' '}
									{/* Indicator showing zero results for disabled options */}
								</span>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}
