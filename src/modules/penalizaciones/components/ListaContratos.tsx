
import React, { useState, useMemo } from 'react';
import { Contrato, ContractStatus } from '../types';
import ContratoCard from './ContratoCard';

interface ListaContratosProps {
  contratos: Contrato[];
  onSelectContrato: (id: string) => void;
}

const ListaContratos: React.FC<ListaContratosProps> = ({ contratos, onSelectContrato }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'Todos'>('Todos');

  const filteredContratos = useMemo(() => {
    return contratos.filter(contrato => {
      const matchesSearch = 
        contrato.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contrato.proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'Todos' || contrato.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contratos, searchTerm, statusFilter]);
  
  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="flex-grow">
            <label htmlFor="search" className="sr-only">Buscar</label>
            <input
              type="text"
              id="search"
              placeholder="Buscar por ID de contrato o proveedor..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4 md:mt-0">
            <label htmlFor="status" className="sr-only">Filtrar por estado</label>
            <select
              id="status"
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ContractStatus | 'Todos')}
            >
              <option value="Todos">Todos los estados</option>
              {Object.values(ContractStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContratos.map((contrato, index) => (
           <div key={contrato.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 50}ms`}}>
              <ContratoCard contrato={contrato} onSelect={onSelectContrato} />
          </div>
        ))}
      </div>
      {filteredContratos.length === 0 && (
          <div className="text-center py-16 col-span-full">
            <p className="text-gray-500">No se encontraron contratos que coincidan con la búsqueda.</p>
          </div>
      )}
    </div>
  );
};

export default ListaContratos;
