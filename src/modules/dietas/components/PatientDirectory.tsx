
import React from 'react';
import { type Patient, type Diet } from '../types';
import PatientCard from './PatientCard';

interface PatientDirectoryProps {
  patients: Patient[];
  diets: Diet[];
  onSelectPatient: (patient: Patient) => void;
}

const PatientDirectory: React.FC<PatientDirectoryProps> = ({ patients, diets, onSelectPatient }) => {
  const patientsByFloor = patients.reduce((acc, patient) => {
    const floor = patient.location.split(',')[0] || 'Sin Asignar';
    if (!acc[floor]) {
      acc[floor] = [];
    }
    acc[floor].push(patient);
    return acc;
  }, {} as Record<string, Patient[]>);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Directorio de Pacientes</h1>
      {Object.entries(patientsByFloor).map(([floor, patientList]) => (
        <div key={floor} className="mb-10">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 pb-2 border-b-2 border-blue-200">{floor}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {patientList.map(patient => (
              <PatientCard
                key={patient.id}
                patient={patient}
                diets={diets}
                onSelectPatient={onSelectPatient}
                hasCriticalAlert={patient.activeDiet.alertsActive.length > 0 && patient.allergies.length > 0}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientDirectory;
