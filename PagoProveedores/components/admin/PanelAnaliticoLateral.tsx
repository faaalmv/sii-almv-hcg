import React from 'react';
import { Factura } from '../../types';
import { GraficoDeEstados } from './GraficoDeEstados';

interface PanelAnaliticoLateralProps {
    facturas: Factura[];
}

export const PanelAnaliticoLateral: React.FC<PanelAnaliticoLateralProps> = ({ facturas }) => {
    return (
        <div className="space-y-6">
            <GraficoDeEstados facturas={facturas} />
            {/* Future charts can be added here */}
        </div>
    );
};
