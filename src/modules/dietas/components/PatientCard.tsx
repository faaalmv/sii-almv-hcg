
import React from 'react';
import { Patient, Diet } from '../types';

interface PatientCardProps {
  patient: Patient;
  diets: Diet[];
  onSelectPatient: (patient: Patient) => void;
  hasCriticalAlert: boolean;
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const PatientCard: React.FC<PatientCardProps> = ({ patient, diets, onSelectPatient, hasCriticalAlert }) => {
  const activeDiet = diets.find(d => d.id === patient.activeDiet.dietId);

  const cardClasses = `
    bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between 
    transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 
    cursor-pointer active:scale-[0.98]
    ${hasCriticalAlert ? 'border-2 border-red-500 animate-pulse' : 'border border-gray-200'}
  `;

  return (
    <div className={cardClasses} onClick={() => onSelectPatient(patient)}>
      <div>
        <div className="flex items-center mb-3">
          <UserIcon />
          <h3 className="text-lg font-bold text-gray-800">{patient.name}</h3>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <LocationIcon />
          <span>{patient.location}</span>
        </div>
        <p className="text-sm text-gray-500 mb-3"><span className="font-semibold">Diagnóstico:</span> {patient.diagnosis}</p>
        
        {patient.allergies.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-bold text-red-600">Alergias:</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {patient.allergies.map(allergy => (
                <span key={allergy} className="px-2 py-0.5 text-xs font-semibold text-red-800 bg-red-100 rounded-full uppercase">
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-3 mt-3">
          <p className="text-sm font-semibold text-gray-700">Dieta Activa:</p>
          <p className="text-blue-600 font-medium transition-opacity duration-500">{activeDiet?.name || 'No asignada'}</p>
      </div>
    </div>
  );
};

export default PatientCard;
