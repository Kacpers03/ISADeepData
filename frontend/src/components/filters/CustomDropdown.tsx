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
    // Don't allow selecting disabled options
    if (optionDisabled) return;
    
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
              className={`${styles.optionItem} ${option.value === value ? styles.selected : ''} ${option.disabled ? styles.disabled : ''}`}
              onClick={() => handleSelect(option.value, option.disabled)}
              style={{
                opacity: option.disabled ? 0.5 : 1,
                cursor: option.disabled ? 'not-allowed' : 'pointer'
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};