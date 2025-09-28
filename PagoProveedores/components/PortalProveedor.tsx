
import React, { useState } from 'react';
import { Factura, Usuario, OrdenDeCompra } from '../types';
import { FacturasDashboard } from './FacturasDashboard';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { FacturaUploader } from './FacturaUploader';
import { UploadIcon } from './icons/Icon';

interface PortalProveedorProps {
  facturas: Factura[];
  currentUser: Usuario;
  onAddFactura: (newFactura: Omit<Factura, 'id' | 'proveedorId'>) => void;
  ordenesDeCompra: OrdenDeCompra[];
  todasLasFacturas: Factura[];
  onLinkOrdenDeCompra: (facturaId: string, ordenDeCompraId: string) => void;
}

export const PortalProveedor: React.FC<PortalProveedorProps> = ({ facturas, currentUser, onAddFactura, ordenesDeCompra, todasLasFacturas, onLinkOrdenDeCompra }) => {
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const handleUploadSuccess = (newFacturaData: Omit<Factura, 'id' | 'proveedorId'>) => {
    onAddFactura(newFacturaData);
    setIsUploaderOpen(false);
  }

  const sortedFacturas = [...facturas].sort((a, b) => new Date(b.fechaCarga).getTime() - new Date(a.fechaCarga).getTime());

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mis Facturas</h1>
        <Button onClick={() => setIsUploaderOpen(true)} variant="primary">
          <span className="flex items-center space-x-2">
            <UploadIcon className="w-5 h-5"/>
            <span>Cargar Factura</span>
          </span>
        </Button>
      </div>
      <FacturasDashboard 
        facturas={sortedFacturas} 
        onUploadClick={() => setIsUploaderOpen(true)} 
        ordenesDeCompra={ordenesDeCompra}
        todasLasFacturas={todasLasFacturas}
        onLinkOrdenDeCompra={onLinkOrdenDeCompra}
      />
      <Modal 
        isOpen={isUploaderOpen} 
        onClose={() => setIsUploaderOpen(false)} 
        title="Cargar Nueva Factura"
      >
        <FacturaUploader onUploadSuccess={handleUploadSuccess} currentUser={currentUser} />
      </Modal>
    </div>
  );
};
