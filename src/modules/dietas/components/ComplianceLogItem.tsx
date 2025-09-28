
import React, { useState } from 'react';
import { ComplianceLog, ComplianceStatus } from '../types';

interface ComplianceLogItemProps {
  log: ComplianceLog;
  onUpdate: (logId: string, value: number, action?: string) => void;
}

const ThermometerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="none" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.918V6.643a1 1 0 01.4-.8l3-3a1 1 0 011.2 1.6l-3 3V14a1 1 0 01-.6.918l-3 1.5a1 1 0 01-1.2-.4l-1.5-3a1 1 0 01.4-1.2l1.5-1.5z" transform="translate(1, 1)" />
    </svg>
);


const ComplianceLogItem: React.FC<ComplianceLogItemProps> = ({ log, onUpdate }) => {
  const [currentValue, setCurrentValue] = useState<string>('');
  const [isOutOfRange, setIsOutOfRange] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentValue(value);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      // Basic range check, assumes format like '< 4' or '> 60'
      const rangeParts = log.range.split(' ');
      const limit = parseFloat(rangeParts[1]);
      let outOfRange = false;
      if (rangeParts[0] === '<') outOfRange = numValue >= limit;
      if (rangeParts[0] === '>') outOfRange = numValue <= limit;
      
      setIsOutOfRange(outOfRange);
      setShowActions(outOfRange);
    } else {
        setIsOutOfRange(false);
        setShowActions(false);
    }
  };

  const handleAction = (action: string) => {
    onUpdate(log.id, parseFloat(currentValue), action);
    setShowActions(false);
  };
  
  let borderColor = 'border-gray-300';
  if (isOutOfRange) borderColor = 'border-amber-500 ring-2 ring-amber-200';

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 transition-shadow hover:shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <ThermometerIcon/>
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-gray-800">{log.item}</h3>
          <p className="text-sm text-gray-500">
            Rango: <span className="font-semibold text-gray-700">{log.range}</span> | 
            Lectura Anterior: <span className="font-semibold text-gray-700">{log.previousValue}{log.unit}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
            <input
                type="number"
                step="0.1"
                placeholder="Actual"
                value={currentValue}
                onChange={handleValueChange}
                className={`w-28 p-2 text-lg text-right border rounded-md transition-all duration-300 ${borderColor}`}
            />
            <span className="text-lg font-semibold text-gray-600">{log.unit}</span>
        </div>
      </div>
      {showActions && (
          <div className="mt-4 pt-3 border-t border-amber-200 bg-amber-50 rounded-b-lg p-3">
              <p className="text-sm font-semibold text-amber-800 mb-2">Valor fuera de rango. ¿Qué acción se tomó?</p>
              <div className="flex gap-2 flex-wrap">
                  <button onClick={() => handleAction('Notificar a supervisor')} className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600 active:scale-95">Notificar a supervisor</button>
                  <button onClick={() => handleAction('Realizar ajuste')} className="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-full hover:bg-green-600 active:scale-95">Realizar ajuste</button>
                  <button onClick={() => handleAction('Marcar para mantenimiento')} className="px-3 py-1 text-xs font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 active:scale-95">Marcar para mantenimiento</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default ComplianceLogItem;
