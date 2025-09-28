
import React from 'react';
import { OrdenDeCompra, Factura } from '../../types';
import Modal from '../../../../common/Modal';
import Icon from '../../../../common/icons/Icon';

interface ModalHistorialDeConsumoOCProps {
  isOpen: boolean;
  onClose: () => void;
  ordenDeCompra: OrdenDeCompra;
  todasLasFacturas: Factura[];
}

export const ModalHistorialDeConsumoOC: React.FC<ModalHistorialDeConsumoOCProps> = ({ isOpen, onClose, ordenDeCompra, todasLasFacturas }) => {
  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

  const facturasVinculadas = ordenDeCompra.facturasVinculadasIds
    .map(id => todasLasFacturas.find(f => f.id === id))
    .filter((f): f is Factura => !!f)
    .sort((a,b) => new Date(b.fechaCarga).getTime() - new Date(a.fechaCarga).getTime());

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Historial de Consumo: ${ordenDeCompra.numeroOC}`}>
        <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4 grid grid-cols-3 gap-4 text-center">
                 <div>
                    <p className="text-sm text-gray-600">Monto Total</p>
                    <p className="font-bold text-lg text-gray-800">{formatCurrency(ordenDeCompra.montoTotal)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Consumido</p>
                    <p className="font-bold text-lg text-blue-800">{formatCurrency(ordenDeCompra.montoConsumido)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Saldo</p>
                    <p className="font-bold text-lg text-green-700">{formatCurrency(ordenDeCompra.montoTotal - ordenDeCompra.montoConsumido)}</p>
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-gray-700 mb-2">Facturas Vinculadas ({facturasVinculadas.length})</h4>
                 <ul className="max-h-80 overflow-y-auto divide-y divide-gray-200 border rounded-md">
                    {facturasVinculadas.length > 0 ? (
                        facturasVinculadas.map(factura => (
                            <li key={factura.id} className="p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Icon.DocumentText className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Folio: ...{factura.folioFiscal.slice(-12)}</p>
                                            <p className="text-xs text-gray-500">Cargada el: {formatDate(factura.fechaCarga)}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(factura.monto)}</span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="p-6 text-center text-gray-500">No hay facturas vinculadas a esta orden de compra.</li>
                    )}
                </ul>
            </div>
        </div>
    </Modal>
  );
};
