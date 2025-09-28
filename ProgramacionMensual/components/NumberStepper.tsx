import React, { useState, useEffect, useCallback } from 'react';
import { StepperDownIcon, StepperUpIcon } from './icons';

interface DailyInputProps {
  value: number; // The original value from parent state
  onChange: (value: number) => void;
  disabled: boolean;
  availableQuantity: number;
  showToast: (message: string, type?: 'warning') => void;
}

const DailyInput: React.FC<DailyInputProps> = ({ value, onChange, disabled, availableQuantity, showToast }) => {
  const [internalValue, setInternalValue] = useState<string>(value === 0 ? '' : String(value));

  // Sync with external changes from parent
  useEffect(() => {
    const externalValueStr = value === 0 ? '' : String(value);
    if (externalValueStr !== internalValue) {
        setInternalValue(externalValueStr);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
    setInternalValue(sanitizedValue);
  };
  
  const handleCommit = useCallback(() => {
    const newNumericValue = internalValue === '' ? 0 : parseInt(internalValue, 10);
    
    // The max value this specific cell can have is its original value plus what's available for the whole item.
    const maxAllowedValue = value + availableQuantity;

    if (newNumericValue > maxAllowedValue) {
      showToast("Excede la cantidad disponible");
      setInternalValue(String(maxAllowedValue));
      if (maxAllowedValue !== value) {
        onChange(maxAllowedValue);
      }
    } else if (newNumericValue !== value) {
      onChange(newNumericValue);
    }
  }, [internalValue, value, availableQuantity, onChange, showToast]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommit();
      // Optionally blur the input to move to the next logical element
      e.currentTarget.blur();
    }
  };

  const handleStep = useCallback((amount: number) => {
    const currentNumericValue = internalValue === '' ? 0 : parseInt(internalValue, 10);
    const potentialNewValue = Math.max(0, currentNumericValue + amount);
    const maxAllowedValue = value + availableQuantity;

    // Clamp the new value to the maximum allowed
    const clampedNewValue = Math.min(potentialNewValue, maxAllowedValue);
    
    setInternalValue(clampedNewValue === 0 ? '' : String(clampedNewValue));
    if (clampedNewValue !== value) {
      onChange(clampedNewValue);
    }
  }, [internalValue, value, availableQuantity, onChange]);

  return (
    <div className="group relative flex items-center justify-center w-full h-full transition-transform duration-150 ease-in-out focus-within:scale-105">
      <input
        type="text"
        pattern="[0-9]*"
        inputMode="numeric"
        disabled={disabled}
        value={internalValue}
        onChange={handleInputChange}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        className="w-full h-full p-2 pr-5 text-center text-xs bg-transparent focus:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-violet-500 border-0 transition-all duration-150 appearance-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
        placeholder="0"
      />
      <div className="absolute right-0.5 top-0 bottom-0 flex flex-col items-center justify-center w-5">
        <button 
          onClick={() => handleStep(1)} 
          disabled={disabled}
          className="h-1/2 w-full text-slate-400 hover:text-slate-800 transition-opacity duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Increment value"
          tabIndex={-1}
        >
          <StepperUpIcon className="h-3 w-3" />
        </button>
        <button 
          onClick={() => handleStep(-1)} 
          disabled={disabled || (internalValue === '' || internalValue === '0')}
          className="h-1/2 w-full text-slate-400 hover:text-slate-800 transition-opacity duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Decrement value"
          tabIndex={-1}
        >
          <StepperDownIcon className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default DailyInput;