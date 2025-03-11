import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/map/filter.module.css';

interface CustomDropdownProps {
  id: string;
  label: string;
  options: { value: string; label: string; disabled?: boolean }[];
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  isActive?: boolean;
  disabled?: boolean;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  isActive = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  const handleSelect = (selectedValue: string, optionDisabled?: boolean) => {
    // Show a clearer visual indication that the option is unavailable
    // but still allow selection - just provide feedback in the UI
    
    // Although we visually indicate disabled options, we allow them to be selected
    // This maintains filter independence
    onChange({ target: { value: selectedValue } });
    setIsOpen(false);
  };
  
  const selectedOption = options.find(option => option.value === value);
  
  return (
    <div className={styles.customSelectWrapper} ref={dropdownRef}>
      <label htmlFor={id} className={styles.filterLabel}>
        {label}
      </label>
      
      <div 
        className={`${styles.customSelect} ${isActive ? styles.activeFilter : ''}`}
        onClick={handleToggle}
        style={{ opacity: disabled ? 0.6 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        <span>{selectedOption?.label || 'Select...'}</span>
        <span className={`${styles.selectArrow} ${isOpen ? styles.up : ''}`}>▼</span>
      </div>
      
      {isOpen && !disabled && (
        <div className={styles.optionsList}>
          {options.map(option => (
            <div
              key={option.value}
              className={`${styles.optionItem} ${option.value === value ? styles.selected : ''} ${option.disabled ? styles.disabledOption : ''}`}
              onClick={() => handleSelect(option.value, option.disabled)}
              // New - add a tooltip to show why option is disabled
              title={option.disabled ? 'No results available with current filters' : ''}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
              {option.value === value && (
                <span className={styles.selectedCheck}>✓</span>
              )}
              {option.disabled && (
                <span className={styles.disabledIndicator}>
                  {/* Small muted indicator for disabled items but still clickable */}
                  <span className={styles.disabledText}>(0)</span>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};