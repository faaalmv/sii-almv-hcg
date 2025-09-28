
import React from 'react';
import { Factura } from '../../types';
import Icon from '../../../../common/icons/Icon';

interface ResumenVisualFacturaProps {
  factura: Factura;
}

export const ResumenVisualFactura: React.FC<ResumenVisualFacturaProps> = ({ factura }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200/80 p-6 h-full font-sans">
      <header className="flex justify-between items-center pb-4 border-b-2 border-gray-100">
        <h3 className="font-oswald text-2xl font-bold uppercase text-gray-700 tracking-wider">Factura</h3>
        <span className="text-sm font-mono text-gray-500">#{factura.folioFiscal.substring(0, 8)}</span>
      </header>

      <section className="grid grid-cols-2 gap-6 my-6">
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Emisor</h4>
          <div className="flex items-start space-x-3">
            <Icon.BuildingOffice className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800">{factura.razonSocial}</p>
              <p className="text-sm text-gray-600">{factura.rfc}</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Receptor</h4>
          <div className="flex items-start space-x-3">
            <Icon.UserCircle className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800">GOBIERNO DEL ESTADO</p>
              <p className="text-sm text-gray-600">GDE123456ABC</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 rounded-md p-4 mb-6 border border-gray-200/80">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Detalles</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Fecha de Carga:</span>
            <span className="font-medium text-gray-800">{formatDate(factura.fechaCarga)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Concepto Principal:</span>
            <span className="font-medium text-gray-800">Servicios Administrativos</span>
          </div>
           <div className="flex justify-between">
            <span className="text-gray-600">Moneda:</span>
            <span className="font-medium text-gray-800">MXN</span>
          </div>
        </div>
      </section>

      <footer className="pt-4 border-t-2 border-gray-100">
        <div className="flex justify-end items-baseline space-x-2">
          <span className="text-md font-semibold text-gray-600">Total:</span>
          <span className="text-3xl font-bold font-oswald text-blue-800 tracking-tight">{formatCurrency(factura.monto)}</span>
        </div>
      </footer>
    </div>
  );
};
