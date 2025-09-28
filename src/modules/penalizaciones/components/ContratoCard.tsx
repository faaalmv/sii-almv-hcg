
import React from 'react';
import { Contrato, ContractStatus } from '../types';
import Icon from '../../../common/icons/Icon';

interface ContratoCardProps {
  contrato: Contrato;
  onSelect: (id: string) => void;
}

const getStatusStyles = (status: ContractStatus) => {
  switch (status) {
    case ContractStatus.EnRegla:
      return { indicator: "bg-green-500", text: "text-green-800", bg: "bg-green-100" };
    case ContractStatus.ConIncidencias:
      return { indicator: "bg-yellow-500", text: "text-yellow-800", bg: "bg-yellow-100" };
    case ContractStatus.EnRiesgo:
      return { indicator: "bg-red-500", text: "text-red-800", bg: "bg-red-100" };
    case ContractStatus.ConPenalizacion:
      return { indicator: "bg-orange-500", text: "text-orange-800", bg: "bg-orange-100" };
    default:
      return { indicator: "bg-gray-500", text: "text-gray-800", bg: "bg-gray-100" };
  }
};

const ContratoCard: React.FC<ContratoCardProps> = ({ contrato, onSelect }) => {
  const { indicator, text, bg } = getStatusStyles(contrato.status);

  return (
    <div
      onClick={() => onSelect(contrato.id)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-200 flex flex-col justify-between"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{contrato.id}</p>
            <h3 className="text-lg font-bold text-gray-800 mt-1">{contrato.proveedor.nombre}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${indicator}`}></div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bg} ${text}`}>{contrato.status}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-600">
          <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
          <span>{new Date(contrato.fechaInicio).toLocaleDateString('es-MX')} - {new Date(contrato.fechaFin).toLocaleDateString('es-MX')}</span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Monto: <span className="font-semibold text-gray-800">${contrato.montoTotal.toLocaleString('es-MX')}</span>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 rounded-b-lg flex justify-between items-center">
        <span className="text-sm font-medium text-blue-600">Ver detalles</span>
        <ChevronRightIcon className="h-5 w-5 text-blue-600" />
      </div>
    </div>
  );
};

export default ContratoCard;
