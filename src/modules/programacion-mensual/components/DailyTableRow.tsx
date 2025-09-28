
import React, { useMemo } from 'react';
import { Item, Day, Meal } from '../types';
import { Item, Day, Meal, DailySchedule } from '../types';
import NumberStepper from './NumberStepper';

interface DailyTableRowProps {
    item: Item;
    day: Day;
    updateDailyValue: (day: Day, meal: Meal, value: number) => void;
    onValueChange: (itemCode: string, day: number, meal: Meal, value: number) => void;
    focusedDay: number | null;
    isScrolled: boolean;
    groupColor: string;
    style: React.CSSProperties;
    showToast: (message: string, type?: 'warning') => void;
}

export const DailyTableRow: React.FC<DailyTableRowProps> = ({ item, day, updateDailyValue }) => {
    const total = useMemo(() => {
        return Object.values(item.dailyValues).reduce((sum, dailyValue) => sum + dailyValue.value, 0);
    }, [item.dailyValues]);
export const DailyTableRow: React.FC<DailyTableRowProps> = ({ item, onValueChange, focusedDay, isScrolled, groupColor, style }) => {
    const totalScheduled = useMemo(() => {
        return Object.values(item.dailySchedule).reduce((sum, meals) => sum + (meals.desayuno || 0) + (meals.comida || 0) + (meals.cena || 0), 0);
    }, [item.dailySchedule]);

    const { value, available } = item.dailyValues[day];
    
    // **CORRECCIÓN CRÍTICA DE LÓGICA DE NEGOCIO:**
    // La cantidad máxima que se puede asignar a este input (maxQuantity) es
    // el total de ese artículo para el día (item.maxQuantity).
    // La cantidad disponible para reasignar es:
    // item.maxQuantity - (item.totalAssigned - item.dailyValues[day].value)
    const maxAllowed = item.maxQuantity;
    const available = item.maxQuantity - totalScheduled;
    const isOverallocated = available < 0;
    const statusColor = isOverallocated ? 'bg-red-500' : (available === 0 ? 'bg-green-500' : 'bg-yellow-500');

    return (
        <tr className="bg-white">
            <td className="border px-4 py-2">{item.code}</td>
            <td className="border px-4 py-2">{item.description}</td>
            {Object.keys(item.dailyValues).map((d) => {
                const dayKey = d as Day;
                const { value, available, total } = item.dailyValues[dayKey];
                
                // La disponibilidad real para este stepper debe ser:
                // La disponibilidad global (available) MÁS el valor actual de esta celda (value).
                // Esto permite al usuario aumentar el valor hasta el máximo sin ser penalizado
                // por la asignación que ya hizo en esta misma celda.
                const availableForStepper = available + value;
        <tr style={style} className="bg-white hover:bg-slate-50/70 transition-colors duration-150 ease-in-out animate-fade-in-down">
            <td className="border-b border-r border-gray-200 px-6 py-3 text-sm font-mono text-gray-700 sticky left-0 bg-white w-32 z-10" style={{ borderLeft: `4px solid ${groupColor}` }}>{item.code}</td>
            <td className="border-b border-r border-gray-200 px-6 py-3 text-sm text-gray-800 sticky left-[128px] bg-white w-64 z-10">{item.description}</td>
            <td className={`border-b border-r border-gray-200 px-6 py-3 text-sm text-center text-gray-600 sticky left-[384px] bg-white w-28 z-10 transition-shadow duration-200 ${isScrolled ? 'sticky-col-shadow' : ''}`}>{item.unit}</td>
            
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                const daySchedule = item.dailySchedule[day] || { desayuno: 0, comida: 0, cena: 0 };
                const isFocused = day === focusedDay;

                return (
                    <td key={dayKey} className="border px-4 py-2">
                        <NumberStepper 
                            value={value}
                            onValueChange={(newValue) => updateDailyValue(dayKey, 'desayuno', newValue)}
                            availableQuantity={availableForStepper}
                        />
                    </td>
                );
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
            <td className="border px-4 py-2">{total}</td>
            <td className="border px-4 py-2">{item.maxQuantity}</td>
            <td className="border-b border-l border-gray-300 px-6 py-3 text-sm font-semibold text-center sticky right-[136px] bg-blue-50/95 z-10 w-20">{totalScheduled}</td>
            <td className={`border-b border-gray-200 px-6 py-3 text-sm font-semibold text-center sticky right-[56px] z-10 w-20 ${isOverallocated ? 'bg-red-100 text-red-700' : 'bg-blue-50/95'}`}>{available}</td>
            <td className="border-b border-gray-200 px-6 py-3 text-center sticky right-0 bg-blue-50/95 z-10 w-14"><div className={`h-2.5 w-2.5 rounded-full mx-auto ${statusColor}`} title={isOverallocated ? 'Sobre-asignado' : (available === 0 ? 'Completo' : 'Disponible')}></div></td>
        </tr>
    );
};
