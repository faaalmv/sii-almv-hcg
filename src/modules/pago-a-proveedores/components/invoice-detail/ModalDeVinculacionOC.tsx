
import React from 'react';
import { OrdenDeCompra } from '../../types';
import Modal from '../../../../common/Modal';
import { Button } from '../common/Button';
import { LinkIcon } from '../icons/Icon';

interface ModalDeVinculacionOCProps {
  isOpen: boolean;
  onClose: () => void;
  ordenesDeCompra: OrdenDeCompra[];
  facturaMonto: number;
  onSelectOC: (ocId: string) => void;
}

export const ModalDeVinculacionOC: React.FC<ModalDeVinculacionOCProps> = ({ isOpen, onClose, ordenesDeCompra, facturaMonto, onSelectOC }) => {
  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vincular a Orden de Compra">
      <div className="space-y-4">
        <p className="text-gray-600">
          Selecciona una Orden de Compra para vincular esta factura por un monto de <strong className="text-gray-800">{formatCurrency(facturaMonto)}</strong>.
        </p>
        <ul className="max-h-80 overflow-y-auto divide-y divide-gray-200 border rounded-md">
          {ordenesDeCompra.length > 0 ? (
            ordenesDeCompra.map(oc => {
                const saldoDisponible = oc.montoTotal - oc.montoConsumido;
                const puedeVincular = saldoDisponible >= facturaMonto;
                return (
                <li key={oc.id} className={`p-4 transition-colors ${puedeVincular ? 'hover:bg-blue-50' : 'opacity-60 bg-gray-50'}`}>
                    <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <p className="font-semibold text-gray-800">{oc.numeroOC}</p>
                        <p className="text-sm text-gray-500">Total: {formatCurrency(oc.montoTotal)}</p>
                        <p className={`text-sm font-medium ${puedeVincular ? 'text-green-600' : 'text-red-600'}`}>
                            Saldo Disponible: {formatCurrency(saldoDisponible)}
                        </p>
                    </div>
                    <Button onClick={() => onSelectOC(oc.id)} disabled={!puedeVincular}>
                        <span className="flex items-center space-x-2">
                            <LinkIcon className="w-4 h-4" />
                            <span>Vincular</span>
                        </span>
                    </Button>
                    </div>
                    {!puedeVincular && <p className="text-xs text-red-600 mt-2">Saldo insuficiente para cubrir el monto de esta factura.</p>}
                </li>
                )
            })
          ) : (
            <li className="p-10 text-center text-gray-500">No hay Órdenes de Compra disponibles.</li>
          )}
        </ul>
      </div>
    </Modal>
  );
};
