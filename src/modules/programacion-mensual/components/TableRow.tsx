import React, { useMemo, useCallback } from 'react';
import { Item } from '../types';
import Icon from '../../../common/icons/Icon';
import DailyInput from './NumberStepper';

interface TableRowProps {
  item: Item;
  onValueChange: (itemCode: string, dayIndex: number, value: number) => void;
  showToast: (message: string, type?: 'warning') => void;
  hoveredColumn: number | null;
  isScrolled: boolean;
  groupColor: string;
  style?: React.CSSProperties;
}

export const TableRow: React.FC<TableRowProps> = ({ item, onValueChange, showToast, hoveredColumn, isScrolled, groupColor, style }) => {
  const total = useMemo(() => {
    return item.dailyValues.reduce((sum, val) => sum + (val || 0), 0);
  }, [item.dailyValues]);

  const handleDayValueChange = useCallback((dayIndex: number, newValue: number) => {
    onValueChange(item.code, dayIndex, newValue);
  }, [item.code, onValueChange]);
  
  const available = useMemo(() => item.maxQuantity - total, [item.maxQuantity, total]);
  const exceedsMax = available < 0;
  const isAtCapacity = available <= 0;

  const getAvailabilityStyles = (availableQty: number, maxQty: number): string => {
    if (maxQty <= 0) {
      return 'bg-slate-100 text-slate-800 border-l-slate-200'; // Neutral for items with no max quantity
    }
    const percentage = (availableQty / maxQty) * 100;

    if (percentage >= 75) {
      return 'bg-teal-100 text-teal-900 border-l-teal-200';
    }
    if (percentage >= 50) {
      return 'bg-sky-100 text-sky-900 border-l-sky-200';
    }
    if (percentage >= 25) {
      return 'bg-amber-100 text-amber-900 border-l-amber-200';
    }
    if (percentage > 0) {
      return 'bg-orange-100 text-orange-900 border-l-orange-200';
    }
    return 'bg-rose-100 text-rose-900 border-l-rose-200';
  };
  
  const availabilityStyles = getAvailabilityStyles(available, item.maxQuantity);

  const rowStyle = {
    ...style,
    '--group-color': groupColor,
  } as React.CSSProperties;

  return (
    <tr 
      style={rowStyle}
      className="row-transition animate-slide-down-fade-in group bg-white hover:z-20 focus-within:z-20 hover:scale-[1.01] focus-within:scale-[1.01] hover:-translate-y-1 focus-within:-translate-y-1 hover:shadow-lg focus-within:shadow-lg"
    >
      <td 
        className="p-2 border-r border-slate-200 text-xs text-slate-700 align-middle sticky left-0 z-10 w-32 bg-white group-hover:bg-sky-50 font-mono transition-colors duration-150"
      >
        {item.code}
      </td>
      <td 
        className="p-2 border-r border-slate-200 text-xs text-slate-700 align-middle sticky left-[128px] z-10 w-64 bg-white group-hover:bg-sky-50 transition-colors duration-150"
      >
        {item.description.toUpperCase()}
      </td>
      <td 
        className={`p-2 border-r border-slate-200 text-xs text-slate-700 align-middle text-center sticky left-[384px] z-10 w-28 bg-white group-hover:bg-sky-50 transition-shadow duration-200`}
      >
        {item.unit.toUpperCase()}
      </td>
      {item.dailyValues.map((value, dayIndex) => {
        const isCellDisabled = isAtCapacity && value === 0;
        return (
          <td key={dayIndex} className={`p-0 border-r border-slate-200 align-middle transition-colors duration-200 ${hoveredColumn === dayIndex ? 'bg-sky-100/50' : (value > 0 ? 'bg-emerald-50/70' : '')} group-hover:bg-sky-50/50`}>
            <DailyInput
              value={value}
              onChange={(newValue) => handleDayValueChange(dayIndex, newValue)}
              disabled={isCellDisabled}
              availableQuantity={available}
              showToast={showToast}
            />
          </td>
        );
      })}
      <td 
        className={`p-2 border-r border-slate-200 font-bold text-center align-middle text-xs transition-colors duration-200 sticky right-[136px] z-10 w-20 bg-slate-50 group-hover:bg-sky-100/60 ${
          exceedsMax ? 'text-rose-700' : 'text-slate-900'
        }`}
      >
        {total}
      </td>
      <td 
        className={`p-2 border-r border-slate-200 font-bold text-center align-middle text-xs transition-colors duration-200 sticky right-[56px] z-10 w-20 ${availabilityStyles} group-hover:brightness-95`}
      >
        {available}
      </td>
      <td className={`p-2 text-center align-middle sticky right-0 z-10 w-14 transition-colors duration-200 bg-white group-hover:bg-sky-50`}>
        <div className="flex justify-center items-center">
          <div className={`h-7 w-7 rounded-full flex items-center justify-center transition-all duration-300 ${exceedsMax ? 'bg-rose-500/20' : (total > 0 ? 'bg-emerald-500/20' : '')}`}>
            {exceedsMax ? (
              <WarningIcon className="h-5 w-5 text-rose-600" />
            ) : (
              total > 0 && <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};