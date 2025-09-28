import React, { useState, useMemo, useRef } from 'react';
import { Factura, Usuario, RolUsuario, EstadoFactura, OrdenDeCompra } from '../types';
import { BandejaDeTareas } from './ValidationQueue';
import { FacturaDetailView } from './FacturaDetailView';
import { BarraDeKPIs } from './admin/BarraDeKPIs';
import { PanelAnaliticoLateral } from './admin/PanelAnaliticoLateral';

interface DashboardInternoProps {
  facturas: Factura[];
  currentUser: Usuario;
  onUpdateFactura: (updatedFactura: Factura) => void;
  ordenesDeCompra: OrdenDeCompra[];
  todasLasFacturas: Factura[];
  onLinkOrdenDeCompra: (facturaId: string, ordenDeCompraId: string) => void;
  searchQuery: string;
}

export const DashboardInterno: React.FC<DashboardInternoProps> = ({ facturas, currentUser, onUpdateFactura, ordenesDeCompra, todasLasFacturas, onLinkOrdenDeCompra, searchQuery }) => {
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const taskQueueRef = useRef<HTMLDivElement>(null);

  const filteredFacturas = useMemo(() => {
    if (!searchQuery) {
      return facturas;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return facturas.filter(f => 
      f.folioFiscal.toLowerCase().includes(lowercasedQuery) ||
      f.razonSocial.toLowerCase().includes(lowercasedQuery) ||
      ordenesDeCompra.find(oc => oc.id === f.ordenDeCompraId)?.numeroOC.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, facturas, ordenesDeCompra]);

  const facturasPendientes = useMemo(() => {
    return filteredFacturas.filter(f => {
      if (currentUser.rol === RolUsuario.VALIDADOR_GLOSA && f.estadoActual === EstadoFactura.EN_VALIDACION_GLOSA) {
        return true;
      }
      if (currentUser.rol === RolUsuario.VALIDADOR_PRESUPUESTO && f.estadoActual === EstadoFactura.VALIDACION_PRESUPUESTO) {
        return true;
      }
      return false;
    }).sort((a,b) => new Date(a.fechaCarga).getTime() - new Date(b.fechaCarga).getTime());
  }, [filteredFacturas, currentUser.rol]);
  
  const handleApprove = (facturaId: string, nextStatus: EstadoFactura) => {
    const factura = facturas.find(f => f.id === facturaId);
    if(factura) {
        const updatedFactura: Factura = {
            ...factura,
            estadoActual: nextStatus,
            historial: [
                ...factura.historial,
                { etapa: factura.estadoActual, fecha: new Date().toISOString(), usuario: currentUser.nombre }
            ]
        };
        onUpdateFactura(updatedFactura);
        setSelectedFactura(null); 
    }
  };
  
  const handleReject = (facturaId: string, motivo: string) => {
    const factura = facturas.find(f => f.id === facturaId);
    if(factura) {
        const updatedFactura: Factura = {
            ...factura,
            estadoActual: EstadoFactura.RECHAZADA,
            historial: [
                ...factura.historial,
                { etapa: EstadoFactura.RECHAZADA, fecha: new Date().toISOString(), usuario: currentUser.nombre, motivoRechazo: motivo }
            ]
        };
        onUpdateFactura(updatedFactura);
        setSelectedFactura(null);
    }
  };

  const handleKpiClick = () => {
    taskQueueRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  if (selectedFactura) {
      return (
        <FacturaDetailView
          factura={selectedFactura}
          currentUser={currentUser}
          onApprove={handleApprove}
          onReject={handleReject}
          onBack={() => setSelectedFactura(null)}
          ordenesDeCompra={ordenesDeCompra}
          todasLasFacturas={todasLasFacturas}
          onLinkOrdenDeCompra={onLinkOrdenDeCompra}
        />
      );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Centro de Mando y Operaciones</h1>
        <p className="text-gray-600">Bienvenido, {currentUser.nombre}. Resumen del sistema a continuación.</p>
      </div>

      <BarraDeKPIs 
        facturas={facturas} 
        ordenesDeCompra={ordenesDeCompra}
        onKpiClick={handleKpiClick}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8" ref={taskQueueRef}>
            <BandejaDeTareas
              facturas={facturasPendientes}
              onSelectFactura={setSelectedFactura}
              title="Bandeja de Tareas Prioritarias"
            />
        </div>
        <div className="lg:col-span-4">
            <PanelAnaliticoLateral facturas={facturas}/>
        </div>
      </div>
    </div>
  );
};