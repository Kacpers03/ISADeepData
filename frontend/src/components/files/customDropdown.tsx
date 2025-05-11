import React, { useState, useRef, useEffect } from 'react' // Imports React and required hooks
import styles from '../../styles/files/dropdown.module.css' // Imports CSS module for styling

// Interface defining props for the CustomDropdown component
interface CustomDropdownProps {
	id: string // Unique identifier for the dropdown
	label: string // Label text displayed above the dropdown
	options: { value: string; label: string; disabled?: boolean }[] // Array of dropdown options
	value: string // Currently selected value
	onChange: (e: { target: { value: string } }) => void // Handler function when selection changes
	isActive?: boolean // Whether the dropdown should appear highlighted/active
	disabled?: boolean // Whether the dropdown is disabled
}

// Main dropdown component with typed props
export const CustomDropdown: React.FC<CustomDropdownProps> = ({
	id,
	label,
	options,
	value,
	onChange,
	isActive = false,
	disabled = false,
}) => {
	const [isOpen, setIsOpen] = useState(false) // State to track if dropdown menu is open
	const dropdownRef = useRef<HTMLDivElement>(null) // Reference to dropdown DOM element for click outside detection

	// Effect hook to handle clicks outside the dropdown (to close it)
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false) // Close dropdown if click is outside
			}
		}

		document.addEventListener('mousedown', handleClickOutside) // Add event listener
		return () => {
			document.removeEventListener('mousedown', handleClickOutside) // Clean up event listener on unmount
		}
	}, [])

	// Toggle dropdown open/closed state when clicked
	const handleToggle = () => {
		if (!disabled) {
			setIsOpen(!isOpen) // Toggle open state if not disabled
		}
	}

	// Handle selection of an option
	const handleSelect = (selectedValue: string, optionDisabled?: boolean) => {
		// Don't allow selecting disabled options
		if (optionDisabled) {
			return // Exit without doing anything if option is disabled
		}

		onChange({ target: { value: selectedValue } }) // Call onChange with selected value
		setIsOpen(false) // Close dropdown after selection
	}

	// Find the currently selected option object from options array
	const selectedOption = options.find(option => option.value === value)

	// Generate a unique ID for the hidden select element
	const selectId = `${id}-select`

	return (
		<div className={styles.customSelectWrapper} ref={dropdownRef}>
			{' '}
			{/* Main wrapper div with ref for click detection */}
			<label htmlFor={selectId} className={styles.filterLabel}>
				{label} {/* Label for the dropdown */}
			</label>
			{/* Hidden native select element for accessibility and form submission */}
			<select
				id={selectId}
				name={id}
				value={value}
				onChange={e => onChange(e)}
				style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }} // Hidden but still accessible
				aria-hidden='true'
				tabIndex={-1}>
				{options.map(option => (
					<option key={option.value} value={option.value} disabled={option.disabled}>
						{option.label}
					</option>
				))}
			</select>
			{/* Custom styled dropdown button that users actually see and interact with */}
			<div
				className={`${styles.customSelect} ${isActive ? styles.activeFilter : ''}`} // Add active class if isActive prop is true
				onClick={handleToggle}
				style={{
					opacity: disabled ? 0.6 : 1, // Reduce opacity if disabled
					cursor: disabled ? 'not-allowed' : 'pointer', // Change cursor based on disabled state
				}}>
				<span title={selectedOption?.label}>{selectedOption?.label || 'Select...'}</span>{' '}
				{/* Display selected option or default text */}
				<span className={`${styles.selectArrow} ${isOpen ? styles.up : ''}`}>▼</span>{' '}
				{/* Dropdown arrow that rotates when open */}
			</div>
			{/* Dropdown options list - only rendered when dropdown is open and not disabled */}
			{isOpen && !disabled && (
				<div className={styles.optionsList} role='listbox' aria-labelledby={`${id}-label`}>
					{' '}
					{/* Accessible listbox role */}
					{options.map(option => (
						<div
							key={option.value}
							className={`${styles.optionItem} ${option.value === value ? styles.selected : ''} ${
								option.disabled ? styles.disabledOption : ''
							}`} // Apply selected and disabled styles conditionally
							onClick={() => handleSelect(option.value, option.disabled)}
							title={option.disabled ? 'No results with current filters' : ''} // Tooltip explaining disabled state
							role='option' // Accessibility role
							aria-selected={option.value === value} // Accessibility attribute for selection state
							aria-disabled={option.disabled}>
							{' '}
							{/* Accessibility attribute for disabled state */}
							{option.label} {/* Option text */}
							{option.value === value && <span className={styles.selectedCheck}>✓</span>}{' '}
							{/* Checkmark for selected option */}
							{option.disabled && (
								<span className={styles.disabledIndicator}>
									<span className={styles.disabledText}>(0)</span>{' '}
									{/* Indicator for disabled options showing zero results */}
								</span>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}
