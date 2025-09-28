import React, { useMemo } from 'react';
import { Factura, OrdenDeCompra, EstadoFactura } from '../../types';
import { TarjetaKPI } from './TarjetaKPI';
import { CurrencyDollarIcon, ExclamationTriangleIcon, ArchiveBoxXMarkIcon, DocumentPlusIcon } from '../icons/Icon';

interface BarraDeKPIsProps {
    facturas: Factura[];
    ordenesDeCompra: OrdenDeCompra[];
    onKpiClick: () => void;
}

export const BarraDeKPIs: React.FC<BarraDeKPIsProps> = ({ facturas, ordenesDeCompra, onKpiClick }) => {

    const kpiData = useMemo(() => {
        const totalPendientePago = facturas
            .filter(f => ![EstadoFactura.PAGADA, EstadoFactura.RECHAZADA].includes(f.estadoActual))
            .reduce((sum, f) => sum + f.monto, 0);

        const facturasConDiscrepancias = facturas.filter(f => f.estadoActual === EstadoFactura.RECHAZADA).length;

        const ocsPorAgotarse = ordenesDeCompra.filter(oc => oc.montoTotal > 0 && (oc.montoConsumido / oc.montoTotal) > 0.85).length;

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const nuevasFacturasHoy = facturas.filter(f => new Date(f.fechaCarga) >= hoy).length;
        
        return { totalPendientePago, facturasConDiscrepancias, ocsPorAgotarse, nuevasFacturasHoy };
    }, [facturas, ordenesDeCompra]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TarjetaKPI 
                title="Total Pendiente de Pago"
                value={kpiData.totalPendientePago}
                icon={<CurrencyDollarIcon className="w-6 h-6"/>}
                color="blue"
                formatAsCurrency
            />
            <TarjetaKPI 
                title="Facturas con Discrepancias"
                value={kpiData.facturasConDiscrepancias}
                icon={<ExclamationTriangleIcon className="w-6 h-6"/>}
                color="amber"
                onClick={onKpiClick}
            />
            <TarjetaKPI 
                title="OCs por Agotarse (<15%)"
                value={kpiData.ocsPorAgotarse}
                icon={<ArchiveBoxXMarkIcon className="w-6 h-6"/>}
                color="red"
            />
            <TarjetaKPI 
                title="Nuevas Facturas (Hoy)"
                value={kpiData.nuevasFacturasHoy}
                icon={<DocumentPlusIcon className="w-6 h-6"/>}
                color="green"
                onClick={onKpiClick}
            />
        </div>
    )
}
