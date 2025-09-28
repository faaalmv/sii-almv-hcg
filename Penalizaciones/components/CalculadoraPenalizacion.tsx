
import React, { useState, useEffect } from 'react';
import { Incidencia, Penalizacion } from '../types';
import { CheckIcon } from './Icons';

interface CalculadoraPenalizacionProps {
    incidencia: Incidencia;
    onApplyPenalty: (incidenciaId: string, penalizacion: Omit<Penalizacion, 'id'>) => void;
}

const CalculadoraPenalizacion: React.FC<CalculadoraPenalizacionProps> = ({ incidencia, onApplyPenalty }) => {
    const [step, setStep] = useState(0);
    const [showProgress, setShowProgress] = useState(false);
    const [isApplied, setIsApplied] = useState(!!incidencia.penalizacion);

    const calculo = {
        diasAtraso: 5,
        formula: "(Monto Hito x 2%)",
        total: 7500,
    };

    useEffect(() => {
        if (isApplied) return;
        // Fix: Cannot find namespace 'NodeJS'. Use a browser-compatible type for setTimeout's return value.
        const timers: ReturnType<typeof setTimeout>[] = [];
        if (step < 3) {
            timers.push(setTimeout(() => setStep(prev => prev + 1), 500));
        }
        return () => timers.forEach(clearTimeout);
    }, [step, isApplied]);
    
    const handleApply = () => {
        setShowProgress(true);
        setTimeout(() => {
            const newPenalty: Omit<Penalizacion, 'id'> = {
                monto: calculo.total,
                folio: `folio-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                fechaNotificacion: new Date().toISOString(),
                calculo: calculo
            };
            onApplyPenalty(incidencia.id, newPenalty);
            setIsApplied(true);
            setShowProgress(false);
        }, 2000);
    };

    const calculationSteps = [
        { label: "Días de atraso", value: `${calculo.diasAtraso}` },
        { label: "Fórmula aplicada", value: `${calculo.formula}` },
        { label: "Total Penalización", value: `$${calculo.total.toLocaleString('es-MX')}` },
    ];
    
    const displaySteps = incidencia.penalizacion ? [
        { label: "Días de atraso", value: `${incidencia.penalizacion.calculo.diasAtraso}` },
        { label: "Fórmula aplicada", value: `${incidencia.penalizacion.calculo.formula}` },
        { label: "Total Penalización", value: `$${incidencia.penalizacion.calculo.total.toLocaleString('es-MX')}` },
    ] : calculationSteps;
    
    const currentStepToShow = isApplied ? 3 : step;

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="text-md font-semibold text-gray-700 mb-4">Cálculo de Penalización</h4>
            <div className="space-y-3">
                {displaySteps.map((s, index) => (
                    <div
                        key={s.label}
                        className={`transition-all duration-500 ${index < currentStepToShow ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{s.label}:</span>
                            <span className="font-bold text-gray-800">{s.value}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                {isApplied ? (
                    <div className="flex items-center justify-center p-3 bg-green-100 text-green-800 text-sm font-medium rounded-md">
                        <CheckIcon className="h-5 w-5 mr-2" />
                        Penalización aplicada y notificada. Folio: {incidencia.penalizacion?.folio}
                    </div>
                ) : (
                    <>
                        {showProgress ? (
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '100%', transition: 'width 2s' }}></div>
                                <p className="text-center text-sm mt-2 text-gray-600">Notificando al proveedor...</p>
                            </div>
                        ) : (
                            <button
                                onClick={handleApply}
                                disabled={step < 3}
                                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all active:scale-95"
                            >
                                Notificar al Proveedor
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CalculadoraPenalizacion;