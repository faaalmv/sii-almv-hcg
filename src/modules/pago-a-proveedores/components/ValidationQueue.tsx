import React from 'react';
import { Factura } from '../types';
import { EyeIcon } from './icons/Icon';

interface BandejaDeTareasProps {
  facturas: Factura[];
  onSelectFactura: (factura: Factura) => void;
  title: string;
}

export const BandejaDeTareas: React.FC<BandejaDeTareasProps> = ({ facturas, onSelectFactura, title }) => {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">{title} ({facturas.length})</h2>
      </div>
      {facturas.length > 0 ? (
        <div className="overflow-y-auto h-[calc(100%-65px)]">
            <ul className="divide-y divide-gray-200">
            {facturas.map((factura, index) => (
                <li
                key={factura.id}
                className="p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer animate-validation-queue-fade-in-up"
                style={{ animationDelay: `${index * 75}ms` }}
                onClick={() => onSelectFactura(factura)}
                >
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-1 min-w-[250px]">
                    <p className="font-semibold text-blue-800">{factura.razonSocial}</p>
                    <p className="text-sm text-gray-500">Folio: {factura.folioFiscal}</p>
                    </div>
                    <div className="flex-none w-32">
                    <p className="font-semibold text-gray-900 text-lg">{formatCurrency(factura.monto)}</p>
                    </div>
                    <div className="flex-none w-32">
                    <p className="text-sm text-gray-600">{formatDate(factura.fechaCarga)}</p>
                    </div>
                    <div className="flex-none">
                    <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 font-semibold">
                        <EyeIcon />
                        <span>Revisar</span>
                    </button>
                    </div>
                </div>
                </li>
            ))}
            </ul>
        </div>
      ) : (
        <div className="p-10 text-center text-gray-500 flex items-center justify-center h-[calc(100%-65px)]">
          <p>No hay facturas pendientes en tu bandeja.</p>
        </div>
      )}
       {/* FIX: Replaced the non-standard `jsx` attribute on the <style> tag with locally-scoped animation names to fix TypeScript errors and prevent global CSS conflicts. */}
       <style>{`
        @keyframes validation-queue-fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-validation-queue-fade-in-up {
          animation: validation-queue-fade-in-up 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};
