
import React from 'react';
import { Factura, OrdenDeCompra } from '../types';
import { FacturaItem } from './FacturaItem';
import { Button } from './common/Button';
import { UploadIcon } from './icons/Icon';

interface FacturasDashboardProps {
  facturas: Factura[];
  onUploadClick: () => void;
  ordenesDeCompra: OrdenDeCompra[];
  todasLasFacturas: Factura[];
  onLinkOrdenDeCompra: (facturaId: string, ordenDeCompraId: string) => void;
}

export const FacturasDashboard: React.FC<FacturasDashboardProps> = ({ facturas, onUploadClick, ordenesDeCompra, todasLasFacturas, onLinkOrdenDeCompra }) => {
  return (
    <div className="space-y-4">
      {facturas.length === 0 ? (
        <div className="text-center py-20 px-6 bg-white rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Bienvenido.</h2>
          <p className="mt-2 text-gray-600">Comienza aquí tu primer trámite de pago.</p>
          <div className="mt-6">
            <Button onClick={onUploadClick} variant="primary">
              <span className="flex items-center space-x-2">
                <UploadIcon className="w-5 h-5"/>
                <span>Cargar Nueva Factura</span>
              </span>
            </Button>
          </div>
        </div>
      ) : (
        facturas.map((factura, index) => 
            <FacturaItem 
                key={factura.id} 
                factura={factura} 
                index={index} 
                ordenesDeCompra={ordenesDeCompra}
                todasLasFacturas={todasLasFacturas}
                onLinkOrdenDeCompra={onLinkOrdenDeCompra}
            />)
      )}
    </div>
  );
};
