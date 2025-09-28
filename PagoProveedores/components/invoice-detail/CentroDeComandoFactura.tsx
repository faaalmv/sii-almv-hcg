
import React, { useState, useEffect } from 'react';
import { Factura, OrdenDeCompra } from '../../types';
import { ResumenVisualFactura } from './ResumenVisualFactura';
import { PanelDeInteligencia } from './PanelDeInteligencia';
import { LineaDeTiempoAuditable } from './LineaDeTiempoAuditable';
import { ModuloReconciliacionOC } from './ModuloReconciliacionOC';

interface CentroDeComandoFacturaProps {
  factura: Factura;
  ordenesDeCompra: OrdenDeCompra[];
  todasLasFacturas: Factura[];
  onLinkOrdenDeCompra: (facturaId: string, ordenDeCompraId: string) => void;
}

const CentroDeComandoSkeleton: React.FC = () => (
  <div className="p-6 grid grid-cols-1 lg:grid-cols-10 gap-8 animate-pulse">
    <div className="lg:col-span-4 bg-gray-200 rounded-lg h-96"></div>
    <div className="lg:col-span-6 space-y-8">
      <div className="bg-gray-200 rounded-lg h-32 w-full"></div>
      <div className="bg-gray-200 rounded-lg h-48 w-full"></div>
      <div className="bg-gray-200 rounded-lg h-24 w-full"></div>
    </div>
  </div>
);

export const CentroDeComandoFactura: React.FC<CentroDeComandoFacturaProps> = ({ factura, ordenesDeCompra, todasLasFacturas, onLinkOrdenDeCompra }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 750);
    return () => clearTimeout(timer);
  }, [factura.id]);

  if (isLoading) {
    return <CentroDeComandoSkeleton />;
  }

  return (
    <>
      <style>{`
        @keyframes cdc-content-fade-in-up {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-cdc-content-enter {
          animation: cdc-content-fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
      <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-10 gap-8">
        <div className="lg:col-span-4 animate-cdc-content-enter" style={{ animationDelay: '100ms' }}>
          <ResumenVisualFactura factura={factura} />
        </div>
        <div className="lg:col-span-6 space-y-6">
          <div className="animate-cdc-content-enter" style={{ animationDelay: '200ms' }}>
            <PanelDeInteligencia factura={factura} />
          </div>
          <div className="animate-cdc-content-enter" style={{ animationDelay: '300ms' }}>
            <LineaDeTiempoAuditable historial={factura.historial} />
          </div>
           <div className="animate-cdc-content-enter" style={{ animationDelay: '400ms' }}>
            <ModuloReconciliacionOC
                factura={factura}
                ordenesDeCompra={ordenesDeCompra}
                todasLasFacturas={todasLasFacturas}
                onLinkOrdenDeCompra={onLinkOrdenDeCompra}
            />
          </div>
        </div>
      </div>
    </>
  );
};
