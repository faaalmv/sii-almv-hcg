
import React from 'react';
import { OrdenDeCompra, Factura } from '../types';

interface ModalHistorialDeConsumoOCProps {
  isOpen: boolean;
  onClose: () => void;
  ordenDeCompra: OrdenDeCompra;
  todasLasFacturas: Factura[];
}

export const ModalHistorialDeConsumoOC: React.FC<ModalHistorialDeConsumoOCProps> = ({ isOpen, onClose, ordenDeCompra, todasLasFacturas }) => {
  if (!isOpen) {
    return null;
  }

  const facturasDeLaOC = todasLasFacturas.filter(f => f.ordenDeCompraId === ordenDeCompra.id);
  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Historial de Consumo - OC: {ordenDeCompra.numeroOC}</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Monto Total de la OC: {formatCurrency(ordenDeCompra.montoTotal)}
            </p>
            <div className="mt-4">
              <h4 className="text-md font-semibold text-gray-800">Facturas Vinculadas</h4>
              <ul className="mt-2 text-left">
                {facturasDeLaOC.map(factura => (
                  <li key={factura.id} className="border-b py-2 flex justify-between">
                    <span>{factura.numeroFactura} ({new Date(factura.fecha).toLocaleDateString()})</span>
                    <span className="font-semibold">{formatCurrency(factura.monto)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
