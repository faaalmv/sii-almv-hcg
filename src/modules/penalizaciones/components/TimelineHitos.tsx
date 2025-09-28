
import React from 'react';
import { HitoDeEntrega, MilestoneStatus } from '../types';
import Icon from '../../../common/icons/Icon';

interface TimelineHitosProps {
  hitos: HitoDeEntrega[];
  onRegisterIncidence: (hito: HitoDeEntrega) => void;
}

const getStatusInfo = (status: MilestoneStatus) => {
  switch (status) {
    case MilestoneStatus.Cumplido:
      return { Icon: Icon.CheckCircle, color: 'text-green-500', bgColor: 'bg-green-500' };
    case MilestoneStatus.Atrasado:
      return { Icon: Icon.Clock, color: 'text-orange-500', bgColor: 'bg-orange-500' };
    case MilestoneStatus.Incumplido:
      return { Icon: Icon.AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-500' };
    case MilestoneStatus.Pendiente:
    default:
      return { Icon: null, color: 'text-gray-400', bgColor: 'bg-gray-400' };
  }
};

const TimelineHitos: React.FC<TimelineHitosProps> = ({ hitos, onRegisterIncidence }) => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {hitos.map((hito, hitoIdx) => {
          const { Icon, color, bgColor } = getStatusInfo(hito.status);
          const isLast = hitoIdx === hitos.length - 1;

          return (
            <li key={hito.id}>
              <div className="relative pb-8">
                {!isLast && (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                )}
                <div className="relative flex space-x-3 items-start">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${bgColor}`}>
                      {Icon ? <Icon className="h-5 w-5 text-white" /> : <div className="h-2 w-2 bg-white rounded-full"></div>}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between items-start space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(hito.fechaPactada).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="font-medium text-gray-900">{hito.descripcion}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 ${color}`}>
                        {hito.status}
                      </span>
                    </div>
                    {[MilestoneStatus.Atrasado, MilestoneStatus.Incumplido, MilestoneStatus.Pendiente].includes(hito.status) && (
                      <button
                        onClick={() => onRegisterIncidence(hito)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors group whitespace-nowrap"
                      >
                        <Icon.PlusCircle className="h-5 w-5 mr-1 text-blue-500 group-hover:text-blue-700" />
                        <span>Registrar Incidencia</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TimelineHitos;
