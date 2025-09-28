
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Contrato, IncidenceStatus } from '../types';
import { AlertTriangleIcon } from './Icons';

interface DashboardPrincipalProps {
  contratos: Contrato[];
  onViewContrato: (contratoId: string) => void;
}

const DashboardPrincipal: React.FC<DashboardPrincipalProps> = ({ contratos, onViewContrato }) => {
  const totalIncidencias = contratos.reduce((acc, c) => acc + c.incidencias.length, 0);
  const totalPenalizaciones = contratos.reduce((acc, c) => acc + c.incidencias.filter(i => i.penalizacion).length, 0);
  const montoTotalPenalizado = contratos.reduce((acc, c) => 
    acc + c.incidencias.reduce((iAcc, i) => iAcc + (i.penalizacion?.monto || 0), 0),
  0);

  const dataProveedores = contratos.reduce((acc, contrato) => {
    const proveedor = acc.find(p => p.name === contrato.proveedor.nombre);
    const penalizaciones = contrato.incidencias.filter(i => i.penalizacion).length;
    if (proveedor) {
      proveedor.penalizaciones += penalizaciones;
    } else {
      acc.push({ name: contrato.proveedor.nombre, penalizaciones });
    }
    return acc;
  }, [] as { name: string; penalizaciones: number }[]).sort((a, b) => b.penalizaciones - a.penalizaciones).slice(0, 5);

  const accionesRequeridas = contratos
    .flatMap(c => c.incidencias.map(i => ({...i, contrato: c})))
    .filter(i => i.status === IncidenceStatus.Abierta || i.status === IncidenceStatus.EnRevision)
    .slice(0, 5);

  const kpis = [
    { label: "Contratos Activos", value: contratos.length },
    { label: "Total Incidencias", value: totalIncidencias },
    { label: "Penalizaciones Aplicadas", value: totalPenalizaciones },
    { label: "Monto Total Penalizado", value: `$${montoTotalPenalizado.toLocaleString('es-MX')}` },
  ];

  return (
    <div className="animate-fade-in space-y-8 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800">Centro de Comando</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div key={kpi.label} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md animate-slide-in-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Top 5 Proveedores con Penalizaciones</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataProveedores} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip wrapperClassName="rounded-md shadow-lg" cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} />
                <Legend />
                <Bar dataKey="penalizaciones" fill="#3b82f6" name="Penalizaciones" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md animate-slide-in-up" style={{ animationDelay: '500ms' }}>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Acciones Requeridas</h2>
          <div className="space-y-4">
            {accionesRequeridas.length > 0 ? (
              accionesRequeridas.map(incidencia => (
                <div key={incidencia.id} className="p-4 bg-orange-50 border border-orange-200 rounded-md">
                  <div className="flex items-start space-x-3">
                    <AlertTriangleIcon className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{incidencia.tipo}</p>
                      <p className="text-xs text-gray-600">
                        Contrato: <span className="font-medium">{incidencia.contrato.id}</span> - <span className="italic">{incidencia.contrato.proveedor.nombre}</span>
                      </p>
                       <button onClick={() => onViewContrato(incidencia.contrato.id)} className="text-xs text-blue-600 hover:underline mt-1">
                        Revisar incidencia
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No hay acciones pendientes.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPrincipal;
