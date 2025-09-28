
import React, { useState } from 'react';
import { Factura, Usuario, EstadoFactura, OrdenDeCompra } from '../types';
import { MOTIVOS_RECHAZO_COMUNES } from '../constants';
import { Button } from './common/Button';
import Modal from '../../../common/Modal';
import Icon from '../../../common/icons/Icon';
import { ModuloReconciliacionOC } from './invoice-detail/ModuloReconciliacionOC';

interface FacturaDetailViewProps {
  factura: Factura;
  currentUser: Usuario;
  onApprove: (facturaId: string, nextStatus: EstadoFactura) => void;
  onReject: (facturaId: string, motivo: string) => void;
  onBack: () => void;
  ordenesDeCompra: OrdenDeCompra[];
  todasLasFacturas: Factura[];
  onLinkOrdenDeCompra: (facturaId: string, ordenDeCompraId: string) => void;
}

export const FacturaDetailView: React.FC<FacturaDetailViewProps> = ({
  factura,
  currentUser,
  onApprove,
  onReject,
  onBack,
  ordenesDeCompra,
  todasLasFacturas,
  onLinkOrdenDeCompra,
}) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [customRejectionReason, setCustomRejectionReason] = useState('');

  const handleReject = () => {
    const finalReason = rejectionReason === 'Otro' ? customRejectionReason : rejectionReason;
    if (finalReason.trim()) {
        onReject(factura.id, finalReason);
        setIsRejectModalOpen(false);
    }
  };

  const getNextStatus = (): EstadoFactura | null => {
      if(factura.estadoActual === EstadoFactura.EN_VALIDACION_GLOSA) {
          return EstadoFactura.VALIDACION_PRESUPUESTO;
      }
      if(factura.estadoActual === EstadoFactura.VALIDACION_PRESUPUESTO) {
          return EstadoFactura.APROBADA_PARA_PAGO;
      }
      return null;
  }

  const nextStatus = getNextStatus();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{factura.razonSocial}</h2>
          <p className="text-sm text-gray-500">Folio Fiscal: {factura.folioFiscal}</p>
          <p className="text-2xl font-semibold text-blue-800 mt-2">
            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(factura.monto)}
          </p>
        </div>
        <Button onClick={onBack} variant="secondary">Volver a la Lista</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document Viewer Placeholder */}
        <div className="bg-gray-100 rounded-lg p-4 min-h-[400px] flex flex-col items-center justify-center border">
            <object data={factura.pdfFile ? URL.createObjectURL(factura.pdfFile) : ''} type="application/pdf" width="100%" height="100%">
                <div className="text-center text-gray-500">
                    <p className="text-lg">Visualizador de PDF</p>
                    <p className="text-sm">La previsualización del PDF aparecería aquí.</p>
                </div>
            </object>
        </div>

        {/* Audit Log and Actions */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Historial de Acciones</h3>
            <ul className="space-y-4">
              {factura.historial.map((item, index) => (
                <li key={index} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.etapa === EstadoFactura.RECHAZADA ? 'bg-red-500' : 'bg-green-500'}`}>
                      {item.etapa === EstadoFactura.RECHAZADA ? <Icon.X className="w-5 h-5 text-white" /> : <Icon.Check className="w-5 h-5 text-white" />}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.etapa}</p>
                    <p className="text-sm text-gray-500">
                      Por: {item.usuario} - {new Date(item.fecha).toLocaleString('es-MX')}
                    </p>
                    {item.motivoRechazo && (
                      <p className="text-sm text-red-600 mt-1">Motivo: {item.motivoRechazo}</p>
                    )}
                  </div>
                </li>
              ))}
               <li className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 animate-pulse">
                      <Icon.Clock className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Acción Requerida: {factura.estadoActual}</p>
                     <p className="text-sm text-gray-500">
                      Esperando validación por: {currentUser.nombre}
                    </p>
                  </div>
                </li>
            </ul>
          </div>
          
          <div className="pt-6 border-t flex space-x-4">
            {nextStatus && (
                <Button onClick={() => onApprove(factura.id, nextStatus)} variant="success">
                    <span className="flex items-center space-x-2"><Icon.Check className="w-5 h-5"/> <span>Aprobar</span></span>
                </Button>
            )}
            <Button onClick={() => setIsRejectModalOpen(true)} variant="danger">
              <span className="flex items-center space-x-2"><Icon.X className="w-5 h-5"/> <span>Rechazar con Motivo</span></span>
            </Button>
          </div>
        </div>
      </div>
       <div className="border-t pt-6">
            <ModuloReconciliacionOC
                factura={factura}
                ordenesDeCompra={ordenesDeCompra}
                todasLasFacturas={todasLasFacturas}
                onLinkOrdenDeCompra={onLinkOrdenDeCompra}
            />
        </div>

      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Justificar Rechazo"
      >
        <div className="space-y-4">
          <p>Selecciona una causa común o escribe una justificación clara. Este mensaje será visible para el proveedor.</p>
          <select 
            value={rejectionReason} 
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            >
            <option value="">-- Selecciona un motivo --</option>
            {MOTIVOS_RECHAZO_COMUNES.map(motivo => <option key={motivo} value={motivo}>{motivo}</option>)}
            <option value="Otro">Otro (especificar)</option>
          </select>
          {rejectionReason === 'Otro' && (
            <textarea
              value={customRejectionReason}
              onChange={(e) => setCustomRejectionReason(e.target.value)}
              placeholder="Escribe aquí la justificación detallada..."
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
          )}
          <div className="flex justify-end space-x-3">
            <Button onClick={() => setIsRejectModalOpen(false)} variant="secondary">Cancelar</Button>
            <Button onClick={handleReject} variant="danger" disabled={!rejectionReason || (rejectionReason === 'Otro' && !customRejectionReason.trim())}>Confirmar Rechazo</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
