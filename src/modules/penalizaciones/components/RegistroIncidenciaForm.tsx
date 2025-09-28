
import React, { useState } from 'react';
import { IncidenceType, HitoDeEntrega } from '../types';
import Icon from '../../../common/icons/Icon';

interface RegistroIncidenciaFormProps {
  hito: HitoDeEntrega;
  onClose: () => void;
  onSave: (incidenciaData: { tipo: IncidenceType; descripcion: string }) => void;
}

const RegistroIncidenciaForm: React.FC<RegistroIncidenciaFormProps> = ({ hito, onClose, onSave }) => {
  const [tipo, setTipo] = useState<IncidenceType>(IncidenceType.Atraso);
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (descripcion.trim()) {
      onSave({ tipo, descripcion });
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg animate-zoom-in">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Registrar Incidencia</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <Icon.X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div>
                <p className="text-sm font-medium text-gray-600">Hito de Entrega</p>
                <p className="text-base text-gray-800">{hito.descripcion}</p>
                <p className="text-sm text-gray-500">Fecha Pactada: {new Date(hito.fechaPactada).toLocaleDateString('es-MX')}</p>
            </div>
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Incidencia</label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as IncidenceType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(IncidenceType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción Detallada</label>
              <textarea
                id="descripcion"
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej: El proveedor entregó la mercancía con 5 días de retraso..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 active:scale-95 transition"
            >
              Guardar Incidencia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroIncidenciaForm;
