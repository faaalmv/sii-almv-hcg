
import React, { useState } from 'react';
import { Factura, HistorialItem, EstadoFactura } from '../types';
import { ESTADOS_FACTURA_ORDEN } from '../constants';
import Icon from '../../../common/icons/Icon';

interface FacturaTimelineProps {
  factura: Factura;
}

const Tooltip: React.FC<{ message: string; children: React.ReactNode }> = ({ message, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative flex items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full mb-2 w-max max-w-xs p-2 text-sm text-white bg-gray-800 rounded-md shadow-lg z-10">
          {message}
        </div>
      )}
    </div>
  );
};

const borderColorMap: { [key: string]: string } = {
  green: 'border-green-500',
  gray: 'border-gray-500',
  blue: 'border-blue-500',
  red: 'border-red-500',
};

const bgColorMap: { [key: string]: string } = {
  green: 'bg-green-100',
  gray: 'bg-gray-100',
  blue: 'bg-blue-100',
  red: 'bg-red-100',
};

const textColorMap: { [key: string]: string } = {
  green: 'text-green-600',
  gray: 'text-gray-600',
  blue: 'text-blue-600',
  red: 'text-red-600',
};

const lineColorMap: { [key: string]: string } = {
  green: 'bg-green-300',
  gray: 'bg-gray-300',
};

export const FacturaTimeline: React.FC<FacturaTimelineProps> = ({ factura }) => {
  const getStatusInfo = (etapa: EstadoFactura) => {
    const historyItem = factura.historial.find(h => h.etapa === etapa);
    const isCompleted = !!historyItem;
    const isCurrent = factura.estadoActual === etapa;
    const isRejected = factura.estadoActual === EstadoFactura.RECHAZADA && factura.historial[factura.historial.length-1].etapa === etapa;

    let color = 'gray';
    if (isCompleted) color = 'green';
    if (isCurrent) color = 'blue';
    if (isRejected) color = 'red';
    
    return { isCompleted, isCurrent, isRejected, color, historyItem };
  };

  if (factura.estadoActual === EstadoFactura.RECHAZADA) {
    const rejectionItem = factura.historial[factura.historial.length-1];
    return (
       <div className="flex items-center space-x-2 text-red-600">
          <Icon.XCircle className="w-5 h-5"/>
          <div className="flex flex-col">
              <span className="font-semibold">Rechazada</span>
              <Tooltip message={rejectionItem.motivoRechazo || 'Sin motivo específico'}>
                  <span className="text-sm text-gray-600 cursor-pointer underline decoration-dotted">
                    {rejectionItem.motivoRechazo?.substring(0, 30) || 'Motivo no disponible'}...
                  </span>
              </Tooltip>
          </div>
       </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2">
      {ESTADOS_FACTURA_ORDEN.map((etapa, index) => {
        const { isCompleted, isCurrent, color } = getStatusInfo(etapa);
        const nextEtapaInfo = index < ESTADOS_FACTURA_ORDEN.length - 1 ? getStatusInfo(ESTADOS_FACTURA_ORDEN[index + 1]) : { isCompleted: false };
        const lineColor = nextEtapaInfo.isCompleted || isCompleted ? 'green' : 'gray';

        return (
          <React.Fragment key={etapa}>
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${borderColorMap[color]} ${bgColorMap[color]}`}
              >
                {isCompleted && <Icon.CheckCircle className={`w-5 h-5 ${textColorMap[color]}`} />}
                {isCurrent && <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>}
              </div>
              <p className={`mt-1 text-xs text-center text-gray-600 ${isCurrent ? 'font-bold text-blue-700' : ''}`}>{etapa}</p>
            </div>
            {index < ESTADOS_FACTURA_ORDEN.length - 1 && (
              <div className={`flex-1 h-1 ${lineColorMap[lineColor]}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
