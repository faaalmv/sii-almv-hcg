
import React, { useState } from 'react';
import { OrdenDeCompra, Factura } from '../../types';
import { ModalHistorialDeConsumoOC } from '../ModalHistorialDeConsumoOC';

interface TarjetaResumenOCProps {
  ordenDeCompra: OrdenDeCompra;
  facturaActualMonto: number;
  todasLasFacturas: Factura[];
}

const Tooltip: React.FC<{ message: string; children: React.ReactNode }> = ({ message, children }) => (
    <div className="relative group flex items-center">
      {children}
      <div className="absolute bottom-full mb-2 w-max max-w-xs p-2 text-sm text-white bg-gray-900 rounded-md shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {message}
      </div>
    </div>
);

export const TarjetaResumenOC: React.FC<TarjetaResumenOCProps> = ({ ordenDeCompra, facturaActualMonto, todasLasFacturas }) => {
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const formatCurrency = (amount: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    
    const saldoDisponible = ordenDeCompra.montoTotal - ordenDeCompra.montoConsumido;
    const consumoTotalPorcentaje = (ordenDeCompra.montoConsumido / ordenDeCompra.montoTotal) * 100;
    const consumoPrevioPorcentaje = ((ordenDeCompra.montoConsumido - facturaActualMonto) / ordenDeCompra.montoTotal) * 100;
    const facturaActualPorcentaje = (facturaActualMonto / ordenDeCompra.montoTotal) * 100;
    
    let progressBarColor = 'bg-blue-500';
    if (consumoTotalPorcentaje > 90) progressBarColor = 'bg-yellow-500';
    if (consumoTotalPorcentaje >= 100) progressBarColor = 'bg-red-500';

    return (
        <>
            <div 
                className="border rounded-lg p-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200"
                onClick={() => setIsHistoryModalOpen(true)}
                role="button"
                aria-label={`Ver historial de la orden de compra ${ordenDeCompra.numeroOC}`}
            >
                <div className="flex justify-between items-center mb-3">
                    <h5 className="font-bold text-gray-800">{ordenDeCompra.numeroOC}</h5>
                    <span className="text-xs font-mono text-white bg-gray-800 px-2 py-0.5 rounded">OC Vinculada</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                    <div 
                        className="bg-blue-300 h-4 rounded-l-full"
                        style={{ width: `${consumoPrevioPorcentaje}%` }}
                    />
                    <Tooltip message={`Esta factura: ${formatCurrency(facturaActualMonto)}`}>
                         <div 
                            className={`${progressBarColor} h-4 absolute transition-all duration-700 ease-out`}
                            style={{ left: `${consumoPrevioPorcentaje}%`, width: `${facturaActualPorcentaje}%` }}
                        />
                    </Tooltip>
                </div>
                <div className="text-xs text-right text-gray-500 mt-1">
                    Consumido: {consumoTotalPorcentaje.toFixed(2)}%
                </div>

                {/* Financial Breakdown */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div>
                        <p className="text-xs text-gray-500">Total OC</p>
                        <p className="font-semibold text-gray-700">{formatCurrency(ordenDeCompra.montoTotal)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Facturado</p>
                        <p className="font-semibold text-blue-700">{formatCurrency(ordenDeCompra.montoConsumido)}</p>
                    </div>
                     <div>
                        <p className="text-xs text-gray-500">Saldo</p>
                        <p className="font-semibold text-green-700">{formatCurrency(saldoDisponible)}</p>
                    </div>
                </div>
            </div>
            <ModalHistorialDeConsumoOC
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                ordenDeCompra={ordenDeCompra}
                todasLasFacturas={todasLasFacturas}
            />
        </>
    );
};
