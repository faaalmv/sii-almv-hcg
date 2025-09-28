
import React, { useState, useMemo } from 'react';
import { Factura, OrdenDeCompra } from '../../types';
import { Button } from '../common/Button';
import { TarjetaResumenOC } from './TarjetaResumenOC';
import { ModalDeVinculacionOC } from './ModalDeVinculacionOC';
import Icon from '../../../../common/icons/Icon';

interface ModuloReconciliacionOCProps {
  factura: Factura;
  ordenesDeCompra: OrdenDeCompra[];
  todasLasFacturas: Factura[];
  onLinkOrdenDeCompra: (facturaId: string, ordenDeCompraId: string) => void;
}

export const ModuloReconciliacionOC: React.FC<ModuloReconciliacionOCProps> = ({ factura, ordenesDeCompra, todasLasFacturas, onLinkOrdenDeCompra }) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const linkedOC = useMemo(() => 
    ordenesDeCompra.find(oc => oc.id === factura.ordenDeCompraId),
    [factura.ordenDeCompraId, ordenesDeCompra]
  );

  const handleLink = (ocId: string) => {
    onLinkOrdenDeCompra(factura.id, ocId);
    setIsLinkModalOpen(false);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200/80 shadow-sm">
      <h4 className="text-lg font-semibold text-gray-700 mb-4 px-1">Reconciliación de Orden de Compra</h4>
      {linkedOC ? (
        <TarjetaResumenOC 
            ordenDeCompra={linkedOC} 
            facturaActualMonto={factura.monto}
            todasLasFacturas={todasLasFacturas}
        />
      ) : (
        <div className="text-center p-4 border-2 border-dashed rounded-lg bg-gray-50/50">
          <p className="text-gray-600 mb-4">Esta factura no está vinculada a una orden de compra.</p>
          <Button onClick={() => setIsLinkModalOpen(true)}>
            <span className="flex items-center space-x-2">
                <Icon.Link className="w-5 h-5" />
                <span>Vincular a Orden de Compra</span>
            </span>
          </Button>
        </div>
      )}

      <ModalDeVinculacionOC
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        ordenesDeCompra={ordenesDeCompra}
        facturaMonto={factura.monto}
        onSelectOC={handleLink}
      />
    </div>
  );
};
