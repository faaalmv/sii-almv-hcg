import React, { useMemo, useCallback } from 'react';
import { Item, Meal } from '../types';
import Icon from '../../../common/icons/Icon';
import DailyInput from './NumberStepper';

interface DailyTableRowProps {
  item: Item;
  onValueChange: (itemCode: string, day: number, meal: Meal, value: number) => void;
  showToast: (message: string, type?: 'warning') => void;
  isScrolled: boolean;
  groupColor: string;
  style?: React.CSSProperties;
  focusedDay: number | null;
}

export const DailyTableRow: React.FC<DailyTableRowProps> = ({ item, onValueChange, showToast, isScrolled, groupColor, style, focusedDay }) => {

  const total = useMemo(() => {
    return Object.values(item.dailySchedule).reduce((daySum, meals) => {
      return daySum + (meals.desayuno || 0) + (meals.comida || 0) + (meals.cena || 0);
    }, 0);
  }, [item.dailySchedule]);

  const available = useMemo(() => item.maxQuantity - total, [item.maxQuantity, total]);
  const isAtCapacity = available <= 0;
  const exceedsMax = available < 0;

  const getAvailabilityStyles = (availableQty: number, maxQty: number): string => {
    if (maxQty <= 0) return 'bg-slate-100 text-slate-800 border-l-slate-200';
    const percentage = (availableQty / maxQty) * 100;
    if (percentage >= 75) return 'bg-teal-100 text-teal-900 border-l-teal-200';
    if (percentage >= 50) return 'bg-sky-100 text-sky-900 border-l-sky-200';
    if (percentage >= 25) return 'bg-amber-100 text-amber-900 border-l-amber-200';
    if (percentage > 0) return 'bg-orange-100 text-orange-900 border-l-orange-200';
    return 'bg-rose-100 text-rose-900 border-l-rose-200';
  };
  
  const availabilityStyles = getAvailabilityStyles(available, item.maxQuantity);

  const rowStyle = { ...style, '--group-color': groupColor } as React.CSSProperties;

  const meals: Meal[] = ['desayuno', 'comida', 'cena'];

  return (
    <tr 
      style={rowStyle}
      className="row-transition animate-slide-down-fade-in group bg-white hover:z-20 focus-within:z-20 hover:scale-[1.01] focus-within:scale-[1.01] hover:-translate-y-1 focus-within:-translate-y-1 hover:shadow-lg focus-within:shadow-lg"
    >
      <td className="p-2 border-r border-slate-200 text-xs text-slate-700 align-middle sticky left-0 z-10 w-32 bg-white group-hover:bg-sky-50 font-mono transition-colors duration-150">
        {item.code}
      </td>
      <td className="p-2 border-r border-slate-200 text-xs text-slate-700 align-middle sticky left-[128px] z-10 w-64 bg-white group-hover:bg-sky-50 transition-colors duration-150">
        {item.description.toUpperCase()}
      </td>
      <td className={`p-2 border-r border-slate-200 text-xs text-slate-700 align-middle text-center sticky left-[384px] z-10 w-28 bg-white group-hover:bg-sky-50 transition-shadow duration-200`}>
        {item.unit.toUpperCase()}
      </td>

      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
        const isEvenDay = (day - 1) % 2 === 0;
        const dayIsFocused = focusedDay === day;
        const focusContainerIsActive = focusedDay !== null;
        
        const opacityClass = focusContainerIsActive && !dayIsFocused ? 'opacity-40' : 'opacity-100';

        return (
          <React.Fragment key={day}>
            {meals.map((meal, mealIndex) => {
              const value = item.dailySchedule[day]?.[meal] ?? 0;
              const isCellDisabled = isAtCapacity && value === 0;

              const borderClass = mealIndex === 2 
                ? 'border-r border-slate-300' 
                : 'border-r border-dotted border-slate-200';
              const backgroundClass = isEvenDay ? 'bg-slate-50/50' : 'bg-white';
              
              const handleMealValueChange = (newValue: number) => {
                onValueChange(item.code, day, meal, newValue);
              };

              return (
                <td key={`${day}-${meal}`} className={`p-0 w-14 min-w-[3.5rem] align-middle transition-opacity duration-300 ${borderClass} ${backgroundClass} ${opacityClass} group-hover:bg-sky-50/50`}>
                  <DailyInput
                    value={value}
                    onChange={handleMealValueChange}
                    disabled={isCellDisabled}
                    availableQuantity={available + value}
                    showToast={showToast}
                  />
                </td>
              );
            })}
          </React.Fragment>
        );
      })}
      
      <td className={`p-2 border-r border-slate-200 font-bold text-center align-middle text-xs transition-colors duration-200 sticky right-[136px] z-10 w-20 bg-slate-50 group-hover:bg-sky-100/60 ${exceedsMax ? 'text-rose-700' : 'text-slate-900'}`}>
        {total}
      </td>
      <td className={`p-2 border-r border-slate-200 font-bold text-center align-middle text-xs transition-colors duration-200 sticky right-[56px] z-10 w-20 ${availabilityStyles} group-hover:brightness-95`}>
        {available}
      </td>
      <td className={`p-2 text-center align-middle sticky right-0 z-10 w-14 transition-colors duration-200 bg-white group-hover:bg-sky-50`}>
        <div className="flex justify-center items-center">
          <div className={`h-7 w-7 rounded-full flex items-center justify-center transition-all duration-300 ${exceedsMax ? 'bg-rose-500/20' : (total > 0 ? 'bg-emerald-500/20' : '')}`}>
            {exceedsMax ? (
              <Icon.Warning className="h-5 w-5 text-rose-600" />
            ) : (
              total > 0 && <Icon.CheckCircle className="h-5 w-5 text-emerald-600" />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};