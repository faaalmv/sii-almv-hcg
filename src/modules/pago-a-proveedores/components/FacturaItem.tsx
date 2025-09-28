
import React, { useState } from 'react';
import { Factura, EstadoFactura, OrdenDeCompra } from '../types';
import { ChevronDownIcon, DocumentTextIcon, ClockIcon } from './icons/Icon';
import { CentroDeComandoFactura } from './invoice-detail/CentroDeComandoFactura';

interface FacturaItemProps {
  factura: Factura;
  index: number;
  ordenesDeCompra: OrdenDeCompra[];
  todasLasFacturas: Factura[];
  onLinkOrdenDeCompra: (facturaId: string, ordenDeCompraId: string) => void;
}

const getStatusBadgeColor = (status: EstadoFactura) => {
    switch (status) {
        case EstadoFactura.PAGADA:
            return 'bg-green-100 text-green-800';
        case EstadoFactura.APROBADA_PARA_PAGO:
            return 'bg-blue-100 text-blue-800';
        case EstadoFactura.RECHAZADA:
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-yellow-100 text-yellow-800';
    }
};

export const FacturaItem: React.FC<FacturaItemProps> = ({ factura, index, ordenesDeCompra, todasLasFacturas, onLinkOrdenDeCompra }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const animationDelay = `${index * 100}ms`;

  return (
    <div 
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 animate-factura-item-fade-in-up"
      style={{ animationDelay }}
    >
      <div className="p-4 cursor-pointer hover:bg-gray-50/70" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center text-sm text-gray-500">
              <DocumentTextIcon className="w-4 h-4 mr-2"/>
              <p>Folio Fiscal: {factura.folioFiscal.substring(0, 8)}...</p>
            </div>
            <p className="text-xl font-bold text-gray-800">{formatCurrency(factura.monto)}</p>
          </div>
          
          <div className="flex-1 min-w-[150px]">
             <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="w-4 h-4 mr-2"/>
                <p>Fecha de Carga</p>
            </div>
            <p className="font-semibold text-gray-700">{formatDate(factura.fechaCarga)}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeColor(factura.estadoActual)}`}
            >
              {factura.estadoActual}
            </span>
            <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50/50 animate-factura-item-expand">
          <CentroDeComandoFactura 
            factura={factura} 
            ordenesDeCompra={ordenesDeCompra}
            todasLasFacturas={todasLasFacturas}
            onLinkOrdenDeCompra={onLinkOrdenDeCompra}
          />
        </div>
      )}
       {/* FIX: Replaced the non-standard `jsx` attribute on the <style> tag with locally-scoped animation names to fix TypeScript errors and prevent global CSS conflicts. */}
       <style>{`
        @keyframes factura-item-fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-factura-item-fade-in-up {
          animation: factura-item-fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes factura-item-expand {
            from {
                max-height: 0;
                opacity: 0;
            }
            to {
                max-height: 800px;
                opacity: 1;
            }
        }
        .animate-factura-item-expand {
            animation: factura-item-expand 0.6s ease-in-out;
            overflow: hidden;
        }
      `}</style>
    </div>
  );
};
