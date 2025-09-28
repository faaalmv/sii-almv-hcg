
import React from 'react';
import { Contrato, HitoDeEntrega, Incidencia, IncidenceStatus, Penalizacion, ContractStatus } from '../types';
import Icon from '../../../common/icons/Icon';
import TimelineHitos from './TimelineHitos';
import CalculadoraPenalizacion from './CalculadoraPenalizacion';
import RegistroIncidenciaForm from './RegistroIncidenciaForm';

interface DetalleContratoViewProps {
  contrato: Contrato;
  onBack: () => void;
  onRegisterIncidence: (contratoId: string, hitoId: string, incidenciaData: { tipo: any; descripcion: string }) => void;
  onApplyPenalty: (contratoId: string, incidenciaId: string, penalizacion: Omit<Penalizacion, 'id'>) => void;
}

const getStatusStyles = (status: ContractStatus) => {
  switch (status) {
    case ContractStatus.EnRegla:
      return { text: "text-green-800", bg: "bg-green-100" };
    case ContractStatus.ConIncidencias:
      return { text: "text-yellow-800", bg: "bg-yellow-100" };
    case ContractStatus.EnRiesgo:
      return { text: "text-red-800", bg: "bg-red-100" };
    case ContractStatus.ConPenalizacion:
      return { text: "text-orange-800", bg: "bg-orange-100" };
    default:
      return { text: "text-gray-800", bg: "bg-gray-100" };
  }
};


const DetalleContratoView: React.FC<DetalleContratoViewProps> = ({ contrato, onBack, onRegisterIncidence, onApplyPenalty }) => {
  const [showIncidenceForm, setShowIncidenceForm] = React.useState<HitoDeEntrega | null>(null);
  const { text, bg } = getStatusStyles(contrato.status);

  const handleRegisterIncidence = (incidenciaData: { tipo: any; descripcion: string }) => {
    if (showIncidenceForm) {
      onRegisterIncidence(contrato.id, showIncidenceForm.id, incidenciaData);
      setShowIncidenceForm(null);
    }
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
        <Icon.ArrowLeft className="h-5 w-5 mr-2" />
        Volver a la lista de contratos
      </button>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between md:items-start">
            <div>
              <p className="text-base font-semibold text-blue-600">{contrato.id}</p>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-1">{contrato.proveedor.nombre}</h1>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${bg} ${text}`}>{contrato.status}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:space-x-8 text-gray-600">
            <div className="flex items-center">
              <Icon.Calendar className="h-5 w-5 mr-2 text-gray-400" />
              <span>Vigencia: {new Date(contrato.fechaInicio).toLocaleDateString('es-MX')} al {new Date(contrato.fechaFin).toLocaleDateString('es-MX')}</span>
            </div>
            <div className="mt-2 md:mt-0">
              <span className="font-medium">Monto Total:</span>
              <span className="font-bold text-gray-800 ml-2 text-lg">${contrato.montoTotal.toLocaleString('es-MX')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Línea de Tiempo de Hitos</h2>
            <TimelineHitos hitos={contrato.hitosDeEntrega} onRegisterIncidence={(hito) => setShowIncidenceForm(hito)} />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Registro de Incidencias</h2>
            <div className="space-y-6">
              {contrato.incidencias.length > 0 ? (
                contrato.incidencias.map(incidencia => (
                  <div key={incidencia.id} className="bg-white rounded-lg border border-gray-200 p-4 animate-slide-in-up">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800">{incidencia.tipo}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${incidencia.status === IncidenceStatus.PenalizacionAplicada ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{incidencia.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{incidencia.descripcion}</p>
                    <p className="text-xs text-gray-400 mt-2">Detectada: {new Date(incidencia.fechaDeteccion).toLocaleString('es-MX')}</p>
                    
                    {incidencia.status !== IncidenceStatus.Cerrada && (
                        <div className="mt-4">
                            <CalculadoraPenalizacion 
                              incidencia={incidencia}
                              onApplyPenalty={(incidenciaId, penalizacion) => onApplyPenalty(contrato.id, incidenciaId, penalizacion)}
                            />
                        </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No hay incidencias registradas para este contrato.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {showIncidenceForm && (
        <RegistroIncidenciaForm
          hito={showIncidenceForm}
          onClose={() => setShowIncidenceForm(null)}
          onSave={handleRegisterIncidence}
        />
      )}
    </div>
  );
};

export default DetalleContratoView;
