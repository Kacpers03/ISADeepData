import React, { useState, useRef, useEffect } from "react";
import styles from "../../../styles/map/filter.module.css";

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
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (selectedValue: string, optionDisabled?: boolean) => {
    // Don't allow selecting disabled options
    if (optionDisabled) {
      return; // Exit without doing anything if option is disabled
    }

    onChange({ target: { value: selectedValue } });
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  // Generate a unique ID for the hidden select element
  const selectId = `${id}-select`;

  return (
    <div className={styles.customSelectWrapper} ref={dropdownRef}>
      {/* Fix: Add the 'for' attribute that correctly references the select ID */}
      <label htmlFor={selectId} className={styles.filterLabel}>
        {label}
      </label>

      {/* Add a hidden real select element for accessibility and form association */}
      <select
        id={selectId}
        name={id}
        value={value}
        onChange={(e) => onChange(e)}
        style={{ position: "absolute", opacity: 0, height: 0, width: 0 }}
        aria-hidden="true"
        tabIndex={-1}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {/* Custom styled dropdown button */}
      <div
        className={`${styles.customSelect} ${
          isActive ? styles.activeFilter : ""
        }`}
        onClick={handleToggle}
        style={{
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label`}
      >
        <span>{selectedOption?.label || "Select..."}</span>
        <span className={`${styles.selectArrow} ${isOpen ? styles.up : ""}`}>
          ▼
        </span>
      </div>

      {isOpen && !disabled && (
        <div
          className={styles.optionsList}
          role="listbox"
          aria-labelledby={`${id}-label`}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.optionItem} ${
                option.value === value ? styles.selected : ""
              } ${option.disabled ? styles.disabledOption : ""}`}
              onClick={() => handleSelect(option.value, option.disabled)}
              title={option.disabled ? "No results with current filters" : ""}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
              // Add pointer style only to enabled options
              style={{ cursor: option.disabled ? "not-allowed" : "pointer" }}
            >
              {option.label}
              {option.value === value && (
                <span className={styles.selectedCheck}>✓</span>
              )}
              {option.disabled && (
                <span className={styles.disabledIndicator}>
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
