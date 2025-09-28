
import React, { useMemo, useState } from 'react';
import { Factura, EstadoFactura } from '../../types';

interface ChartData {
  status: EstadoFactura;
  count: number;
  percentage: number;
  color: string;
}

const STATUS_COLORS: { [key in EstadoFactura]: string } = {
  [EstadoFactura.RECEPCION]: '#FBBF24', // amber-400
  [EstadoFactura.EN_VALIDACION_GLOSA]: '#F59E0B', // amber-500
  [EstadoFactura.VALIDACION_PRESUPUESTO]: '#D97706', // amber-600
  [EstadoFactura.APROBADA_PARA_PAGO]: '#3B82F6', // blue-500
  [EstadoFactura.PAGADA]: '#16A34A', // green-600
  [EstadoFactura.RECHAZADA]: '#EF4444', // red-500
};

const Tooltip: React.FC<{ data: ChartData | null; position: { x: number; y: number }; parentRef: React.RefObject<HTMLDivElement> }> = ({ data, position, parentRef }) => {
  if (!data) return null;
  const parentRect = parentRef.current?.getBoundingClientRect();
  const left = position.x - (parentRect?.left ?? 0) + 15;
  const top = position.y - (parentRect?.top ?? 0) + 15;
  return (
    <div className="absolute bg-gray-800 text-white text-sm rounded-md p-2 shadow-lg pointer-events-none transition-transform transform" style={{ left, top }}>
      <p className="font-bold">{data.status}</p>
      <p>{data.count} Facturas ({data.percentage.toFixed(1)}%)</p>
    </div>
  );
};

const GraficoDeEstadosComponent: React.FC<{ facturas: Factura[] }> = ({ facturas }) => {
  const [hoveredSegment, setHoveredSegment] = useState<ChartData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const chartContainerRef = React.useRef<HTMLDivElement>(null);

  const chartData = useMemo<ChartData[]>(() => {
    const counts = facturas.reduce((acc, f) => {
      acc[f.estadoActual] = (acc[f.estadoActual] || 0) + 1;
      return acc;
    }, {} as { [key in EstadoFactura]?: number });

    const total = facturas.length;
    if (total === 0) return [];

    return Object.entries(counts).map(([status, count]) => ({
      status: status as EstadoFactura,
      count,
      percentage: (count / total) * 100,
      color: STATUS_COLORS[status as EstadoFactura] || '#6B7280',
    }));
  }, [facturas]);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div ref={chartContainerRef} className="bg-white rounded-lg shadow-md border border-gray-200 p-4 relative" onMouseMove={handleMouseMove}>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Facturas por Estado</h3>
      {facturas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="relative">
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              <circle cx="100" cy="100" r={radius} fill="transparent" stroke="#E5E7EB" strokeWidth="20" />
              {chartData.map((segment) => {
                const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedOffset;
                accumulatedOffset += (segment.percentage / 100) * circumference;

                return (
                  <circle
                    key={segment.status}
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="transparent"
                    stroke={segment.color}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 ease-in-out"
                    style={{ filter: hoveredSegment && hoveredSegment.status !== segment.status ? 'grayscale(50%) opacity(0.7)' : 'none' }}
                    onMouseEnter={() => setHoveredSegment(segment)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">{facturas.length}</span>
                <span className="text-sm text-gray-500">Total</span>
            </div>
          </div>
          <div>
            <ul className="space-y-2">
              {chartData.map((segment) => (
                <li 
                  key={segment.status} 
                  className="flex items-center text-sm"
                  onMouseEnter={() => setHoveredSegment(segment)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: segment.color }}></span>
                  <span className="flex-1 text-gray-600">{segment.status}</span>
                  <span className="font-semibold text-gray-800">{segment.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">No hay datos de facturas para mostrar.</div>
      )}
      <Tooltip data={hoveredSegment} position={tooltipPosition} parentRef={chartContainerRef} />
    </div>
  );
};

export const GraficoDeEstados = React.memo(GraficoDeEstadosComponent);
