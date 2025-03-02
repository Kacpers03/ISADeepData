import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/map/map.module.css';

// Custom dropdown that stays within the sidebar
export const CustomDropdown = ({ 
  id, 
  label, 
  options, 
  value, 
  onChange,
  isActive,
  disabled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Find the selected option name to display
  const selectedOption = options.find(opt => opt.value === value) || options[0];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle selecting an option
  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };
  
  return (
    <div className={styles.filterGroup} ref={dropdownRef}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.customSelectWrapper}>
        <div 
          className={`${styles.customSelect} ${isActive ? styles.activeFilter : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          {selectedOption.label}
          <span className={`${styles.selectArrow} ${isOpen ? styles.up : ''}`}>▼</span>
        </div>
        
        {isOpen && !disabled && (
          <div className={styles.optionsList}>
            {options.map((option) => (
              <div
                key={option.value}
                className={`${styles.optionItem} ${value === option.value ? styles.selected : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};