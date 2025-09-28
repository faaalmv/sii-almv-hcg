
import React, { useState } from 'react';
import { HistorialItem, EstadoFactura } from '../../types';
import { CheckIcon, XIcon, ClockIcon, ChevronDownIcon, UserCircleIcon } from '../icons/Icon';

interface LineaDeTiempoAuditableProps {
  historial: HistorialItem[];
}

const EventoIcon: React.FC<{ etapa: EstadoFactura }> = ({ etapa }) => {
  const iconMap: { [key in EstadoFactura]?: React.ReactNode } = {
    [EstadoFactura.RECHAZADA]: <XIcon className="w-5 h-5 text-white" />,
    [EstadoFactura.PAGADA]: <CheckIcon className="w-5 h-5 text-white" />,
  };
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white
      ${etapa === EstadoFactura.RECHAZADA ? 'bg-red-500' : ''}
      ${etapa === EstadoFactura.PAGADA ? 'bg-green-500' : ''}
      ${etapa !== EstadoFactura.RECHAZADA && etapa !== EstadoFactura.PAGADA ? 'bg-blue-500' : ''}
    `}>
      {iconMap[etapa] || <ClockIcon className="w-5 h-5 text-white" />}
    </div>
  );
};

const EventoItem: React.FC<{ item: HistorialItem; isLast: boolean }> = ({ item, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="relative">
      {!isLast && <div className="absolute top-5 left-5 -ml-px mt-1 w-0.5 h-full bg-gray-300"></div>}
      <div className="relative flex items-start space-x-4">
        <EventoIcon etapa={item.etapa} />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div>
              <p className="font-semibold text-gray-800">{item.etapa}</p>
              <p className="text-sm text-gray-500">{formatDate(item.fecha)}</p>
            </div>
            {(item.comentarios || item.motivoRechazo) && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                aria-label="Ver detalles"
              >
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
          {isExpanded && (
            <div className="mt-2 ml-4 p-3 bg-gray-100 rounded-md border border-gray-200 text-sm">
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <UserCircleIcon className="w-5 h-5" />
                <span>Realizado por: <strong>{item.usuario}</strong></span>
              </div>
              <p className="text-gray-800">{item.comentarios || item.motivoRechazo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export const LineaDeTiempoAuditable: React.FC<LineaDeTiempoAuditableProps> = ({ historial }) => {
  const sortedHistorial = [...historial].sort((a,b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200/80 shadow-sm">
      <h4 className="text-lg font-semibold text-gray-700 mb-4 px-1">Línea de Tiempo Auditable</h4>
      <div className="space-y-6">
        {sortedHistorial.map((item, index) => (
          <EventoItem key={index} item={item} isLast={index === sortedHistorial.length - 1} />
        ))}
      </div>
    </div>
  );
};
