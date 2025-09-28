
import React, { useMemo } from 'react';
import { Item, Day, Meal, DailySchedule } from '../types';
import NumberStepper from './NumberStepper';

interface DailyTableRowProps {
    item: Item;
    onValueChange: (itemCode: string, day: number, meal: Meal, value: number) => void;
    focusedDay: number | null;
    isScrolled: boolean;
    groupColor: string;
    style: React.CSSProperties;
    showToast: (message: string, type?: 'warning') => void;
}

export const DailyTableRow: React.FC<DailyTableRowProps> = ({ item, onValueChange, focusedDay, isScrolled, groupColor, style }) => {
    const totalScheduled = useMemo(() => {
        return Object.values(item.dailySchedule).reduce((sum, meals) => sum + (meals.desayuno || 0) + (meals.comida || 0) + (meals.cena || 0), 0);
    }, [item.dailySchedule]);

    const available = item.maxQuantity - totalScheduled;
    const isOverallocated = available < 0;
    const statusColor = isOverallocated ? 'bg-red-500' : (available === 0 ? 'bg-green-500' : 'bg-yellow-500');

    return (
        <tr style={style} className="bg-white hover:bg-slate-50/70 transition-colors duration-150 ease-in-out animate-fade-in-down">
            <td className="border-b border-r border-gray-200 px-6 py-3 text-sm font-mono text-gray-700 sticky left-0 bg-white w-32 z-10" style={{ borderLeft: `4px solid ${groupColor}` }}>{item.code}</td>
            <td className="border-b border-r border-gray-200 px-6 py-3 text-sm text-gray-800 sticky left-[128px] bg-white w-64 z-10">{item.description}</td>
            <td className={`border-b border-r border-gray-200 px-6 py-3 text-sm text-center text-gray-600 sticky left-[384px] bg-white w-28 z-10 transition-shadow duration-200 ${isScrolled ? 'sticky-col-shadow' : ''}`}>{item.unit}</td>
            
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                const daySchedule = item.dailySchedule[day] || { desayuno: 0, comida: 0, cena: 0 };
                const isFocused = day === focusedDay;

                return (
                    <React.Fragment key={day}>
                        {(['desayuno', 'comida', 'cena'] as Meal[]).map((meal, mealIndex) => {
                            const currentValue = daySchedule[meal] || 0;
                            // **LÓGICA CORREGIDA**
                            // La cantidad disponible para este stepper es la disponibilidad global (available)
                            // MÁS el valor que ya tiene este stepper (currentValue).
                            // Esto permite reasignar valores sin que el stepper se bloquee a sí mismo.
                            const availableForStepper = available + currentValue;

                            return (
                                <td key={`${day}-${meal}`} className={`border-b border-r border-gray-200 p-1 transition-colors duration-200 ${isFocused ? 'bg-blue-50' : ''} ${mealIndex > 0 ? 'border-l-dotted' : ''}`}>
                                    <NumberStepper
                                        value={currentValue}
                                        onValueChange={(newValue) => onValueChange(item.code, day, meal, newValue)}
                                        availableQuantity={availableForStepper}
                                    />
                                </td>
                            );
                        })}
                    </React.Fragment>
                )
            })}
            <td className="border-b border-l border-gray-300 px-6 py-3 text-sm font-semibold text-center sticky right-[136px] bg-blue-50/95 z-10 w-20">{totalScheduled}</td>
            <td className={`border-b border-gray-200 px-6 py-3 text-sm font-semibold text-center sticky right-[56px] z-10 w-20 ${isOverallocated ? 'bg-red-100 text-red-700' : 'bg-blue-50/95'}`}>{available}</td>
            <td className="border-b border-gray-200 px-6 py-3 text-center sticky right-0 bg-blue-50/95 z-10 w-14"><div className={`h-2.5 w-2.5 rounded-full mx-auto ${statusColor}`} title={isOverallocated ? 'Sobre-asignado' : (available === 0 ? 'Completo' : 'Disponible')}></div></td>
        </tr>
    );
};
