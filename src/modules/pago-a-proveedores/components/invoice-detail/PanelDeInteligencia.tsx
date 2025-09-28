
import React from 'react';
import { Factura, EstadoFactura } from '../../types';
import { Button } from '../common/Button';
import Icon from '../../../../common/icons/Icon';

interface PanelDeInteligenciaProps {
  factura: Factura;
}

const PanelRechazado: React.FC<{ factura: Factura }> = ({ factura }) => {
  const motivo = factura.historial.find(h => h.etapa === EstadoFactura.RECHAZADA)?.motivoRechazo;
  return (
    <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg" role="alert">
      <div className="flex items-start">
        <Icon.XCircle className="w-6 h-6 mr-3 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-lg">Acción Requerida</h4>
          <p className="text-md mt-1">
            Esta factura fue rechazada. Por favor, revisa el motivo y vuelve a cargar los documentos corregidos.
          </p>
          {motivo && (
            <div className="mt-3 bg-red-100 p-3 rounded-md">
              <p className="font-semibold">Motivo del Rechazo:</p>
              <p className="text-sm">{motivo}</p>
            </div>
          )}
          <div className="mt-4">
            <Button variant="danger">Corregir y Cargar de Nuevo</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PanelAprobado: React.FC<{ factura: Factura }> = ({ factura }) => (
  <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg" role="status">
    <div className="flex items-start">
      <Icon.CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
      <div>
        <h4 className="font-bold text-lg">Aprobada para Pago</h4>
        <p className="text-md mt-1">
          ¡Buenas noticias! Tu factura ha sido aprobada y está en la cola para ser pagada.
        </p>
        <div className="mt-3 flex items-center space-x-2 text-blue-700">
            <CalendarDaysIcon className="w-5 h-5" />
            <span>Fecha estimada de pago: <strong>3 de Octubre de 2025</strong></span>
        </div>
      </div>
    </div>
  </div>
);

const PanelPendiente: React.FC<{ factura: Factura }> = ({ factura }) => (
  <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg" role="status">
    <div className="flex items-start">
      <InformationCircleIcon className="w-6 h-6 mr-3 flex-shrink-0" />
      <div>
        <h4 className="font-bold text-lg">En Proceso</h4>
        <p className="text-md mt-1">
          La factura se encuentra actualmente en la etapa de <strong>{factura.estadoActual}</strong>. Nuestro equipo la está revisando.
        </p>
        <p className="text-sm mt-2">No se requiere ninguna acción de tu parte por el momento.</p>
      </div>
    </div>
  </div>
);

export const PanelDeInteligencia: React.FC<PanelDeInteligenciaProps> = ({ factura }) => {
  switch (factura.estadoActual) {
    case EstadoFactura.RECHAZADA:
      return <PanelRechazado factura={factura} />;
    case EstadoFactura.APROBADA_PARA_PAGO:
    case EstadoFactura.PAGADA:
      return <PanelAprobado factura={factura} />;
    default:
      return <PanelPendiente factura={factura} />;
  }
};
