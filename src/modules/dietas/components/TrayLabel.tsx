
import React from 'react';
import { Patient, Diet } from '../types';

interface TrayLabelProps {
  patient: Patient;
  diet: Diet;
}

const TrayLabel: React.FC<TrayLabelProps> = ({ patient, diet }) => {
  return (
    <div className="bg-white border-2 border-gray-800 p-4 w-[400px] h-[250px] flex flex-col justify-between font-sans">
      <div>
        <div className="flex justify-between items-start border-b-2 border-gray-800 pb-2 mb-2">
          <div>
            <p className="text-2xl font-bold">{patient.name}</p>
            <p className="text-lg text-gray-700">{patient.location}</p>
          </div>
          <p className="text-sm font-mono">{new Date().toLocaleDateString()}</p>
        </div>
        <div className="text-center my-4">
          <p className="text-lg font-semibold uppercase tracking-wider">Dieta</p>
          <p className="text-3xl font-bold text-blue-600">{diet.name}</p>
        </div>
      </div>
      
      {patient.allergies.length > 0 && (
        <div className="border-4 border-red-600 bg-red-100 p-2 text-center rounded-md">
          <p className="text-xl font-bold text-red-700 uppercase">!!! ALERGIAS !!!</p>
          <p className="text-lg font-semibold text-red-800">{patient.allergies.join(', ').toUpperCase()}</p>
        </div>
      )}

      {!patient.allergies.length && (
         <div className="border-2 border-gray-400 p-2 text-center">
             <p className="text-md font-semibold text-gray-600">Sin alergias conocidas</p>
         </div>
      )}
    </div>
  );
};

export default TrayLabel;
