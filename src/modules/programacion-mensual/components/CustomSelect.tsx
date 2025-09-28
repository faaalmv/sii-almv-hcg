import React, { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '../../../common/icons/Icon';

interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  id: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, options, value, onChange, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(options.findIndex(opt => opt.value === value) || 0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find(option => option.value === value);

  const handleSelectOption = useCallback((option: CustomSelectOption) => {
    onChange(option.value);
    setIsOpen(false);
  }, [onChange]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const selectedIdx = options.findIndex(opt => opt.value === value);
      setHighlightedIndex(selectedIdx >= 0 ? selectedIdx : 0);
    }
  }, [isOpen, options, value]);

  useEffect(() => {
    if (isOpen && listboxRef.current) {
        const optionElement = listboxRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
        if (optionElement) {
            optionElement.scrollIntoView({ block: 'nearest' });
        }
    }
  }, [isOpen, highlightedIndex]);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setIsOpen(prev => !prev);
        if (isOpen) {
            handleSelectOption(options[highlightedIndex]);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(0, prev - 1));
        if (!isOpen) setIsOpen(true);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => Math.min(options.length - 1, prev + 1));
        if (!isOpen) setIsOpen(true);
        break;
      case 'Escape':
        if (isOpen) setIsOpen(false);
        break;
      case 'Tab':
        if (isOpen) setIsOpen(false);
        break;
    }
  };
  
  return (
    <div className="relative w-full" ref={containerRef}>
      <label id={`${id}-label`} className="block text-sm font-medium text-slate-700">{label}</label>
      <button
        id={id}
        type="button"
        className={`glass-select-button mt-1 flex items-center justify-between w-full pl-3 pr-2 py-2 text-left rounded-md shadow-sm text-slate-800 ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label ${id}`}
      >
        <span className="font-medium truncate">{selectedOption?.label || ''}</span>
        <Icon.ChevronDown className={`h-5 w-5 text-slate-600 transition-transform duration-200 ease-in-out ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <ul
          ref={listboxRef}
          className="glass-select-menu absolute z-10 mt-1 w-full rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none"
          tabIndex={-1}
          role="listbox"
          aria-activedescendant={options[highlightedIndex] ? `${id}-option-${options[highlightedIndex].value}` : undefined}
          aria-labelledby={`${id}-label`}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-option-${option.value}`}
              data-index={index}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${highlightedIndex === index ? 'text-white bg-violet-500' : 'text-slate-900'}`}
              role="option"
              aria-selected={value === option.value}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => handleSelectOption(option)}
            >
              <span className={`block truncate ${value === option.value ? 'font-semibold' : 'font-normal'}`}>
                {option.label}
              </span>
              {value === option.value && (
                <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${highlightedIndex === index ? 'text-white' : 'text-violet-600'}`}>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
