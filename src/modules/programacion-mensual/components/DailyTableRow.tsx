
import React, { useMemo } from 'react';
import { Item, Day, Meal } from '../types';
import NumberStepper from './NumberStepper';

interface DailyTableRowProps {
    item: Item;
    day: Day;
    updateDailyValue: (day: Day, meal: Meal, value: number) => void;
}

export const DailyTableRow: React.FC<DailyTableRowProps> = ({ item, day, updateDailyValue }) => {
    const total = useMemo(() => {
        return Object.values(item.dailyValues).reduce((sum, dailyValue) => sum + dailyValue.value, 0);
    }, [item.dailyValues]);

    const { value, available } = item.dailyValues[day];
    
    // **CORRECCIÓN CRÍTICA DE LÓGICA DE NEGOCIO:**
    // La cantidad máxima que se puede asignar a este input (maxQuantity) es
    // el total de ese artículo para el día (item.maxQuantity).
    // La cantidad disponible para reasignar es:
    // item.maxQuantity - (item.totalAssigned - item.dailyValues[day].value)
    const maxAllowed = item.maxQuantity;

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

                return (
                    <td key={dayKey} className="border px-4 py-2">
                        <NumberStepper 
                            value={value}
                            onValueChange={(newValue) => updateDailyValue(dayKey, 'desayuno', newValue)}
                            availableQuantity={availableForStepper}
                        />
                    </td>
                );
            })}
            <td className="border px-4 py-2">{total}</td>
            <td className="border px-4 py-2">{item.maxQuantity}</td>
        </tr>
    );
};
