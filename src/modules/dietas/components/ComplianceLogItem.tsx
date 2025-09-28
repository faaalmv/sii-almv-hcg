
import React, { useState, useEffect } from 'react';
import { type ComplianceLog, type LogValue } from '../types';
import { Icon } from '../../../../common/icons/Icon';
import { isCompliant } from '../utils/rangeUtils'; 

interface ComplianceLogItemProps {
  log: ComplianceLog;
  updateLogValue: (id: string, value: number, isCompliant: boolean) => void;
}

export const ComplianceLogItem: React.FC<ComplianceLogItemProps> = ({ log, updateLogValue }) => {
  const [localValue, setLocalValue] = useState<string>('');
  const [compliant, setCompliant] = useState<boolean | null>(null);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValueString = e.target.value;
    setLocalValue(newValueString);

    if (newValueString === '') {
        setCompliant(null);
        updateLogValue(log.id, NaN, false); 
        return;
    }

    const newValue = parseFloat(newValueString);
    if (isNaN(newValue)) return;

    const isValueCompliant = isCompliant(newValue, log.range);
    setCompliant(isValueCompliant);
    updateLogValue(log.id, newValue, isValueCompliant);
  };

  const icon = compliant === true
    ? <Icon.Check className="text-green-500" />
    : compliant === false
    ? <Icon.Warning className="text-red-500" />
    : null;

  const borderColor = compliant === true
    ? 'border-green-500'
    : compliant === false
    ? 'border-red-500'
    : 'border-gray-300';

  return (
    <div className={`p-4 border rounded-lg ${borderColor}`}>
        <div className="flex items-center justify-between">
            <div className="font-bold">{log.item}</div>
            <div className="text-sm text-gray-500">Rango: {log.range}</div>
        </div>
        <div className="flex items-center mt-2">
            <input
                type="number"
                value={localValue}
                onChange={handleValueChange}
                className="w-full p-2 border-t-0 border-x-0 border-b-2 focus:ring-0 focus:border-blue-500 transition"
                placeholder={`Valor en ${log.unit}`}
            />
            {icon}
        </div>
    </div>
  );
};
